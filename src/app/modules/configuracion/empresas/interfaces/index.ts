export interface ResponseGestionEmpresa {
    message: number;
    message_text: string;
    empresa: Empresa;
}

export interface Empresa {
    id: number;
    nit_empresa: string;
    dv: string;
    nombre: string;
    email: string;
    direccion: string;
    telefono: number;
    web: string;
    celular: number;
    estado: number;
    departamento_id: number;
    municipio_id: number;
    departamento?: string;
    municipio?: string;
    imagen?: string;
    lema?: string;
}

export interface ResponseEmpresa {
    total: number;
    empresas: Empresa[];
}
