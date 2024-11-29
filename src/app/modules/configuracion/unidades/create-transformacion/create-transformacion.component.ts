import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { Unidad, UnidadTransformacion } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';
import { isPermission } from 'src/app/config/config';
import { DeleteTransformacionComponent } from '../delete-transformacion/delete-transformacion.component';


@Component({
  selector: 'app-create-transformacion',
  templateUrl: './create-transformacion.component.html',
  styleUrl: './create-transformacion.component.scss'
})
export class CreateTransformacionComponent implements OnInit {

  isLoading$: any;  

  @Input() unidadTransformacionSeleccionado: Unidad;
  @Input() unidades: Unidad[];

  user: User;

  unidadTransformacion: UnidadTransformacion = {
    id: 0,
    unidad_id: 9999999,
    unidad_to_id: 9999999,
    empresa_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    public unidadesService: UnidadesService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.unidadesService.isLoading$;
    this.user = this.authService.user;
    this.unidadTransformacion.empresa_id = this.user.empresa_id;
    this.unidadTransformacion.unidad_id = this.unidadTransformacionSeleccionado.id;
  }

  store() {

    if (this.unidadTransformacion.unidad_to_id === 9999999) {
      this.toast.error('Validación', 'La unidad es requerida');
      return false;
    }

    if (this.unidadTransformacion.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.unidadesService.registrarTransformacion(this.unidadTransformacion)
      .subscribe((resp) => {
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          // this.UnidadC.emit(resp.unidad);
          this.unidadTransformacionSeleccionado.transformacion?.unshift(resp.unidadTransformacion);
          // this.modal.close();
        }
      });

  }

  delete(unidadTransformacion: UnidadTransformacion) {
    const modalRef = this.modalService.open(DeleteTransformacionComponent, { centered: true, size: 'sm' });
    modalRef.componentInstance.UnidadTransformacionSeleccionado = unidadTransformacion;

    modalRef.componentInstance.UnidadTransformacionD.subscribe((UnidadTransformacionR: UnidadTransformacion) => {
      let index = this.unidadTransformacionSeleccionado?.transformacion?.findIndex((UnidadTransformacionFind: UnidadTransformacion) => UnidadTransformacionFind.id === unidadTransformacion.id);
      if (index !== undefined && index !== -1) {
        this.unidadTransformacionSeleccionado.transformacion?.splice(index, 1);
      }
    });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
