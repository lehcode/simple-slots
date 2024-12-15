import { Routes } from '@angular/router';

export const GAME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/game.component').then((m) => m.GameComponent)
  }
]