import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Cliente } from '../../clientes/interfaces';
import { Articulo, BodegaArticulo } from '../../articulos/interfaces';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { Iva } from '../../configuracion/ivas/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { ArticulosService } from '../../articulos/service/articulos.service';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { SedeDeliverie } from '../../configuracion/sede-deliveries/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClienteComponent } from '../../clientes/create-cliente/create-cliente.component';
import { FacturasService } from '../service/facturas.service';
import { BuscarClienteComponent } from '../componentes/buscar-cliente/buscar-cliente.component';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';
import { BuscarArticuloComponent } from '../componentes/buscar-articulo/buscar-articulo.component';
import { User } from '../../users/interfaces';
import { ArticuloWallet } from '../../articulos/interfaces/index';
import { DetalleFactura } from '../interfaces';
import { EditArticuloFacturaComponent } from '../componentes/edit-articulo-factura/edit-articulo-factura.component';
import { DeleteArticuloFacturaComponent } from '../componentes/delete-articulo-factura/delete-articulo-factura.component';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrl: './create-factura.component.scss'
})

export class CreateFacturaComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  unidades: Unidad[] = [];
  bodegas: Bodega[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  ivas: Iva[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  sede_deliveries: SedeDeliverie[] = [];
  tipodocumentos: TipoDoc[] = [];
  generos: Genero[] = [];

  // CLIENTES
  identificacion_cliente: number;
  nombres_ciente: string = '';
  celular_ciente: number;

  // ARTICULOS
  unidad_id_articulo: number = 9999999;
  bodega_id_articulo: number = 9999999;
  cantidad_articulo: number = 0;
  precio_general_articulo: number = 0;
  buscar_articulo: string = '';
  bodegas_articulos: BodegaArticulo[] = [];
  exist_bodegas: BodegaArticulo[] = [];
  monto_descuento: number = 0;
  iva: number = 0;

  total_iva_factura: number = 0;
  total_costo_factura: number = 0;

  // LUGAR DE ENTREGA
  sede_deliverie_id: number = 9999999;
  departamento_id_deliverie: number = 9999999;
  municipio_id_deliverie: number = 9999999;
  descripcion_deliverie: string = '';
  fecha_deliverie: string = '';
  agencia_deliverie: string = '';
  encargado_deliverie: string = '';
  documento_deliverie: string = '';
  celular_deliverie: string = '';

  detalle_factura: DetalleFactura[] = [];
  deuda: number = 0;
  pago_out: number = 0;

  // METODO PAGO
  monto_pago: number;

  user: User;

  cliente: Cliente = {
    id: 0,
    tipo_identificacion: 9999999,
    identificacion: '',
    dv: '',
    nombres: '',
    apellidos: '',
    email: '',
    direccion: '',
    celular: '',
    departamento_id: 9999999,
    municipio_id: 9999999,
    empresa_id: 9999999,
    estado: 1,
    is_parcial: 1,
    segmento_cliente_id: 9999999,
    genero_id: 9999999,
    sede_id: 9999999,
    fecha_nacimiento: '',
  };

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

  source: any;
  // @ViewChild("descuento") something: ElementRef;
  @ViewChild('descuento', { static: false }) something: ElementRef | undefined;
  private keyupSubscription: Subscription | null = null;

  constructor(
    public articuloService: ArticulosService,
    public modalService: NgbModal,
    public generalService: GeneralesService,
    public facturaService: FacturasService,
    public authService: AuthService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.closeSidebar();

    this.cliente.nombres = 'SEDE';
    this.buscarCliente();

    this.buscar_articulo = 'carne';
    this.buscarArticulos();
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

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');

    if (this.keyupSubscription) {
      this.keyupSubscription.unsubscribe();
    }
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.sedes = response.sedes;
        this.sede_deliveries = response.sede_deliveries;
        this.tipodocumentos = response.tipodocumentos.filter((doc: TipoDoc) => doc.id === 1 || doc.id === 6);
        this.segmentos_clientes = response.segmentos_clientes;
        this.generos = response.generos;
      });
  }

  // CLIENTES
  buscarCliente() {

    if (!this.cliente.identificacion && !this.cliente.nombres && !this.cliente.celular) {
      this.toast.error('Validación', 'Necesitas ingresar al menos uno de los campos de cliente');
      return false;
    }

    this.facturaService.buscarCliente(this.cliente).subscribe((resp) => {
      if (!resp || !resp.clientes || !resp.clientes.data || resp.clientes.data.length === 0) {
        // Si no hay resultados, resetear el cliente y mostrar mensaje
        this.resetearCliente();
        this.toast.info('Validación', 'No hay coincidencia en la búsqueda');
        return false;  // Detener la ejecución si no se encontraron resultados
      }

      // Si se encuentran más de un cliente, abrir el listado de clientes seleccionados
      if (resp.clientes.data.length > 1) {
        this.resetearCliente();
        this.abrirClientesSeleccionados(resp.clientes.data);
      }
      // Si solo se encuentra un cliente, asignarlo y concatenar los nombres si es necesario
      else if (resp.clientes.data.length === 1) {
        this.cliente = resp.clientes.data[0];
        if (this.cliente.tipo_identificacion === 1) {
          this.cliente.nombres = this.cliente.nombres + ' ' + this.cliente.apellidos;
        }
        setTimeout(() => {
          this.unidad_id_articulo = 9999999;
          this.precio_general_articulo = 0;
        });
        // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
        this.toast.success('Exito', 'Se ha seleccionado un cliente');
        this.isLoadingProcess();
      }
    });
  }

  abrirClientesSeleccionados(clientes: Cliente[]) {
    const modalRef = this.modalService.open(BuscarClienteComponent, { centered: true, size: 'xl' });

    modalRef.componentInstance.clientes = clientes;
    modalRef.componentInstance.ClienteS.subscribe((cliente: Cliente) => {

      this.cliente = cliente;
      if (this.cliente.tipo_identificacion === 1) {
        this.cliente.nombres = this.cliente.nombres + ' ' + this.cliente.apellidos;
      }
      setTimeout(() => {
        this.unidad_id_articulo = 9999999;
        this.precio_general_articulo = 0;
      });
      // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha seleccionado un cliente');
    });
  }

  crearCliente() {
    const modalRef = this.modalService.open(CreateClienteComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.segmentos = this.segmentos_clientes;
    modalRef.componentInstance.generos = this.generos;

    modalRef.componentInstance.ClienteC.subscribe((cliente: Cliente) => {
      this.cliente = cliente;
      if (this.cliente.tipo_identificacion === 1) {
        this.cliente.nombres = this.cliente.nombres + ' ' + this.cliente.apellidos;
      }

      // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
      this.isLoadingProcess();
      // this.toast.success('Exito', 'Se ha seleccionado un cliente');
    });
  }

  resetearCliente() {
    // Restablecer el objeto cliente con valores por defecto o vacíos
    this.cliente = {
      id: 0,
      tipo_identificacion: 9999999, // Asignar un valor por defecto si es necesario
      identificacion: '',
      dv: '',
      nombres: '',
      apellidos: '',
      email: '',
      direccion: '',
      celular: '',
      departamento_id: 9999999,
      municipio_id: 9999999,
      empresa_id: 9999999,
      estado: 1, // Suponiendo que 'estado' tiene un valor por defecto
      is_parcial: 1, // Si es necesario, puede ser también 0 o cualquier valor por defecto
      segmento_cliente_id: 9999999,
      genero_id: 9999999,
      sede_id: 9999999,
      fecha_nacimiento: '',
    };
    this.isLoadingProcess();
  }

  // Propiedad para mostrar el nombre completo en la vista
  get nombreCompletoCliente(): string {
    if (this.cliente.tipo_identificacion === 1) {
      return `${this.cliente.nombres} ${this.cliente.apellidos}`;
    } else {
      return this.cliente.nombres;
    }
  }

  get identificacionCompletaCliente(): string {
    return `${this.cliente.tipodocumento?.sigla} ${this.cliente.identificacion}`;
  }

  // CLIENTES

  // ARTICULOS
  buscarArticulos() {

    if (!this.buscar_articulo) {
      this.toast.error('Validación', 'Necesitas ingresar el nombre ó el código del articulo');
      return false;
    }

    this.facturaService.buscarArticulos(this.buscar_articulo).subscribe((resp) => {
      if (!resp || !resp.articulos || !resp.articulos.data || resp.articulos.data.length === 0) {
        // Si no hay resultados, resetear el cliente y mostrar mensaje
        // this.resetearCliente();
        this.toast.info('Validación', 'No hay coincidencia en la búsqueda');
        return false;  // Detener la ejecución si no se encontraron resultados
      }

      // Si se encuentran más de un cliente, abrir el listado de clientes seleccionados
      if (resp.articulos.data.length > 1) {
        // this.resetearCliente();
        this.abrirArticulosSeleccionados(resp.articulos.data);
      }
      // Si solo se encuentra un cliente, asignarlo y concatenar los nombres si es necesario
      else if (resp.articulos.data.length === 1) {
        this.articulo = resp.articulos.data[0];
        this.buscar_articulo = this.articulo.nombre;
        // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
        this.toast.success('Exito', 'Se ha seleccionado un articulo');
        setTimeout(() => {
          this.initKeyupDescuento();
        }, 50);

        this.monto_descuento = 0;
        this.cantidad_articulo = 0;
        this.unidad_id_articulo = 9999999;
        this.precio_general_articulo = 0;
        this.bodega_id_articulo = 9999999;

        this.iva = 0;
        this.bodegas_articulos = [];
        this.exist_bodegas = [];

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
      this.toast.success('Exito', 'Se ha seleccionado un articulo');

      setTimeout(() => {
        this.initKeyupDescuento();
      }, 50);

      this.monto_descuento = 0;
      this.cantidad_articulo = 0;
      this.unidad_id_articulo = 9999999;
      this.precio_general_articulo = 0;
      this.bodega_id_articulo = 9999999;

      this.iva = 0;
      this.bodegas_articulos = [];
      this.exist_bodegas = [];

      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha seleccionado el articulo');
    });
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
      this.isLoadingProcess();
    }
    // Actualizar bodegas_articulos solo si la unidad es válida

    if (this.unidad_id_articulo !== 9999999) {
      this.bodegas_articulos = this.articulo.bodegas_articulos?.filter(
        (bodega: BodegaArticulo) => bodega.unidad.id === this.unidad_id_articulo
      ) ?? [];
    } else {
      this.bodegas_articulos = [];
    }

    if (this.cliente.id === 0) {

      this.toast.error('Validación', 'Es necesario seleccionar un cliente');
      setTimeout(() => {
        this.unidad_id_articulo = 9999999;
        this.precio_general_articulo = 0;
        this.bodega_id_articulo = 9999999;
      });

      // this.cdr.detectChanges();
      this.isLoadingProcess();
      return false;
    }


    this.exist_bodegas = this.bodegas_articulos.filter((bod_art: BodegaArticulo) => bod_art.bodega.sede_id === this.user.sede_id);
    const wallets = this.articulo.articulos_wallets;

    if (!Array.isArray(wallets)) {
      // console.error('Error: `articulos_wallets` no está definido o no es un array.');
      return false;
    }

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
      // Aplica el descuento al precio
      const precioConDescuento = this.precio_general_articulo - (this.monto_descuento || 0);

      // Subtotal sin IVA (precio con descuento multiplicado por cantidad)
      const subtotal = precioConDescuento * this.cantidad_articulo;

      // Calcula el IVA sobre el subtotal
      if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
        const porcentajeIVA = this.articulo.iva.porcentaje * 0.01; // Convierte el porcentaje a decimal
        this.iva = subtotal * porcentajeIVA; // Almacena el IVA total
      } else {
        this.iva = 0; // Resetea el IVA si no aplica
      }

      this.isLoadingProcess();

      // Total con IVA
      return subtotal + this.iva;
    }

    this.iva = 0; // Si no hay datos, resetea el IVA
    return 0;
  }

  getSubtotal(): number {
    if (this.precio_general_articulo && this.cantidad_articulo) {
      // Calcula el subtotal como precio por cantidad sin descuento ni IVA
      return this.precio_general_articulo * this.cantidad_articulo;
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

  agregarArticulo(): void {

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


    // Verificar si el artículo ya existe en detalle_factura
    const articuloExistente = this.detalle_factura.find((detalle) =>
      detalle.articulo_id === this.articulo.id && detalle.unidad_id === this.unidad_id_articulo
    );

    if (articuloExistente) {
      // Si existe, actualizar la cantidad y recalcular totales
      articuloExistente.cantidad_item += this.cantidad_articulo;

      const precioConDescuento = this.precio_general_articulo - (this.monto_descuento || 0);
      articuloExistente.sub_total = precioConDescuento * articuloExistente.cantidad_item;

      if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
        const porcentajeIVA = this.articulo.iva.porcentaje * 0.01;
        articuloExistente.total_iva = articuloExistente.sub_total * porcentajeIVA;
      } else {
        articuloExistente.total_iva = 0;
      }

      articuloExistente.total_precio = articuloExistente.sub_total + articuloExistente.total_iva;

      this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
    } else {
      // Lógica adicional para agregar el artículo si pasa las validaciones

      const unidad = this.articulo.unidades?.find((item: Unidad) => item.id === this.unidad_id_articulo);

      this.detalle_factura.push({
        id: 0,
        precio_item: this.precio_general_articulo,
        total_precio: this.getTotalCosto(),
        total_iva: this.iva,
        cantidad_item: this.cantidad_articulo,
        factura_id: 0,
        articulo_id: this.articulo.id,
        iva_id: this.articulo.iva?.id ?? 0,
        empresa_id: this.user.empresa_id,
        sede_id: this.user.sede_id ?? 0,
        estado: 1,
        categoria_id: this.articulo.categoria?.id ?? 0,
        descuento: this.monto_descuento,
        sub_total: this.getSubtotal(),
        unidad_id: this.unidad_id_articulo,
        unidad: unidad,
        articulo: this.articulo
      });

      this.toast.success('Artículo agregado', 'El artículo ha sido agregado a la factura');
    }

    // Calcula los totales
    this.resetearArticulo();
    this.calcularTotalesFactura();
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
    this.monto_descuento = 0;
    this.cantidad_articulo = 0;
    this.unidad_id_articulo = 9999999;
    this.precio_general_articulo = 0;
    this.bodega_id_articulo = 9999999;
    this.iva = 0;
    this.bodegas_articulos = [];
    this.exist_bodegas = [];
    this.isLoadingProcess();
  }

  editarArticulo(detalle: DetalleFactura, index: number) {
    const modalRef = this.modalService.open(EditArticuloFacturaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = detalle;
    modalRef.componentInstance.cliente = this.cliente;

    modalRef.componentInstance.DetalleS.subscribe((detalleR: DetalleFactura) => {

      this.detalle_factura[index] = detalleR;
      // Calcula los totales
      this.calcularTotalesFactura();
      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha editado el articulo');
    });
  }

  eliminarArticulo(detalle: DetalleFactura, index: number) {
    const modalRef = this.modalService.open(DeleteArticuloFacturaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = detalle;

    modalRef.componentInstance.DetalleD.subscribe((resp: string) => {

      this.detalle_factura.splice(index, 1);
      // Calcula los totales
      this.calcularTotalesFactura();
      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha eliminado el articulo');
    });
  }

  get descuentoMinimoValor(): number {
    return (this.articulo.descuento_minimo * 0.01) * this.precio_general_articulo;
  }

  get descuentoMaximoValor(): number {
    return (this.articulo.descuento_maximo * 0.01) * this.precio_general_articulo;
  }

  calcularTotalesFactura(): void {
    // Calcula el total del IVA sumando el total_iva de cada detalle
    this.total_iva_factura = this.detalle_factura.reduce((total, detalle) => total + (detalle.total_iva || 0), 0);

    // Calcula el costo total de la factura sumando el total_precio de cada detalle
    this.total_costo_factura = this.detalle_factura.reduce((total, detalle) => total + (detalle.total_precio || 0), 0);

    this.deuda = this.total_costo_factura;
    this.isLoadingProcess();
  }

  // ARTICULOS
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
}
