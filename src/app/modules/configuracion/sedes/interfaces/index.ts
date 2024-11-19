export interface ResponseSede {
    total: number;
    sedes: Sede[];
}

export interface ResponseGestionSede {
    message:      number;
    message_text: string;
    sede:         Sede;
}

export interface Sede {
    id: number;
    codigo: string;
    nombre: string;
    direccion: string;
    telefono: number;
    celular: number;
    responsable: string;
    telefono_responsable: number;
    identificacion_responsable: string;
    empresa_id: number;
    estado: number;
    empresa: Empresa;
    created_format_at?: string;
    seleccionada?: boolean;
    departamento_id: number;
    municipio_id: number;
    departamento?: string;
    municipio?: string;
}

export interface Empresa {
    id: number;
    nit_empresa: string;
    dv: string;
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
    web: string;
    celular: string;
}
