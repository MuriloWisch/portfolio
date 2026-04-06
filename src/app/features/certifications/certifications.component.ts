import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { ScrollService } from '../../../core/services/scroll.service';

// Interface usada para representar formação, trilhas e marcos de evolução
export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issuerLogo: string;   // emoji ou URL de logo
  year: number;
  credentialUrl?: string;
  skills: string[];
  color: string;        // cor de destaque do card
  category: string;
}

/**
 * CertificationsComponent - Cards de formação e evolução técnica
 */
@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="certifications" class="py-20 bg-[var(--color-card)]">
      <div class="section-container">

        <!-- Header da seção -->
        <div class="mb-12">
          <p class="font-mono text-primary-500 text-sm mb-2 reveal">// {{ t('certifications.title') }}</p>
          <h2 class="section-title mb-4 reveal" style="transition-delay: 0.1s">
            {{ t('certifications.title') }}
          </h2>
          <p class="text-[var(--color-text-muted)] max-w-xl reveal" style="transition-delay: 0.2s">
            {{ t('certifications.subtitle') }}
          </p>
        </div>

        <!-- Estatísticas da jornada -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 reveal" style="transition-delay: 0.3s">
          <div *ngFor="let stat of certStats"
               class="text-center p-4 rounded-2xl border border-[var(--color-border)]">
            <div class="text-3xl mb-1">{{ stat.emoji }}</div>
            <div class="font-bold text-xl text-gradient">{{ stat.value }}</div>
            <div class="text-xs text-[var(--color-text-muted)] mt-1">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Grid de formação e trilhas -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let cert of certifications; let i = index"
            class="card p-6 relative overflow-hidden reveal"
            [style.transition-delay]="(i * 0.1) + 's'"
          >
            <!-- Linha de cor no topo do card -->
            <div
              class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              [style.background]="cert.color"
            ></div>

            <!-- Header do card -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <!-- Logo da instituição (emoji placeholder) -->
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  [style.background]="cert.color + '20'"
                >
                  {{ cert.issuerLogo }}
                </div>
                <div>
                  <p class="text-xs text-[var(--color-text-muted)]">{{ t('certifications.issued_by') }}</p>
                  <p class="font-semibold text-sm">{{ cert.issuer }}</p>
                </div>
              </div>

              <!-- Ano -->
              <span class="font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-border)]
                           px-2 py-1 rounded-lg">
                {{ cert.year }}
              </span>
            </div>

            <!-- Título do card -->
            <h3 class="font-bold text-base mb-3 leading-tight">{{ cert.title }}</h3>

            <!-- Skills do card -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span *ngFor="let skill of cert.skills" class="badge text-xs">{{ skill }}</span>
            </div>

            <!-- Botão de credencial -->
            <a
              *ngIf="cert.credentialUrl"
              [href]="cert.credentialUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-sm font-medium transition-colors"
              [style.color]="cert.color"
            >
              <span class="material-icons text-base">verified</span>
              {{ t('certifications.view_credential') }}
              <span class="material-icons text-sm">open_in_new</span>
            </a>
          </div>
        </div>

        <!-- Seção de progresso / aprendizado contínuo -->
        <div class="mt-16 p-8 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r
                    from-primary-500/5 to-blue-500/5 reveal">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div class="text-5xl">🎯</div>
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1">Aprendizado Contínuo</h3>
              <p class="text-[var(--color-text-muted)] text-sm mb-4">
                Sempre em busca de novos conhecimentos. Atualmente estudando:
              </p>
              <div class="space-y-3">
                <div *ngFor="let learning of currentLearning">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-medium flex items-center gap-1.5">
                      {{ learning.emoji }} {{ learning.name }}
                    </span>
                    <span class="text-primary-500 font-mono">{{ learning.progress }}%</span>
                  </div>
                  <div class="h-1.5 bg-[var(--color-border)] rounded-full">
                    <div
                      class="h-full rounded-full transition-all duration-1000"
                      [style.width]="learning.progress + '%'"
                      [style.background]="'linear-gradient(90deg, #05e696, #00c9ff)'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CertificationsComponent implements OnInit {

  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  certStats = [
    { emoji: '🎓', value: 'PUC', label: 'Instituição' },
    { emoji: '📚', value: '3º',  label: 'Período atual' },
    { emoji: '🎯', value: '1ª',  label: 'Oportunidade buscada' },
    { emoji: '⚙️', value: 'Backend', label: 'Foco técnico' },
  ];

  // =============================================
  // Formação e marcos reais
  // =============================================
  certifications: Certification[] = [
    {
      id: 1,
      title: 'Análise e Desenvolvimento de Sistemas',
      issuer: 'PUC Minas',
      issuerLogo: '🎓',
      year: 2026,
      skills: ['ADS', 'Lógica', 'Banco de Dados', 'Desenvolvimento Web'],
      color: '#05E696',
      category: 'education',
    },
    {
      id: 2,
      title: 'Trilha Backend com Java e Spring Boot',
      issuer: 'Projetos e estudos práticos',
      issuerLogo: '☕',
      year: 2026,
      skills: ['Java', 'Spring Boot', 'APIs REST', 'Spring Security', 'JPA / Hibernate'],
      color: '#F59E0B',
      category: 'backend',
    },
    {
      id: 3,
      title: 'Base Web e Integração com Frontend',
      issuer: 'Projetos acadêmicos e pessoais',
      issuerLogo: '🅰️',
      year: 2026,
      skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS'],
      color: '#3B82F6',
      category: 'frontend',
    },
  ];

  // Cursos em andamento
  currentLearning = [
    { emoji: '🔐', name: 'Spring Security, OAuth2 e JWT', progress: 82 },
    { emoji: '🧩', name: 'Microserviços e arquitetura em camadas', progress: 74 },
    { emoji: '🐳', name: 'Docker, CI/CD e boas práticas de deploy', progress: 63 },
  ];

  ngOnInit(): void {
    setTimeout(() => this.scrollService.initScrollReveal(), 100);
  }

  t(key: string): string {
    return this.translationService.t(key);
  }
}
