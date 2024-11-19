import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from '../interfaces';
import { EmpresaService } from '../service/empresa.service';


@Component({
  selector: 'app-delete-empresa',
  templateUrl: './delete-empresa.component.html',
  styleUrl: './delete-empresa.component.scss'
})
export class DeleteEmpresaComponent implements OnInit {

  isLoading$: any;
  
  @Output() EmpresaD: EventEmitter<Empresa> = new EventEmitter;

  @Input() EmpresaSeleccionado: Empresa;

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
    departamento_id: 0,
    municipio_id: 0
  };

  constructor(
    public modal: NgbActiveModal,
    public empresaService: EmpresaService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.empresaService.isLoading$;
    this.empresa = { ...this.EmpresaSeleccionado };
    this.empresa.estado = Number(this.empresa.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.empresa.estado === 1 ? 0 : 1;
    if (this.empresa.estado === 1) {
      this.empresa.estado = 0;
    } else {
      this.empresa.estado = 1;
    }

    this.empresaService.cambiarEstado(this.empresa, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.EmpresaD.emit(this.empresa);
        this.modal.close();
      }
    });

  }
}
