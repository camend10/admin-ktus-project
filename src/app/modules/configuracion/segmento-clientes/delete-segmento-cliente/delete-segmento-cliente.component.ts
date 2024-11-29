import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { SegmentoCliente } from '../interfaces';
import { SegmentoClienteService } from '../service/segmento-cliente.service';

@Component({
  selector: 'app-delete-segmento-cliente',
  templateUrl: './delete-segmento-cliente.component.html',
  styleUrl: './delete-segmento-cliente.component.scss'
})
export class DeleteSegmentoClienteComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() SegmentoClienteD: EventEmitter<SegmentoCliente> = new EventEmitter;
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

  cambiarEstado() {

    const nuevoEstado = this.segmentoCliente.estado === 1 ? 0 : 1;
    if (this.segmentoCliente.estado === 1) {
      this.segmentoCliente.estado = 0;
    } else {
      this.segmentoCliente.estado = 1;
    }

    this.segmentoClienteService.cambiarEstado(this.segmentoCliente, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SegmentoClienteD.emit(this.segmentoCliente);
        this.modal.close();
      }
    });

  }

}
