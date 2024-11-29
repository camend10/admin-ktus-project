import { Empresa } from "../../sedes/interfaces";

export interface SegmentoCliente {
    id: number;
    nombre: string;
    empresa_id: number;
    estado: number;
    empresa?: Empresa;
    created_format_at?: string;
}

export interface ResponseSegmentoCliente {
    total: number;
    segmentoClientes: SegmentoCliente[];
}

export interface ResponseGestionSegmentoCliente {
    message: number;
    message_text: string;
    segmentoCliente: SegmentoCliente;
}