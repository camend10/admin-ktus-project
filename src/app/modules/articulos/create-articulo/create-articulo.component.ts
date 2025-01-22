import {
  ChangeDetectorRef, Component, OnInit, ElementRef,
  OnDestroy
} from '@angular/core';
import { Articulo, ArticuloWallet, BodegaArticulo, Especificacion } from '../interfaces';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ArticulosService } from '../service/articulos.service';
import { User } from '../../users/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Empresa } from 'src/app/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { Iva } from '../../configuracion/ivas/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { isPermission } from 'src/app/config/config';


@Component({
  selector: 'app-create-articulo',
  templateUrl: './create-articulo.component.html',
  styleUrl: './create-articulo.component.scss'
})
export class CreateArticuloComponent implements OnInit, OnDestroy {

  isLoading$: any;

  is_discount: number = 1;
  tab_selected: number = 1;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  unidades: Unidad[] = [];
  bodegas: Bodega[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  ivas: Iva[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  //SECCION BODEGAS
  unidad_id_bodegas: number = 9999999;
  bodega_id_bodegas: number = 9999999;
  cantidad_bodegas: number = 0;
  bodegas_articulos: BodegaArticulo[] = [];
  //SECCION BODEGAS

  //SECCION PRECIOS MULTIPLES

  unidad_id_premul: number = 9999999;
  sede_id_premul: number = 9999999;
  segmento_cliente_id_premul: number = 9999999;
  precio_premul: number = 0;
  articulos_wallets: ArticuloWallet[] = [];
  //SECCION PRECIOS MULTIPLES

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
  }

  user: User;

  file_name: File | null = null;

  // imagen_previzualizada: any;
  imagen_previzualizada: string | null = 'assets/media/svg/files/blank-image.svg';

  key_v: string = '';
  value_v: string = '';
  especificaciones: Especificacion[] = [];

  constructor(
    public articuloService: ArticulosService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.articuloService.isLoading$;
    this.imagen_previzualizada = 'assets/media/svg/files/blank-image.svg';
    this.user = this.authService.user;
    this.articulo.empresa_id = this.user.empresa_id;
    this.cargarConfiguraciones();
    this.closeSidebar();
  }

  verificarEstado() {
    return this.articulo.estado === 1 ? 'bg-success' : 'bg-danger';
  }

  addBodegasArticulos() {
    if (this.unidad_id_bodegas === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una unidad');
      return false;
    }

    if (this.bodega_id_bodegas === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una bodega');
      return false;
    }

    // if (!this.cantidad_bodegas) {
    //   this.toast.error('Validación', 'Necesitas colocar una cantidad');
    //   return false;
    // }

    let unidad_seleccionada = this.unidades.find((unidad: Unidad) => unidad.id == this.unidad_id_bodegas);
    let bodega_seleccionada = this.bodegas.find((bodega: Bodega) => bodega.id == this.bodega_id_bodegas);
    0
    if (!unidad_seleccionada || !bodega_seleccionada) {
      console.error('Unidad o bodega no encontrada');
      return false;
    }

    let index_bodegas: number = this.bodegas_articulos.findIndex((bod_art: BodegaArticulo) => (bod_art.unidad.id == this.unidad_id_bodegas) && (bod_art.bodega.id == this.bodega_id_bodegas));

    if (index_bodegas != -1) {
      // Si ya existe, sumar la cantidad
      this.bodegas_articulos[index_bodegas].cantidad += this.cantidad_bodegas;
      // this.toast.error('Validación', 'La existencia de ese articulo con la bodega y la unidad ya existe');
      return false;
    } else {
      this.bodegas_articulos.push({
        bodega: bodega_seleccionada,
        unidad: unidad_seleccionada,
        cantidad: this.cantidad_bodegas,
      });
    }
    this.unidad_id_bodegas = 9999999;
    this.bodega_id_bodegas = 9999999;
    this.cantidad_bodegas = 0;

    // if (unidad_seleccionada && bodega_seleccionada) {
    //   this.bodegas_articulos.push({
    //     bodega: bodega_seleccionada,
    //     unidad: unidad_seleccionada,
    //     cantidad: this.cantidad_bodegas,
    //   });
    // } else {
    //   console.error('Unidad o bodega no encontrada');
    // }

  }

  removeBodegaArticulo(bodega_articulo: BodegaArticulo) {

    let index: number = this.bodegas_articulos.findIndex((bod_art: BodegaArticulo) => (bod_art.unidad.id == bodega_articulo.unidad.id) && (bod_art.bodega.id == bodega_articulo.bodega.id));

    if (index != -1) {
      this.bodegas_articulos.splice(index, 1);
    }
  }

  addArticulosWallets() {
    if (this.unidad_id_premul === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una unidad');
      return false;
    }

    if (!this.precio_premul) {
      this.toast.error('Validación', 'Necesitas colocar una precio');
      return false;
    }

    let unidad_seleccionada = this.unidades.find((unidad: Unidad) => unidad.id == this.unidad_id_premul);
    let sede_seleccionada = this.sedes.find((sede: Sede) => sede.id == this.sede_id_premul) || null;
    let segmento_cliente_seleccionado = this.segmentos_clientes.find((segmento_cliente: SegmentoCliente) => segmento_cliente.id == this.segmento_cliente_id_premul) || null;

    if (!unidad_seleccionada) {
      console.error('Unidad no encontrada, esto no debería pasar.');
      return false;
    }

    let index: number = this.articulos_wallets.findIndex((art_wal: ArticuloWallet) => (art_wal.unidad.id == this.unidad_id_premul) && (art_wal.sede_id_premul == this.sede_id_premul) && (art_wal.segmento_cliente_id_premul == this.segmento_cliente_id_premul));

    if (index != -1) {
      this.toast.error('Validación', 'El precio del articulo con la sede y la unidad ya existe');
      return false;
    }

    this.articulos_wallets.push({
      unidad: unidad_seleccionada,
      sede: sede_seleccionada,
      segmento_cliente: segmento_cliente_seleccionado,
      precio: this.precio_premul,
      sede_id_premul: this.sede_id_premul,
      segmento_cliente_id_premul: this.segmento_cliente_id_premul
    });

    this.unidad_id_premul = 9999999;
    this.sede_id_premul = 9999999;
    this.segmento_cliente_id_premul = 9999999;
    this.precio_premul = 0;
  }

  removeArticuloWallet(articulo_wallet: ArticuloWallet) {


    let index: number = this.articulos_wallets.findIndex((art_wal: ArticuloWallet) =>
      (art_wal.unidad.id == articulo_wallet.unidad.id) &&
      (articulo_wallet.sede ? art_wal.sede_id_premul == articulo_wallet.sede.id : true) &&
      (articulo_wallet.segmento_cliente ? art_wal.segmento_cliente_id_premul == articulo_wallet.segmento_cliente.id : true)
    );


    if (index != -1) {
      this.articulos_wallets.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  isGift() {
    this.articulo.is_gift = this.articulo.is_gift === 1 ? 2 : 1;
  }

  selectedDiscount(valor: number) {
    this.is_discount = valor;
    this.articulo.is_discount = valor;
  }

  selectedTab(valor: number) {
    this.tab_selected = valor;
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

    // Limpia la previsualización antes de procesar la nueva imagen
    this.imagen_previzualizada = null;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagen_previzualizada = reader.result as string;

      // Forzar la detección de cambios
      // this.cdr.detectChanges();
      this.isLoadingProcess();
    };
    reader.readAsDataURL(file);

  }

  isLoadingProcess() {
    this.articuloService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.articuloService.isLoadingSubject.next(false);
    }, 50);
  }

  cancelImage() {
    // Restablece la imagen a la predeterminada cuando se cancela
    this.imagen_previzualizada = 'assets/media/svg/files/blank-image.svg';
  }

  removeImage() {
    // Restablece la imagen a la predeterminada cuando se elimina
    this.imagen_previzualizada = 'assets/media/svg/files/blank-image.svg';
  }

  verificarImagen() {
    return this.imagen_previzualizada == 'assets/media/svg/files/blank-image.svg';
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.unidades = response.unidades;
        this.sedes = response.sedes;
        this.bodegas = response.bodegas;
        this.segmentos_clientes = response.segmentos_clientes;
        this.ivas = response.ivas;
        this.categorias = response.categorias;
        this.proveedores = response.proveedores;

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

        this.categorias = this.categorias.map(categoria => {
          return { ...categoria, nombre: this.capitalize(categoria.nombre) };
        });

        this.proveedores = this.proveedores.map(proveedor => {
          return {
            ...proveedor, nombre: this.capitalize(proveedor.nombres),
            apellidos: proveedor.apellidos === null ? this.capitalize(proveedor.apellidos) : ''
          };
        });

        this.segmentos_clientes = this.segmentos_clientes.map(segmento => {
          return { ...segmento, nombre: this.capitalize(segmento.nombre) };
        });

        this.unidades = this.unidades.map(unidad => {
          return { ...unidad, nombre: this.capitalize(unidad.nombre) };
        });

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
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

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  store() {

    if (!this.articulo.sku) {
      this.toast.error('Validación', 'El código del articulo es requerido');
      return false;
    }

    if (!this.articulo.nombre) {
      this.toast.error('Validación', 'El nombre del articulo es requerido');
      return false;
    }

    if (!this.articulo.precio_general) {
      this.toast.error('Validación', 'El precio del articulo es requerido');
      return false;
    }

    if (this.articulo.categoria_id === 9999999) {
      this.toast.error('Validación', 'La categoria del articulo es requerida');
      return false;
    }

    if (this.articulo.iva_id === 9999999) {
      this.toast.error('Validación', 'El iva del articulo es requerido');
      return false;
    }

    if (this.articulo.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (!this.articulo.punto_pedido) {
      this.toast.error('Validación', 'El punto de pedido del articulo es requerido');
      return false;
    }

    if (this.articulo.punto_pedido_unidad_id === 9999999) {
      this.toast.error('Validación', 'La unidad del punto de pedido es requerida');
      return false;
    }

    if (this.bodegas_articulos.length === 0) {
      this.toast.error('Validación', 'Necesitas ingresar al menos un registro de existencia de articulos');
      return false;
    }

    if (this.articulos_wallets.length === 0) {
      this.toast.error('Validación', 'Necesitas ingresar al menos un listado de precios al articulos');
      return false;
    }

    this.articuloService.registrar(this.articulo, this.file_name,
      this.bodegas_articulos, this.articulos_wallets,
      this.especificaciones).subscribe((resp) => {
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.clearForm();
          // this.cdr.detectChanges(); // Forzar detección de cambios
          this.isLoadingProcess();
        }
      });

  }

  onImpuestoChange() {
    if (this.articulo.impuesto === 1) {
      // Encuentra el IVA con porcentaje = 0
      const ivaCero = this.ivas.find((iva) => iva.porcentaje === 0);
      if (ivaCero) {
        this.articulo.iva_id = ivaCero.id; // Asigna el id del IVA encontrado
      } else {
        this.articulo.iva_id = 9999999; // O maneja el caso cuando no se encuentra
      }
    } else {
      this.articulo.iva_id = 9999999; // O maneja el caso cuando no se encuentra
    }
  }

  clearForm() {
    this.articulo = {
      id: 0,
      sku: '',
      nombre: '',
      descripcion: '',
      precio_general: 0,
      punto_pedido: 0,
      imagen: '',
      iva_id: 9999999,
      empresa_id: this.user.empresa_id,
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
      peso: 0,
      ancho: 0,
      alto: 0,
      largo: 0
    }

    this.is_discount = 1;
    this.tab_selected = 1;

    //SECCION BODEGAS
    this.unidad_id_bodegas = 9999999;
    this.bodega_id_bodegas = 9999999;
    this.cantidad_bodegas = 0;
    this.bodegas_articulos = [];
    //SECCION BODEGAS

    //SECCION PRECIOS MULTIPLES

    this.unidad_id_premul = 9999999;
    this.sede_id_premul = 9999999;
    this.segmento_cliente_id_premul = 9999999;
    this.precio_premul = 0;
    this.articulos_wallets = [];
    //SECCION PRECIOS MULTIPLES

    this.file_name = null;
    this.imagen_previzualizada = 'assets/media/svg/files/blank-image.svg';
  }

  addEspecificacion() {
    if (!this.key_v) {
      this.toast.error('Validación', 'Necesitas digitar una propiedad');
      return false;
    }

    if (!this.value_v) {
      this.toast.error('Validación', 'Necesitas digitar un valor');
      return false;
    }

    this.especificaciones.unshift({
      key_v: this.key_v,
      value_v: this.value_v
    });

    this.key_v = '';
    this.value_v = '';
  }

  removeEspecificacion(i: number) {
    this.especificaciones.splice(i, 1);
  }

  onCategoriaChange(event: Event): void {
    const categoria_id = (event.target as HTMLSelectElement).value;

    if (categoria_id) {
      this.articuloService.generarSku(categoria_id).subscribe((data: any) => {
        this.articulo.sku = data.sku;
      });
    } else {
      this.articulo.sku = '';
    }
  }

  validarDescuentos() {
    const { descuento_minimo, descuento_maximo } = this.articulo;

    if (descuento_minimo > descuento_maximo) {
      this.toast.error('Validación', 'El descuento mínimo no puede ser mayor que el descuento máximo.');
      this.articulo.descuento_minimo = 0;
      this.articulo.descuento_maximo = 0;
      return false;
    } else if (descuento_minimo > 100 || descuento_maximo > 100) {
      this.toast.error('Validación', 'Los descuentos deben ser porcentuales (máximo 100).');
      this.articulo.descuento_minimo = 0;
      this.articulo.descuento_maximo = 0;
      return false;
    }
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }


  // // Método para procesar el valor ingresado y formatearlo
  // onPrecioGeneralInput(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   let value = inputElement?.value;

  //   // Filtra caracteres no numéricos
  //   value = value.replace(/[^0-9]/g, '');

  //   // Elimina comas y convierte el resultado en un número
  //   const numericValue = Number(value.replace(/,/g, ''));
  //   if (!isNaN(numericValue)) {
  //     this.articulo.precio_general = numericValue; // Actualiza el valor numérico puro
  //     this.updateDisplayPrecio(); // Actualiza el valor formateado
  //   }
  // }

  // // Método para bloquear letras y caracteres no deseados durante la escritura
  // validateNumericInput(event: KeyboardEvent): void {
  //   // Permitir solo teclas numéricas, Backspace, Delete, Tab, y flechas
  //   const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
  //   const isNumber = /^[0-9]$/.test(event.key);

  //   if (!isNumber && !allowedKeys.includes(event.key)) {
  //     event.preventDefault(); // Bloquea la entrada
  //   }
  // }

  // updateDisplayPrecio(): void {
  //   // Actualiza el valor formateado para mostrarlo en el input
  //   this.displayPrecioGeneral = this.articulo.precio_general.toLocaleString('en-US');
  // }

}
