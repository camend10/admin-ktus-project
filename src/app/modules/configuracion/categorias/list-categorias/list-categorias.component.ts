import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Categoria } from '../interfaces';
import { CategoriaService } from '../service/categoria.service';
import { CreateCategoriaComponent } from '../create-categoria/create-categoria.component';
import { EditCategoriaComponent } from '../edit-categoria/edit-categoria.component';
import { DeleteCategoriaComponent } from '../delete-categoria/delete-categoria.component';


@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.component.html',
  styleUrl: './list-categorias.component.scss'
})
export class ListCategoriasComponent implements OnInit {

  buscar: string = '';
  categorias: Categoria[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public categoriaService: CategoriaService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.categoriaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.categoriaService.listar(page, this.buscar).subscribe((resp) => {
      this.categorias = resp.categorias;
      this.categorias = this.categorias.map(categoria => ({
        ...categoria,
        estado: Number(categoria.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateCategoriaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;

    modalRef.componentInstance.CategoriaC.subscribe((categoria: Categoria) => {

      this.categorias.unshift({
        ...categoria,
        estado: Number(categoria.estado)
      });
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(categoria: Categoria) {
    const modalRef = this.modalService.open(EditCategoriaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.CategoriaSeleccionado = categoria;
    modalRef.componentInstance.CategoriaE.subscribe((CategoriaR: Categoria) => {
      let index = this.categorias.findIndex((CategoriaFind: Categoria) => CategoriaFind.id === categoria.id);
      if (index != -1) {
        this.categorias[index] = {
          ...CategoriaR,
          estado: Number(CategoriaR.estado)
        };
      }
    });
  }

  cambiarEstado(categoria: Categoria) {
    const modalRef = this.modalService.open(DeleteCategoriaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.CategoriaSeleccionado = categoria;
    modalRef.componentInstance.CategoriaD.subscribe((CategoriaR: Categoria) => {
      let index = this.categorias.findIndex((CategoriaFind: Categoria) => CategoriaFind.id === categoria.id);
      if (index != -1) {
        this.categorias[index] = CategoriaR;
      }

    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }

}
