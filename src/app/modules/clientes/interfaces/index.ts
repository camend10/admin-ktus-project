import { Departamento, Empresa, Genero, Municipio, TipoDoc } from "src/app/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { SegmentoCliente } from "../../configuracion/segmento-clientes/interfaces";
import { User } from "../../users/interfaces";

export interface Cliente {
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
    is_parcial: number;
    segmento_cliente_id: number;
    sede_id?: number;
    fecha_nacimiento?: string;
    user_id?: number;
    sigla?: string;
    empresa?: Empresa;
    sede?: Sede;
    departamento?: Departamento;
    municipio?: Municipio;
    tipodocumento?: TipoDoc;
    segmento?: SegmentoCliente;
    usuario?: User;
    created_format_at?: string;
    genero_id?: number,
    genero?: Genero
}

export interface ResponseCliente {
    total: number;
    clientes: { // Ajuste para reflejar la estructura anidada
        data: Cliente[];
    };
}

export interface ResponseGestionCliente {
    message: number;
    message_text: string;
    cliente: Cliente;
}

export interface ResponseGestionSubir {
    message: number;
    message_text: string;
}
