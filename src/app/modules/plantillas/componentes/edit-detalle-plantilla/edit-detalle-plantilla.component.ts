import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';
import { Unidad } from 'src/app/modules/configuracion/unidades/interfaces';
import { DetallePlantilla } from '../../interfaces';
import { PlantillasService } from '../../service/plantillas.service';
import { Articulo, ArticuloWallet } from 'src/app/modules/articulos/interfaces';
import { User } from 'src/app/modules/users/interfaces';

@Component({
  selector: 'app-edit-detalle-plantilla',
  templateUrl: './edit-detalle-plantilla.component.html',
  styleUrl: './edit-detalle-plantilla.component.scss'
})
export class EditDetallePlantillaComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() user: User;
  @Input() detalle: DetallePlantilla;
  @Input() unidades: Unidad[] = [];
  @Output() DetalleS: EventEmitter<DetallePlantilla> = new EventEmitter;

  unidad_id: number = 9999999;
  costo: number = 0;
  cantidad: number = 0;

  constructor(
    public modal: NgbActiveModal,
    public plantillaService: PlantillasService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.plantillaService.isLoading$;
    this.unidad_id = this.detalle.unidad_id;
    this.cantidad = this.detalle.cantidad;
    this.costo = this.detalle.costo;
  }

  edit() {

    if (this.unidad_id === 9999999) {
      this.toast.error('Validación', 'No ha seleccionado la unidad del artículo');
      return;
    }

    if (!this.costo) {
      this.toast.error('Validación', 'Por favor digite el costo');
      return;
    }

    if (!this.cantidad) {
      this.toast.error('Validación', 'No ha digitado la cantidad solicitada del artículo');
      return;
    }

    // Subtotal sin descuento
    const costoTotal = this.costo * this.cantidad;

    const unidad = this.unidades.find((item: Unidad) => item.id === this.unidad_id);
    // Actualizar el detalle con los nuevos valores
    this.detalle.cantidad = this.cantidad;
    this.detalle.cantidad_recibida = this.cantidad;
    this.detalle.unidad_id = this.unidad_id;
    this.detalle.unidad = unidad;
    this.detalle.costo = this.costo;
    this.detalle.total_costo = costoTotal;

    this.DetalleS.emit(this.detalle);
    this.modal.close();
  }

  focusField(selector: string): void {
    const element = document.querySelector(selector) as HTMLSelectElement;

    if (element) {
      element.focus();

      if (element.tagName.toLowerCase() === 'select') {
        // Expande el dropdown al configurar size
        element.size = element.options.length;

        // Colapsa el dropdown cuando se pierde el foco
        element.addEventListener('blur', () => {
          element.size = 0;
        });
      }
    }
  }

  changeUnidadArticulo() {

    this.focusField('.costo-input-edit');
    this.isLoadingProcess();
    this.cdr.detectChanges();

    if (this.detalle.articulo && this.detalle.articulo.articulos_wallets) {
      // Buscar coincidencia exacta en articulos_wallets
      const wallet = this.detalle.articulo.articulos_wallets.find((wallet: ArticuloWallet) => {
        return (
          wallet.unidad.id === this.unidad_id &&
          (wallet.sede_id_premul === this.user.sede_id || wallet.sede_id_premul === null)
        );
      });

      if (!wallet) {
        // Verificar posibles coincidencias parciales
        const posiblesCoincidencias = this.detalle.articulo.articulos_wallets.filter((wallet: ArticuloWallet) => {
          return wallet.unidad.id === this.unidad_id;
        });

        if (posiblesCoincidencias.length > 0) {
          // Usar la primera coincidencia parcial como predeterminada
          const primeraCoincidencia = posiblesCoincidencias[0];
          // Asignar precio de la coincidencia parcial como fallback
          this.costo = primeraCoincidencia.precio;
        } else {
          this.costo = this.detalle.costo; // Establecer un valor predeterminado
        }
        return;
      }

      // Si se encuentra una coincidencia exacta, usar el precio del wallet
      this.costo = wallet.precio;
    } else {
      // Si no hay articulo o articulos_wallets, establecer un valor predeterminado
      this.costo = this.detalle.costo;
    }
  }

  seleccionarTexto(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input.select) {
      input.select(); // Selecciona el texto del input
    }
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.plantillaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.plantillaService.isLoadingSubject.next(false);
    }, 50);
  }
}
