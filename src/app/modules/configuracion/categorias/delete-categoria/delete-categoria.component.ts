import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Categoria } from '../interfaces';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-delete-categoria',
  templateUrl: './delete-categoria.component.html',
  styleUrl: './delete-categoria.component.scss'
})
export class DeleteCategoriaComponent implements OnInit {
  name: string = '';
  isLoading$: any;
  @Output() CategoriaD: EventEmitter<Categoria> = new EventEmitter;
  @Input() CategoriaSeleccionado: Categoria;

  categoria: Categoria = {
    id: 0,
    nombre: '',
    descripcion: '',
    imagen: '',
    empresa_id: 9999999,
    estado: 1,
  };

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
  }

  cambiarEstado() {

    const nuevoEstado = this.categoria.estado === 1 ? 0 : 1;
    if (this.categoria.estado === 1) {
      this.categoria.estado = 0;
    } else {
      this.categoria.estado = 1;
    }

    this.categoriaService.cambiarEstado(this.categoria, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.CategoriaD.emit(this.categoria);
        this.modal.close();
      }
    });

  }

}
