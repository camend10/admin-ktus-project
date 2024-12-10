import { Bodega } from "../modules/configuracion/bodegas/interfaces";
import { Categoria } from "../modules/configuracion/categorias/interfaces";
import { Iva } from "../modules/configuracion/ivas/interfaces";
import { Proveedor } from "../modules/configuracion/proveedores/interfaces";
import { SedeDeliverie } from "../modules/configuracion/sede-deliveries/interfaces";
import { Sede } from "../modules/configuracion/sedes/interfaces";
import { SegmentoCliente } from "../modules/configuracion/segmento-clientes/interfaces";
import { Unidad } from "../modules/configuracion/unidades/interfaces";
import { User } from "../modules/users/interfaces";

export interface ResponseConfiguracion {
    departamentos: Departamento[];
    empresas: Empresa[];
    sedes: Sede[];
    tipodocumentos: TipoDoc[];
    generos: Genero[];
    roles: Role[];
    // municipios:     { [key: string]: Municipio[] };
    municipios: Municipio[];
    arraySedes: Sede[];
    segmentos_clientes: SegmentoCliente[];
    sede_deliveries: SedeDeliverie[];
}

export interface ResponseConfiguracionArticulos {
    unidades: Unidad[];
    empresas: Empresa[];
    sedes: Sede[];
    bodegas: Bodega[];
    segmentos_clientes: SegmentoCliente[];
    ivas: Iva[];
    categorias: Categoria[];
    proveedores: Proveedor[];
}


export interface Departamento {
    id: number;
    nombre: string;
    estado: number;
}

export interface Municipio {
    id: number;
    nombre: string;
    estado: number;
}

export interface TipoDoc {
    id: number;
    nombre: string;
    sigla: string;
    estado: number;
}

export interface Genero {
    id: number;
    nombre: string;
    estado: number;
}

export interface Role {
    id: number;
    name: string;
}

export interface Empresa {
    id: number;
    nit_empresa: number;
    dv: number;
    nombre: string;
    email: string;
    direccion: string;
    telefono: number;
    web: string;
    celular: number;
}

export interface ResponseAuth {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}
