import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/modules/clientes/interfaces';


@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.scss'
})
export class BuscarClienteComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() clientes: Cliente[] = [];
  @Output() ClienteS: EventEmitter<Cliente> = new EventEmitter;

  constructor(
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    
  }

  seleccionarCliente(cliente: Cliente) {
    this.ClienteS.emit(cliente);
    this.modal.close();
  }
}
