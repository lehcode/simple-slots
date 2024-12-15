import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/game',
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadChildren: () => import('./routes/game.routes').then((m) => m.GAME_ROUTES)
  },
  {
    path: 'settings',
    loadChildren: () => import('./routes/settings.routes').then((m) => m.SETTINGS_ROUTES)
  }
];
