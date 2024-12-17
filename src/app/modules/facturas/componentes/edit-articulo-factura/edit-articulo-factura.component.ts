import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';
import { DetalleFactura } from '../../interfaces';
import { Articulo, ArticuloWallet, BodegaArticulo } from 'src/app/modules/articulos/interfaces';
import { FacturasService } from '../../service/facturas.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/modules/clientes/interfaces';
import { Unidad } from 'src/app/modules/configuracion/unidades/interfaces';

@Component({
  selector: 'app-edit-articulo-factura',
  templateUrl: './edit-articulo-factura.component.html',
  styleUrl: './edit-articulo-factura.component.scss'
})
export class EditArticuloFacturaComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() detalle: DetalleFactura;
  @Input() cliente: Cliente;
  @Output() DetalleS: EventEmitter<DetalleFactura> = new EventEmitter;

  source: any;
  // @ViewChild("descuento") something: ElementRef;
  @ViewChild('descuento', { static: false }) something: ElementRef | undefined;
  private keyupSubscription: Subscription | null = null;

  unidad_id_articulo: number = 9999999;
  bodega_id_articulo: number = 9999999;
  cantidad_articulo: number = 0;
  precio_general_articulo: number = 0;
  bodegas_articulos: BodegaArticulo[] = [];
  exist_bodegas: BodegaArticulo[] = [];
  monto_descuento: number = 0;
  iva: number = 0;

  user: User;

  articulo: Articulo = {
    id: 0,
    sku: '',
    nombre: '',
    descripcion: '',
    precio_general: 0,
    punto_pedido: 0,
    imagen: '',
    iva_id: 9999999,
    empresa_id: 9999999,
    estado: 1,
    categoria_id: 9999999,
    is_gift: 1,
    descuento_maximo: 0,
    descuento_minimo: 0,
    tiempo_de_abastecimiento: 0,
    disponibilidad: 9999999,
    impuesto: 9999999,
    punto_pedido_unidad_id: 9999999,
    is_discount: 1,
    proveedor_id: 9999999,
    unidades: [],
    bodegas_articulos: [],
    articulos_wallets: [],
    iva: {
      id: 0,
      porcentaje: 0,
      empresa_id: 0,
      estado: 0,
    },
    categoria: {
      id: 0,
      nombre: '',
      descripcion: '',
      empresa_id: 0,
      estado: 0,
      imagen: '',
    }
  }

  constructor(
    public modal: NgbActiveModal,
    public facturaService: FacturasService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
    this.user = this.authService.user;
    this.articulo = this.detalle.articulo ?? { ...this.articulo };
    this.unidad_id_articulo = this.detalle.unidad_id;
    // this.bodega_id_articulo 
    this.cantidad_articulo = this.detalle.cantidad_item;
    this.precio_general_articulo = this.detalle.precio_item;
    this.monto_descuento = this.detalle.descuento;

    this.bodegas_articulos = this.articulo.bodegas_articulos?.filter(
      (bodega: BodegaArticulo) => bodega.unidad.id === this.unidad_id_articulo
    ) ?? [];
    this.exist_bodegas = this.bodegas_articulos.filter((bod_art: BodegaArticulo) => bod_art.bodega.sede_id === this.user.sede_id);

    setTimeout(() => {
      this.initKeyupDescuento();
    }, 50);
  }

  // Inicializa la validación del descuento
  initKeyupDescuento() {
    if (!this.something) {
      // console.error('Elemento "descuento" no está disponible.');
      return;
    }

    // Cancelar la suscripción previa si ya existe
    if (this.keyupSubscription) {
      this.keyupSubscription.unsubscribe();
    }

    // Crear una nueva suscripción
    this.keyupSubscription = fromEvent(this.something.nativeElement, 'keyup')
      .pipe(debounceTime(1200)) // Esperar 1.2 segundos antes de ejecutar
      .subscribe(() => {
        this.verificarDescuento();
      });
  }

  edit() {
    const articuloNoSeleccionado = this.articulo.id === 0;
    const articuloSinExistencias = this.unidad_id_articulo !== 9999999 && this.bodegas_articulos.length === 0;
    const bodegasSinExistencias = this.unidad_id_articulo !== 9999999 && this.bodegas_articulos.length > 0 && this.exist_bodegas.length === 0;

    if (articuloNoSeleccionado) {
      this.toast.error('Validación', 'No ha seleccionado un artículo');
      return;
    }

    if (this.precio_general_articulo === 0) {
      this.toast.error('Validación', 'No existe el precio del artículo');
      return;
    }

    if (this.unidad_id_articulo === 9999999) {
      this.toast.error('Validación', 'No ha seleccionado la unidad del artículo');
      return;
    }

    if (this.cantidad_articulo === 0) {
      this.toast.error('Validación', 'No ha digitado la cantidad solicitada del artículo');
      return;
    }

    if (this.articulo.disponibilidad === 2) {
      if (articuloSinExistencias || bodegasSinExistencias) {
        this.toast.error('Validación', 'El artículo no se puede agregar debido a que no tiene existencias disponibles');
        return;
      }
    }

    // Validar el descuento solo si es mayor que 0
    if (this.monto_descuento > 0) {
      const descuento_maximo_real = (this.articulo.descuento_maximo * 0.01) * this.precio_general_articulo;
      const descuento_minimo_real = (this.articulo.descuento_minimo * 0.01) * this.precio_general_articulo;

      if (this.monto_descuento > descuento_maximo_real) {
        this.toast.info('Validación', 'El descuento supera el monto máximo permitido para este artículo');
        // this.monto_descuento = descuento_maximo_real; // Ajustar al máximo permitido
        this.monto_descuento = 0;
        return; // Salir para no permitir agregar
      }

      if (this.monto_descuento < descuento_minimo_real) {
        this.toast.info('Validación', 'El descuento es inferior al monto mínimo permitido para este artículo');
        // this.monto_descuento = descuento_minimo_real; // Ajustar al mínimo permitido
        this.monto_descuento = 0;
        return; // Salir para no permitir agregar
      }
    }


    // const unidad = this.articulo.unidades?.find((item: Unidad) => item.id === this.unidad_id_articulo);

    // this.detalle.descuento = this.monto_descuento;
    // this.detalle.total_iva = this.iva;
    // this.detalle.unidad = unidad;
    // this.detalle.sub_total = this.getSubtotal();
    // this.detalle.total_precio = this.getTotalCosto();
    // this.detalle.cantidad_item = this.cantidad_articulo;
    // this.detalle.unidad_id = this.unidad_id_articulo;
    // this.detalle.total_descuento = this.getTotalDescuento();

    // Actualización de los detalles
    const unidad = this.articulo.unidades?.find((item: Unidad) => item.id === this.unidad_id_articulo);

    // Recalcular valores en función de la edición
    const subtotalBase = this.precio_general_articulo * this.cantidad_articulo;
    const totalDescuento = this.monto_descuento * this.cantidad_articulo;
    const subtotalConDescuento = subtotalBase - totalDescuento;

    let ivaTotal = 0;
    if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
      const porcentajeIVA = this.articulo.iva.porcentaje * 0.01;
      ivaTotal = subtotalConDescuento * porcentajeIVA;
    }

    const costoTotal = subtotalConDescuento + ivaTotal;

    // Actualizar el detalle con los nuevos valores
    this.detalle.descuento = this.monto_descuento;
    this.detalle.total_iva = ivaTotal;
    this.detalle.unidad = unidad;
    this.detalle.sub_total = subtotalBase;
    this.detalle.total_precio = costoTotal;
    this.detalle.cantidad_item = this.cantidad_articulo;
    this.detalle.unidad_id = this.unidad_id_articulo;
    this.detalle.total_descuento = totalDescuento;
    this.detalle.precio_item = this.precio_general_articulo;

    this.DetalleS.emit(this.detalle);
    this.modal.close();
  }

  getTotalDescuento(): number {
    if (this.monto_descuento && this.cantidad_articulo) {
      // Multiplica el descuento unitario por la cantidad de productos
      return this.monto_descuento * this.cantidad_articulo;
    }
    return 0; // Devuelve 0 si no hay datos suficientes
  }

  seleccionarTexto(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input.select) {
      input.select(); // Selecciona el texto del input
    }
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.facturaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.facturaService.isLoadingSubject.next(false);
    }, 50);
  }

  changeUnidadArticulo(target: EventTarget | null) {
    if (!(target instanceof HTMLSelectElement)) {
      console.error('El elemento no es un select válido');
      return false;
    }

    // Convertir el valor seleccionado a número
    this.monto_descuento = 0;
    this.cantidad_articulo = 0;
    const unidad_id = parseInt(target.value, 10);

    // Validar si el valor es válido
    if (isNaN(unidad_id) || unidad_id === 0) {
      // console.error('Valor de unidad_id no válido, restableciendo a 9999999');
      setTimeout(() => {
        this.unidad_id_articulo = 9999999;
        this.precio_general_articulo = 0;
        this.bodega_id_articulo = 9999999;
      });
    }
    // Actualizar bodegas_articulos solo si la unidad es válida

    if (this.unidad_id_articulo !== 9999999) {
      this.bodegas_articulos = this.articulo.bodegas_articulos?.filter(
        (bodega: BodegaArticulo) => bodega.unidad.id === this.unidad_id_articulo
      ) ?? [];
    } else {
      this.bodegas_articulos = [];
    }

    this.exist_bodegas = this.bodegas_articulos.filter((bod_art: BodegaArticulo) => bod_art.bodega.sede_id === this.user.sede_id);
    const wallets = this.articulo.articulos_wallets;

    setTimeout(() => {
      this.verificarDescuento();
    }, 50);

    if (!Array.isArray(wallets)) {
      // console.error('Error: `articulos_wallets` no está definido o no es un array.');
      return false;
    }

    this.focusField('.cantidad-input-edit');
    // Prioridad 1: Búsqueda por unidad, sede y segmento de cliente
    let precio_s = this.buscarPrecio(wallets, this.unidad_id_articulo, this.user.sede_id ?? null,
      this.cliente.segmento?.id ?? null);

    if (precio_s) {
      this.precio_general_articulo = precio_s.precio;
      return false;
    }

    // Prioridad 2: Búsqueda por unidad y sede o segmento
    const precio_sba = this.buscarPrecio(wallets, this.unidad_id_articulo, this.user.sede_id ?? null, null);
    const precio_sbb = this.buscarPrecio(wallets, this.unidad_id_articulo, null, this.cliente.segmento?.id ?? null);

    if (precio_sba && precio_sbb) {
      this.precio_general_articulo = Math.min(precio_sba.precio, precio_sbb.precio);
      return false;
    }

    if (precio_sba) {
      this.precio_general_articulo = precio_sba.precio;
      return false;
    }

    if (precio_sbb) {
      this.precio_general_articulo = precio_sbb.precio;
      return false;
    }

    // Prioridad 3: Búsqueda por unidad solamente
    const precio_st = this.buscarPrecio(wallets, this.unidad_id_articulo, null, null);

    if (precio_st) {
      this.precio_general_articulo = precio_st.precio;
      return false;
    }

    // Sin coincidencias: asignar precio base
    this.precio_general_articulo = this.articulo.precio_general;

    this.isLoadingProcess();
    this.cdr.detectChanges();
  }

  private buscarPrecio(
    wallets: ArticuloWallet[],
    unidad_id: number,
    sede_id: number | null,
    segmento_id: number | null
  ): ArticuloWallet | undefined {

    // Convertir unidad_id y segmento_id explícitamente a número
    const unidadIdNumber = Number(unidad_id);
    const sedeIdNumber = sede_id !== null ? Number(sede_id) : null;
    const segmentoIdNumber = segmento_id !== null ? Number(segmento_id) : null;

    return wallets.find((wallet: ArticuloWallet) => {
      // Convertir valores de wallet a números si es necesario
      const walletUnidadId = wallet.unidad?.id ? Number(wallet.unidad.id) : null;
      const walletSedeId = wallet.sede && !Array.isArray(wallet.sede) ? Number(wallet.sede.id) : null;
      const walletSegmentoId = wallet.segmento_cliente && !Array.isArray(wallet.segmento_cliente)
        ? Number(wallet.segmento_cliente.id)
        : null;

      // Logs para depuración

      // Comparación con valores convertidos
      return (
        walletUnidadId === unidadIdNumber &&
        walletSedeId === sedeIdNumber &&
        walletSegmentoId === segmentoIdNumber
      );
    });
  }

  getTotalCosto(): number {
    if (this.precio_general_articulo && this.cantidad_articulo) {
      // Aplica el descuento al precio unitario
      const descuentoAplicado = this.monto_descuento || 0;
      const precioConDescuento = this.precio_general_articulo - descuentoAplicado;

      // Subtotal sin IVA (precio con descuento multiplicado por cantidad)
      const subtotal = precioConDescuento * this.cantidad_articulo;

      // Calcula el IVA sobre el subtotal
      if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
        const porcentajeIVA = this.articulo.iva.porcentaje * 0.01; // Convierte el porcentaje a decimal
        this.iva = subtotal * porcentajeIVA; // Almacena el IVA total
      } else {
        this.iva = 0; // Resetea el IVA si no aplica
      }

      // Total con IVA
      return subtotal + this.iva;
    }

    this.iva = 0; // Si no hay datos, resetea el IVA
    return 0;
  }

  getSubtotal(): number {
    if (this.precio_general_articulo && this.cantidad_articulo) {
      // Calcula el subtotal considerando el descuento
      const descuentoAplicado = this.monto_descuento || 0;
      return (this.precio_general_articulo - descuentoAplicado) * this.cantidad_articulo;
    }
    return 0; // Devuelve 0 si no hay datos suficientes
  }

  verificarDescuento() {
    // Verificar si monto_descuento es 0
    if (this.monto_descuento === 0) {
      return; // Salir de la función si el descuento es 0
    }

    const descuento_maximo_real = (this.articulo.descuento_maximo * 0.01) * this.precio_general_articulo;
    const descuento_minimo_real = (this.articulo.descuento_minimo * 0.01) * this.precio_general_articulo;

    if (this.monto_descuento > descuento_maximo_real) {
      this.toast.info('Validación', 'El descuento supera el monto que el articulo tiene configurado');
      // this.monto_descuento = descuento_maximo_real; // Establece el máximo permitido
      this.monto_descuento = 0;
    }

    if (this.monto_descuento < descuento_minimo_real) {
      this.toast.info('Validación', 'El descuento no supera el monto mínimo configurado');
      // this.monto_descuento = descuento_minimo_real; // Establece el mínimo permitido
      this.monto_descuento = 0;
    }
    this.isLoadingProcess();
  }

  get descuentoMinimoValor(): number {
    return (this.articulo.descuento_minimo * 0.01) * this.precio_general_articulo;
  }

  get descuentoMaximoValor(): number {
    return (this.articulo.descuento_maximo * 0.01) * this.precio_general_articulo;
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

}
