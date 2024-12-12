import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Departamento, Empresa, Municipio, TipoDoc } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { Proveedor } from '../interfaces';
import { ProveedorService } from '../service/proveedor.service';

@Component({
  selector: 'app-create-proveedor',
  templateUrl: './create-proveedor.component.html',
  styleUrl: './create-proveedor.component.scss'
})
export class CreateProveedorComponent implements OnInit {

  isLoading$: any;
  @Output() ProveedorC: EventEmitter<Proveedor> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() tipodocumentos: TipoDoc[] = [];
  @Input() departamentos: Departamento[] = [];
  @Input() municipios: Municipio[] = [];

  user: User;

  proveedor: Proveedor = {
    id: 0,
    tipo_identificacion: 9999999,
    identificacion: '',
    dv: '',
    nombres: '',
    apellidos: '',
    email: '',
    direccion: '',
    celular: '',
    departamento_id: 9999999,
    municipio_id: 9999999,
    imagen: '',
    empresa_id: 9999999,
    estado: 1,
  };

  file_name: File | null = null;

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = '../../../../assets/media/icons/proveedores.png';

  constructor(
    public modal: NgbActiveModal,
    public proveedorService: ProveedorService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.proveedorService.isLoading$;
    this.imagen_previzualizada = '../../../../assets/media/icons/proveedores.png';
    this.user = this.authService.user;
    this.proveedor.empresa_id = this.user.empresa_id;
  }

  store() {

    if (this.proveedor.tipo_identificacion === 9999999) {
      this.toast.error('Validación', 'El tipo de identificación es requerido');
      return false;
    }

    if (!this.proveedor.identificacion) {
      if (this.proveedor.tipo_identificacion === 1) {
        this.toast.error('Validación', 'La identificación es requerida');
      } else {
        this.toast.error('Validación', 'El NIT es requerido');
      }
      return false;
    } else if (!/^\d+$/.test(this.proveedor.identificacion)) {
      if (this.proveedor.tipo_identificacion === 1) {
        this.toast.error('Validación', 'La identificación debe contener solo números');
      } else {
        this.toast.error('Validación', 'El NIT debe contener solo números');
      }
      return false;
    }

    if (!this.proveedor.dv) {
      this.toast.error('Validación', 'El Digito de verificación es requerido');
      return false;
    }

    if (!this.proveedor.nombres) {
      if (this.proveedor.tipo_identificacion === 1) {
        this.toast.error('Validación', 'El nombre es requerido');
      } else {
        this.toast.error('Validación', 'La razón social es requerida');
      }
      return false;
    }

    if (!this.proveedor.email) {
      this.toast.error('Validación', 'El email es requerido');
      return false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.proveedor.email)) {
      this.toast.error('Validación', 'El email no es válido');
      return false;
    }

    if (!this.proveedor.celular) {
      this.toast.error('Validación', 'El celular es requerido');
      return false;
    }

    if (this.proveedor.departamento_id === 9999999) {
      this.toast.error('Validación', 'El departamento es requerido');
      return false;
    }

    if (this.proveedor.municipio_id === 9999999) {
      this.toast.error('Validación', 'El municipio es requerido');
      return false;
    }

    if (this.proveedor.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.proveedorService.registrar(this.proveedor, this.file_name).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.ProveedorC.emit(resp.proveedor);
        this.modal.close();
      }
    });
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
    };
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.file_name = null;
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = '../../../../assets/media/icons/proveedores.png';
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = '../../../../assets/media/icons/proveedores.png';
  }

  calculateDV(nit: string): string {
    if (!nit) {
      return ''; // O devuelve un valor predeterminado, como '0'
    }
    const nitArray = nit.split('').reverse();
    const primeNumbers = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

    let total = 0;
    for (let i = 0; i < nitArray.length; i++) {
      total += parseInt(nitArray[i], 10) * primeNumbers[i];
    }

    const remainder = total % 11;
    return remainder > 1 ? (11 - remainder).toString() : remainder.toString();
  }

}
