import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../users/interfaces';
import { Observable } from 'rxjs';
import { Sede } from '../../configuracion/sedes/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { FacturasService } from '../../facturas/service/facturas.service';
import { Articulo, ArticuloWallet, BodegaArticulo } from '../../articulos/interfaces';
import { BuscarArticuloComponent } from '../../facturas/componentes/buscar-articulo/buscar-articulo.component';
import { MovimientosService } from '../service/movimientos.service';
import { DetalleMovimiento, Movimiento } from '../../solicitudes/interfaces';
import { EditDetalleMovimientoComponent } from '../componentes/edit-detalle-movimiento/edit-detalle-movimiento.component';
import { DeleteDetalleMovimientoComponent } from '../componentes/delete-detalle-movimiento/delete-detalle-movimiento.component';

@Component({
  selector: 'app-edit-movimiento',
  templateUrl: './edit-movimiento.component.html',
  styleUrl: './edit-movimiento.component.scss'
})
export class EditMovimientoComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  user: User;

  movimiento: Movimiento;
  bodega_id: number = 9999999;
  proveedor_id: number = 9999999;
  fecha_emision: string = '';
  tipo_movimiento: number = 9999999;
  observacion: string = '';
  observacion_entrega: string = '';

  bodegas: Bodega[] = [];
  proveedores: Proveedor[] = [];
  unidades: Unidad[] = [];
  unidades_totales: Unidad[] = [];
  sedes: Sede[] = [];

  // ARTICULOS
  buscar_articulo: string = '';
  unidad_id: number = 9999999;
  costo: number = 0;
  cantidad: number = 0;
  detalle_movimiento: DetalleMovimiento[] = [];
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
  total_factura: number = 0;
  total_cantidad: number = 0;
  total_costo: number = 0;

  movimiento_id: number = 0;
  estado: number = 9999999;

  constructor(
    public movimientoService: MovimientosService,
    public facturaService: FacturasService,
    public modalService: NgbModal,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public activateRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    // this.tipo_movimiento = 1;
    this.isLoading$ = this.movimientoService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();

    const today = new Date();
    this.fecha_emision = today.toISOString().split('T')[0];

    this.closeSidebar();

    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.movimiento_id = id;
      this.showMovimiento(this.movimiento_id);
    })

    this.isLoadingProcess();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  showMovimiento(id: number) {
    this.movimientoService.showMovimiento(id).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.movimiento = resp.movimiento;

        this.detalle_movimiento = this.movimiento.detalles_movimientos ?? [];
        this.resetearArticulo();
        this.calcularTotales();

        this.estado = this.movimiento.estado ?? 9999999;
        this.bodega_id = this.movimiento.bodega_id ?? 9999999;
        this.proveedor_id = this.movimiento.proveedor_id ?? 9999999;
        this.user.name = this.movimiento.usuario?.name ?? '';
        this.user.nombre_sede = this.movimiento.sede?.nombre ?? '';
        this.fecha_emision = this.movimiento.fecha_emision
          ? new Date(this.movimiento.fecha_emision).toISOString().split('T')[0]
          : ''; // Convierte a formato 'YYYY-MM-DD' o usa '' si no existe

        this.tipo_movimiento = this.movimiento.tipo_movimiento;
        this.observacion = this.movimiento.observacion;
        this.observacion_entrega = this.movimiento.observacion_entrega ?? '';
        this.detalle_movimiento = Array.isArray(this.movimiento.detalles_movimientos)
          ? this.movimiento.detalles_movimientos
          : []; // Asegura que sea un arreglo

        this.isLoadingProcess();
        this.cdr.detectChanges();
      }
    });
  }

  setNombreSede(): void {
    // Buscar la sede por ID
    const sedeEncontrada = this.sedes.find(sede => sede.id === this.user.sede_id);
    if (sedeEncontrada) {
      this.user.nombre_sede = sedeEncontrada.nombre;
    }
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.unidades_totales = response.unidades;
        this.bodegas = response.bodegas;
        this.proveedores = response.proveedores;
        this.sedes = response.sedes;
        this.isLoadingProcess();
      });
  }

  listarArticulos() {

    if (this.tipo_movimiento === 9999999) {
      this.toast.error('Validación', 'Necesita seleccionar un tipo de movimiento');
      return;
    }

    if (!this.buscar_articulo) {
      this.toast.error('Validación', 'Necesitas ingresar el nombre ó el código del articulo');
      return false;
    }

    if (this.bodega_id === 9999999) {
      this.toast.error('Validación', 'Necesita seleccionar una bodega');
      return;
    }

    this.facturaService.buscarArticulos(this.buscar_articulo).subscribe((resp) => {

      if (!resp || !resp.articulos || !resp.articulos.data || resp.articulos.data.length === 0) {
        this.toast.info('Validación', 'No hay coincidencia en la búsqueda');
        return false;  // Detener la ejecución si no se encontraron resultados
      }

      // Si se encuentran más de un cliente, abrir el listado de clientes seleccionados
      if (resp.articulos.data.length > 1) {
        this.abrirArticulosSeleccionados(resp.articulos.data);
      }
      // Si solo se encuentra un cliente, asignarlo y concatenar los nombres si es necesario
      else if (resp.articulos.data.length === 1) {
        this.articulo = resp.articulos.data[0];
        this.buscar_articulo = this.articulo.nombre;

        if (this.tipo_movimiento === 2) {
          this.unidades = this.articulo.bodegas_articulos
            ?.filter((bodega: BodegaArticulo) => bodega.bodega.id === this.bodega_id)
            .map((bodega: BodegaArticulo) => bodega.unidad) || [];

          if (this.unidades.length <= 0) {
            this.toast.error(
              'Validación',
              `No existe stock disponible para esta bodega`
            );
          }
        } else {
          this.unidades = this.unidades_totales;
        }

        // this.costo = this.articulo.precio_general;
        setTimeout(() => {
          this.focusField('.unidad-id-articulo-select');
        }, 50);
        this.isLoadingProcess();
      }
    });
  }

  abrirArticulosSeleccionados(articulos: Articulo[]) {
    const modalRef = this.modalService.open(BuscarArticuloComponent, { centered: true, size: 'xl' });

    modalRef.componentInstance.articulos = articulos;
    modalRef.componentInstance.ArticuloS.subscribe((articulo: Articulo) => {

      this.articulo = articulo;
      this.buscar_articulo = this.articulo.nombre;
      // this.costo = this.articulo.precio_general;
      if (this.tipo_movimiento === 2) {
        this.unidades = this.articulo.bodegas_articulos
          ?.filter((bodega: BodegaArticulo) => bodega.bodega.id === this.bodega_id)
          .map((bodega: BodegaArticulo) => bodega.unidad) || [];

        if (this.unidades.length <= 0) {
          this.toast.error(
            'Validación',
            `No existe stock disponible para esta bodega`
          );
        }
      } else {
        this.unidades = this.unidades_totales;
      }

      setTimeout(() => {
        this.focusField('.unidad-id-articulo-select');
      }, 50);

      this.isLoadingProcess();
    });
  }

  agregarArticulo(): void {

    if (this.articulo.id === 0) {
      this.toast.error('Validación', 'No ha seleccionado un artículo');
      return;
    }

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

    // Validar si el artículo ya existe con descuento o sin descuento
    const articuloExistente = this.detalle_movimiento.find(
      (detalle) =>
        detalle.articulo_id === this.articulo.id &&
        detalle.unidad_id === this.unidad_id
    );

    // Subtotal sin descuento
    const costoTotal = this.costo * this.cantidad;

    const unidad = this.unidades.find((item: Unidad) => item.id === this.unidad_id);

    if (this.tipo_movimiento === 2) {
      const bodegaArticulo = this.articulo.bodegas_articulos
        ?.find(
          (bodega: BodegaArticulo) =>
            bodega.unidad.id === this.unidad_id && bodega.bodega.id === this.bodega_id
        );

      if (bodegaArticulo && bodegaArticulo.cantidad < this.cantidad) {
        this.toast.error(
          'Validación',
          `No puedes solicitar esa cantidad, porque no hay stock disponible (${bodegaArticulo.cantidad})`
        );
        return;
      }
    }


    if (articuloExistente) {
      // Validar si el costo es diferente
      if (articuloExistente.costo !== this.costo) {
        this.toast.error(
          'Validación',
          'El artículo ya existe con un costo diferente. No se puede agregar.'
        );
        return;
      }
      // Actualizar valores
      articuloExistente.cantidad += this.cantidad;
      articuloExistente.total += costoTotal;


      this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
    } else {
      // Si no existe, agrega el artículo al detalle
      // const unidad = this.articulo.unidades?.find((item: Unidad) => item.id === this.unidad_id_articulo);

      this.detalle_movimiento.push({
        id: 0,
        articulo: this.articulo,
        unidad: unidad,
        cantidad: this.cantidad,
        cantidad_recibida: this.cantidad,
        total: costoTotal,
        movimiento_id: 0,
        articulo_id: this.articulo.id,
        empresa_id: this.user.empresa_id,
        sede_id: this.user.sede_id ?? 0,
        estado: 1,
        unidad_id: this.unidad_id,
        costo: this.costo,
        user_id: this.user.id,
        fecha_entrega: null,
      });

      this.toast.success('Artículo agregado', 'El artículo ha sido agregado a la factura');
    }
    setTimeout(() => {
      this.focusField('.buscar-articulo-input');
    }, 50);
    // Calcula los totales

    this.resetearArticulo();
    this.calcularTotales();
    this.unidades = [];
  }

  changeBodega() {
    if (this.articulo) {
      if (this.tipo_movimiento === 2) {
        this.unidades = this.articulo.bodegas_articulos
          ?.filter((bodega: BodegaArticulo) => bodega.bodega.id === this.bodega_id)
          .map((bodega: BodegaArticulo) => bodega.unidad) || [];
      } else {
        this.unidades = this.unidades_totales;
      }
    }
  }

  resetearArticulo() {

    this.articulo = {
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

    this.buscar_articulo = '';
    this.cantidad = 0;
    this.costo = 0;
    this.unidad_id = 9999999;

    setTimeout(() => {
      this.focusField('.buscar-articulo-input');
    }, 50);
    this.isLoadingProcess();
  }

  calcularTotales(): void {

    this.total_factura = this.detalle_movimiento.reduce((total, detalle) => total + (detalle.total || 0), 0);

    this.total_cantidad = this.detalle_movimiento.reduce((cantidad, detalle) => cantidad + (detalle.cantidad || 0), 0);

    this.total_costo = this.detalle_movimiento.reduce((costo, detalle) => costo + (detalle.costo || 0), 0);

    this.isLoadingProcess();
  }

  changeUnidadArticulo() {
    this.focusField('.costo-input');
    this.isLoadingProcess();
    this.cdr.detectChanges();
    // Buscar coincidencia exacta en articulos_wallets
    const wallet = this.articulo.articulos_wallets?.find((wallet: ArticuloWallet) => {
      return (
        wallet.unidad.id === this.unidad_id &&
        (wallet.sede_id_premul === this.user.sede_id || wallet.sede_id_premul === null)
      );
    });

    if (!wallet) {

      // Verificar posibles coincidencias parciales
      const posiblesCoincidencias = this.articulo.articulos_wallets?.filter((wallet: ArticuloWallet) => {
        return wallet.unidad.id === this.unidad_id;
      });

      if (posiblesCoincidencias?.length) {
        // console.warn('Usando la primera coincidencia parcial como predeterminada.');
        const primeraCoincidencia = posiblesCoincidencias[0];
        // Asignar precio de la coincidencia parcial como fallback
        this.costo = primeraCoincidencia.precio;
      } else {
        this.costo = 0; // Establecer un valor predeterminado
      }
      return;
    }

    // Asignar el precio del wallet encontrado
    this.costo = wallet.precio;
  }

  editarArticulo(detalle: DetalleMovimiento, index: number) {
    const modalRef = this.modalService.open(EditDetalleMovimientoComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = detalle;
    modalRef.componentInstance.bodega_id = this.bodega_id;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.tipo_movimiento = this.tipo_movimiento;

    modalRef.componentInstance.DetalleS.subscribe((detalleR: DetalleMovimiento) => {

      this.detalle_movimiento[index] = detalleR;
      // Calcula los totales
      this.calcularTotales();
      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha editado el articulo');
    });
  }

  eliminarArticulo(detalle: DetalleMovimiento, index: number) {
    const modalRef = this.modalService.open(DeleteDetalleMovimientoComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = detalle;

    modalRef.componentInstance.DetalleD.subscribe((resp: string) => {

      this.detalle_movimiento.splice(index, 1);
      // Calcula los totales
      this.calcularTotales();
      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha eliminado el articulo');
    });
  }

  store() {

    if (this.bodega_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un almacen");
      return;
    }

    if (this.proveedor_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un proveedor");
      return;
    }

    if (this.fecha_emision === '') {
      this.toast.error("Validando", "Necesitas seleccionar una fecha");
      return;
    }

    if (this.observacion === '') {
      this.toast.error("Validando", "Necesitas agregar una observación");
      return;
    }

    if (this.tipo_movimiento === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un tipo de movimiento");
      return;
    }

    if (this.estado === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un estado");
      return;
    }

    if (this.detalle_movimiento.length === 0) {
      this.toast.error("Validando", "Necesitas agregar por lo menos un articulo al detalle");
      return;
    }

    this.movimiento = {
      id: this.movimiento_id,
      fecha_emision: this.fecha_emision ? new Date(this.fecha_emision) : null,
      tipo_movimiento: this.tipo_movimiento,
      observacion: this.observacion,
      destino: 'Movimiento',
      total: this.total_factura,
      user_id: this.user.id,
      bodega_id: this.bodega_id,
      plantilla_id: 0,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id,
      sede_id: this.user?.sede_id ?? 0, // Usa 0 si sede_id es undefined
      estado: this.estado,
      fecha_entrega: null,
      observacion_entrega: '',
      detalles_movimientos: this.detalle_movimiento
    }

    this.movimientoService.edit(this.movimiento, this.movimiento_id).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);

      } else {
        this.toast.success('Exito', resp.message_text);

        this.router.navigate(['/movimientos/listado']);
      }
    });
  }

  seleccionarTexto(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input.select) {
      input.select(); // Selecciona el texto del input
    }
    this.isLoadingProcess();
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

  changeTipo() {
    this.resetearArticulo();
    this.calcularTotales();
    this.unidades = [];
  }

  isLoadingProcess() {
    this.movimientoService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.movimientoService.isLoadingSubject.next(false);
    }, 50);
  }
}
