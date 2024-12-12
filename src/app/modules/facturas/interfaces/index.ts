import { Empresa } from "src/app/interfaces";
import { User } from "../../users/interfaces";
import { Cliente } from "../../clientes/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { SegmentoCliente } from "../../configuracion/segmento-clientes/interfaces";
import { Articulo } from "../../articulos/interfaces";
import { Categoria } from "../../configuracion/categorias/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";

export interface Factura {
    id: number;
    total_venta: number;
    total_descuento: number;
    total_iva: number;

    user_id: number;
    cliente_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    segmento_cliente_id: number;
    sub_total: number;
    estado_factura: number;
    estado_pago: number;
    deuda: number;
    pago_out: number;
    fecha_validacion: Date;
    fecha_pago_total: Date;
    descripcion?: string;
    domicilio?: string;

    usuario?: User;
    cliente?: Cliente;
    empresa?: Empresa;
    sede?: Sede;
    segmento?: SegmentoCliente;
}

export interface DetalleFactura{
    id: number;
    precio_item: number;
    total_precio: number;
    total_iva: number;
    cantidad_item: number;
    factura_id: number;
    articulo_id: number;
    iva_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    categoria_id: number;
    descuento: number;
    sub_total: number;
    unidad_id: number;
    total_descuento: number;
    
    articulo?: Articulo;
    empresa?: Empresa;
    sede?: Sede;
    categoria?: Categoria;
    unidad?: Unidad;
    
}

export interface ResponseGestionFactura {
    message: number;
    message_text: string;
    factura: Factura;
}

export interface ResponseGestionFactura {
    message: number;
    message_text: string;
    factura: Factura;
}

export interface ResponseFactura {
    total: number;
    facturas: { // Ajuste para reflejar la estructura anidada
        data: Factura[];
    };
}