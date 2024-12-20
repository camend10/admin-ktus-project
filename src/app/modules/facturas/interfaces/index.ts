import { Departamento, Empresa, Municipio } from "src/app/interfaces";
import { User } from "../../users/interfaces";
import { Cliente } from "../../clientes/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { SegmentoCliente } from "../../configuracion/segmento-clientes/interfaces";
import { Articulo } from "../../articulos/interfaces";
import { Categoria } from "../../configuracion/categorias/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";
import { SedeDeliverie } from "../../configuracion/sede-deliveries/interfaces";
import { MetodoPago } from "../../configuracion/metodo-pagos/interfaces";

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
    fecha_validacion: Date | null; // Permite null
    fecha_pago_total: Date | null; // Permite null

    cliente: Cliente;
    usuario: User;
    descripcion?: string;
    created_format_at?: string;

    empresa?: Empresa;
    sede?: Sede;
    segmento?: SegmentoCliente;
    detalles?: DetalleFactura[];
    factura_deliverie?: FacturaDeliverie;
    factura_pago?: FacturaPago[];
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
    created_at?: string;
    bodega_id?: number;    
}

export interface FacturaDeliverie{

    id: number;
    sede_deliverie_id: number;
    factura_id: number;
    fecha_entrega: string;
    direccion: string;
    empresa_id: number;
    sede_id: number;
    estado: number;
    fecha_envio: string;
    departamento_id: number;
    municipio_id: number;
    agencia: string;
    encargado: string;
    documento: string;
    celular: string;
    
    sede_deliverie?: SedeDeliverie;
    empresa?: Empresa;
    sede?: Sede;
    departamento?: Departamento;
    municipio?: Municipio;
    
}

export interface FacturaPago{

    id: number;
    monto: number;
    metodo_pago_id: number;
    factura_id: number;
    fecha_validacion: string;
    n_transaccion: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    banco_id: number;
    imagen: string;
    metodo_pago: MetodoPago;
    empresa?: Empresa;
    sede?: Sede;
    banco?: MetodoPago;
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

export interface ResponseGestionDetalle {
    message: number;
    message_text: string;
}