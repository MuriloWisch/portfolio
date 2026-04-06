import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TranslationService } from '../core/services/translation.service';

/**
 * AppComponent - Componente raiz da aplicação
 * Inicializa serviços globais e monta o layout principal
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <!-- Layout principal com header fixo e footer -->
    <div class="flex flex-col min-h-screen">
      <app-header></app-header>
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>

    <!-- Botão flutuante "Voltar ao topo" -->
    <button
      *ngIf="showScrollTop"
      (click)="scrollToTop()"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center
             bg-primary-500 text-gray-900 rounded-full shadow-lg
             hover:bg-primary-400 hover:scale-110 transition-all duration-200"
      title="Voltar ao topo"
    >
      <span class="material-icons">arrow_upward</span>
    </button>
  `,
  host: {
    // Ouve o evento de scroll na janela para mostrar/ocultar o botão
    '(window:scroll)': 'onScroll()'
  }
})
export class AppComponent implements OnInit {

  private translationService = inject(TranslationService);

  showScrollTop = false;

  async ngOnInit(): Promise<void> {
    // Carrega as traduções no idioma padrão (PT-BR)
    // O serviço verifica automaticamente o LocalStorage para idioma salvo
    await this.translationService.loadTranslations('pt-BR');
  }

  onScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
