import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./agente.component').then(m => m.AgenteComponent),
    data: {
      title: $localize`Agente`
    }
  }
];

