import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { Role } from '../models/role.model';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../interfaces';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.scss'
})
export class EliminarComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() RoleD: EventEmitter<any> = new EventEmitter;

  @Input() RoleSeleccionado: Roles;

  roleCopia: Roles;

  role: Role = new Role(0, '', []);
  SIDEBAR: any = SIDEBAR;

  permissions: any = [];

  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.roleCopia = { ...this.RoleSeleccionado };
    this.role.name = this.roleCopia.name;
    this.role.id = this.roleCopia.id;
    this.permissions = this.RoleSeleccionado.permission_pluck;
  }

  delete() {

    this.rolesService.eliminarRole(this.role).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.RoleD.emit(resp.role);
        this.modal.close();
      }
    });

  }

}
