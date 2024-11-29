import { environment } from "src/environments/environment";
import { User } from "../modules/users/interfaces";

export const URL_SERVICIOS = environment.URL_SERVICIOS;
export const URL_BACKEND = environment.URL_BACKEND;
export const URL_FRONTED = environment.URL_FRONTED;

export const SIDEBAR: any = [
    {
        'name': 'Roles',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_roles',
            },
            {
                name: 'Editar',
                permiso: 'editar_roles',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_roles',
            },
            {
                name: 'Ver',
                permiso: 'ver_roles',
            }
        ]
    },
    {
        'name': 'Articulos',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_articulos',
            },
            {
                name: 'Editar',
                permiso: 'editar_articulos',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_articulos',
            },
            {
                name: 'Ver',
                permiso: 'ver_articulos',
            },
            {
                name: 'Ver precios',
                permiso: 'ver_precios_articulos',
            },
            {
                name: 'Nuevo precio',
                permiso: 'registrar_precios_articulos',
            },
            {
                name: 'Editar precio',
                permiso: 'editar_precios_articulos',
            },
            {
                name: 'Eliminar precio',
                permiso: 'eliminar_precios_articulos',
            },
        ]
    },
    {
        'name': 'Usuarios',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_usuario',
            },
            {
                name: 'Editar',
                permiso: 'editar_usuario',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_usuario',
            },
            {
                name: 'Ver',
                permiso: 'ver_usuarios',
            }
        ]
    },
    {
        'name': 'Sedes',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_sede',
            },
            {
                name: 'Editar',
                permiso: 'editar_sede',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_sede',
            },
            {
                name: 'Ver',
                permiso: 'ver_sede',
            }
        ]
    },
    {
        'name': 'Bodegas',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_bodega',
            },
            {
                name: 'Editar',
                permiso: 'editar_bodega',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_bodega',
            },
            {
                name: 'Ver',
                permiso: 'ver_bodega',
            }
        ]
    },
    {
        'name': 'Lugar de Entrega',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_sedeDeliverie',
            },
            {
                name: 'Editar',
                permiso: 'editar_sedeDeliverie',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_sedeDeliverie',
            },
            {
                name: 'Ver',
                permiso: 'ver_sedeDeliverie',
            }
        ]
    },
    {
        'name': 'Metodo de pago',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_metodoPago',
            },
            {
                name: 'Editar',
                permiso: 'editar_metodoPago',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_metodoPago',
            },
            {
                name: 'Ver',
                permiso: 'ver_metodoPago',
            }
        ]
    },
    {
        'name': 'Segmento de clientes',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_segmentoCliente',
            },
            {
                name: 'Editar',
                permiso: 'editar_segmentoCliente',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_segmentoCliente',
            },
            {
                name: 'Ver',
                permiso: 'ver_segmentoCliente',
            }
        ]
    },
    {
        'name': 'Categorias',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_categoria',
            },
            {
                name: 'Editar',
                permiso: 'editar_categoria',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_categoria',
            },
            {
                name: 'Ver',
                permiso: 'ver_categoria',
            }
        ]
    },
    {
        'name': 'Proveedores',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_proveedor',
            },
            {
                name: 'Editar',
                permiso: 'editar_proveedor',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_proveedor',
            },
            {
                name: 'Ver',
                permiso: 'ver_proveedor',
            }
        ]
    },
    {
        'name': 'Unidades',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_unidad',
            },
            {
                name: 'Editar',
                permiso: 'editar_unidad',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_unidad',
            },
            {
                name: 'Ver',
                permiso: 'ver_unidad',
            },
            {
                name: 'Crear Transformacion',
                permiso: 'registrar_transformacion',
            },
            {
                name: 'Eliminar Transformacion',
                permiso: 'eliminar_transformacion',
            }
        ]
    },
    {
        'name': 'Iva',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'registrar_iva',
            },
            {
                name: 'Editar',
                permiso: 'editar_iva',
            },
            {
                name: 'Eliminar',
                permiso: 'eliminar_iva',
            },
            {
                name: 'Ver',
                permiso: 'ver_iva',
            }
        ]
    },
    // {
    //     'name': 'Clientes',
    //     'permisos': [
    //         {
    //             name: 'Registrar',
    //             permiso: 'register_clientes',
    //         },
    //         {
    //             name: 'Editar',
    //             permiso: 'edit_clientes',
    //         },
    //         {
    //             name: 'Eliminar',
    //             permiso: 'delete_clientes',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Caja',
    //     'permisos': [
    //         {
    //             name: 'Validar pagos',
    //             permiso: 'valid_payments',
    //         },
    //         {
    //             name: 'Reporte de caja',
    //             permiso: 'reports_caja',
    //         },
    //         {
    //             name: 'Historial de contratos procesados',
    //             permiso: 'record_contract_process',
    //         },
    //         {
    //             name: 'Egreso (Salida de efectivo)',
    //             permiso: 'egreso',
    //         },
    //         {
    //             name: 'Ingreso',
    //             permiso: 'ingreso',
    //         },
    //         {
    //             name: 'Cierre de caja',
    //             permiso: 'close_caja',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Proforma',
    //     'permisos': [
    //         {
    //             name: 'Registrar',
    //             permiso: 'register_proforma',
    //         },
    //         {
    //             name: 'Editar',
    //             permiso: 'edit_proforma',
    //         },
    //         {
    //             name: 'Eliminar',
    //             permiso: 'delete_proforma',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Cronograma',
    //     'permisos': [
    //         {
    //             name: 'Disponible',
    //             permiso: 'cronograma',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Comisiones',
    //     'permisos': [
    //         {
    //             name: 'Disponible',
    //             permiso: 'comisiones',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Compras',
    //     'permisos': [
    //         {
    //             name: 'Registrar',
    //             permiso: 'register_compra',
    //         },
    //         {
    //             name: 'Editar',
    //             permiso: 'edit_compra',
    //         },
    //         {
    //             name: 'Eliminar',
    //             permiso: 'delete_compra',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Transporte',
    //     'permisos': [
    //         {
    //             name: 'Registrar',
    //             permiso: 'register_transporte',
    //         },
    //         {
    //             name: 'Editar',
    //             permiso: 'edit_transporte',
    //         },
    //         {
    //             name: 'Eliminar',
    //             permiso: 'delete_transporte',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Despacho',
    //     'permisos': [
    //         {
    //             name: 'Disponible',
    //             permiso: 'despacho',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Movimientos',
    //     'permisos': [
    //         {
    //             name: 'Disponible',
    //             permiso: 'movimientos',
    //         },
    //     ]
    // },
    // {
    //     'name': 'Kardex',
    //     'permisos': [
    //         {
    //             name: 'Disponible',
    //             permiso: 'kardex',
    //         },
    //     ]
    // },


];

export function isPermission(permission: string) {

    let user_auth: User = JSON.parse(localStorage.getItem('user') ?? '');

    if (user_auth) {
        if (user_auth.role.name === 'Super-Admin') {
            return true;
        }
        if (user_auth.permissions.includes(permission)) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}