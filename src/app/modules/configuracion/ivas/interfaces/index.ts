import { Empresa } from "../../sedes/interfaces";

export interface Iva {
    id: number;
    porcentaje: number;
    empresa_id: number;
    estado: number;
    empresa?: Empresa;
    created_format_at?: string;
}

export interface ResponseIva {
    total: number;
    ivas: Iva[];
}

export interface ResponseGestionIva {
    message:      number;
    message_text: string;
    iva:         Iva;
}