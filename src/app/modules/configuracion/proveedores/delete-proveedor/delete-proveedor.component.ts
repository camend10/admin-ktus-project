import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Proveedor } from '../interfaces';
import { ProveedorService } from '../service/proveedor.service';


@Component({
  selector: 'app-delete-proveedor',
  templateUrl: './delete-proveedor.component.html',
  styleUrl: './delete-proveedor.component.scss'
})
export class DeleteProveedorComponent implements OnInit {

  isLoading$: any;
  @Output() ProveedorD: EventEmitter<Proveedor> = new EventEmitter;
  @Input() ProveedorSeleccionado: Proveedor;

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

  constructor(
    public modal: NgbActiveModal,
    public proveedorService: ProveedorService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.proveedorService.isLoading$;
    this.proveedor = { ...this.ProveedorSeleccionado };
    this.proveedor.estado = Number(this.proveedor.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.proveedor.estado === 1 ? 0 : 1;
    if (this.proveedor.estado === 1) {
      this.proveedor.estado = 0;
    } else {
      this.proveedor.estado = 1;
    }

    this.proveedorService.cambiarEstado(this.proveedor, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.ProveedorD.emit(resp.proveedor);
        this.modal.close();
      }
    });

  }
}
