import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../core/services/translation.service';
import { ScrollService } from '../../../../core/services/scroll.service';

/**
 * FooterComponent - Rodapé moderno com links sociais e back-to-top
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="relative border-t border-[var(--color-border)] bg-[var(--color-card)]">

      <!-- Linha decorativa superior com gradiente -->
      <div class="h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

          <!-- Coluna 1: Branding -->
          <div>
            <a class="flex items-center gap-2 mb-4">
              <span class="neon-dot"></span>
              <span class="font-display font-bold text-xl text-gradient">&lt;murilo.dev /&gt;</span>
            </a>
            <p class="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
              Estudante de ADS com foco em backend, construindo soluções com Java, Spring Boot e APIs REST.
            </p>

            <!-- Tech stack -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span class="badge" *ngFor="let tech of techStack">{{ tech }}</span>
            </div>
          </div>

          <!-- Coluna 2: Navegação rápida -->
          <div>
            <h3 class="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-500">
              Navegação
            </h3>
            <ul class="space-y-2">
              <li *ngFor="let link of navLinks">
                <a
                  [href]="link.href"
                  (click)="scrollTo(link.id, $event)"
                  class="text-sm text-[var(--color-text-muted)] hover:text-primary-500 transition-colors flex items-center gap-1.5"
                >
                  <span class="material-icons text-xs">chevron_right</span>
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Coluna 3: Contato social -->
          <div>
            <h3 class="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-500">
              Redes Sociais
            </h3>
            <div class="flex flex-col gap-3">
              <a
                *ngFor="let social of socials"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-sm text-[var(--color-text-muted)]
                       hover:text-primary-500 transition-colors group"
              >
                <span class="w-8 h-8 flex items-center justify-center rounded-lg
                             bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                  <span class="material-icons text-base text-primary-500">{{ social.icon }}</span>
                </span>
                {{ social.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-[var(--color-text-muted)] text-center sm:text-left">
            {{ t('footer.made_with') }}
            <span class="text-red-500">♥</span>
            {{ t('footer.and') }} Angular
            {{ t('footer.by') }} <strong class="text-primary-500">Murilo Wisch</strong>.
            © {{ currentYear }} — {{ t('footer.rights') }}
          </p>

          <!-- Back to top -->
          <button
            (click)="scrollToTop()"
            class="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]
                   hover:text-primary-500 transition-colors group"
          >
            <span class="material-icons text-base group-hover:-translate-y-1 transition-transform">
              arrow_upward
            </span>
            {{ t('footer.back_to_top') }}
          </button>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {

  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  currentYear = new Date().getFullYear();

  techStack = ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker'];

  navLinks = [
    { id: 'home',           href: '#home',           label: 'Início' },
    { id: 'projects',       href: '#projects',       label: 'Projetos' },
    { id: 'certifications', href: '#certifications', label: 'Formação e Evolução' },
    { id: 'contact',        href: '#contact',        label: 'Contato' },
  ];

  socials = [
    { icon: 'code',            label: 'github.com/MuriloWisch', url: 'https://github.com/MuriloWisch' },
    { icon: 'work',            label: 'linkedin.com/in/murilowisch', url: 'https://www.linkedin.com/in/murilowisch/?skipRedirect=true' },
    { icon: 'alternate_email', label: 'murilowisch.dev@gmail.com', url: 'mailto:murilowisch.dev@gmail.com' },
    { icon: 'sports_esports',  label: 'Disciplina, academia e constância', url: '#' },
  ];

  t(key: string): string {
    return this.translationService.t(key);
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.scrollService.scrollTo(id);
  }

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }
}
