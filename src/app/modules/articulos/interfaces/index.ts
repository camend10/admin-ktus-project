import { Bodega } from "../../configuracion/bodegas/interfaces";
import { Categoria } from "../../configuracion/categorias/interfaces";
import { Iva } from "../../configuracion/ivas/interfaces";
import { Proveedor } from "../../configuracion/proveedores/interfaces";
import { Empresa, Sede } from "../../configuracion/sedes/interfaces";
import { SegmentoCliente } from "../../configuracion/segmento-clientes/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";
import { User } from "../../users/interfaces";

export interface Articulo {
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
    bodegas_articulos?: BodegaArticulo;
    articulos_wallets?: ArticuloWallet;
}

export interface BodegaArticulo {
    unidad: Unidad;
    bodega: Bodega;
    cantidad: number;
    id?: number;
}

export interface ArticuloWallet {
    unidad: Unidad;
    precio: number;
    sede_id_premul: number;
    segmento_cliente_id_premul: number;
    sede?: Sede | null;
    segmento_cliente?: SegmentoCliente | null;
    id?: number;
}


export interface ResponseArticulo {
    total: number;
    articulos: { // Ajuste para reflejar la estructura anidada
        data: Articulo[];
    };
    num_art_agotados: number;
    num_art_por_agotar: number;
}

export interface ResponseGestionArticulo {
    message: number;
    message_text: string;
    articulo: Articulo;
}

export interface Especificacion {
    key_v: string;
    value_v: string;
}

export interface ResponseGestionBodegaArticulo {
    message: number;
    message_text: string;
    bodega_articulo: BodegaArticulo;
}

export interface ResponseGestionArticuloWallet {
    message: number;
    message_text: string;
    articulo_wallet: ArticuloWallet;
}

export interface ResponseGestionSubir {
    message: number;
    message_text: string;
}

export interface ResponseGestionSku {
    message: number;
    message_text: string;
    sku: string;
}