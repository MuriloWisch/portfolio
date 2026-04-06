import { Routes } from '@angular/router';

/**
 * Rotas da aplicação
 * O portfólio usa uma única página (SPA) com scroll suave entre seções.
 * As rotas abaixo são para navegação via URL direta.
 */
export const routes: Routes = [
  {
    path: '',
    // Lazy load do componente principal que contém todas as seções
    loadComponent: () =>
      import('./features/home/portfolio-page.component').then(m => m.PortfolioPageComponent),
    title: 'Murilo Wisch | Backend Developer',
  },
  {
    // Redireciona qualquer rota desconhecida para a home
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
