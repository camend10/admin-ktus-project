import { TipoDoc } from "src/app/interfaces";
import { Empresa } from "../../sedes/interfaces";

export interface Proveedor {
    id: number;
    tipo_identificacion: number;
    identificacion: string;
    dv: string;
    nombres: string;
    apellidos: string;
    email: string;
    direccion: string;
    celular: string;
    departamento_id: number;
    municipio_id: number;
    empresa_id: number;
    estado: number;
    imagen: string;
    sigla?: string;
    empresa?: Empresa;
    departamento?: string;
    municipio?: string;
    tipodocumento?: TipoDoc;
    created_format_at?: string;
}

export interface ResponseProveedor {
    total: number;
    proveedores: Proveedor[];
}

export interface ResponseGestionProveedor {
    message: number;
    message_text: string;
    proveedor: Proveedor;
}