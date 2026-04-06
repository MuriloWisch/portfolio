import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { ScrollService } from '../../../../core/services/scroll.service';

/**
 * HeaderComponent - Navegação fixa com scroll reveal, dark mode toggle e i18n
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Header fixo com glassmorphism ao fazer scroll -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.scrolled]="isScrolled"
      [class.bg-white]="isScrolled && !themeService.isDark()"
      [class.dark:bg-gray-900]="isScrolled"
      [class.shadow-lg]="isScrolled"
      [class.bg-transparent]="!isScrolled"
    >
      <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">

        <!-- Logo / Nome -->
        <a
          href="#home"
          (click)="scrollTo('home', $event)"
          class="flex items-center gap-2 group"
        >
          <!-- Ícone decorativo animado -->
          <span class="neon-dot group-hover:scale-150 transition-transform duration-300"></span>
          <span class="font-display font-bold text-xl text-gradient">
            &lt;murilo.dev /&gt;
          </span>
        </a>

        <!-- Links de navegação - Desktop -->
        <ul class="hidden md:flex items-center gap-1">
          <li *ngFor="let item of navItems">
            <a
              [href]="'#' + item.id"
              (click)="scrollTo(item.id, $event)"
              class="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                     hover:text-primary-500 hover:bg-primary-500/10"
              [class.text-primary-500]="activeSection === item.id"
            >
              {{ t(item.labelKey) }}
            </a>
          </li>
        </ul>

        <!-- Ações direita: Tema + Idioma + CV -->
        <div class="flex items-center gap-2">

          <!-- Toggle de idioma -->
          <button
            (click)="toggleLang()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current
                   text-xs font-mono font-medium transition-all duration-200
                   hover:border-primary-500 hover:text-primary-500"
            [title]="t('lang.switch_to')"
          >
            <span class="text-base">{{ currentLang() === 'pt-BR' ? '🇧🇷' : '🇺🇸' }}</span>
            <span>{{ currentLang() === 'pt-BR' ? 'PT' : 'EN' }}</span>
          </button>

          <!-- Toggle de tema -->
          <button
            (click)="themeService.toggle()"
            class="w-9 h-9 flex items-center justify-center rounded-full
                   transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500"
            [title]="themeService.isDark() ? t('theme.light') : t('theme.dark')"
          >
            <span class="material-icons text-xl">
              {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>

          <!-- Botão Download CV - Desktop apenas -->
          <a
            href="/assets/cv.pdf"
            download
            class="hidden md:flex btn-primary text-sm py-2 px-4"
          >
            <span class="material-icons text-base">download</span>
            {{ t('nav.download_cv') }}
          </a>

          <!-- Menu hamburguer - Mobile -->
          <button
            (click)="toggleMenu()"
            class="md:hidden w-9 h-9 flex items-center justify-center rounded-full
                   hover:bg-primary-500/10 transition-colors"
          >
            <span class="material-icons">{{ menuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </nav>

      <!-- Menu Mobile -->
      <div
        class="md:hidden transition-all duration-300 overflow-hidden"
        [class.max-h-96]="menuOpen"
        [class.max-h-0]="!menuOpen"
        [class.bg-white]="!themeService.isDark()"
        [class.dark:bg-gray-900]="true"
      >
        <ul class="px-4 pb-4 flex flex-col gap-1">
          <li *ngFor="let item of navItems">
            <a
              [href]="'#' + item.id"
              (click)="scrollTo(item.id, $event); menuOpen = false"
              class="block px-4 py-3 rounded-lg text-sm font-medium
                     hover:text-primary-500 hover:bg-primary-500/10 transition-all"
            >
              {{ t(item.labelKey) }}
            </a>
          </li>
          <li>
            <a href="/assets/cv.pdf" download class="btn-primary text-sm py-2 w-full justify-center mt-2">
              <span class="material-icons text-base">download</span>
              {{ t('nav.download_cv') }}
            </a>
          </li>
        </ul>
      </div>
    </header>
  `,
  styles: [`
    header {
      backdrop-filter: blur(0px);
      transition: backdrop-filter 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    }
    header.scrolled {
      backdrop-filter: blur(12px);
    }
    .nav-link {
      color: inherit;
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: calc(100% - 32px);
      height: 2px;
      background: var(--color-primary);
      border-radius: 1px;
      transition: transform 0.2s ease;
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      transform: translateX(-50%) scaleX(1);
    }
  `]
})
export class HeaderComponent implements OnInit {

  themeService = inject(ThemeService);
  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  isScrolled = false;
  menuOpen = false;
  activeSection = 'home';

  // Links de navegação - configure aqui os IDs das seções
  navItems = [
    { id: 'home',           labelKey: 'nav.home' },
    { id: 'projects',       labelKey: 'nav.projects' },
    { id: 'certifications', labelKey: 'nav.certifications' },
    { id: 'contact',        labelKey: 'nav.contact' },
  ];

  // Expõe o signal de idioma atual ao template
  currentLang = this.translationService.currentLang;

  ngOnInit(): void {
    this.detectActiveSection();
  }

  /** Tradução via serviço */
  t(key: string): string {
    return this.translationService.t(key);
  }

  /** Alterna o idioma */
  async toggleLang(): Promise<void> {
    await this.translationService.toggleLanguage();
  }

  /** Controla visibilidade do header ao scrollar */
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
    this.detectActiveSection();
  }

  /** Detecta qual seção está visível para destacar o link ativo */
  private detectActiveSection(): void {
    const sections = ['home', 'projects', 'certifications', 'contact'];

    for (const id of [...sections].reverse()) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) {
        this.activeSection = id;
        break;
      }
    }
  }

  /** Scroll suave para a seção */
  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollTo(id);
  }

  /** Toggle do menu mobile */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
