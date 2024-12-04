import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { ArticulosService } from '../service/articulos.service';
import { Articulo } from '../interfaces';


@Component({
  selector: 'app-import-articulo',
  templateUrl: './import-articulo.component.html',
  styleUrl: './import-articulo.component.scss'
})
export class ImportArticuloComponent implements OnInit {

  isLoading$: any;
  @Output() ImportArticuloD: EventEmitter<any> = new EventEmitter;

  user: User;

  file_name: File | null = null;
  // selectedFileName: string | null = null;
  // selectedFileName: File | null = null;

  constructor(
    public modal: NgbActiveModal,
    public articuloService: ArticulosService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.articuloService.isLoading$;
    this.user = this.authService.user;
    // this.segmentoCliente.empresa_id = this.user.empresa_id;
  }

  processFile($event: Event): void {
    const input = $event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.toast.warning("Validación", "No se ha seleccionado ningún archivo");
      this.file_name = null; // Limpiar el archivo seleccionado
      return;
    }

    const file = input.files[0];

    // Validar el tipo de archivo
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!allowedTypes.includes(file.type)) {
      this.toast.warning("Validación", "El archivo debe ser de tipo .xls, .xlsx o .csv");
      this.file_name = null; // Limpiar el archivo seleccionado
      return;
    }

    // Validar el tamaño del archivo
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxFileSize) {
      this.toast.warning("Validación", "El archivo excede el tamaño máximo permitido (10 MB)");
      this.file_name = null; // Limpiar el archivo seleccionado
      return;
    }

    // Asignar el archivo completo
    this.file_name = file;

    // Mensaje de éxito
    this.toast.success("Validación exitosa", `El archivo ${file.name} se ha cargado correctamente`);
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile({ target: { files } } as unknown as Event);
    }
  }

  preventDefault(event: Event): void {
    event.preventDefault();
  }

  isLoadingProcess() {
    this.articuloService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.articuloService.isLoadingSubject.next(false);
    }, 50);
  }

  store() {

    if (!this.file_name) {
      this.toast.warning("Validación", "No se ha seleccionado ningún archivo para importar");
      return;
    }

    this.articuloService.import_articulo(this.file_name).subscribe((resp) => {
      this.toast.success('Exito', resp.message_text);
      this.ImportArticuloD.emit(resp.message_text);
      this.modal.close();
    }, error => {
      console.log(error);
    });
  }
}
