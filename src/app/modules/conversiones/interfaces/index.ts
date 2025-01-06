import { Empresa } from "src/app/interfaces";
import { Sede } from "../../configuracion/sedes/interfaces";
import { User } from "../../users/interfaces";
import { Unidad } from "../../configuracion/unidades/interfaces";
import { Bodega } from "../../configuracion/bodegas/interfaces";
import { Articulo } from "../../articulos/interfaces";

export interface Conversion {
    id: number;
    articulo_id: number;
    bodega_id: number;
    unidad_inicio_id: number;
    unidad_final_id: number;
    user_id: number;
    empresa_id: number;
    sede_id: number;
    estado: number;
    cantidad_inicial: number;
    cantidad_final: number;
    cantidad_convertida: number;
    descripcion: string;
    empresa?: Empresa;
    sede?: Sede;
    usuario?: User;
    created_format_at?: string;
    unidad_inicio?: Unidad;
    unidad_final?: Unidad;
    bodega?: Bodega;
    articulo?: Articulo;
}


export interface ResponseConversion {
    total: number;
    conversiones: { // Ajuste para reflejar la estructura anidada
        data: Conversion[];
    };
}

export interface ResponseGestionConversion {
    message: number;
    message_text: string;
    conversion: Conversion;
}
