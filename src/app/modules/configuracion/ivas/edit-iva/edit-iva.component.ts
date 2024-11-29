import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Iva } from '../interfaces';
import { IvaService } from '../service/iva.service';

@Component({
  selector: 'app-edit-iva',
  templateUrl: './edit-iva.component.html',
  styleUrl: './edit-iva.component.scss'
})
export class EditIvaComponent implements OnInit {

  isLoading$: any;
  @Output() IvaE: EventEmitter<Iva> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

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

  store() {

    if (this.iva.porcentaje === null || isNaN(this.iva.porcentaje) || this.iva.porcentaje < 0) {
      this.toast.error('Validación', 'El porcentaje es requerido');
      return false;
    }

    if (this.iva.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.ivaService.editar(this.iva).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.IvaE.emit(resp.iva);
        this.modal.close();
      }
    });

  }

  validateNumber(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.keyCode);
    if (!/^[0-9.]$/.test(char)) {
      event.preventDefault();
    }
  }
}
