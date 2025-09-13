import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterWhatsapp } from './pages/register-whatsapp/register-whatsapp';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'register-whatsapp',
        loadComponent: () =>
          import('./pages/register-whatsapp/register-whatsapp').then((m) => m.RegisterWhatsapp),
      },
    ],
  },
  { path: '**', redirectTo: '/auth' },
];
