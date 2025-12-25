import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/components/auth/auth.guard';
import { AuthLayoutComponent } from '../components/layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from '../components/layout/admin-layout/admin-layout.component';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';

export const contentRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('../../components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../components/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'masters',
        loadChildren: () =>
          import('../../components/masters/masters.module').then(
            (m) => m.MastersModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../../components/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../components/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../../components/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('../../components/sales/sales.module').then(
            (m) => m.SalesModule
          ),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('../../components/invoice/invoice.module').then(
            (m) => m.InvoiceModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../../components//reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
