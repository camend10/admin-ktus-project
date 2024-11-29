import { Sede, Empresa } from "../../sedes/interfaces";

export interface MetodoPago {
    id: number;
    nombre: string;
    empresa_id: number;
    metodo_pago_id: number;
    estado: number;
    empresa?: Empresa;
    metodo_pago?: MetodoPago;
    metodo_pagos?: MetodoPago;
    created_format_at?: string;
}

export interface ResponseMetodoPago {
    total: number;
    metodoPagos: MetodoPago[];
}

export interface ResponseGestionMetodoPago {
    message:      number;
    message_text: string;
    metodoPago:         MetodoPago;
}