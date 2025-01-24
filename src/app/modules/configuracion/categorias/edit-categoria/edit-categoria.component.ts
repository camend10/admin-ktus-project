import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Categoria } from '../interfaces';
import { CategoriaService } from '../service/categoria.service';


@Component({
  selector: 'app-edit-categoria',
  templateUrl: './edit-categoria.component.html',
  styleUrl: './edit-categoria.component.scss'
})
export class EditCategoriaComponent implements OnInit {
  isLoading$: any;
  @Output() CategoriaE: EventEmitter<Categoria> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  @Input() CategoriaSeleccionado: Categoria;

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
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.categoriaService.isLoading$;

    this.categoria = { ...this.CategoriaSeleccionado };
    this.categoria.estado = Number(this.categoria.estado);
    this.imagen_previzualizada = this.CategoriaSeleccionado.imagen;
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
    
    this.categoriaService.editar(this.categoria, this.file_name).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.CategoriaE.emit(resp.categoria);
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
