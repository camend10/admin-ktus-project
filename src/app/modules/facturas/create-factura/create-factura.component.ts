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
import { DetalleFactura, Factura } from '../interfaces';
import { EditArticuloFacturaComponent } from '../componentes/edit-articulo-factura/edit-articulo-factura.component';
import { DeleteArticuloFacturaComponent } from '../componentes/delete-articulo-factura/delete-articulo-factura.component';
import { Banco, MetodoPago } from '../../configuracion/metodo-pagos/interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrl: './create-factura.component.scss'
})

export class CreateFacturaComponent implements OnInit, OnDestroy {

  // isLoading$: Observable<boolean>;
  isLoading$: any;

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
  metodos_pagos: MetodoPago[] = [];

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
  is_gift: number = 1;

  total_iva_factura: number = 0;
  total_costo_factura: number = 0;
  subtotal_factura: number = 0;
  total_descuento_factura: number = 0;

  detalle_factura: DetalleFactura[] = [];
  descripcion: string = '';
  deuda: number = 0;
  pago_out: number = 0;

  // LUGAR DE ENTREGA
  sede_deliverie_id: number = 9999999;
  departamento_id_deliverie: number = 9999999;
  municipio_id_deliverie: number = 9999999;
  direccion_deliverie: string = '';
  fecha_deliverie: string = '';
  agencia_deliverie: string = '';
  encargado_deliverie: string = '';
  documento_deliverie: string = '';
  celular_deliverie: string = '';

  isDomicilio: boolean = false;

  // METODO PAGO
  monto_pago: number = 0;
  metodo_pago_id: number = 9999999;
  banco_id: number = 9999999;
  metodos_pagos_seleccionado: MetodoPago | null = null;
  file_name: File | null = null;
  imagen_previzualizada: string | null = null;
  descuento_final: number = 0;

  efectivo_recibido: number = 0;
  vueltos: number = 0;

  user: User;
  currentDate: string = '';

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
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.closeSidebar();

    this.cliente.nombres = 'Cliente General';
    this.buscarCliente();

    // this.buscar_articulo = 'carne';
    // this.buscarArticulos();

    this.departamento_id_deliverie = this.user.departamento_id;
    this.municipio_id_deliverie = this.user.municipio_id;

    const today = new Date();
    this.fecha_deliverie = today.toISOString().split('T')[0];
    this.focusField('.buscar-cliente-input');
    this.setCurrentDate();
  }

  setCurrentDate(): void {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/Bogota', // Cambia por tu zona horaria
    };
    this.currentDate = new Intl.DateTimeFormat('es-CO', options).format(date);
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
        this.metodos_pagos = response.metodos_pagos;
        // this.isLoadingProcess();
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
          this.focusField('.buscar-articulo-input');
        });
        // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
        this.isLoadingProcess();
        // this.toast.success('Exito', 'Se ha seleccionado un cliente');
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
        this.focusField('.buscar-articulo-input');
      });
      // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
      this.isLoadingProcess();
      // this.toast.success('Exito', 'Se ha seleccionado un cliente');
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
    setTimeout(() => {
      this.focusField('.buscar-cliente-input');
    });
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
        // this.cliente.identificacion = this.cliente.tipodocumento?.sigla + ' : ' + this.cliente.identificacion;
        // this.toast.success('Exito', 'Se ha seleccionado un articulo');
        setTimeout(() => {
          this.initKeyupDescuento();
          this.focusField('.unidad-id-articulo-select');
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

      setTimeout(() => {
        this.initKeyupDescuento();
        this.focusField('.unidad-id-articulo-select');
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
      // this.toast.success('Exito', 'Se ha seleccionado el articulo');
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

      if (this.bodegas_articulos.length > 0) {
        this.bodega_id_articulo = this.bodegas_articulos[0].bodega.id;
      }
    } else {
      this.bodegas_articulos = [];

      this.toast.error('Validación', 'El artículo no tiene existencia en esta bodega.');
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
    this.focusField('.cantidad-input');
    // Prioridad 1: Búsqueda por unidad, sede y segmento de cliente
    let precio_s = this.buscarPrecio(wallets, this.unidad_id_articulo, this.user.sede_id ?? null,
      this.cliente.segmento?.id ?? null);

    if (precio_s) {
      this.precio_general_articulo = precio_s.precio;
      if (this.is_gift === 2) {
        this.precio_general_articulo = 0;
      }
      return false;
    }

    // Prioridad 2: Búsqueda por unidad y sede o segmento
    const precio_sba = this.buscarPrecio(wallets, this.unidad_id_articulo, this.user.sede_id ?? null, null);
    const precio_sbb = this.buscarPrecio(wallets, this.unidad_id_articulo, null, this.cliente.segmento?.id ?? null);

    if (precio_sba && precio_sbb) {
      this.precio_general_articulo = Math.min(precio_sba.precio, precio_sbb.precio);
      if (this.is_gift === 2) {
        this.precio_general_articulo = 0;
      }
      return false;
    }

    if (precio_sba) {
      this.precio_general_articulo = precio_sba.precio;
      if (this.is_gift === 2) {
        this.precio_general_articulo = 0;
      }
      return false;
    }

    if (precio_sbb) {
      this.precio_general_articulo = precio_sbb.precio;
      if (this.is_gift === 2) {
        this.precio_general_articulo = 0;
      }
      return false;
    }

    // Prioridad 3: Búsqueda por unidad solamente
    const precio_st = this.buscarPrecio(wallets, this.unidad_id_articulo, null, null);

    if (precio_st) {
      this.precio_general_articulo = precio_st.precio;
      if (this.is_gift === 2) {
        this.precio_general_articulo = 0;
      }
      return false;
    }

    // Sin coincidencias: asignar precio base
    this.precio_general_articulo = this.articulo.precio_general;
    if (this.is_gift === 2) {
      this.precio_general_articulo = 0;
    }
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

  getTotalDescuento(): number {
    if (this.monto_descuento && this.cantidad_articulo) {
      // Multiplica el descuento unitario por la cantidad de productos
      return this.monto_descuento * this.cantidad_articulo;
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

    if (this.articulo.disponibilidad !== 2) {
      this.toast.error('Validación', 'No se puede vender el articulo sin disponibilidad');
      return;
    }

    if (this.is_gift === 1 && this.precio_general_articulo === 0) {
      this.toast.error('Validación', 'No existe el precio del artículo');
      return;
    }

    if (this.unidad_id_articulo === 9999999) {
      this.toast.error('Validación', 'No ha seleccionado la unidad del artículo');
      return;
    }

    if (this.bodega_id_articulo === 9999999) {
      this.toast.error('Validación', 'No ha seleccionado la bodega del artículo');
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

    // Validar si el artículo ya existe con descuento o sin descuento
    const articuloExistente = this.detalle_factura.find(
      (detalle) =>
        detalle.articulo_id === this.articulo.id &&
        detalle.unidad_id === this.unidad_id_articulo
    );

    if (articuloExistente) {

      // Validación adicional para evitar condiciones conflictivas
      if (
        articuloExistente.descuento === 0 &&
        articuloExistente.precio_item === 0 &&
        this.precio_general_articulo > 0
      ) {
        this.toast.error(
          'Validación',
          'El artículo ya ha sido agregado como gratuito. No puede agregarse nuevamente con precio.'
        );
        return;
      }

      if (
        articuloExistente.descuento === 0 &&
        articuloExistente.precio_item > 0 &&
        this.is_gift === 2
      ) {
        this.toast.error(
          'Validación',
          'El artículo ya ha sido agregado con precio. No puede agregarse nuevamente como gratuito.'
        );
        return;
      }

      if (
        (articuloExistente.descuento > 0 && this.monto_descuento === 0) ||
        (articuloExistente.descuento === 0 && this.monto_descuento > 0)
      ) {
        this.toast.error(
          'Validación',
          'El artículo ya ha sido agregado con una condición de descuento diferente. No puede agregarlo nuevamente con otra condición.'
        );
        return;
      }

      // Validar si el descuento es el mismo
      if (articuloExistente.descuento !== this.monto_descuento) {
        this.toast.error(
          'Validación',
          'El artículo ya ha sido agregado con un descuento diferente. El descuento debe ser el mismo.'
        );
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


    // Subtotal sin descuento
    const subtotalBase = this.precio_general_articulo * this.cantidad_articulo;

    // Total descuento
    const totalDescuento = this.monto_descuento * this.cantidad_articulo;

    // Subtotal con descuento aplicado
    const subtotalConDescuento = subtotalBase - totalDescuento;

    // Calcular IVA
    let ivaTotal = 0;
    if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
      const porcentajeIVA = this.articulo.iva.porcentaje * 0.01;
      ivaTotal = subtotalConDescuento * porcentajeIVA;
    }

    // Costo total
    const costoTotal = subtotalConDescuento + ivaTotal;

    if (articuloExistente) {

      // Actualizar valores
      articuloExistente.cantidad_item += this.cantidad_articulo;
      articuloExistente.sub_total += subtotalBase;
      articuloExistente.total_descuento += totalDescuento;

      // Recalcular IVA y Costo Total
      const nuevoSubtotalConDescuento =
        articuloExistente.sub_total - articuloExistente.total_descuento;

      if (this.articulo.impuesto === 2 && this.articulo.iva?.porcentaje) {
        const porcentajeIVA = this.articulo.iva.porcentaje * 0.01;
        articuloExistente.total_iva = nuevoSubtotalConDescuento * porcentajeIVA;
      } else {
        articuloExistente.total_iva = 0;
      }

      articuloExistente.total_precio =
        nuevoSubtotalConDescuento + articuloExistente.total_iva;

      this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
    } else {
      // Si no existe, agrega el artículo al detalle
      const unidad = this.articulo.unidades?.find((item: Unidad) => item.id === this.unidad_id_articulo);

      this.detalle_factura.push({
        id: 0,
        precio_item: this.precio_general_articulo,
        total_precio: costoTotal,
        total_iva: ivaTotal,
        cantidad_item: this.cantidad_articulo,
        factura_id: 0,
        articulo_id: this.articulo.id,
        iva_id: this.articulo.iva?.id ?? 0,
        empresa_id: this.user.empresa_id,
        sede_id: this.user.sede_id ?? 0,
        estado: 1,
        categoria_id: this.articulo.categoria?.id ?? 0,
        descuento: this.monto_descuento,
        sub_total: subtotalBase,
        unidad_id: this.unidad_id_articulo,
        unidad: unidad,
        total_descuento: totalDescuento,
        articulo: this.articulo,
        bodega_id: this.bodega_id_articulo
      });

      this.toast.success('Artículo agregado', 'El artículo ha sido agregado a la factura');
    }
    this.focusField('.buscar-articulo-input');
    // Calcula los totales

    this.resetearArticulo();
    this.resetearMetodoPago();
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
    this.is_gift = 1;

    setTimeout(() => {
      this.focusField('.buscar-articulo-input');
    }, 50);
    this.isLoadingProcess();
  }

  editarArticulo(detalle: DetalleFactura, index: number) {

    const modalRef = this.modalService.open(EditArticuloFacturaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = JSON.parse(JSON.stringify(detalle));
    modalRef.componentInstance.cliente = this.cliente;

    modalRef.componentInstance.DetalleS.subscribe((detalleR: DetalleFactura) => {
      // Clonar detalleR para asegurarnos de que no altere referencias
      const detalleClonado = JSON.parse(JSON.stringify(detalleR));

      // Buscar si ya existe un artículo con el mismo ID y unidad, pero que no sea el mismo artículo editado
      const articuloExistenteIndex = this.detalle_factura.findIndex(
        (detalle, i) =>
          detalle.articulo_id === detalleClonado.articulo?.id &&
          detalle.unidad_id === detalleClonado.unidad_id &&
          i !== index // Evitar consolidar consigo mismo
      );

      if (articuloExistenteIndex !== -1) {
        const articuloDuplicado = this.detalle_factura[articuloExistenteIndex];

        // Validación adicional para evitar condiciones conflictivas
        if (
          articuloDuplicado.descuento === 0 &&
          articuloDuplicado.precio_item > 0 &&
          detalleClonado.descuento === 2
        ) {
          this.toast.error(
            'Validación',
            'El artículo ya ha sido agregado con precio. No puede agregarse nuevamente como gratuito.'
          );
          return; // Detener completamente la ejecución
        }

        if (
          articuloDuplicado.descuento === 0 &&
          articuloDuplicado.precio_item === 0 &&
          detalleClonado.precio_item > 0
        ) {
          this.toast.error(
            'Validación',
            'El artículo ya ha sido agregado como gratuito. No puede agregarse nuevamente con precio.'
          );
          return; // Detener completamente la ejecución
        }

        if (
          (articuloDuplicado.descuento > 0 && detalleClonado.descuento === 0) ||
          (articuloDuplicado.descuento === 0 && detalleClonado.descuento > 0)
        ) {
          this.toast.error(
            'Validación',
            'El artículo ya ha sido agregado con una condición de descuento diferente. No puede agregarlo nuevamente con otra condición.'
          );
          return; // Detener completamente la ejecución
        }

        if (articuloDuplicado.descuento !== detalleClonado.descuento) {
          this.toast.error(
            'Validación',
            'El artículo ya ha sido agregado con un descuento diferente. El descuento debe ser el mismo.'
          );
          return; // Detener completamente la ejecución
        }
      }

      if (articuloExistenteIndex !== -1) {
        // Si ya existe, actualizar los valores del artículo existente
        const articuloExistente = this.detalle_factura[articuloExistenteIndex];

        articuloExistente.cantidad_item += detalleClonado.cantidad_item;
        articuloExistente.sub_total += detalleClonado.sub_total;
        articuloExistente.total_descuento += detalleClonado.total_descuento;

        const nuevoSubtotalConDescuento =
          articuloExistente.sub_total - articuloExistente.total_descuento;

        if (detalleClonado.articulo?.impuesto === 2 && detalleClonado.articulo?.iva?.porcentaje) {
          const porcentajeIVA = detalleClonado.articulo.iva.porcentaje * 0.01;
          articuloExistente.total_iva = nuevoSubtotalConDescuento * porcentajeIVA;
        } else {
          articuloExistente.total_iva = 0;
        }

        articuloExistente.total_precio =
          nuevoSubtotalConDescuento + articuloExistente.total_iva;

        // Eliminar el artículo duplicado del arreglo
        this.detalle_factura.splice(index, 1);

        this.toast.success('Exito', 'Se han consolidado los valores del artículo.');
      } else {
        // Si no existe, simplemente actualizar el artículo en su índice correspondiente
        this.detalle_factura[index] = detalleClonado;
        this.toast.success('Exito', 'Se ha editado el artículo.');
      }

      // Calcula los totales
      this.calcularTotalesFactura();
      this.isLoadingProcess();
      // this.toast.success('Exito', 'Se ha editado el articulo');
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
    // Calcula el subtotal sumando el sub_total de cada detalle
    this.subtotal_factura = this.detalle_factura.reduce((subtotal, detalle) => subtotal + (detalle.sub_total || 0), 0);

    // Calcula el total del IVA sumando el total_iva de cada detalle
    this.total_iva_factura = this.detalle_factura.reduce((total, detalle) => total + (detalle.total_iva || 0), 0);

    // Calcula el total de descuento sumando el descuento de cada detalle
    this.total_descuento_factura = this.detalle_factura.reduce((descuento, detalle) => descuento + (detalle.total_descuento || 0), 0);

    // Calcula el costo total de la factura sumando el total_precio de cada detalle
    this.total_costo_factura = this.detalle_factura.reduce((total, detalle) => total + (detalle.total_precio || 0), 0);

    // Ajusta la deuda
    this.deuda = this.total_costo_factura;

    this.isLoadingProcess();
  }

  isGift() {
    this.is_gift = this.is_gift === 1 ? 2 : 1;
    if (this.is_gift === 2) {
      this.precio_general_articulo = 0;
    }

    this.unidad_id_articulo = 9999999;
    setTimeout(() => {
      this.focusField('.unidad-id-articulo-select');
    }, 50);
  }

  // ARTICULOS

  // LUGAR DE ENTREGA

  onChangeSedeDeliverie(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Asegura que el evento proviene de un <select>
    const selectedId = Number(selectElement.value); // Obtiene el valor como número

    // Busca la sede seleccionada
    const selectedSede = this.sede_deliveries.find(
      (item) => item.id === selectedId
    );

    // Verifica si el nombre incluye "domicilio"
    this.isDomicilio = selectedSede?.nombre.toLowerCase().includes('domicilio') || false;
  }

  resetearLugarDeEntrega() {
    this.sede_deliverie_id = 9999999;
    this.direccion_deliverie = '';
    this.agencia_deliverie = '';
    this.encargado_deliverie = '';
    this.documento_deliverie = '';
    this.celular_deliverie = '';

    this.departamento_id_deliverie = this.user.departamento_id;
    this.municipio_id_deliverie = this.user.municipio_id;

    const today = new Date();
    this.fecha_deliverie = today.toISOString().split('T')[0];
  
    this.isDomicilio = false;
  }

  // LUGAR DE ENTREGA

  // METODO DE PAGO

  onChangeMetodoPago(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Asegura que el evento proviene de un <select>
    const selectedId = Number(selectElement.value); // Obtiene el valor como númeroue sea un array, incluso si no se encuentra nada
    const metodoSeleccionado = this.metodos_pagos.find((item) => item.id === this.metodo_pago_id);
    this.metodos_pagos_seleccionado = metodoSeleccionado || null;

    this.banco_id = 9999999;

    if (this.metodo_pago_id === 9999999) {
      this.monto_pago = 0; // Si el método de pago seleccionado es 9999999, el monto es 0
    } else {
      this.monto_pago = this.total_costo_factura; // Caso contrario, se usa el total de la factura
    }

  }

  processFile($event: Event) {

    const input = $event.target as HTMLInputElement;

    // Asegúrate de que hay un archivo seleccionado
    if (!input.files || input.files.length === 0) {
      this.toast.warning("Validando", "No se ha seleccionado ningún archivo");
      return;
    }

    // const file = $event.target.files[0];
    const file = input.files[0];
    if (!file || file.type.indexOf("image") < 0) {
      this.toast.warning("Validando", "El archivo no es una imagen");
      return;
    }

    this.file_name = file; // Asigna el archivo a this.file_name

    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizada = reader.result as string;
      this.isLoadingProcess();
    };
    reader.readAsDataURL(file);

  }

  cancelImage() {
    this.file_name = null;
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = null;
  }

  removeImage() {
    this.file_name = null;
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = null;
  }

  // Getter para obtener siempre un arreglo de bancos
  get bancos(): Banco[] {
    return this.metodos_pagos_seleccionado?.bancos || [];
  }

  resetearMetodoPago() {
    this.efectivo_recibido = 0;
    this.monto_pago = 0;
    this.descuento_final = 0;
    this.metodo_pago_id = 9999999;
    this.banco_id = 9999999;
    this.metodos_pagos_seleccionado = null;
    this.file_name = null;
    this.imagen_previzualizada = null;
    
    this.vueltos = 0;
  }

  onChangeEfectivo() {
    // Verificar si el efectivo recibido es suficiente para cubrir el monto a pagar
    if (this.efectivo_recibido >= this.monto_pago) {
      this.vueltos = this.efectivo_recibido - this.monto_pago; // Calcular vueltos      
    } else {
      this.vueltos = 0; // Si el efectivo recibido es insuficiente, los vueltos son 0
    }
  }

  onChangeDescuentoFinal(): void {
    if (this.descuento_final >= 0 && this.descuento_final <= this.subtotal_factura) {
      // Recalcular el monto pago restando el descuento final al total
      this.monto_pago = this.total_costo_factura - this.descuento_final;

      // Validar que el monto pago no sea negativo
      if (this.monto_pago < 0) {
        this.monto_pago = 0;
      }
    } else {
      // Si el descuento es inválido, se restablece el monto pago
      this.toast.error('Descuento inválido', 'El descuento no puede ser mayor al subtotal o negativo.');
      this.descuento_final = 0;
      this.monto_pago = this.total_costo_factura;
    }
  }

  // METODO DE PAGO

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

  isLoadingProcess() {
    this.facturaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.facturaService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    if (this.cliente.id === 0) {
      this.toast.error("Validando", "Necesitas seleccionar un cliente");
      return;
    }

    if (this.total_costo_factura === 0) {
      this.toast.error("Validando", "Necesitas agregar por lo menos un articulo al detalle con un costo mayor a 0");
      return;
    }

    if (this.detalle_factura.length === 0) {
      this.toast.error("Validando", "Necesitas agregar por lo menos un articulo al detalle");
      return;
    }

    if (this.isDomicilio) {
      if (!this.direccion_deliverie || this.direccion_deliverie.trim() === '') {
        this.toast.error("Validando", "La dirección de entrega es obligatoria");
        return;
      }
      if (!this.fecha_deliverie) {
        this.toast.error("Validando", "La fecha de entrega es obligatoria");
        return;
      }
      if (this.departamento_id_deliverie === 9999999) {
        this.toast.error("Validando", "Debes seleccionar un departamento");
        return;
      }
      if (this.municipio_id_deliverie === 9999999) {
        this.toast.error("Validando", "Debes seleccionar un municipio");
        return;
      }
      if (!this.agencia_deliverie || this.agencia_deliverie.trim() === '') {
        this.toast.error("Validando", "La agencia de envío es obligatoria");
        return;
      }
      if (!this.encargado_deliverie || this.encargado_deliverie.trim() === '') {
        this.toast.error("Validando", "El nombre del encargado es obligatorio");
        return;
      }
      // if (!this.documento_deliverie || this.documento_deliverie.trim() === '') {
      //   this.toast.error("Validando", "El documento del encargado es obligatorio");
      //   return;
      // }
      if (!this.celular_deliverie || this.celular_deliverie.trim() === '') {
        this.toast.error("Validando", "El celular del encargado es obligatorio");
        return;
      }
    }

    if (this.metodo_pago_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar un metodo de pago");
      return;
    } else {
      const metodoSeleccionado = this.metodos_pagos.find((item) => item.id === this.metodo_pago_id);

      if (metodoSeleccionado && metodoSeleccionado.nombre.toLowerCase() === 'transferencia') {
        if (this.banco_id === 9999999) {
          this.toast.error("Validando", "Necesitas seleccionar un banco");
          return;
        }
      }
    }

    if (!this.monto_pago) {
      this.toast.error("Validando", "El monto de pago es requerido");
      return;
    }

    //GUARDAR

    let formData = new FormData();

    formData.append("cliente_id", this.cliente.id.toString());
    formData.append("segmento_cliente_id", this.cliente.segmento_cliente_id.toString());
    formData.append("sub_total", this.subtotal_factura.toString());
    formData.append("total_descuento", (this.descuento_final + this.total_descuento_factura).toString());
    formData.append("total_iva", this.total_iva_factura.toString());
    formData.append("total_venta", this.total_costo_factura.toString());
    formData.append("deuda", (this.deuda - (this.monto_pago ? this.monto_pago : 0)) + '');
    // formData.append("pago_out", (this.total_costo_factura + (this.monto_pago ? this.monto_pago : 0)) + '');
    formData.append("pago_out", (this.monto_pago - (this.total_costo_factura - (this.descuento_final || 0))).toString());
    formData.append("descripcion", this.descripcion);

    formData.append('detalle_factura', JSON.stringify(this.detalle_factura));

    formData.append("sede_deliverie_id", this.sede_deliverie_id.toString());
    formData.append("fecha_entrega", this.fecha_deliverie.toString());
    formData.append("departamento_id", this.departamento_id_deliverie.toString());
    formData.append("municipio_id", this.municipio_id_deliverie.toString());
    formData.append("direccion_deliverie", this.direccion_deliverie.toString());
    formData.append("agencia_deliverie", this.agencia_deliverie.toString());
    formData.append("encargado_deliverie", this.encargado_deliverie.toString());
    formData.append("documento_deliverie", this.documento_deliverie.toString());
    formData.append("celular_deliverie", this.celular_deliverie.toString());

    formData.append("monto_pago", this.monto_pago.toString());
    formData.append("metodo_pago_id", this.metodo_pago_id.toString());
    formData.append("banco_id", this.banco_id.toString());
    if (this.file_name) {
      formData.append('imagen', this.file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    this.facturaService.create(formData).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);

        this.resetearMetodoPago();
        this.descripcion = '';
        this.efectivo_recibido = 0;
        this.vueltos = 0;

      } else {
        this.toast.success('Exito', resp.message_text);
        this.isLoadingProcess();
        this.imprimirFactura(resp.factura);
        // Redirigir a la ruta '/facturas/listado'
        // this.router.navigate(['/facturas/listado']);

        this.resetearCliente();
        this.cliente.nombres = 'Cliente General';
        this.buscarCliente();
        this.resetearMetodoPago();
        this.resetearArticulo();
        this.resetearLugarDeEntrega();
        this.detalle_factura = [];

        this.total_iva_factura = 0;
        this.total_costo_factura = 0;
        this.subtotal_factura = 0;
        this.total_descuento_factura = 0;
      
        this.descripcion = '';
        this. deuda = 0;
        this.pago_out = 0;
      }
    });

  }

  imprimirFactura(factura: Factura) {
    const params = {
      id: factura.id,
      empresa_id: this.user.empresa_id,
      user_id: this.user.id
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/facturas/imprimir-factura' + link, '_BLANK', "toolbar=no,scrollbars=no,resizable=no,width=400,height=800");
  }

}
