import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { Role } from '../models/role.model';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss'
})
export class CrearComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() RoleC: EventEmitter<any> = new EventEmitter;

  role: Role = new Role(0, '', []);
  SIDEBAR: any = SIDEBAR;

  permissions: any = [];

  tab_selected: number = 0;

  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
  }

  store() {

    if (!this.role.name) {
      this.toast.error('Validación', 'El nombre del rol es requerido');
      return false;
    }

    if (this.permissions.length === 0) {
      this.toast.error('Validación', 'Necesitas seleccionar por lo menos un permiso');
      return false;
    }

    this.role.permissions = this.permissions;

    this.rolesService.registrarRole(this.role).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.RoleC.emit(resp.role);
        this.modal.close();
      }
    });

  }

  selectedTab(index: number) {
    this.tab_selected = index;
  }

  agregarPermission(permiso: string) {

    let index = this.permissions.findIndex((perm: string) => perm == permiso);
    if (index != -1) {
      this.permissions.splice(index, 1);
    } else {
      this.permissions.push(permiso);
    }


  }

}
