import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() UserD: EventEmitter<User> = new EventEmitter;
  @Input() UserSeleccionado: User;
  @Output() estadoCambiado = new EventEmitter<{ id: number, nuevoEstado: number }>();

  user: User = {
    id: 0,
    name: '',
    email: '',
    identificacion: '',
    usuario: '',
    direccion: '',
    celular: 0,
    estado: 1,
    empresa_id: 0,
    role_id: 0,
    role: {
      id: 0,
      name: '',
      guard_name: ''
    },
    roles: [
      {
        id: 0,
        name: '',
        guard_name: '',
        permissions: []
      }
    ],
    permissions: [],
    avatar: '',
    genero_id: 0,
    departamento_id: 0,
    municipio_id: 0,
    tipo_doc_id: 0,
    fecha_nacimiento: ''
  };

  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    public toast: ToastrService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.userService.isLoading$;
    this.user = { ...this.UserSeleccionado };
    this.user.estado = Number(this.user.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.user.estado === 1 ? 0 : 1;
    if (this.user.estado === 1) {
      this.user.estado = 0;
    } else {
      this.user.estado = 1;
    }

    this.userService.cambiarEstadoUsuario(this.user, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.UserD.emit(resp.user);
        this.modal.close();
      }
    });

  }
}
