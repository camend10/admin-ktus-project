import { Routes } from '@angular/router';
import { verificaTokenGuard } from '../guards/verifica-token.guard';
import { AuthGuard } from '../modules/auth/services/auth.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },

  // MIS MODULOS localhost:4200/roles/listar
  {
    path: 'roles',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
  },
  // MIS MODULOS localhost:4200/usuarios/listar
  {
    path: 'usuarios',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
  },
  // Configuraciones
  {
    path: 'configuraciones',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/configuracion/configuracion.module').then((m) => m.ConfiguracionModule),
  },
  {
    path: 'articulos',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/articulos/articulos.module').then((m) => m.ArticulosModule),
  },
  {
    path: 'clientes',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/clientes/clientes.module').then((m) => m.ClientesModule),
  },
  {
    path: 'facturas',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/facturas/facturas.module').then((m) => m.FacturasModule),
  },  
  {
    path: 'movimientos',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/movimientos/movimientos.module').then((m) => m.MovimientosModule),
  },  
  {
    path: 'solicitudes',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/solicitudes/solicitudes.module').then((m) => m.SolicitudesModule),
  },  
  {
    path: 'plantillas',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/plantillas/plantillas.module').then((m) => m.PlantillasModule),
  },
  {
    path: 'conversiones',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/conversiones/conversiones.module').then((m) => m.ConversionesModule),
  },  
  {
    path: 'kardex',
    canActivate: [verificaTokenGuard],
    loadChildren: () => import('../modules/kardex/kardex.module').then((m) => m.KardexModule),
  },  
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
