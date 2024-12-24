import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { User } from '../../users/interfaces';
import { ResponseAuth } from 'src/app/interfaces';

// export type UserType = UserModel | undefined;
export type UserType = User | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<User | undefined>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: User) {
    this.currentUserSubject.next(user);
  }

  token: any;
  user: User;

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<User | undefined>(undefined);

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();

    // Inicializar el token desde localStorage
    this.token = localStorage.getItem('token') || null;

    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string, empresa_id: number, sede_id: number): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http.post(URL_SERVICIOS + "/auth/login", { email, password, empresa_id, sede_id }).pipe(
      map((auth: any) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      // switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // this.router.navigate(['/auth/login'], {
    //   queryParams: {},
    // });
    // Si tienes propiedades como `this.token`, inicialízalas correctamente
    this.token = null; // O asegúrate de que no se utilice durante el logout

    // (Opcional) Notifica otros servicios sobre el cierre de sesión
    console.log('Sesión cerrada');
  }

  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return of(auth).pipe(
      map((user: any) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password, 0, 0)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: ResponseAuth): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem('token', auth.access_token);
      localStorage.setItem('user', JSON.stringify(auth.user));

      this.user = auth.user;
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('user');
      if (!lsValue) {
        return undefined;
      }
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(lsValue);

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  expirado(fechaExp: number) {

    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }

  }

  verificaRenueva(fechaExp: number): Promise<boolean> {

    return new Promise((resolve, reject) => {


      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date();

      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));


      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this.renuevaToken()
          .subscribe({
            next: () => {
              resolve(true);
            },
            error: (err) => {
              reject(false);
              this.router.navigate(['/login']);
            }
          });
      }

      resolve(true);

    });

  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/refresh';

    let data = {
      id: 0
    };

    this.isLoadingSubject.next(true);

    return this.http.post(url, data)
      .pipe(
        map((resp: any) => {
          this.token = resp.access_token;
          localStorage.setItem('token', this.token);

          console.log("token renovado");
          return true;
        }),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  // estaLogueado() {
  //   return (this.token.length > 5) ? true : false;
  // }

  estaLogueado(): boolean {
    return this.token && this.token.length > 5 ? true : false;
  }

  verificarUsuario(email: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.http.post(URL_SERVICIOS + "/auth/verificar", { email }).pipe(
      map((resp: any) => {
        return resp;
      }),
      // switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
