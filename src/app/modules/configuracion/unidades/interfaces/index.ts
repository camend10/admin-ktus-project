import { Empresa } from "../../sedes/interfaces";

export interface Unidad {
    id: number;
    nombre: string;
    sigla: string;
    descripcion: string;
    empresa_id: number;
    estado: number;
    empresa?: Empresa;
    transformacion?: UnidadTransformacion[];    
    created_format_at?: string;
}

export interface ResponseUnidad {
    total: number;
    unidades: Unidad[];
}

export interface ResponseGestionUnidad {
    message: number;
    message_text: string;
    unidad: Unidad;
}

export interface UnidadTransformacion {
    id: number;
    unidad_id: number;
    unidad_to_id: number;
    empresa_id: number;
    estado: number;
    unidad_to?: Unidad;
    created_format_at?: string;
}

export interface ResponseGestionUnidadTransformacion {
    message: number;
    message_text: string;
    unidadTransformacion: UnidadTransformacion;    
}
