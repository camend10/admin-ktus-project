import { Departamento, Genero, Municipio, TipoDoc } from "src/app/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";

export interface ResponseUser {
    total: number;
    users: User[];
}

export interface ResponseGestionUsers {
    message: number;
    message_text: string,
    user: User;
}

export interface User {
    id: number,
    name: string;
    email: string;
    identificacion: string;
    usuario: string;
    direccion: string;
    celular: number;
    estado: number;
    empresa_id: number;
    role_id: number;
    role: Role;
    roles: PurpleRole[];
    permissions: string[];
    avatar: string;
    genero_id: number;
    departamento_id: number;
    municipio_id: number;
    tipo_doc_id: number;
    fecha_nacimiento?: string;
    // fecha_nacimiento?: Date | null;
    created_format_at?: string;
    sedes?: Sede[];
    sede_id?: number;
    nombre_sede?: String;
    sigla?: string;
    empresa?: string;
    departamento?: Departamento;
    municipio?: Municipio;
    tipodocumento?: TipoDoc;
    genero?: Genero;
    password?: string;
    sedesFormatted?: string; // Nueva propiedad opcional
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at?: Date;
    updated_at?: Date;
    pivot?: Pivot;
}

interface Pivot {
    model_type: string;
    model_id: string;
    role_id: string;
}

export interface PurpleRole {
    id: number;
    name: string;
    guard_name: string;
    permissions: PermissionElement[];
}

interface PermissionElement {
    id: number;
    name: string;
    guard_name: string;
    created_at: Date | null;
    updated_at: Date | null;
    pivot?: PermissionPivot;
}

interface PermissionPivot {
    role_id: string;
    permission_id: string;
}