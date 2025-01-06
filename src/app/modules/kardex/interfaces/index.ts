export interface ResponseKardex {
    kardex_articulos: KardexArticulo[];
}

export interface KardexArticulo {
    articulo_id: string;
    nombre: string;
    sku: string;
    categoria: string;
    movimiento_unidades: MovimientoUnidade[];
    unidad_first: Unidad;
    unidades: Unidad[];
}

export interface MovimientoUnidade {
    unidad_id: number;
    movimientos: Movimiento[];
}

export interface Movimiento {
    fecha: string;
    detalle: string;
    ingreso: Ingreso | null;
    salida: Ingreso | null;
    existencia: Existencia;
}

export interface Existencia {
    cantidad: number;
    precio: number;
    total: number;
}

export interface Ingreso {
    cantidad: string;
    precio: string;
    total: number;
}

export interface Unidad {
    id: number;
    nombre: string;
    sigla: string;
    estado: number;
    empresa_id: number;
    created_at: Date;
    updated_at: Date;
    descripcion: string;
}