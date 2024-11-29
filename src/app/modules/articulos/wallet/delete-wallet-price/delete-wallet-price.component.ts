import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { ArticuloWallet } from '../../interfaces';
import { WalletService } from '../../service/wallet.service';


@Component({
  selector: 'app-delete-wallet-price',
  templateUrl: './delete-wallet-price.component.html',
  styleUrl: './delete-wallet-price.component.scss'
})
export class DeleteWalletPriceComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() ArticuloWalletD: EventEmitter<ArticuloWallet> = new EventEmitter;

  @Input() ArticuloWalletSeleccionado: ArticuloWallet;

  articulo_wallet: ArticuloWallet;

  constructor(
    public modal: NgbActiveModal,
    public walletService: WalletService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.walletService.isLoading$;
    this.articulo_wallet = { ...this.ArticuloWalletSeleccionado };
  }

  delete() {

    if (this.articulo_wallet.id !== undefined) {
      this.walletService.delete(this.articulo_wallet.id).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.ArticuloWalletD.emit(resp.articulo_wallet);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de sede artículo no está definido.');
    }


  }

}
