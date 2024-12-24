import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/interfaces';
import { Sede } from 'src/app/modules/configuracion/sedes/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'super@gmail.com',
    password: '12345678',
  };

  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  bandera: boolean = false;
  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  role_id: number = 0;
  empresa_id: number = 9999999;
  sede_id: number = 9999999;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

    // Establecer el valor inicial del formulario y ejecutar verificarUsuario()
    this.loginForm.patchValue({
      email: this.defaultAuth.email,
      password: this.defaultAuth.password,
    });

    // Ejecutar verificarUsuario() después de establecer los valores iniciales
    this.verificarUsuario();

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      empresa_id: [9999999], // Valor por defecto y validación requerida
      sede_id: [9999999, Validators.required], // Valor por defecto y validación requerida
    });
  }

  submit() {
    this.hasError = false;

    if (this.loginForm.invalid) {
      // Mostrar error si el formulario no es válido
      this.hasError = true;
      return;
    }

    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value, this.f.empresa_id.value, this.f.sede_id.value)
      .pipe(first())
      .subscribe((resp: boolean) => {
        // console.log(user);
        if (resp) {
          // this.router.navigate([this.returnUrl]);
          document.location.reload();
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  verificarUsuario() {
    if (this.f.email.value !== '') {
      this.authService.verificarUsuario(this.f.email.value).subscribe((resp: any) => {
        if (resp) {
          this.empresas = resp.empresas || [];
          this.sedes = resp.sedes || [];
          this.role_id = resp.role_id || 0;

          // Si hay sedes, selecciona la primera por defecto
          if (this.sedes.length > 0) {
            // this.loginForm.patchValue({
            //   sede_id: this.sedes[0].id,
            // });

            this.loginForm.patchValue({
              sede_id: 9999999,
            });
            this.bandera = true; // Activar bandera si hay sedes disponibles
          } else {
            this.loginForm.patchValue({
              sede_id: 9999999,
            });
            this.bandera = false; // Desactivar bandera si no hay sedes
          }
        } else {
          this.hasError = true;
          this.bandera = false;
        }
      });
    } else {
      this.bandera = false;
      this.loginForm.patchValue({ sede_id: 9999999 });
    }
  }

  verificarEmpresa() {
    const empresaId = this.loginForm.get('empresa_id')?.value;
    if (empresaId !== 9999999) {
      const empresaSeleccionada = this.empresas.find((e) => e.id === empresaId);
      // this.sedes = empresaSeleccionada?.sedes || [];

      // Filtrar sedes con estado = 1
      this.sedes = (empresaSeleccionada?.sedes || []).filter((sede) => sede.estado === 1);

      this.loginForm.patchValue({
        sede_id: 9999999,
      });

      // this.loginForm.patchValue({
      //   sede_id: this.sedes.length > 0 ? this.sedes[0].id : 9999999,
      // });

      // const sedeId = this.loginForm.get('sede_id')?.value;
      // if (sedeId !== 9999999) {
      //   this.bandera = true;
      // }

    } else {
      this.sedes = [];
      this.loginForm.patchValue({ sede_id: 9999999 });
    }

  }

  verificarSede() {
    const sedeId = this.loginForm.get('sede_id')?.value;
    if (sedeId !== 9999999) {
      this.bandera = true;
    }
  }

  limpiarEmpresasYSedes() {
    this.empresas = [];
    this.sedes = [];
    this.loginForm.patchValue({ empresa_id: 9999999, sede_id: 9999999 });
    this.role_id = 0;
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
