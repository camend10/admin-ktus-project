import { Empresa } from "src/app/interfaces";
import { Proveedor } from "../../configuracion/proveedores/interfaces";
import { User } from "../../users/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { Bodega } from "../../configuracion/bodegas/interfaces";
import { Articulo } from "../../articulos/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";

export interface Movimiento {
    id: number;
    fecha_emision: Date | null;
    tipo_movimiento: number;
    observacion: string;
    observacion_entrega: string;
    destino: string;
    total: number;
    user_id: number;
    bodega_id: number;
    plantilla_id: number;
    proveedor_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    fecha_entrega: Date | null;

    empresa?: Empresa;
    sede?: Sede;
    usuario?: User;
    proveedor?: Proveedor;
    bodega?: Bodega;
    detalles_movimientos?: DetalleMovimiento[];
    created_format_at?: string;
}

export interface ResponseGestionMovimiento {
    message: number;
    message_text: string;
    solicitud: Movimiento;
}

export interface ResponseMovimiento {
    total: number;
    solicitudes: { // Ajuste para reflejar la estructura anidada
        data: Movimiento[];
    };
}

export interface DetalleMovimiento{
    id: number;
    cantidad: number;
    cantidad_recibida: number;
    total: number;
    movimiento_id: number;
    articulo_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    unidad_id: number;
    costo: number;
    user_id: number;
    fecha_entrega: Date | null;
    
    articulo?: Articulo;
    empresa?: Empresa;
    sede?: Sede;
    unidad?: Unidad;
    usuario?: User;
    created_at?: string;
    
}
