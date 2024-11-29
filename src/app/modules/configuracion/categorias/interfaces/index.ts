import { Empresa } from "../../sedes/interfaces";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    empresa_id: number;
    estado: number;
    imagen: string;
    empresa?: Empresa;
    created_format_at?: string;
}

export interface ResponseCategoria {
    total: number;
    categorias: Categoria[];
}

export interface ResponseGestionCategoria {
    message: number;
    message_text: string;
    categoria: Categoria;
}