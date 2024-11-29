import { Sede, Empresa } from "../../sedes/interfaces";

export interface SedeDeliverie {
    id: number;
    nombre: string;
    direccion: string;
    empresa_id: number;
    sede_id: number;
    estado: number;
    empresa?: Empresa;
    sede?: Sede;
    created_format_at?: string;
}

export interface ResponseSedeDeliverie {
    total: number;
    sedeDeliveries: SedeDeliverie[];
}

export interface ResponseGestionSedeDeliverie {
    message: number;
    message_text: string;
    sedeDeliverie: SedeDeliverie;
}