import { Articulo } from "src/app/modules/articulos/interfaces";

export interface ResponseDashboard {
    message: number;
    message_text: string;
    articulo: Articulo;
}

export interface ResponseFecha {
    year: string;
    month: string;
}

export interface Informacion {
    total_compra: number;
    total_clientes: number;
    total_ventas: number;
    sede_mas_venta: SedeMasVenta;
}

export interface SedeMasVenta {
    sede_id: number;
    empresa_id: number;
    total_facturas: string;
    total_venta: number;
    empresa: Empresa;
    sede: Empresa;
}

export interface Empresa {
    id: number;
    nombre: string;
}

export interface ResponseVentaSede {
    venta_sedes: VentaSede[];
    total_venta_sedes: number;
    total_venta_sedes_fecha_pasada: number;
    porcentajeV: number;
}

export interface VentaSede {
    sede_id: number;
    sede_nombre: string;
    empresa_id: number;
    empresa_nombre: string;
    total_facturas: number;
    total_venta: number;
}

export interface ResponseVentaDiaDelMes {
    venta_dia_del_mes: VentaDiaDelMes[];
    total_venta_actual: number;
    total_venta_pasada: number;
    porcentajeV: number;
}

export interface VentaDiaDelMes {
    created_format: Date;
    dia_created_format: string;
    total_venta: number;
    total_facturas: string;
}

export interface ResponseVentaXMesDelYearA {
    venta_x_mes_del_year_actual: VentaXMesDelYearA[];
    total_venta_year_actual: number;
    venta_x_mes_del_year_anterior: VentaXMesDelYearA[];
    total_venta_year_anterior: number;
    meses_nombre: string[];
}

export interface VentaXMesDelYearA {
    created_at_format: string;
    total_venta: number;
    total_facturas: string;
}

export interface ResponseVentaXSegmentoCliente {
    total_venta_segmento: number;
    venta_x_segmento_clientes: VentaXSegmentoCliente[];
}

export interface VentaXSegmentoCliente {
    segmento_cliente_id: number;
    nombre_segmento: string;
    total_venta: number;
    total_facturas: number;
}

export interface ResponseVendedorMasVenta {
    porcentajeV: number;
    vendedor_mas_venta: VendedorMasVenta;
    vendedor_total_venta_mes_anterior: string;
    vendedor_total_venta_mes_actual: number;
    vendedor_venta_semana: VendedorVentaSemana[];
    nombre_mes: string;
    imagen: string;
}

export interface VendedorMasVenta {
    vendedor_id: string;
    vendedor: string;
    total_venta: number;
    total_facturas: string;
}

export interface VendedorVentaSemana {
    created_format: Date;
    dia: string;
    total_venta: number;
    total_facturas: string;
}

export interface ResponseCategoriasMasVenta {
    categorias_mas_ventas: CategoriasMasVenta[];
    categorias_articulos: ResponseArticulo[];
}

export interface ResponseArticulo {
    id: string;
    nombre: string;
    imagen: string;
    articulos: ArticuloArticulo[];
}

export interface ArticuloArticulo {
    articulo_id: string;
    articulo: string;
    imagen: string;
    sku: string;
    sub_total_venta: string;
    total_venta: number;
    cantidad_articulos: string;
}

export interface CategoriasMasVenta {
    categoria_id: string;
    categoria: string;
    total_venta: number;
    cantidad_articulos: string;    
}

