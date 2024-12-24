import { Empresa } from "src/app/interfaces";
import { User } from "../../users/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { Articulo } from "../../articulos/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";

export interface Plantilla {
    id: number;
    codigo: string;
    nombre: string;
    observacion: string;
    empresa_id: number;
    sede_id: number;
    estado: number;
    user_id: number;

    empresa?: Empresa;
    sede?: Sede;
    usuario?: User;
    detalles_plantillas?: DetallePlantilla[];
    created_format_at?: string;
}

export interface ResponseGestionPlantilla {
    message: number;
    message_text: string;
    plantilla: Plantilla;
}

export interface ResponsePlantilla {
    total: number;
    plantillas: Plantilla[];
}

export interface DetallePlantilla{
    id: number;
    costo: number;
    total_costo: number;
    cantidad: number;
    cantidad_recibida: number;
    plantilla_id: number;
    articulo_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    unidad_id: number;
    
    articulo?: Articulo;
    empresa?: Empresa;
    sede?: Sede;
    unidad?: Unidad;
    created_at?: string;
}