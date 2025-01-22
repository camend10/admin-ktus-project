import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Permission } from '../models/permission.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';

interface SidebarPermission {
  name: string;
  permiso: string;
}

interface SidebarModule {
  name: string;
  permisos: SidebarPermission[];
}

@Component({
  selector: 'app-ver-permisos',
  templateUrl: './ver-permisos.component.html',
  styleUrl: './ver-permisos.component.scss'
})
export class VerPermisosComponent implements OnInit {
  isLoading$: any;
  @Output() PermisoC: EventEmitter<Permission> = new EventEmitter;
  @Input() permissions: string[] = [];
  groupedPermissions: { name: string; permisos: string[] }[] = [];

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    // Procesar permisos para agruparlos según el SIDEBAR
    this.groupedPermissions = (SIDEBAR as SidebarModule[]).map((module: SidebarModule) => {
      const permisosUsuario = module.permisos
        .filter((permiso: SidebarPermission) => this.permissions.includes(permiso.permiso))
        .map((permiso: SidebarPermission) => permiso.name);

      return { name: module.name, permisos: permisosUsuario };
    }).filter(module => module.permisos.length > 0); // Filtrar módulos sin permisos del usuario
  }
}
