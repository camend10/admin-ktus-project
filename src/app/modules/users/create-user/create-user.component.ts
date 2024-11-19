import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';
import { User } from '../interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { Departamento, Genero, Municipio, TipoDoc, Role, Empresa } from 'src/app/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit {

  password_repeat: string = '';
  isLoading$: any;
  
  @Output() UserC: EventEmitter<User> = new EventEmitter;
  @Input() tipodocumentos: TipoDoc[] = [];
  @Input() departamentos: Departamento[] = [];
  @Input() municipios: Municipio[] = [];
  @Input() generos: Genero[] = [];
  @Input() roles: Role[] = [];
  @Input() empresas: Empresa[] = [];
  @Input() sedes: Sede[] = [];

  // file_name: any;
  file_name: File | null = null;

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = '../../../../assets/media/svg/avatars/blank.svg';

  user: User = {
    id: 0,
    name: '',
    email: '',
    identificacion: '',
    usuario: '',
    direccion: '',
    celular: 0,
    estado: 1,
    empresa_id: 9999999,
    role_id: 9999999,
    role: {
      id: 0,
      name: '',
      guard_name: ''
    },
    roles: [
      {
        id: 0,
        name: '',
        guard_name: '',
        permissions: []
      }
    ],
    permissions: [],
    avatar: '',
    genero_id: 9999999,
    departamento_id: 9999999,
    municipio_id: 9999999,
    tipo_doc_id: 9999999,
    fecha_nacimiento: ''
  };

  sedesSeleccionadas: number[] = [];

  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.userService.isLoading$;
    this.imagen_previzualizada = '../../../../assets/media/svg/avatars/blank.svg';
    this.user = {
      id: 0,
      name: '',
      email: '',
      identificacion: '',
      usuario: '',
      direccion: '',
      celular: 0,
      estado: 1,
      empresa_id: 9999999,
      role_id: 9999999,
      role: {
        id: 0,
        name: '',
        guard_name: ''
      },
      roles: [
        {
          id: 0,
          name: '',
          guard_name: '',
          permissions: []
        }
      ],
      permissions: [],
      avatar: '',
      genero_id: 9999999,
      departamento_id: 9999999,
      municipio_id: 9999999,
      tipo_doc_id: 9999999
    };

    this.sedes = this.sedes.map((sede) => ({ ...sede, seleccionada: false }));
  }

  processFile($event: Event) {
    // if ($event.target.files[0].type.indexOf("image") < 0) {
    //   this.toast.warning("Validando", "El archivo no es una imagen");
    //   return;
    // }

    // this.file_name = $event.target.files[0];
    // let reader = new FileReader();
    // reader.readAsDataURL(this.file_name);
    // reader.onloadend = () => this.imagen_previzualizada = reader.result;

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
    };
    reader.readAsDataURL(file);
  }

  cancelImage() {
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = '../../../../assets/media/svg/avatars/blank.svg';
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = '../../../../assets/media/svg/avatars/blank.svg';
  }

  store() {

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

    if (!this.user.password) {
      this.toast.error('Validación', 'El password es requerido');
      return false;
    } else if (this.user.password.length < 8 || this.user.password.length > 10) {
      this.toast.error('Validación', 'El password debe tener entre 8 y 10 caracteres');
      return false;
    }

    if (this.user.password && this.user.password != this.password_repeat) {
      this.toast.error('Validación', 'Los password no coinciden');
      return false;
    }

    if (this.sedesSeleccionadas.length === 0) {
      this.toast.error('Validación', 'Debe seleccionar al menos una sede');
      return false;
    }

    this.userService.registrarUser(this.user, this.file_name, this.sedesSeleccionadas).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        resp.user.estado = Number(resp.user.estado);
        this.toast.success('Exito', resp.message_text);
        this.UserC.emit(resp.user);
        console.log(resp.user);
        this.modal.close();
      }
    });

  }

  // Método para seleccionar o deseleccionar todas las sedes
  selectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.sedes.forEach((sede) => {
      sede.seleccionada = isChecked;
      if (isChecked && !this.sedesSeleccionadas.includes(sede.id)) {
        this.sedesSeleccionadas.push(sede.id);
      } else if (!isChecked) {
        this.sedesSeleccionadas = [];
      }
    });
  }

  // Método para alternar la selección de una sede
  toggleSedeSelection(sede: Sede): void {
    sede.seleccionada = !sede.seleccionada;

    if (sede.seleccionada) {
      // Agrega `sede_id` a `sedesSeleccionadas` si la sede se selecciona
      this.sedesSeleccionadas.push(sede.id);
    } else {
      // Remueve `sede_id` de `sedesSeleccionadas` si la sede se deselecciona
      this.sedesSeleccionadas = this.sedesSeleccionadas.filter(id => id !== sede.id);
    }

    // Verifica si todos los checkboxes están seleccionados
    const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
    selectAllCheckbox.checked = this.sedes.every((s) => s.seleccionada);
    selectAllCheckbox.indeterminate = this.sedes.some((s) => s.seleccionada) && !selectAllCheckbox.checked;
  }

}
