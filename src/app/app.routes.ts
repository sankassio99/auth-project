import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';

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
