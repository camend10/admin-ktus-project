import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { SegmentoCliente } from '../interfaces';
import { SegmentoClienteService } from '../service/segmento-cliente.service';

@Component({
  selector: 'app-edit-segmento-cliente',
  templateUrl: './edit-segmento-cliente.component.html',
  styleUrl: './edit-segmento-cliente.component.scss'
})
export class EditSegmentoClienteComponent implements OnInit {

  isLoading$: any;
  @Output() SegmentoClienteE: EventEmitter<SegmentoCliente> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  @Input() SegmentoClienteSeleccionado: SegmentoCliente;

  segmentoCliente: SegmentoCliente = {
    id: 0,
    nombre: '',
    empresa_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public segmentoClienteService: SegmentoClienteService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.segmentoClienteService.isLoading$;

    this.segmentoCliente = { ...this.SegmentoClienteSeleccionado };
    this.segmentoCliente.estado = Number(this.segmentoCliente.estado);
  }

  store() {

    if (!this.segmentoCliente.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.segmentoCliente.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.segmentoClienteService.editar(this.segmentoCliente).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SegmentoClienteE.emit(resp.segmentoCliente);
        this.modal.close();
      }
    });

  }
}
