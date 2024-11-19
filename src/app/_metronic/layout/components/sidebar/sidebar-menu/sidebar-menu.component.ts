import { Component, OnInit } from '@angular/core';
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