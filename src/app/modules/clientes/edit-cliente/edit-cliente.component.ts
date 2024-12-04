import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { ClientesService } from '../service/clientes.service';
import { Cliente } from '../interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrl: './edit-cliente.component.scss'
})
export class EditClienteComponent implements OnInit {


  isLoading$: any;
  @Output() ClienteE: EventEmitter<Cliente> = new EventEmitter;

  @Input() ClienteSeleccionado: Cliente;

  @Input() empresas: Empresa[] = [];
  @Input() tipodocumentos: TipoDoc[] = [];
  @Input() departamentos: Departamento[] = [];
  @Input() municipios: Municipio[] = [];
  @Input() sedes: Sede[] = [];
  @Input() segmentos: SegmentoCliente[] = [];
  @Input() generos: Genero[] = [];

  user: User;

  cliente: Cliente = {
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
    empresa_id: 9999999,
    estado: 1,
    is_parcial: 1,
    segmento_cliente_id: 9999999,
    genero_id: 9999999,
    sede_id: 9999999,
    fecha_nacimiento: '',
  };

  constructor(
    public modal: NgbActiveModal,
    public clienteService: ClientesService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.clienteService.isLoading$;
    this.user = this.authService.user;
    
    this.cliente = { ...this.ClienteSeleccionado };
    this.cliente.estado = Number(this.cliente.estado);
  }

  store() {

    if (this.cliente.tipo_identificacion === 9999999) {
      this.toast.error('Validación', 'El tipo de identificación es requerido');
      return false;
    }

    if (!this.cliente.identificacion) {
      if (this.cliente.tipo_identificacion === 1) {
        this.toast.error('Validación', 'La identificación es requerida');
      } else {
        this.toast.error('Validación', 'El NIT es requerido');
      }
      return false;
    } else if (!/^\d+$/.test(this.cliente.identificacion)) {
      if (this.cliente.tipo_identificacion === 1) {
        this.toast.error('Validación', 'La identificación debe contener solo números');
      } else {
        this.toast.error('Validación', 'El NIT debe contener solo números');
      }
      return false;
    }

    if (!this.cliente.dv) {
      this.toast.error('Validación', 'El Digito de verificación es requerido');
      return false;
    }

    if (!this.cliente.nombres) {
      if (this.cliente.tipo_identificacion === 1) {
        this.toast.error('Validación', 'El nombre es requerido');
      } else {
        this.toast.error('Validación', 'La razón social es requerida');
      }
      return false;
    }

    if (!this.cliente.celular) {
      this.toast.error('Validación', 'El celular es requerido');
      return false;
    }

    if (this.cliente.departamento_id === 9999999) {
      this.toast.error('Validación', 'El departamento es requerido');
      return false;
    }

    if (this.cliente.municipio_id === 9999999) {
      this.toast.error('Validación', 'El municipio es requerido');
      return false;
    }

    if (this.cliente.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (this.cliente.segmento_cliente_id === 9999999) {
      this.toast.error('Validación', 'La tipo de cliente es requerido');
      return false;
    }

    // Formatear fecha de nacimiento si está definida
    if (this.cliente.fecha_nacimiento) {
      this.cliente.fecha_nacimiento = new Date(this.cliente.fecha_nacimiento).toISOString().split('T')[0];
    }

    this.clienteService.editar(this.cliente).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.ClienteE.emit(resp.cliente);
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

  isParcial() {
    this.cliente.is_parcial = this.cliente.is_parcial === 1 ? 2 : 1;
  }
}
