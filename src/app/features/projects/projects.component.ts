import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { ScrollService } from '../../../core/services/scroll.service';

// Interface de projeto - adicione seus projetos aqui
export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;      // URL da imagem ou emoji de placeholder
  tags: string[];
  category: 'frontend' | 'backend' | 'fullstack';
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
}

/**
 * ProjectsComponent - Grid de projetos com filtro por categoria
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="py-20">
      <div class="section-container">

        <!-- Header da seção -->
        <div class="mb-12">
          <p class="font-mono text-primary-500 text-sm mb-2 reveal">// {{ t('projects.title') }}</p>
          <h2 class="section-title mb-4 reveal" style="transition-delay: 0.1s">
            {{ t('projects.title') }}
          </h2>
          <p class="text-[var(--color-text-muted)] max-w-xl reveal" style="transition-delay: 0.2s">
            {{ t('projects.subtitle') }}
          </p>
        </div>

        <!-- Filtros por categoria -->
        <div class="flex flex-wrap gap-2 mb-10 reveal" style="transition-delay: 0.3s">
          <button
            *ngFor="let filter of filters"
            (click)="setFilter(filter.value)"
            class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
            [class.bg-primary-500]="activeFilter() === filter.value"
            [class.text-gray-900]="activeFilter() === filter.value"
            [class.border-primary-500]="activeFilter() === filter.value"
            [class.border-[var(--color-border)]]="activeFilter() !== filter.value"
            [class.hover:border-primary-500]="activeFilter() !== filter.value"
            [class.text-[var(--color-text-muted)]]="activeFilter() !== filter.value"
          >
            {{ t(filter.labelKey) }}
          </button>
        </div>

        <!-- Grid de projetos -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let project of filteredProjects(); let i = index"
            class="card group cursor-pointer reveal"
            [style.transition-delay]="(i * 0.1) + 's'"
            (click)="openModal(project)"
          >
            <!-- Imagem / thumbnail -->
            <div class="h-48 rounded-t-2xl overflow-hidden relative bg-gradient-to-br
                        from-primary-500/10 to-blue-500/10 flex items-center justify-center">
              <!-- Substitua por <img [src]="project.image"> quando tiver imagens reais -->
              <span class="text-6xl">{{ project.image }}</span>

              <!-- Badge de destaque -->
              <span *ngIf="project.featured"
                    class="absolute top-3 right-3 badge text-xs">
                ⭐ Destaque
              </span>

              <!-- Overlay com ações rápidas -->
              <div class="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100
                          transition-opacity duration-300 flex items-center justify-center gap-4">
                <a
                  [href]="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="$event.stopPropagation()"
                  class="btn-primary py-2 px-4 text-sm"
                >
                  <span class="material-icons text-base">code</span>
                  {{ t('projects.view_github') }}
                </a>
                <a
                  *ngIf="project.demoUrl"
                  [href]="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="$event.stopPropagation()"
                  class="btn-outline py-2 px-4 text-sm"
                >
                  <span class="material-icons text-base">open_in_new</span>
                  {{ t('projects.view_demo') }}
                </a>
              </div>
            </div>

            <!-- Conteúdo do card -->
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 line-clamp-2">
                {{ project.description }}
              </p>

              <!-- Tags de tecnologias -->
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let tag of project.tags" class="badge text-xs">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio quando filtro não retorna resultados -->
        <div *ngIf="filteredProjects().length === 0" class="text-center py-16">
          <span class="text-5xl mb-4 block">🔍</span>
          <p class="text-[var(--color-text-muted)]">Nenhum projeto nesta categoria ainda.</p>
        </div>
      </div>

      <!-- =============================================
           MODAL de detalhes do projeto
           ============================================= -->
      <div
        *ngIf="selectedProject()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        (click)="closeModal()"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <!-- Modal content -->
        <div
          class="relative bg-[var(--color-card)] rounded-2xl max-w-2xl w-full max-h-[90vh]
                 overflow-y-auto shadow-2xl border border-[var(--color-border)]"
          (click)="$event.stopPropagation()"
        >
          <!-- Header do modal -->
          <div class="h-48 relative bg-gradient-to-br from-primary-500/20 to-blue-500/20
                      flex items-center justify-center text-6xl rounded-t-2xl">
            {{ selectedProject()!.image }}
            <button
              (click)="closeModal()"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                     bg-black/30 rounded-full hover:bg-black/50 transition-colors text-white"
            >
              <span class="material-icons text-base">close</span>
            </button>
          </div>

          <!-- Body do modal -->
          <div class="p-6">
            <h3 class="font-display text-2xl font-bold mb-3">{{ selectedProject()!.title }}</h3>
            <p class="text-[var(--color-text-muted)] leading-relaxed mb-6">
              {{ selectedProject()!.longDescription }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span *ngFor="let tag of selectedProject()!.tags" class="badge">{{ tag }}</span>
            </div>

            <!-- Botões de ação -->
            <div class="flex flex-wrap gap-3">
              <a
                [href]="selectedProject()!.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary"
              >
                <span class="material-icons text-base">code</span>
                Ver no GitHub
              </a>
              <a
                *ngIf="selectedProject()!.demoUrl"
                [href]="selectedProject()!.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline"
              >
                <span class="material-icons text-base">open_in_new</span>
                Ver Demo ao Vivo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ProjectsComponent implements OnInit {

  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  activeFilter = signal<string>('all');
  selectedProject = signal<Project | null>(null);

  filters = [
    { value: 'all',       labelKey: 'projects.filter_all' },
    { value: 'fullstack', labelKey: 'projects.filter_fullstack' },
    { value: 'frontend',  labelKey: 'projects.filter_frontend' },
    { value: 'backend',   labelKey: 'projects.filter_backend' },
  ];

  // =============================================
  // PROJETOS MOCK - Substitua pelos seus projetos reais!
  // =============================================
  projects: Project[] = [
    {
      id: 1,
      title: 'WischGym',
      description: 'Plataforma web para gestão de academias, cobrindo alunos, professores, treinos, matrículas, pagamentos e notificações em tempo real.',
      longDescription: 'Plataforma completa construída com backend em Spring Boot 3 e frontend em Angular 17+. O projeto inclui autenticação JWT com refresh token rotativo, OAuth2 com Google One Tap, Spring Security com controle por role, upload de mídia com Cloudinary, agendamentos automáticos com @Scheduled e uma camada frontend com guards de rota, interceptors HTTP e lazy loading.',
      image: '🏋️',
      tags: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'JWT', 'OAuth2', 'MySQL', 'Cloudinary'],
      category: 'fullstack',
      githubUrl: 'https://github.com/MuriloWisch/WischGym_Backend',
      demoUrl: 'https://wischgym-rjb3qdmdh-murilowischs-projects.vercel.app/',
      featured: true,
    },
    {
      id: 2,
      title: 'EcoPointMap',
      description: 'Aplicação web voltada à sustentabilidade para mapear pontos de reciclagem e facilitar o descarte correto de resíduos.',
      longDescription: 'Aplicação web criada para disponibilizar informações sobre pontos de reciclagem e promover a sustentabilidade por meio de uma navegação simples e acessível. O projeto foi construído com JavaScript, Bootstrap e HTML, com foco em organização visual, usabilidade e incentivo ao descarte consciente.',
      image: '♻️',
      tags: ['JavaScript', 'Bootstrap', 'HTML', 'Sustentabilidade'],
      category: 'frontend',
      githubUrl: 'https://github.com/MuriloWisch/EcoPointMap',
      demoUrl: 'https://icei-puc-minas-pmv-ads.github.io/pmv-ads-2025-1-e1-proj-web-t6-v2-pmv-ads-2025-1-e1-proj-ecopointmap/codigo-fonte/src/Home/index.html',
      featured: true,
    },
  ];

  // Signal computado para projetos filtrados
  filteredProjects = signal<Project[]>(this.projects);

  ngOnInit(): void {
    setTimeout(() => this.scrollService.initScrollReveal(), 100);
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  setFilter(category: string): void {
    this.activeFilter.set(category);
    if (category === 'all') {
      this.filteredProjects.set(this.projects);
    } else {
      this.filteredProjects.set(
        this.projects.filter(p => p.category === category)
      );
    }
  }

  openModal(project: Project): void {
    this.selectedProject.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }
}
