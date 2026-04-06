import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { ScrollService } from '../../../core/services/scroll.service';

/**
 * HomeComponent - Seção Hero + Sobre mim + Habilidades
 * Contém animações de scroll reveal e informações pessoais
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- =============================================
         SEÇÃO HERO
         ============================================= -->
    <section id="home" class="relative min-h-screen flex items-center hero-bg overflow-hidden">

      <!-- Decoração de fundo: esferas animadas -->
      <div class="absolute top-20 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div class="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style="animation-delay: 1s"></div>

      <div class="section-container relative w-full">
        <div class="grid lg:grid-cols-2 gap-12 items-center pt-20 lg:pt-0">

          <!-- Conteúdo principal -->
          <div class="order-2 lg:order-1">

            <!-- Badge de disponibilidade -->
            <div class="flex items-center gap-2 mb-6 reveal" style="transition-delay: 0s">
              <span class="flex h-2.5 w-2.5">
                <span class="animate-ping absolute h-2.5 w-2.5 rounded-full bg-primary-400 opacity-75"></span>
                <span class="relative rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
              <span class="text-sm font-medium text-primary-500">{{ t('home.available') }}</span>
            </div>

            <!-- Saudação + Nome -->
            <h1 class="font-display leading-tight mb-4 reveal" style="transition-delay: 0.1s">
              <span class="text-lg font-normal text-[var(--color-text-muted)] block mb-1">
                {{ t('home.greeting') }}
              </span>
              <span class="text-5xl sm:text-6xl lg:text-7xl font-black text-[var(--color-text)]">
                {{ t('home.name') }}
              </span>
            </h1>

            <!-- Título com gradiente -->
            <h2 class="text-2xl sm:text-3xl font-bold text-gradient mb-6 reveal font-mono" style="transition-delay: 0.2s">
              &gt; {{ t('home.title') }}
            </h2>

            <!-- Descrição -->
            <p class="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-lg mb-8 reveal" style="transition-delay: 0.3s">
              {{ t('home.subtitle') }}
            </p>

            <!-- Localização -->
            <p class="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-8 reveal" style="transition-delay: 0.35s">
              <span class="material-icons text-primary-500 text-base">location_on</span>
              {{ t('home.location') }}
            </p>

            <!-- CTAs -->
            <div class="flex flex-wrap gap-4 mb-12 reveal" style="transition-delay: 0.4s">
              <button
                (click)="scrollTo('projects')"
                class="btn-primary"
              >
                <span class="material-icons text-base">rocket_launch</span>
                {{ t('home.cta_projects') }}
              </button>
              <button
                (click)="scrollTo('contact')"
                class="btn-outline"
              >
                <span class="material-icons text-base">mail_outline</span>
                {{ t('home.cta_contact') }}
              </button>
            </div>

            <!-- Stats em linha -->
            <div class="flex flex-wrap gap-8 reveal" style="transition-delay: 0.5s">
              <div *ngFor="let stat of stats" class="text-center">
                <div class="font-display text-3xl font-black text-gradient">{{ stat.value }}</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">{{ t(stat.labelKey) }}</div>
              </div>
            </div>
          </div>

          <!-- Avatar / Foto de perfil placeholder -->
          <div class="order-1 lg:order-2 flex justify-center lg:justify-end reveal" style="transition-delay: 0.2s">
            <div class="relative">
              <!-- Anel animado externo -->
              <div class="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-ping" style="animation-duration: 3s"></div>
              <!-- Anel decorativo -->
              <div class="absolute -inset-4 rounded-full border border-primary-500/20"></div>
              <div class="absolute -inset-8 rounded-full border border-primary-500/10"></div>

              <!-- Avatar com foto -->
              <div class="relative w-[26rem] h-[26rem] sm:w-[34rem] sm:h-[34rem] rounded-full overflow-hidden
                          border-4 border-primary-500/40 shadow-2xl animate-float"
                   style="box-shadow: 0 0 60px rgba(5,230,150,0.2)">
                <img
                  src="assets/murilo-portfolio.jpeg"
                  alt="Foto de Murilo Wisch"
                  class="w-full h-full object-cover"
                  style="object-position: center 39%;"
                />
              </div>

              <!-- Badge de tecnologia flutuante -->
              <div class="absolute -bottom-4 -right-4 bg-[var(--color-card)] border border-[var(--color-border)]
                          rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2">
                <span class="text-xl">⚡</span>
                <div>
                  <div class="text-xs font-bold text-[var(--color-text)]">Backend</div>
                  <div class="text-xs text-[var(--color-text-muted)]">Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador de scroll -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span class="text-xs text-[var(--color-text-muted)]">scroll</span>
          <span class="material-icons text-primary-500">expand_more</span>
        </div>
      </div>
    </section>

    <!-- =============================================
         SEÇÃO SOBRE / HABILIDADES
         ============================================= -->
    <section class="relative py-20 overflow-hidden about-tech-section">
      <div class="about-tech-orb about-tech-orb-1"></div>
      <div class="about-tech-orb about-tech-orb-2"></div>
      <div class="section-container">
        <div class="grid lg:grid-cols-2 gap-16 items-center">

          <!-- Sobre mim -->
          <div class="reveal">
            <div class="about-panel">
              <div class="about-panel-grid"></div>

              <div class="relative z-10">
                <h2 class="section-title mb-8 reveal" style="transition-delay: 0.05s">{{ t('home.about_title') }}</h2>

                <div class="about-copy-card reveal" style="transition-delay: 0.1s">
                  <span class="about-copy-line"></span>
                  <p class="text-[var(--color-text-muted)] leading-relaxed">
                    {{ t('home.about_p1') }}
                  </p>
                </div>

                <div class="about-copy-card reveal" style="transition-delay: 0.2s">
                  <span class="about-copy-line"></span>
                  <p class="text-[var(--color-text-muted)] leading-relaxed">
                    {{ t('home.about_p2') }}
                  </p>
                </div>

                <div class="about-mini-stats reveal" style="transition-delay: 0.25s">
                  <div class="about-mini-stat">
                    <span class="material-icons">school</span>
                    <div>
                      <strong>PUC Minas</strong>
                      <span>ADS em andamento</span>
                    </div>
                  </div>
                  <div class="about-mini-stat">
                    <span class="material-icons">bolt</span>
                    <div>
                      <strong>Backend First</strong>
                      <span>Java, Spring Boot e APIs</span>
                    </div>
                  </div>
                </div>

                <!-- Informações extras -->
                <div class="grid sm:grid-cols-2 gap-4 reveal" style="transition-delay: 0.3s">
                  <div *ngFor="let info of aboutInfo"
                       class="about-info-card">
                    <span class="material-icons text-primary-500 text-base">{{ info.icon }}</span>
                    <span>{{ info.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="relative">
            <div class="skills-panel">
              <div class="skills-panel-header reveal">
                <div>
                  <span class="skills-chip">Tecnologias em destaque</span>
                  <h3 class="text-xl font-bold mt-3">{{ t('home.skills_title') }}</h3>
                  <p class="skills-subtitle">
                    Minha stack organizada por especialidade, com foco principal em backend, segurança, dados e ferramentas de desenvolvimento.
                  </p>
                </div>
                <div class="skills-pulse">
                  <span></span>
                  <span>STACK PRINCIPAL</span>
                </div>
              </div>

              <div class="skills-highlights reveal" style="transition-delay: 0.08s">
                <div class="skills-highlight-card">
                  <span class="material-icons">dns</span>
                  <div>
                    <strong>Backend</strong>
                    <span>Java, Spring Boot, APIs REST</span>
                  </div>
                </div>
                <div class="skills-highlight-card">
                  <span class="material-icons">shield</span>
                  <div>
                    <strong>Seguranca</strong>
                    <span>JWT, OAuth2, Spring Security</span>
                  </div>
                </div>
                <div class="skills-highlight-card">
                  <span class="material-icons">storage</span>
                  <div>
                    <strong>Dados</strong>
                    <span>MySQL, PostgreSQL, modelagem</span>
                  </div>
                </div>
              </div>

              <div class="skills-category-grid">
                <div *ngFor="let category of skillCategories; let i = index"
                     class="reveal skills-category-card"
                     [style.transition-delay]="(i * 0.1) + 's'">
                  <div class="skills-category-top">
                    <div class="skills-category-icon">
                      <span class="material-icons">{{ category.icon }}</span>
                    </div>
                    <div>
                      <h4 class="skills-category-title">{{ category.title }}</h4>
                      <p class="skills-category-description">{{ category.description }}</p>
                    </div>
                  </div>
                  <div class="skills-category-tags">
                    <span *ngFor="let item of category.items" class="badge">{{ item }}</span>
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
export class HomeComponent implements OnInit {

  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  // ============================================
  // DADOS PESSOAIS - Substitua pelos seus!
  // ============================================

  stats = [
    { value: '3º',   labelKey: 'home.stats_years' },
    { value: '2',    labelKey: 'home.stats_projects' },
    { value: 'Backend',  labelKey: 'home.stats_clients' },
  ];

  aboutInfo = [
    { icon: 'person',        value: 'Murilo Wisch' },
    { icon: 'school',        value: 'ADS | PUC Minas' },
    { icon: 'timeline',      value: '3º período' },
    { icon: 'code',          value: 'Java + Spring Boot' },
  ];

  skillCategories = [
    {
      title: 'Backend',
      icon: 'dns',
      description: 'Base principal de desenvolvimento e construccao de APIs.',
      items: ['Java', 'Spring Boot', 'APIs REST', 'JPA / Hibernate', 'MVC', 'Microservicos'],
    },
    {
      title: 'Seguranca',
      icon: 'shield',
      description: 'Autenticacao, autorizacao e protecao de acesso.',
      items: ['Spring Security', 'OAuth2', 'JWT'],
    },
    {
      title: 'Banco de Dados',
      icon: 'storage',
      description: 'Persistencia, consultas e estruturacao de dados.',
      items: ['MySQL', 'PostgreSQL', 'Modelagem de dados'],
    },
    {
      title: 'Ferramentas',
      icon: 'build',
      description: 'Fluxo de desenvolvimento, testes de API e entrega.',
      items: ['Git', 'GitHub', 'Docker', 'CI/CD', 'Postman', 'Maven', 'Swagger'],
    },
    {
      title: 'Web',
      icon: 'web',
      description: 'Interfaces e integracao com aplicacoes frontend.',
      items: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS', 'React Native'],
    },
  ];

  ngOnInit(): void {
    // Inicializa animações de scroll reveal após renderização
    setTimeout(() => this.scrollService.initScrollReveal(), 100);
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  scrollTo(id: string): void {
    this.scrollService.scrollTo(id);
  }
}
