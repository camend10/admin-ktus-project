import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../users/interfaces';
import { Observable } from 'rxjs';
import { Sede } from '../../configuracion/sedes/interfaces';
import { DetalleMovimiento, Movimiento } from '../interfaces';
import { SolicitudesService } from '../service/solicitudes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { FacturasService } from '../../facturas/service/facturas.service';
import { Articulo } from '../../articulos/interfaces';
import { BuscarArticuloComponent } from '../../facturas/componentes/buscar-articulo/buscar-articulo.component';
import { EditItemSolicitudComponent } from '../componentes/edit-item-solicitud/edit-item-solicitud.component';
import { DeleteItemSolicitudComponent } from '../componentes/delete-item-solicitud/delete-item-solicitud.component';
import { isPermission } from 'src/app/config/config';
import { DetallePlantilla, Plantilla } from '../../plantillas/interfaces';


@Component({
  selector: 'app-edit-solicitud',
  templateUrl: './edit-solicitud.component.html',
  styleUrl: './edit-solicitud.component.scss'
})
export class EditSolicitudComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  user: User;

  movimiento: Movimiento;
  bodega_id: number = 9999999;
  proveedor_id: number = 9999999;
  fecha_emision: string = '';
  tipo_movimiento: number = 9999999;
  observacion: string = '';
  observacion_entrega: string = '';
  plantilla_id: number = 9999999;

  bodegas: Bodega[] = [];
  proveedores: Proveedor[] = [];
  unidades: Unidad[] = [];
  sedes: Sede[] = [];
  plantillas: Plantilla[] = [];

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

  deta_movi: number[] = [];

  constructor(
    public solicitudService: SolicitudesService,
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
    this.tipo_movimiento = 1;
    this.isLoading$ = this.solicitudService.isLoading$;
    this.user = this.authService.user;

    this.user.name = this.capitalize(this.user.name);
    this.user.nombre_sede = this.capitalize((this.user.nombre_sede || '').toString());

    this.cargarConfiguraciones();

    const today = new Date();
    this.fecha_emision = today.toISOString().split('T')[0];
    // this.setNombreSede();
    this.closeSidebar();

    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.movimiento_id = id;
      this.showMovimiento(this.movimiento_id);
    });

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
    this.solicitudService.showMovimiento(id).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.movimiento = resp.solicitud;

        this.detalle_movimiento = this.movimiento.detalles_movimientos ?? [];
        this.resetearArticulo();
        this.calcularTotales();

        this.estado = this.movimiento.estado ?? 9999999;
        this.bodega_id = this.movimiento.bodega_id ?? 9999999;
        this.proveedor_id = this.movimiento.proveedor_id ?? 9999999;
        this.plantilla_id = this.movimiento.plantilla_id ?? 9999999;
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
        this.unidades = response.unidades;
        this.bodegas = response.bodegas;
        this.proveedores = response.proveedores;
        this.sedes = response.sedes;
        this.plantillas = response.plantillas;

        this.unidades = this.unidades.map(unidad => {
          return { ...unidad, nombre: this.capitalize(unidad.nombre) };
        });

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

        this.proveedores = this.proveedores.map(proveedor => {
          return {
            ...proveedor, nombre: this.capitalize(proveedor.nombres),
            apellidos: proveedor.apellidos === null ? this.capitalize(proveedor.apellidos) : ''
          };
        });
        this.isLoadingProcess();
      });
  }

  capitalize(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  listarArticulos() {
    if (!this.buscar_articulo) {
      this.toast.error('Validación', 'Necesitas ingresar el nombre ó el código del articulo');
      return false;
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
      const unidad = this.unidades.find((item: Unidad) => item.id === this.unidad_id);
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

      this.toast.success('Artículo agregado', 'El artículo ha sido agregado al detalle');
    }
    setTimeout(() => {
      this.focusField('.buscar-articulo-input');
    }, 50);
    // Calcula los totales

    this.resetearArticulo();
    this.calcularTotales();

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
  }

  editarArticulo(detalle: DetalleMovimiento, index: number) {
    const modalRef = this.modalService.open(EditItemSolicitudComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = JSON.parse(JSON.stringify(detalle));
    modalRef.componentInstance.bodega_id = this.bodega_id;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.tipo_movimiento = this.tipo_movimiento;
    modalRef.componentInstance.unidades = this.unidades;

    modalRef.componentInstance.DetalleS.subscribe((detalleR: DetalleMovimiento) => {

      // Clonar detalleR para asegurarnos de que no altere referencias
      const detalleClonado = JSON.parse(JSON.stringify(detalleR));

      // Buscar si ya existe un artículo con el mismo ID y unidad, pero que no sea el mismo artículo editado
      const articuloExistenteIndex = this.detalle_movimiento.findIndex(
        (detalle, i) =>
          detalle.articulo_id === detalleClonado.articulo?.id &&
          detalle.unidad_id === detalleClonado.unidad_id &&
          i !== index // Evitar consolidar consigo mismo
      );

      if (articuloExistenteIndex !== -1) {
        const articuloDuplicado = this.detalle_movimiento[articuloExistenteIndex];

        // Validar si el costo es diferente
        if (articuloDuplicado.costo !== detalleClonado.costo) {
          this.toast.error(
            'Validación',
            'El artículo ya existe con un costo diferente. No se puede agregar.'
          );
          return;
        }

        articuloDuplicado.cantidad += detalleClonado.cantidad;
        articuloDuplicado.total += detalleClonado.total;

        this.detalle_movimiento.splice(index, 1);

        this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
      } else {
        this.detalle_movimiento[index] = detalleClonado;
        this.toast.success('Exito', 'Se ha editado el articulo');
      }

      // Calcula los totales
      this.calcularTotales();
      this.isLoadingProcess();

    });
  }

  eliminarArticulo(detalle: DetalleMovimiento, index: number) {
    const modalRef = this.modalService.open(DeleteItemSolicitudComponent, { centered: true, size: 'md' });
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

    if (this.estado === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un estado");
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

    if (this.tipo_movimiento === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un tipo de movimiento");
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
      destino: 'Solicitud',
      total: this.total_factura,
      user_id: this.user.id,
      bodega_id: this.bodega_id,
      plantilla_id: this.plantilla_id,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id,
      sede_id: this.movimiento.sede_id ?? 0, // Usa 0 si sede_id es undefined
      estado: this.estado,
      fecha_entrega: null,
      observacion_entrega: this.observacion_entrega,
      detalles_movimientos: this.detalle_movimiento
    }

    this.solicitudService.edit(this.movimiento, this.movimiento_id).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);

      } else {
        this.toast.success('Exito', resp.message_text);
        this.router.navigate(['/solicitudes/listado']);
        this.resetearArticulo();

        this.bodega_id = 9999999;
        this.proveedor_id = 9999999;
        this.observacion = '';
        this.observacion_entrega = '';
        const today = new Date();
        this.fecha_emision = today.toISOString().split('T')[0];
        this.tipo_movimiento = 1;
        this.detalle_movimiento = [];
        this.calcularTotales();
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

  seleccionarDetalle(detalle: DetalleMovimiento) {
    let index = this.deta_movi.findIndex((item: number) => item === (detalle.id));

    if (index != -1) {
      this.deta_movi.splice(index, 1);
    } else {
      this.deta_movi.push(detalle.id);
    }
  }

  entregar() {
    if (this.deta_movi.length === 0) {
      this.toast.error('Validación', "Necesitas seleccionar un item del detalle para procesar la entrega");
      return;
    }

    if (!this.observacion_entrega) {
      this.toast.error('Validación', "Necesitas agregar una observación de entrega");
      return;
    }

    let data = {
      movimiento_id: Number(this.movimiento_id),
      deta_movi_ids: this.deta_movi,
      observacion_entrega: this.observacion_entrega,
    }

    this.solicitudService.entregar(data).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.showMovimiento(this.movimiento_id);
      }
    });
  }

  isLoadingProcess() {
    this.solicitudService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.solicitudService.isLoadingSubject.next(false);
    }, 50);
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }

  changePlantilla() {
    if (this.plantilla_id !== 9999999) {
      const plantilla = this.plantillas.find((item) => item.id === this.plantilla_id);
      if (plantilla) {
        this.detalle_movimiento = [];
        plantilla.detalles_plantillas?.forEach((deta: DetallePlantilla) => {

          const nuevoDetalle: DetalleMovimiento = {
            id: 0,
            articulo: deta.articulo,
            unidad: deta.unidad,
            cantidad: deta.cantidad,
            cantidad_recibida: deta.cantidad,
            total: deta.total_costo,
            movimiento_id: 0,
            articulo_id: deta.articulo_id,
            empresa_id: this.user.empresa_id,
            sede_id: this.user.sede_id ?? 0,
            estado: 1,
            unidad_id: deta.unidad_id,
            costo: deta.costo,
            user_id: this.user.id,
            fecha_entrega: null,
          };

          // Hacer push del nuevo detalle al arreglo
          this.detalle_movimiento.push(nuevoDetalle);
        });
        // this.detalle_movimiento = plantilla.detalles_plantillas;
        this.calcularTotales();
      }

      this.isLoadingProcess();
    }
  }
}
