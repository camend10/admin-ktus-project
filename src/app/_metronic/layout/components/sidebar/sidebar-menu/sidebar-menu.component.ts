import { Component, OnInit } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  user: User
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;
  }

  abrirInventario() {
    const params = {
      sede_id: this.user.sede_id,
      empresa_id: this.user.empresa_id
    };

    const queryString = Object.entries(params)
      .filter(([key, value]) => (value !== undefined && value !== null))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/pdf/inventario' + link, '_BLANK');
  }

  showMenu(permisos: string[]) {
    if (this.isRole()) {
      return true;
    }
    let permissions = this.user.permissions;
    let is_show = false;
    permisos.forEach((perm: string) => {
      if (permissions.includes(perm)) {
        is_show = true;
      }
    });
    return is_show;
  }

  isRole() {
    return this.user.role.name === 'Super-Admin' ? true : false;
  }

}
