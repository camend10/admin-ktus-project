import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { GeneralesService } from "src/app/services/generales.service";
import { Empresa } from "src/app/interfaces";
import { User } from "src/app/modules/users/interfaces";
import { AuthService } from "src/app/modules/auth";
import { ConversionesService } from "../service/conversiones.service";
import { Conversion } from "../interfaces";
import { FacturasService } from "../../facturas/service/facturas.service";
import { Articulo, BodegaArticulo } from "../../articulos/interfaces";
import { BuscarArticuloComponent } from "../../facturas/componentes/buscar-articulo/buscar-articulo.component";
import { Bodega } from "../../configuracion/bodegas/interfaces";
import { Unidad, UnidadTransformacion } from "../../configuracion/unidades/interfaces";

@Component({
  selector: "app-create-conversion",
  templateUrl: "./create-conversion.component.html",
  styleUrl: "./create-conversion.component.scss"
})
export class CreateConversionComponent implements OnInit {
  isLoading$: any;
  @Output() ConversionC: EventEmitter<Conversion> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() unidades: Unidad[] = [];

  bodegas: Bodega[] = [];
  bodegas_unidades: BodegaArticulo[] = [];
  unidades_transformadas: UnidadTransformacion[] = [];
  buscar_articulo: string = "";
  bodega_id: number = 9999999;
  unidad_inicio_id: number = 9999999;
  unidad_final_id: number = 9999999;
  cantidad_inicial: number = 0;
  cantidad_final: number = 0;
  cantidad_convertida: number = 0;
  nombre_unidad: string = "";
  descripcion: string = "";
  unidad_seleccionada: Unidad;

  articulo: Articulo = {
    id: 0,
    sku: "",
    nombre: "",
    descripcion: "",
    precio_general: 0,
    punto_pedido: 0,
    imagen: "",
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
      nombre: "",
      descripcion: "",
      empresa_id: 0,
      estado: 0,
      imagen: "",
    }
  }

  user: User;

  conversion: Conversion = {
    id: 0,
    articulo_id: 9999999,
    bodega_id: 9999999,
    unidad_inicio_id: 9999999,
    unidad_final_id: 9999999,
    user_id: 9999999,
    cantidad_inicial: 0,
    cantidad_final: 0,
    cantidad_convertida: 0,
    descripcion: "",
    empresa_id: 9999999,
    sede_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public conversionService: ConversionesService,
    public generalService: GeneralesService,
    public facturaService: FacturasService,
    public authService: AuthService,
    public modalService: NgbModal,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.conversionService.isLoading$;
    this.user = this.authService.user;
    this.conversion.empresa_id = this.user.empresa_id;
    this.conversion.sede_id = this.user.sede_id || 9999999;
  }

  store() {

    if (this.articulo.id === 0) {
      this.toast.error("Validación", "El articulo es requerido");
      return false;
    }

    if (this.bodega_id === 9999999) {
      this.toast.error("Validación", "La bodega es requerida");
      return false;
    }

    if (!this.unidad_seleccionada) {
      this.toast.error("Validación", "Es necesario seleccionar una unidad");
      return false;
    }

    if (this.unidad_final_id === 9999999) {
      this.toast.error("Validación", "La unidad de conversión es requerida");
      return false;
    }

    if (this.conversion.empresa_id === 9999999) {
      this.toast.error("Validación", "La empresa es requerida");
      return false;
    }

    if (this.cantidad_convertida === 0) {
      this.toast.error("Validación", "Es necesario digitar la cantidad inicial y la cantidad final");
      return false;
    }

    if (!this.descripcion) {
      this.toast.error("Validación", "La descripción es requerida");
      return false;
    }

    this.conversion.id = 0;
    this.conversion.articulo_id = this.articulo.id;
    this.conversion.bodega_id = this.bodega_id;
    this.conversion.unidad_inicio_id = this.unidad_seleccionada.id;
    this.conversion.unidad_final_id = this.unidad_final_id;
    this.conversion.user_id = this.user.id;
    this.conversion.cantidad_inicial = this.cantidad_inicial;
    this.conversion.cantidad_final = this.cantidad_final;
    this.conversion.cantidad_convertida = this.cantidad_convertida;
    this.conversion.descripcion = this.descripcion;
    this.conversion.empresa_id = this.user.empresa_id;
    this.conversion.sede_id = this.user.sede_id || 9999999;
    this.conversion.estado = 1;

    this.conversionService.registrar(this.conversion).subscribe((resp) => {
      if (resp.message !== 200) {
        this.toast.error("Validación", resp.message_text);
      } else {
        this.toast.success("Exito", resp.message_text);
        this.ConversionC.emit(resp.conversion);
        this.modal.close();
      }
    });

  }

  // ARTICULOS
  buscarArticulos() {

    if (!this.buscar_articulo) {
      this.toast.error("Validación", "Necesitas ingresar el nombre ó el código del articulo");
      return false;
    }

    this.facturaService.buscarArticulos(this.buscar_articulo).subscribe((resp) => {
      if (!resp || !resp.articulos || !resp.articulos.data || resp.articulos.data.length === 0) {
        // Si no hay resultados, resetear el cliente y mostrar mensaje
        this.toast.info("Validación", "No hay coincidencia en la búsqueda");
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

        this.bodegas = [];
        this.articulo.bodegas_articulos?.forEach((bodega_articulo: BodegaArticulo) => {
          let index = this.bodegas.findIndex((bodega: Bodega) => bodega.id === bodega_articulo.bodega.id);
          if (index === -1) {
            this.bodegas.push(bodega_articulo.bodega);
          }
        });
        this.isLoadingProcess();
      }
    });
  }

  abrirArticulosSeleccionados(articulos: Articulo[]) {
    const modalRef = this.modalService.open(BuscarArticuloComponent, { centered: true, size: "xl" });

    modalRef.componentInstance.articulos = articulos;
    modalRef.componentInstance.ArticuloS.subscribe((articulo: Articulo) => {

      this.articulo = articulo;
      this.buscar_articulo = this.articulo.nombre;

      this.bodegas = [];
      this.articulo.bodegas_articulos?.forEach((bodega_articulo: BodegaArticulo) => {
        let index = this.bodegas.findIndex((bodega: Bodega) => bodega.id === bodega_articulo.bodega.id);
        if (index === -1) {
          this.bodegas.push(bodega_articulo.bodega);
        }
      });

      this.isLoadingProcess();
    });
  }

  seleccionarBodega() {
    if (!this.articulo) {
      this.toast.error("Validación", "Necesita seleccionar un articulo");
      return false;
    }
    this.bodegas_unidades = this.articulo.bodegas_articulos?.filter(
      (bodega_articulo: BodegaArticulo) => bodega_articulo.bodega.id === Number(this.bodega_id)
    ) || [];
  }

  seleccionarUnidad(bodega_articulo: BodegaArticulo) {

    this.unidad_seleccionada = bodega_articulo.unidad;
    this.nombre_unidad = this.unidad_seleccionada.nombre;

    this.unidades_transformadas = [];

    let unidad_s = this.unidades.find((unidad: Unidad) => unidad.id === this.unidad_seleccionada.id);

    if (unidad_s) {
      this.unidades_transformadas = unidad_s.transformacion || [];
    }

  }

  calculoTotal() {
    this.cantidad_convertida = Math.floor(this.cantidad_inicial * this.cantidad_final);
  }

  seleccionarTexto(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input.select) {
      input.select(); // Selecciona el texto del input
    }
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.conversionService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.conversionService.isLoadingSubject.next(false);
    }, 50);
  }
}
