import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from '../interfaces';
import { EmpresaService } from '../service/empresa.service';
import { Departamento, Municipio } from 'src/app/interfaces';

@Component({
  selector: 'app-create-empresa',
  templateUrl: './create-empresa.component.html',
  styleUrl: './create-empresa.component.scss'
})
export class CreateEmpresaComponent implements OnInit {
  isLoading$: any;
  @Output() EmpresaC: EventEmitter<Empresa> = new EventEmitter;

  @Input() departamentos: Departamento[] = [];
  @Input() municipios: Municipio[] = [];

  file_name: File | null = null;

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = '../../../../assets/media/icons/empresa.png';


  empresa: Empresa = {
    id: 0,
    nit_empresa: '',
    dv: '',
    nombre: '',
    email: '',
    direccion: '',
    telefono: 0,
    web: '',
    celular: 0,
    estado: 0,
    departamento_id: 9999999,
    municipio_id: 9999999,
    imagen: '',
    lema: ''
  };

  constructor(
    public modal: NgbActiveModal,
    public empresaService: EmpresaService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.empresaService.isLoading$;
    this.imagen_previzualizada = '../../../../assets/media/icons/empresa.png';
  }

  store() {

    if (!this.empresa.nit_empresa) {
      this.toast.error('Validación', 'El nit de la empresa es requerido');
      return false;
    }

    if (!this.empresa.nombre) {
      this.toast.error('Validación', 'El nombre de la empresa es requerido');
      return false;
    }

    if (!this.empresa.email) {
      this.toast.error('Validación', 'El correo de la empresa es requerido');
      return false;
    }

    if (!this.empresa.celular) {
      this.toast.error('Validación', 'El celular es requerido');
      return false;
    }

    if (this.empresa.departamento_id === 9999999) {
      this.toast.error('Validación', 'El departamento es requerido');
      return false;
    }

    if (this.empresa.municipio_id === 9999999) {
      this.toast.error('Validación', 'El municipio es requerido');
      return false;
    }

    this.empresaService.registrar(this.empresa, this.file_name).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.EmpresaC.emit(resp.empresa);
        this.modal.close();
      }
    });

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
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = '../../../../assets/media/icons/empresa.png';
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = '../../../../assets/media/icons/empresa.png';
  }
}
