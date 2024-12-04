import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Lógica de logout
    this.authService.logout();

    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }
}
