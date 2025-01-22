import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Departamento, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { UsersService } from 'src/app/modules/users/service/users.service';
import { GeneralesService } from 'src/app/services/generales.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  user: User;
  tipodocumentos: TipoDoc[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  generos: Genero[] = [];

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = '../../../../assets/media/svg/avatars/blank.svg';
  // file_name: any;
  file_name: File | null = null;

  constructor(private cdr: ChangeDetectorRef,
    public authService: AuthService,
    public generalService: GeneralesService,
    public toast: ToastrService,
    public userService: UsersService,
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.imagen_previzualizada = this.user.avatar;
    this.cargarConfiguraciones();
    this.isLoadingProcess();
    this.cdr.detectChanges();
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.tipodocumentos = response.tipodocumentos;
        this.generos = response.generos;

        this.isLoadingProcess();
        this.cdr.detectChanges();
      });
  }

  saveSettings() {

    if (!this.user.name) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (!this.user.email) {
      this.toast.error('Validación', 'El email es requerido');
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email)) {
      this.toast.error('Validación', 'El email no es válido');
      return false;
    }

    if (!this.user.identificacion) {
      this.toast.error('Validación', 'La identificación es requerida');
      return false;
    } else if (!/^\d+$/.test(this.user.identificacion)) {
      this.toast.error('Validación', 'La identificación debe contener solo números');
      return false;
    }

    if (!this.user.celular) {
      this.toast.error('Validación', 'El celular es requerido');
      return false;
    }

    if (this.user.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (this.user.role_id === 9999999) {
      this.toast.error('Validación', 'El rol es requerido');
      return false;
    }

    if (this.user.genero_id === 9999999) {
      this.toast.error('Validación', 'El genero es requerido');
      return false;
    }

    if (this.user.tipo_doc_id === 9999999) {
      this.toast.error('Validación', 'El tipo de documento es requerido');
      return false;
    }

    if (this.user.departamento_id === 9999999) {
      this.toast.error('Validación', 'El departamento es requerido');
      return false;
    }

    if (this.user.municipio_id === 9999999) {
      this.toast.error('Validación', 'El municipio es requerido');
      return false;
    }

    if (!this.user.fecha_nacimiento) {
      this.toast.error('Validación', 'La fecha de nacimiento es requerida');
      return false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(this.user.fecha_nacimiento)) {
      this.toast.error('Validación', 'La fecha de nacimiento debe estar en el formato YYYY-MM-DD');
      return false;
    } else {
      const fecha = new Date(this.user.fecha_nacimiento);
      if (isNaN(fecha.getTime())) {
        this.toast.error('Validación', 'La fecha de nacimiento no es válida');
        return false;
      }
    }

    if (!this.user.usuario) {
      this.toast.error('Validación', 'El nombre de usuario es requerido');
      return false;
    }

    this.isLoading = true;
    
    this.userService.editarPerfil(this.user, this.file_name).subscribe((resp) => {
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  processFile($event: Event) {
    const input = $event.target as HTMLInputElement;

    // Asegúrate de que hay un archivo seleccionado
    if (!input.files || input.files.length === 0) {
      this.toast.warning("Validando", "No se ha seleccionado ningún archivo");
      return;
    }


    // const file = $event.target.files[0];
    const file = input.files[0];
    if (!file || file.type.indexOf("image") < 0) {
      this.toast.warning("Validando", "El archivo no es una imagen");
      return;
    }

    this.file_name = file; // Asigna el archivo a this.file_name

    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizada = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  cancelImage() {
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = '../../../../assets/media/svg/avatars/blank.svg';
    this.cdr.detectChanges();
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = '../../../../assets/media/svg/avatars/blank.svg';
    this.cdr.detectChanges();
  }

  isLoadingProcess() {
    this.generalService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.generalService.isLoadingSubject.next(false);
    }, 50);
  }
}
