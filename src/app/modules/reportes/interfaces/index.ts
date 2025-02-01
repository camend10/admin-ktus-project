import { Empresa } from "src/app/interfaces";
import { Articulo, ArticuloWallet, BodegaArticulo } from "../../articulos/interfaces";
import { Iva } from "../../configuracion/ivas/interfaces";
import { Categoria } from "../../configuracion/categorias/interfaces";
import { User } from "../../users/interfaces";
import { Unidad } from "../../kardex/interfaces";
import { Proveedor } from "../../configuracion/proveedores/interfaces";

export interface ResponseReporte {
    total: number;
    articulos: { // Ajuste para reflejar la estructura anidada
        data: ArticuloElement[];
    };
}

export interface ArticuloElement {
    articulo_id: number;
    total_vendido: string;
    unidad: string;
    articulo: ArticuloIndex;
}

export interface ArticuloIndex {
    id: number;
    sku: string;
    nombre: string;
    descripcion: string;
    precio_general: number;
    punto_pedido: number;
    imagen: string;
    iva_id: number;
    empresa_id: number;
    estado: number;
    categoria_id: number;
    is_gift: number;
    descuento_maximo: number;
    descuento_minimo: number;
    tiempo_de_abastecimiento: number;
    disponibilidad: number;
    is_discount: number;
    impuesto: number;
    punto_pedido_unidad_id: number;
    articulo_id: number;
    total_vendido: string;
    unidad: string;
    tipo?: string;
    especificaciones?: string[];
    peso?: number;
    ancho?: number;
    alto?: number;
    largo?: number;
    user_id?: number;
    proveedor_id?: number;
    state_stock?: number;
    iva?: Iva;
    empresa?: Empresa;
    categoria?: Categoria;
    usuario?: User;
    unidad_punto_pedido?: Unidad;
    proveedor?: Proveedor;
    bodegas_articulos?: BodegaArticulo[];
    articulos_wallets?: ArticuloWallet[];
    unidades?: Unidad[];
}


export interface ResponseMovimiento {
    existencia_inicial: number;
    existencia_final: number;
    total_entradas: number;
    total_salidas: number;
    unidad: string;
    nombreArticulo: string;
    movimientos: Movimiento[];
}

export interface Movimiento {
    id: string;
    tipo: string;
    fecha: Date;
    observacion: string;
    bodega: string;
    usuario: string;
    cantidad: number;
    origen: string;
    detalles: Detalle[];
}

export interface Detalle {
    articulo: string;
    cantidad: number;
    unidad: string;
    costo: number;
    total: number;
}


