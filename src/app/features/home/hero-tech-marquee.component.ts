import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';

interface TechCardItem {
  label: string;
  summary: {
    pt: string;
    en: string;
  };
  accent: string;
  deviconClass?: string;
  materialIcon?: string;
  fallbackText?: string;
}

@Component({
  selector: 'app-hero-tech-marquee',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: block;
    }

    .marquee-section {
      position: relative;
      padding: 1rem 0 1.2rem;
      border-top: 1px solid color-mix(in srgb, var(--color-border) 72%, var(--color-primary) 28%);
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-surface) 0%, transparent),
          color-mix(in srgb, var(--color-surface) 24%, transparent) 18%,
          color-mix(in srgb, var(--color-card) 90%, var(--color-surface) 10%) 58%,
          color-mix(in srgb, var(--color-card) 96%, var(--color-surface) 4%)
        );
      overflow: hidden;
    }

    :host-context(.dark) .marquee-section {
      border-top: 1px solid rgba(5, 230, 150, 0.08);
      background: linear-gradient(180deg, rgba(10, 15, 30, 0), rgba(10, 15, 30, 0.88) 34%, rgba(10, 15, 30, 0.96));
    }

    .marquee-shell {
      position: relative;
      overflow: hidden;
      padding: 0 1.25rem;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: techMarquee 40s linear infinite;
      will-change: transform;
    }

    .marquee-shell:hover .marquee-track {
      animation-play-state: paused;
    }

    .marquee-shell-static .marquee-track {
      animation-play-state: paused;
    }

    .marquee-set {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      padding-right: 1rem;
    }

    .tech-card {
      --tech-accent: #05e696;
      width: 15rem;
      min-width: 15rem;
      border-radius: 1.35rem;
      border: 1px solid color-mix(in srgb, var(--tech-accent) 28%, var(--color-border) 72%);
      background: color-mix(in srgb, var(--color-card) 96%, var(--color-surface) 4%);
      box-shadow: 0 16px 40px rgba(2, 8, 23, 0.14);
      overflow: hidden;
      transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
    }

    :host-context(.dark) .tech-card {
      border: 1px solid color-mix(in srgb, var(--tech-accent) 30%, rgba(255, 255, 255, 0.06));
      background: #111a2d;
      box-shadow: 0 16px 40px rgba(2, 8, 23, 0.22);
    }

    .tech-card:not(.tech-card-expanded):hover,
    .tech-card:not(.tech-card-expanded):focus-within {
      transform: translateY(-6px) scale(1.02);
      border-color: color-mix(in srgb, var(--tech-accent) 55%, rgba(255, 255, 255, 0.08));
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--tech-accent) 18%, transparent),
        0 22px 50px color-mix(in srgb, var(--tech-accent) 12%, transparent);
    }

    .tech-card-expanded {
      border: 1px solid transparent;
      background: color-mix(in srgb, var(--color-card) 96%, var(--color-surface) 4%);
      box-shadow: 0 16px 40px rgba(2, 8, 23, 0.14);
      transform: none;
    }

    :host-context(.dark) .tech-card-expanded {
      border: 1px solid transparent;
      background: #111a2d;
      box-shadow: 0 16px 40px rgba(2, 8, 23, 0.22);
    }

    .tech-card-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding: 1rem 1rem 0.95rem;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      text-align: left;
      font: inherit;
    }

    .tech-card-trigger:focus-visible {
      outline: none;
    }

    .tech-card-top {
      flex: 1;
      min-width: 0;
    }

    .tech-card-name {
      display: block;
      color: var(--color-text);
      font-size: 0.92rem;
      font-weight: 800;
      letter-spacing: 0.01em;
      font-family: 'JetBrains Mono', monospace;
    }

    :host-context(.dark) .tech-card-name {
      color: #e2e8f0;
    }

    .tech-card-icon {
      width: 2.6rem;
      height: 2.6rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.95rem;
      background: color-mix(in srgb, var(--tech-accent) 14%, var(--color-card) 86%);
      color: var(--tech-accent);
      font-size: 0.8rem;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 0 20px color-mix(in srgb, var(--tech-accent) 18%, transparent);
      flex-shrink: 0;
    }

    :host-context(.dark) .tech-card-icon {
      background: color-mix(in srgb, var(--tech-accent) 16%, rgba(255, 255, 255, 0.03));
    }

    .tech-card-icon i {
      font-size: 1.25rem;
    }

    .tech-card-chevron {
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: color-mix(in srgb, var(--tech-accent) 78%, var(--color-text) 22%);
      background: color-mix(in srgb, var(--tech-accent) 10%, var(--color-card) 90%);
      transition: transform 0.22s ease, background 0.22s ease;
      flex-shrink: 0;
    }

    :host-context(.dark) .tech-card-chevron {
      color: color-mix(in srgb, var(--tech-accent) 88%, #ffffff 12%);
      background: color-mix(in srgb, var(--tech-accent) 12%, rgba(255, 255, 255, 0.02));
    }

    .tech-card-expanded .tech-card-chevron {
      transform: rotate(180deg);
      background: transparent;
    }

    .tech-card-summary {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.26s ease;
    }

    .tech-card-expanded .tech-card-summary {
      margin-top: -0.35rem;
    }

    .tech-card-summary-inner {
      overflow: hidden;
    }

    .tech-card-summary-content {
      padding: 0 1rem 1rem;
      color: var(--color-text-muted);
      font-size: 0.84rem;
      line-height: 1.65;
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 0.18s ease, transform 0.18s ease;
    }

    :host-context(.dark) .tech-card-summary-content {
      color: #cbd5e1;
    }

    .tech-card-expanded .tech-card-summary {
      grid-template-rows: 1fr;
    }

    .tech-card-expanded .tech-card-summary-content {
      padding-top: 0.35rem;
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.08s;
    }

    .marquee-fade {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 6rem;
      z-index: 1;
      pointer-events: none;
    }

    .marquee-fade-left {
      left: 0;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-card) 97%, var(--color-surface) 3%),
        color-mix(in srgb, var(--color-card) 0%, transparent)
      );
    }

    :host-context(.dark) .marquee-fade-left {
      background: linear-gradient(90deg, rgba(10, 15, 30, 1), rgba(10, 15, 30, 0));
    }

    .marquee-fade-right {
      right: 0;
      background: linear-gradient(
        270deg,
        color-mix(in srgb, var(--color-card) 97%, var(--color-surface) 3%),
        color-mix(in srgb, var(--color-card) 0%, transparent)
      );
    }

    :host-context(.dark) .marquee-fade-right {
      background: linear-gradient(270deg, rgba(10, 15, 30, 1), rgba(10, 15, 30, 0));
    }

    @keyframes techMarquee {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 768px) {
      .marquee-section {
        padding: 0.9rem 0 1rem;
      }

      .marquee-shell {
        padding: 0 0.75rem;
      }

      .marquee-set {
        gap: 0.75rem;
        padding-right: 0.75rem;
      }

      .tech-card {
        width: 13.5rem;
        min-width: 13.5rem;
      }

      .tech-card-trigger {
        padding: 0.9rem 0.9rem 0.85rem;
      }

      .tech-card-summary-content {
        padding: 0 0.9rem 0.9rem;
        font-size: 0.8rem;
      }

      .marquee-fade {
        width: 2.5rem;
      }
    }
  `],
  template: `
    <section class="marquee-section">
      <div class="marquee-fade marquee-fade-left"></div>
      <div class="marquee-fade marquee-fade-right"></div>

      <div class="marquee-shell" [class.marquee-shell-static]="expandedCardId !== null">
        <div class="marquee-track">
          <div class="marquee-set" *ngFor="let clone of marqueeClones; let cloneIndex = index">
            <article
              *ngFor="let tech of technologies"
              class="tech-card"
              [style.--tech-accent]="tech.accent"
              [class.tech-card-expanded]="expandedCardId === buildCardId(cloneIndex, tech.label)"
            >
              <button
                type="button"
                class="tech-card-trigger"
                [attr.aria-expanded]="expandedCardId === buildCardId(cloneIndex, tech.label)"
                (click)="toggleCard(buildCardId(cloneIndex, tech.label))"
              >
                <span class="tech-card-icon">
                  <i *ngIf="tech.deviconClass" [class]="tech.deviconClass"></i>
                  <span *ngIf="!tech.deviconClass && tech.materialIcon" class="material-icons">{{ tech.materialIcon }}</span>
                  <span *ngIf="!tech.deviconClass && !tech.materialIcon">{{ tech.fallbackText }}</span>
                </span>

                <span class="tech-card-top">
                  <span class="tech-card-name">{{ tech.label }}</span>
                </span>

                <span class="tech-card-chevron material-icons">expand_more</span>
              </button>

              <div class="tech-card-summary">
                <div class="tech-card-summary-inner">
                  <div class="tech-card-summary-content">
                    {{ getSummary(tech) }}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroTechMarqueeComponent {
  private elementRef = inject(ElementRef<HTMLElement>);
  private translationService = inject(TranslationService);

  expandedCardId: string | null = null;
  marqueeClones = [0, 1];

  technologies: TechCardItem[] = [
    { label: 'Java', accent: '#f97316', deviconClass: 'devicon-java-plain', summary: { pt: 'Linguagem usada para construir a base das minhas APIs, regras de negocio e aplicacoes backend com foco em robustez e manutencao.', en: 'Language I use to build the foundation of my APIs, business rules, and backend applications with a focus on robustness and maintainability.' } },
    { label: 'Spring Boot', accent: '#22c55e', deviconClass: 'devicon-spring-original', summary: { pt: 'Framework que acelera o desenvolvimento backend com configuracao produtiva, organizacao da aplicacao e criacao rapida de APIs.', en: 'Framework that speeds up backend development with productive configuration, application structure, and fast API creation.' } },
    { label: 'Spring Security', accent: '#10b981', materialIcon: 'shield', fallbackText: 'SS', summary: { pt: 'Camada de seguranca que protege rotas, controla autenticacao e autorizacao e ajuda a manter o backend mais seguro.', en: 'Security layer that protects routes, controls authentication and authorization, and helps keep the backend safer.' } },
    { label: 'JPA / Hibernate', accent: '#38bdf8', materialIcon: 'database', fallbackText: 'JPA', summary: { pt: 'Tecnologias usadas para mapear entidades e facilitar a comunicacao entre o backend e bancos de dados relacionais.', en: 'Technologies used to map entities and make communication between the backend and relational databases easier.' } },
    { label: 'REST API', accent: '#06b6d4', materialIcon: 'api', fallbackText: 'API', summary: { pt: 'Padrao de comunicacao que permite integrar frontend, backend e outros sistemas por meio de endpoints organizados.', en: 'Communication pattern that allows frontend, backend, and other systems to integrate through organized endpoints.' } },
    { label: 'OAuth2', accent: '#14b8a6', materialIcon: 'verified_user', fallbackText: 'OA', summary: { pt: 'Protocolo de autorizacao que ajuda a implementar login seguro e integracao com provedores externos.', en: 'Authorization protocol that helps implement secure login and integration with external providers.' } },
    { label: 'JWT', accent: '#34d399', materialIcon: 'key', fallbackText: 'JWT', summary: { pt: 'Token usado para autenticacao stateless, permitindo validar sessoes e acesso em APIs de forma segura.', en: 'Token used for stateless authentication, allowing secure session and access validation in APIs.' } },
    { label: 'Microserviços', accent: '#22c55e', materialIcon: 'hub', fallbackText: 'MS', summary: { pt: 'Arquitetura que divide o sistema em servicos menores para facilitar escala, manutencao e evolucao do projeto.', en: 'Architecture that splits the system into smaller services to improve scalability, maintenance, and evolution.' } },
    { label: 'MySQL', accent: '#60a5fa', deviconClass: 'devicon-mysql-original', summary: { pt: 'Banco relacional utilizado para armazenar dados estruturados com consultas eficientes e boa organizacao.', en: 'Relational database used to store structured data with efficient queries and solid organization.' } },
    { label: 'PostgreSQL', accent: '#818cf8', deviconClass: 'devicon-postgresql-plain', summary: { pt: 'Banco relacional robusto, muito util para persistencia confiavel, modelagem bem definida e consultas avancadas.', en: 'Robust relational database, very useful for reliable persistence, well-defined modeling, and advanced queries.' } },
    { label: 'Git', accent: '#f97316', deviconClass: 'devicon-git-plain', summary: { pt: 'Ferramenta de versionamento usada para acompanhar mudancas, criar branches e manter o historico do codigo.', en: 'Version control tool used to track changes, create branches, and keep the code history organized.' } },
    { label: 'GitHub', accent: '#94a3b8', deviconClass: 'devicon-github-original', summary: { pt: 'Plataforma onde hospedo repositorios, compartilho projetos e organizo colaboracao e entregas de codigo.', en: 'Platform where I host repositories, share projects, and organize collaboration and code delivery.' } },
    { label: 'CI/CD', accent: '#2dd4bf', materialIcon: 'published_with_changes', fallbackText: 'CI', summary: { pt: 'Conjunto de praticas para automatizar validacoes, integracoes e deploys, deixando a entrega mais confiavel.', en: 'Set of practices to automate validations, integrations, and deployments, making delivery more reliable.' } },
    { label: 'Docker', accent: '#38bdf8', deviconClass: 'devicon-docker-plain', summary: { pt: 'Ferramenta de conteinerizacao que padroniza ambientes e facilita execucao, teste e distribuicao da aplicacao.', en: 'Containerization tool that standardizes environments and makes application execution, testing, and distribution easier.' } },
    { label: 'Postman', accent: '#fb923c', deviconClass: 'devicon-postman-plain', summary: { pt: 'Ferramenta utilizada para testar endpoints, enviar requisicoes e validar o comportamento das APIs.', en: 'Tool used to test endpoints, send requests, and validate API behavior.' } },
    { label: 'Maven', accent: '#f87171', materialIcon: 'build', fallbackText: 'MV', summary: { pt: 'Gerenciador de dependencias e build que organiza pacotes, plugins e o ciclo de vida dos projetos Java.', en: 'Dependency and build manager that organizes packages, plugins, and the lifecycle of Java projects.' } },
    { label: 'Swagger', accent: '#84cc16', materialIcon: 'description', fallbackText: 'SW', summary: { pt: 'Ferramenta para documentar APIs e facilitar a visualizacao e teste dos endpoints de forma clara.', en: 'Tool for documenting APIs and making endpoint visualization and testing clearer and easier.' } },
    { label: 'Angular', accent: '#f43f5e', deviconClass: 'devicon-angularjs-plain', summary: { pt: 'Framework frontend usado para criar interfaces estruturadas, reativas e bem integradas com APIs.', en: 'Frontend framework used to create structured, reactive interfaces that integrate well with APIs.' } },
    { label: 'TypeScript', accent: '#60a5fa', deviconClass: 'devicon-typescript-plain', summary: { pt: 'Superset do JavaScript com tipagem, deixando o codigo mais seguro, legivel e facil de manter.', en: 'JavaScript superset with typing that makes code safer, more readable, and easier to maintain.' } },
    { label: 'JavaScript', accent: '#facc15', deviconClass: 'devicon-javascript-plain', summary: { pt: 'Linguagem base da web, essencial para interacoes, logica de interface e comportamento do frontend.', en: 'Core language of the web, essential for interactions, interface logic, and frontend behavior.' } },
    { label: 'HTML', accent: '#fb7185', deviconClass: 'devicon-html5-plain', summary: { pt: 'Responsavel pela estrutura semantica das paginas e pela organizacao do conteudo das interfaces.', en: 'Responsible for the semantic structure of pages and the organization of interface content.' } },
    { label: 'CSS', accent: '#38bdf8', deviconClass: 'devicon-css3-plain', summary: { pt: 'Usado para estilizar interfaces, criar responsividade e dar acabamento visual mais profissional.', en: 'Used to style interfaces, create responsiveness, and give a more polished visual finish.' } },
    { label: 'Bootstrap', accent: '#a78bfa', deviconClass: 'devicon-bootstrap-plain', summary: { pt: 'Framework CSS que acelera a criacao de layouts responsivos com componentes prontos e consistentes.', en: 'CSS framework that speeds up responsive layout creation with ready-made and consistent components.' } },
    { label: 'Tailwind CSS', accent: '#22d3ee', deviconClass: 'devicon-tailwindcss-original', summary: { pt: 'Framework utility-first que permite construir interfaces modernas com velocidade e maior controle visual.', en: 'Utility-first framework that helps build modern interfaces with speed and greater visual control.' } },
    { label: 'React Native', accent: '#67e8f9', deviconClass: 'devicon-react-original', summary: { pt: 'Tecnologia voltada para apps mobile multiplataforma, ampliando meu repertorio alem do desenvolvimento web.', en: 'Technology focused on cross-platform mobile apps, expanding my repertoire beyond web development.' } },
  ];

  buildCardId(cloneIndex: number, label: string): string {
    return `${cloneIndex}-${label}`;
  }

  toggleCard(cardId: string): void {
    this.expandedCardId = this.expandedCardId === cardId ? null : cardId;
  }

  getSummary(tech: TechCardItem): string {
    return this.translationService.currentLang() === 'en'
      ? tech.summary.en
      : tech.summary.pt;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (!target) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.expandedCardId = null;
    }
  }
}
