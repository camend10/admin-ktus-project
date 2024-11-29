import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { Categoria } from '../interfaces';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-create-categoria',
  templateUrl: './create-categoria.component.html',
  styleUrl: './create-categoria.component.scss'
})
export class CreateCategoriaComponent implements OnInit {

  isLoading$: any;
  @Output() CategoriaC: EventEmitter<Categoria> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  user: User;

  categoria: Categoria = {
    id: 0,
    nombre: '',
    descripcion: '',
    imagen: '',
    empresa_id: 9999999,
    estado: 1,
  };

  file_name: File | null = null;

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = '../../../../assets/media/icons/categoria.png';

  constructor(
    public modal: NgbActiveModal,
    public categoriaService: CategoriaService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.categoriaService.isLoading$;
    this.imagen_previzualizada = '../../../../assets/media/icons/categoria.png';
    this.user = this.authService.user;
    this.categoria.empresa_id = this.user.empresa_id;
  }

  store() {

    if (!this.categoria.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.categoria.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.categoriaService.registrar(this.categoria, this.file_name).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.CategoriaC.emit(resp.categoria);
        this.modal.close();
      }
    });
  }

  processFile($event: Event) {

    const input = $event.target as HTMLInputElement;

    // Asegúrate de que hay un archivo seleccionado
    if (!input.files || input.files.length === 0) {
      this.toast.warning("Validando", "No se ha seleccionado ningún archivo");
      return;
    }

    // const file = $event.target.files[0];
    const file = input.files[0];
    if (!file || file.type.indexOf("image") < 0) {
      this.toast.warning("Validando", "El archivo no es una imagen");
      return;
    }

    this.file_name = file; // Asigna el archivo a this.file_name

    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizada = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  cancelImage() {
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = '../../../../assets/media/icons/categoria.png';
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = '../../../../assets/media/icons/categoria.png';
  }

}
