import { Routes } from "@angular/router";

// import { SettingsPage } from "../pages/settings/settings.page";

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/settings/settings.page').then((m) => m.SettingsPage)
  }
]