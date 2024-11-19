import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ListUsersComponent,
    EditUserComponent,
    CreateUserComponent,
    DeleteUserComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class UsersModule { }
