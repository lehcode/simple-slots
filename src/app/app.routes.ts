import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page'),
  },
  {
    path: 'game',
    loadChildren: () => import('./routes/game.routes').then((m) => m.GAME_ROUTES)
  },
  {
    path: 'settings',
    loadChildren: () => import('./routes/settings.routes').then((m) => m.SETTINGS_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
