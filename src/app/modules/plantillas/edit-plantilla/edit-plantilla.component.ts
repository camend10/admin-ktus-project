import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../users/interfaces';
import { Observable } from 'rxjs';
import { Sede } from '../../configuracion/sedes/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { FacturasService } from '../../facturas/service/facturas.service';
import { Articulo, ArticuloWallet } from '../../articulos/interfaces';
import { BuscarArticuloComponent } from '../../facturas/componentes/buscar-articulo/buscar-articulo.component';
import { DetallePlantilla, Plantilla } from '../interfaces';
import { PlantillasService } from '../service/plantillas.service';
import { DeleteDetallePlantillaComponent } from '../componentes/delete-detalle-plantilla/delete-detalle-plantilla.component';
import { EditDetallePlantillaComponent } from '../componentes/edit-detalle-plantilla/edit-detalle-plantilla.component';


@Component({
  selector: 'app-edit-plantilla',
  templateUrl: './edit-plantilla.component.html',
  styleUrl: './edit-plantilla.component.scss'
})
export class EditPlantillaComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  user: User;

  plantilla: Plantilla = {
    id: 0,
    codigo: '',
    nombre: '',
    observacion: '',
    empresa_id: 0,
    sede_id: 0,
    user_id: 0,
    estado: 1,
    detalles_plantillas: []
  };

  observacion: string = '';

  unidades: Unidad[] = [];
  sedes: Sede[] = [];

  // ARTICULOS
  buscar_articulo: string = '';
  unidad_id: number = 9999999;
  costo: number = 0;
  cantidad: number = 0;
  detalle_plantilla: DetallePlantilla[] = [];
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

  plantilla_id: number = 0;

  constructor(
    public plantillaService: PlantillasService,
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
    this.isLoading$ = this.plantillaService.isLoading$;
    this.user = this.authService.user;

    this.plantilla.user_id = this.user.id;
    this.plantilla.empresa_id = this.user.empresa_id;
    this.plantilla.sede_id = this.user.sede_id ?? 0;

    this.cargarConfiguraciones();

    this.closeSidebar();

    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      this.plantilla_id = id;
      this.showPlantilla(this.plantilla_id);
    });

    this.isLoadingProcess();
    this.cdr.detectChanges();
  }

  showPlantilla(id: number) {
    this.plantillaService.showMovimiento(id).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.plantilla = resp.plantilla;

        this.detalle_plantilla = this.plantilla.detalles_plantillas ?? [];
        this.resetearArticulo();

        this.user.name = this.plantilla.usuario?.name ?? '';
        this.user.nombre_sede = this.plantilla.sede?.nombre ?? '';

        this.observacion = this.plantilla.observacion;
        this.detalle_plantilla = Array.isArray(this.plantilla.detalles_plantillas)
          ? this.plantilla.detalles_plantillas
          : []; // Asegura que sea un arreglo

        this.isLoadingProcess();
        this.cdr.detectChanges();
      }
    });
  }


  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.unidades = response.unidades;
        this.sedes = response.sedes;
        this.isLoadingProcess();
      });
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
    const articuloExistente = this.detalle_plantilla.find(
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
      articuloExistente.total_costo += costoTotal;


      this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
    } else {
      // Si no existe, agrega el artículo al detalle

      const unidad = this.unidades.find((item: Unidad) => item.id === this.unidad_id);

      this.detalle_plantilla.push({
        id: 0,
        costo: this.costo,
        total_costo: costoTotal,
        cantidad: this.cantidad,
        cantidad_recibida: this.cantidad,
        plantilla_id: 0,
        articulo_id: this.articulo.id,
        empresa_id: this.user.empresa_id,
        sede_id: this.user.sede_id ?? 0,
        estado: 1,
        unidad_id: this.unidad_id,

        articulo: this.articulo,
        unidad: unidad
      });

      this.toast.success('Artículo agregado', 'El artículo ha sido agregado al detalle');
    }
    setTimeout(() => {
      this.focusField('.buscar-articulo-input');
    }, 50);
    // Calcula los totales

    this.resetearArticulo();
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

  editarArticulo(detalle: DetallePlantilla, index: number) {
    const modalRef = this.modalService.open(EditDetallePlantillaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = JSON.parse(JSON.stringify(detalle));
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.unidades = this.unidades;

    modalRef.componentInstance.DetalleS.subscribe((detalleR: DetallePlantilla) => {

      // Clonar detalleR para asegurarnos de que no altere referencias
      const detalleClonado = JSON.parse(JSON.stringify(detalleR));

      // Buscar si ya existe un artículo con el mismo ID y unidad, pero que no sea el mismo artículo editado
      const articuloExistenteIndex = this.detalle_plantilla.findIndex(
        (detalle, i) =>
          detalle.articulo_id === detalleClonado.articulo?.id &&
          detalle.unidad_id === detalleClonado.unidad_id &&
          i !== index // Evitar consolidar consigo mismo
      );

      if (articuloExistenteIndex !== -1) {
        const articuloDuplicado = this.detalle_plantilla[articuloExistenteIndex];

        // Validar si el costo es diferente
        if (articuloDuplicado.costo !== detalleClonado.costo) {
          this.toast.error(
            'Validación',
            'El artículo ya existe con un costo diferente. No se puede agregar.'
          );
          return;
        }

        articuloDuplicado.cantidad += detalleClonado.cantidad;
        articuloDuplicado.total_costo += detalleClonado.total_costo;

        this.detalle_plantilla.splice(index, 1);

        this.toast.success('Artículo actualizado', 'La cantidad ha sido sumada');
      } else {
        this.detalle_plantilla[index] = detalleClonado;
        this.toast.success('Exito', 'Se ha editado el articulo');
      }

      this.isLoadingProcess();

    });
  }

  eliminarArticulo(detalle: DetallePlantilla, index: number) {
    const modalRef = this.modalService.open(DeleteDetallePlantillaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.detalle = detalle;

    modalRef.componentInstance.DetalleD.subscribe((resp: string) => {

      this.detalle_plantilla.splice(index, 1);

      this.isLoadingProcess();
      this.toast.success('Exito', 'Se ha eliminado el articulo');
    });
  }

  store() {

    if (!this.plantilla.codigo) {
      this.toast.error("Validando", "Necesitas digitar el codigo");
      return;
    }

    if (!this.plantilla.nombre) {
      this.toast.error("Validando", "Necesitas digitar el nombre");
      return;
    }

    if (!this.plantilla.empresa_id) {
      this.toast.error("Validando", "Necesitas seleccionar la empresa");
      return;
    }

    if (!this.plantilla.empresa_id) {
      this.toast.error("Validando", "Necesitas seleccionar la sede");
      return;
    }

    if (!this.plantilla.user_id) {
      this.toast.error("Validando", "Necesitas seleccionar el usuario");
      return;
    }

    if (this.detalle_plantilla.length === 0) {
      this.toast.error("Validando", "Necesitas agregar por lo menos un articulo al detalle");
      return;
    }

    this.plantilla.observacion = this.observacion;
    this.plantilla.detalles_plantillas = this.detalle_plantilla;

    this.plantillaService.edit(this.plantilla, this.plantilla_id).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);

      } else {
        this.toast.success('Exito', resp.message_text);
        this.router.navigate(['/plantillas/listado']);
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

  isLoadingProcess() {
    this.plantillaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.plantillaService.isLoadingSubject.next(false);
    }, 50);
  }
}
