import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Articulo } from 'src/app/modules/articulos/interfaces';

@Component({
  selector: 'app-buscar-articulo',
  templateUrl: './buscar-articulo.component.html',
  styleUrl: './buscar-articulo.component.scss'
})
export class BuscarArticuloComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() articulos: Articulo[] = [];;
  @Output() ArticuloS: EventEmitter<Articulo> = new EventEmitter;

  constructor(
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    
  }

  seleccionarArticulo(articulo: Articulo) {
    this.ArticuloS.emit(articulo);
    this.modal.close();
  }
}
