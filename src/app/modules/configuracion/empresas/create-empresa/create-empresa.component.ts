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
    municipio_id: 9999999
  };

  constructor(
    public modal: NgbActiveModal,
    public empresaService: EmpresaService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.empresaService.isLoading$;
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


    this.empresaService.registrar(this.empresa).subscribe((resp) => {
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
}
