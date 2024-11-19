import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';

  user: User;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;
  }
}
