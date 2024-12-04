import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { ClientesService } from '../service/clientes.service';
import { Cliente } from '../interfaces';

@Component({
  selector: 'app-delete-cliente',
  templateUrl: './delete-cliente.component.html',
  styleUrl: './delete-cliente.component.scss'
})
export class DeleteClienteComponent implements OnInit {

  isLoading$: any;
  @Output() ClienteD: EventEmitter<Cliente> = new EventEmitter;

  @Input() ClienteSeleccionado: Cliente;

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
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.clienteService.isLoading$;
    this.cliente = { ...this.ClienteSeleccionado };
    this.cliente.estado = Number(this.cliente.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.cliente.estado === 1 ? 0 : 1;
    if (this.cliente.estado === 1) {
      this.cliente.estado = 0;
    } else {
      this.cliente.estado = 1;
    }

    this.clienteService.cambiarEstado(this.cliente, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.ClienteD.emit(resp.cliente);
        this.modal.close();
      }
    });

  }
}
