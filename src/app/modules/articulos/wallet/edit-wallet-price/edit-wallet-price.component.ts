import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArticuloWallet, BodegaArticulo } from '../../interfaces';
import { BodegaArticuloService } from '../../service/bodega-articulo.service';
import { Unidad } from 'src/app/modules/configuracion/unidades/interfaces';
import { Bodega } from 'src/app/modules/configuracion/bodegas/interfaces';
import { WalletService } from '../../service/wallet.service';
import { SegmentoCliente } from 'src/app/modules/configuracion/segmento-clientes/interfaces';
import { Sede } from 'src/app/modules/configuracion/sedes/interfaces';


@Component({
  selector: 'app-edit-wallet-price',
  templateUrl: './edit-wallet-price.component.html',
  styleUrl: './edit-wallet-price.component.scss'
})
export class EditWalletPriceComponent implements OnInit {

  isLoading$: any;
  @Output() ArticuloWalletE: EventEmitter<ArticuloWallet> = new EventEmitter;

  @Input() ArticuloWalletSeleccionado: ArticuloWallet;
  @Input() unidades: Unidad[];
  @Input() segmentos_clientes: SegmentoCliente[];
  @Input() sedes: Sede[];
  @Input() articulo_id: number;

  unidad_id_premul: number = 9999999;
  sede_id_premul: number = 9999999;
  segmento_cliente_id_premul: number = 9999999;
  precio_premul: number = 0;

  articulo_wallet: ArticuloWallet;

  constructor(
    public modal: NgbActiveModal,
    public walletService: WalletService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.walletService.isLoading$;
    this.articulo_wallet = { ...this.ArticuloWalletSeleccionado };

    this.unidad_id_premul = this.articulo_wallet.unidad.id;
    this.sede_id_premul = this.articulo_wallet.sede?.id || 9999999;
    this.segmento_cliente_id_premul = this.articulo_wallet.segmento_cliente?.id || 9999999;
    this.precio_premul = this.articulo_wallet.precio;
  }

  store() {

    if (this.unidad_id_premul === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una unidad');
      return false;
    }

    if (!this.precio_premul) {
      this.toast.error('Validación', 'Necesitas colocar una precio');
      return false;
    }

    if (this.articulo_wallet.id !== undefined) {

      let data = {
        id: this.articulo_wallet.id,
        articulo_id: this.articulo_id,
        segmento_cliente_id: this.segmento_cliente_id_premul,
        unidad_id: this.unidad_id_premul,
        precio: this.precio_premul,
        sede_id: this.sede_id_premul,
      }
  

      this.walletService.editar(this.articulo_wallet.id, data).subscribe((resp) => {
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.ArticuloWalletE.emit(resp.articulo_wallet);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de bodega artículo no está definido.');
    }


  }
}
