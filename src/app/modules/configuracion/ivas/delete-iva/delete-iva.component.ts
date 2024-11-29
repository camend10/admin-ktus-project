import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Iva } from '../interfaces';
import { IvaService } from '../service/iva.service';

@Component({
  selector: 'app-delete-iva',
  templateUrl: './delete-iva.component.html',
  styleUrl: './delete-iva.component.scss'
})
export class DeleteIvaComponent implements OnInit {

  isLoading$: any;
  @Output() IvaD: EventEmitter<Iva> = new EventEmitter;
  @Input() IvaSeleccionado: Iva;

  iva: Iva = {
    id: 0,
    porcentaje: 0,
    empresa_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public ivaService: IvaService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.ivaService.isLoading$;
    this.iva = { ...this.IvaSeleccionado };
    this.iva.estado = Number(this.iva.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.iva.estado === 1 ? 0 : 1;
    if (this.iva.estado === 1) {
      this.iva.estado = 0;
    } else {
      this.iva.estado = 1;
    }

    this.ivaService.cambiarEstado(this.iva, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.IvaD.emit(this.iva);
        this.modal.close();
      }
    });

  }
}
