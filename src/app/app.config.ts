import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

/**
 * Configuração central da aplicação Angular standalone
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Router com transições suaves entre rotas
    provideRouter(routes, withViewTransitions()),
    // HTTP client para carregar arquivos i18n
    provideHttpClient(),
    // Animações do Angular Material
    provideAnimations(),
  ],
};
