import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { UsersService } from 'src/app/modules/users/service/users.service';

@Component({
  selector: 'app-sign-in-method',
  templateUrl: './sign-in-method.component.html',
  styleUrl: './sign-in-method.component.scss'
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  user: User;
  email: string = '';

  passwordAct: string = '';
  passwordNue: string = '';
  passwordRep: string = '';

  constructor(private cdr: ChangeDetectorRef,
    public authService: AuthService,
    public userService: UsersService,
    public toast: ToastrService,
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.user = this.authService.user;
  }

  toggleEmailForm(show: boolean) {
    this.showChangeEmailForm = show;
  }

  saveEmail() {
    if (!this.email) {
      this.toast.error('Validación', 'El email es requerido');
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
      this.toast.error('Validación', 'El email no es válido');
      return false;
    }
    this.isLoading = true;
    this.userService.cambiarEmail(this.user, this.email)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Asegurar que siempre se ejecute
          this.cdr.detectChanges();
        })
      )
      .subscribe((resp) => {
        this.isLoading = false;
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {

          this.toast.success('Exito', resp.message_text);
          resp.user.estado = Number(resp.user.estado);

          setTimeout(() => {
            this.logout();
          }, 1000);
        }
      });
  }

  logout() {
    this.authService.logout();
    document.location.reload();
  }

  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  savePassword() {
    // Validar si los campos están llenos
    if (!this.passwordAct || !this.passwordNue || !this.passwordRep) {
      this.toast.error('Todos los campos son obligatorios', 'Error de validación');
      return;
    }

    // Validar longitud mínima de la nueva contraseña
    if (this.passwordNue.length < 8) {
      this.toast.error('La nueva contraseña debe tener al menos 8 caracteres', 'Error de validación');
      return;
    }

    // Validar si las contraseñas nuevas coinciden
    if (this.passwordNue !== this.passwordRep) {
      this.toast.error('La nueva contraseña y la confirmación no coinciden', 'Error de validación');
      return;
    }

    // Preparar datos para enviar al backend
    const data = {
      password: this.passwordAct,
      newpassword: this.passwordNue,
      empresa_id: this.user.empresa_id,
    };

    this.isLoading = true;
    this.userService.changePassword(this.user, data)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Asegurar que siempre se ejecute
          this.cdr.detectChanges();
        })
      )
      .subscribe((resp) => {
        this.isLoading = false;
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {

          this.toast.success('Exito', resp.message_text);

          this.togglePasswordForm(false);

          setTimeout(() => {
            this.logout();
          }, 1000);
        }
      });

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
