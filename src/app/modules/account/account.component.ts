import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { User } from '../users/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user: User;

  constructor(
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,) { }

  ngOnInit(): void { 
    this.user = this.authService.user;
  }
}
