import { Sede, Empresa } from "../../sedes/interfaces";

export interface Bodega {
    id: number;
    nombre: string;
    descripcion: string;
    empresa_id: number;
    sede_id: number;
    estado: number;
    empresa?: Empresa;
    sede?: Sede;
    created_format_at?: string;
}

export interface ResponseBodega {
    total: number;
    bodegas: Bodega[];
}

export interface ResponseGestionBodega {
    message:      number;
    message_text: string;
    bodega:         Bodega;
}