import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { ScrollService } from '../../../core/services/scroll.service';

interface JourneyItem {
  period: { pt: string; en: string };
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  description: { pt: string; en: string };
  tags: { pt: string[]; en: string[] };
  side: 'left' | 'right';
}

interface JourneyStat {
  value: { pt: string; en: string };
  label: { pt: string; en: string };
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .journey-section {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 15% 20%, rgba(5, 230, 150, 0.08), transparent 24%),
        radial-gradient(circle at 85% 30%, rgba(0, 201, 255, 0.08), transparent 24%),
        linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, var(--color-card) 8%), var(--color-surface));
    }

    .journey-section::before,
    .journey-section::after {
      content: '';
      position: absolute;
      border-radius: 999px;
      filter: blur(70px);
      opacity: 0.28;
      pointer-events: none;
      animation: journeyOrbFloat 9s ease-in-out infinite;
    }

    .journey-section::before {
      width: 240px;
      height: 240px;
      top: 80px;
      left: -60px;
      background: rgba(5, 230, 150, 0.16);
    }

    .journey-section::after {
      width: 280px;
      height: 280px;
      right: -70px;
      bottom: 40px;
      background: rgba(0, 201, 255, 0.14);
      animation-delay: 1.4s;
    }

    .journey-panel {
      position: relative;
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid color-mix(in srgb, var(--color-border) 74%, var(--color-primary) 26%);
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--color-card) 96%, white 4%), color-mix(in srgb, var(--color-card) 92%, var(--color-surface) 8%)),
        var(--color-card);
      box-shadow: 0 30px 80px color-mix(in srgb, var(--color-text) 12%, transparent);
      backdrop-filter: blur(18px);
      animation: journeyPanelFloat 6s ease-in-out infinite;
    }

    .journey-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(135deg, rgba(5, 230, 150, 0.07), transparent 35%),
        linear-gradient(315deg, rgba(0, 201, 255, 0.06), transparent 30%);
      pointer-events: none;
    }

    .journey-panel {
      padding: 2rem;
    }

    .journey-kicker {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      border: 1px solid rgba(5, 230, 150, 0.22);
      background: rgba(5, 230, 150, 0.08);
      color: color-mix(in srgb, var(--color-primary) 72%, var(--color-text) 28%);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }

    .journey-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.85rem;
      margin-top: 1.5rem;
    }

    .journey-stat {
      padding: 1rem;
      border-radius: 18px;
      border: 1px solid color-mix(in srgb, var(--color-border) 78%, var(--color-primary) 22%);
      background: color-mix(in srgb, var(--color-primary) 8%, var(--color-card) 92%);
    }

    .journey-stat strong {
      display: block;
      font-size: 1.2rem;
      color: var(--color-text);
      font-weight: 800;
    }

    .journey-stat span {
      display: block;
      margin-top: 0.25rem;
      color: var(--color-text-muted);
      font-size: 0.78rem;
    }

    .journey-timeline {
      position: relative;
      margin-top: 1.75rem;
      padding: 0.25rem 0;
    }

    .journey-timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, rgba(5, 230, 150, 0.8), rgba(0, 201, 255, 0.18));
      transform: translateX(-50%);
    }

    .journey-timeline::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #05e696;
      transform: translateX(-50%);
      box-shadow: 0 0 18px rgba(5, 230, 150, 0.6);
      animation: timelinePulse 2.4s ease-in-out infinite;
    }

    .journey-item {
      position: relative;
      width: calc(50% - 1.5rem);
      margin-bottom: 1.1rem;
      padding: 1rem 1rem 1rem 1.2rem;
      border-radius: 20px;
      border: 1px solid color-mix(in srgb, var(--color-border) 86%, var(--color-primary) 14%);
      background: color-mix(in srgb, var(--color-card) 92%, var(--color-surface) 8%);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .journey-item-left {
      margin-right: auto;
    }

    .journey-item-right {
      margin-left: auto;
    }

    .journey-item:hover {
      transform: translateY(-6px);
      border-color: rgba(5, 230, 150, 0.26);
      box-shadow: 0 18px 40px rgba(5, 230, 150, 0.08);
    }

    .journey-item::before {
      content: '';
      position: absolute;
      top: 1.15rem;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: #05e696;
      box-shadow: 0 0 0 4px rgba(5, 230, 150, 0.15), 0 0 18px rgba(5, 230, 150, 0.45);
    }

    .journey-item-left::before {
      right: -1.86rem;
    }

    .journey-item-right::before {
      left: -1.86rem;
    }

    .journey-period {
      display: inline-flex;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: color-mix(in srgb, #00c9ff 10%, var(--color-card) 90%);
      border: 1px solid rgba(0, 201, 255, 0.16);
      color: color-mix(in srgb, #00a3cc 72%, var(--color-text) 28%);
      font-size: 0.72rem;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 0.75rem;
    }

    .journey-item h3 {
      color: var(--color-text);
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 0.15rem;
    }

    .journey-item h4 {
      color: color-mix(in srgb, var(--color-text) 78%, var(--color-text-muted) 22%);
      font-size: 0.86rem;
      margin: 0 0 0.65rem;
      font-weight: 500;
    }

    .journey-item p {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      line-height: 1.7;
      margin: 0 0 0.85rem;
    }

    .journey-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .journey-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.28rem 0.7rem;
      border-radius: 999px;
      border: 1px solid rgba(5, 230, 150, 0.2);
      background: rgba(5, 230, 150, 0.08);
      color: color-mix(in srgb, var(--color-primary) 72%, var(--color-text) 28%);
      font-size: 0.72rem;
      font-family: 'JetBrains Mono', monospace;
      transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
    }

    .journey-tag:hover {
      transform: translateY(-2px);
      border-color: rgba(5, 230, 150, 0.36);
      background: rgba(5, 230, 150, 0.14);
    }

    .journey-stat {
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .journey-stat:hover {
      transform: translateY(-4px);
      border-color: rgba(5, 230, 150, 0.28);
      box-shadow: 0 16px 36px rgba(5, 230, 150, 0.08);
    }

    @keyframes journeyOrbFloat {
      0%, 100% {
        transform: translate3d(0, 0, 0);
      }
      50% {
        transform: translate3d(14px, -18px, 0);
      }
    }

    @keyframes journeyPanelFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-4px);
      }
    }

    @keyframes timelinePulse {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 18px rgba(5, 230, 150, 0.6);
      }
      50% {
        opacity: 0.72;
        box-shadow: 0 0 28px rgba(5, 230, 150, 0.9);
      }
    }

    @media (max-width: 768px) {
      .journey-panel {
        border-radius: 22px;
      }

      .journey-panel {
        padding: 1.25rem;
      }

      .journey-stats {
        grid-template-columns: 1fr;
      }

      .journey-timeline {
        padding-left: 1.2rem;
      }

      .journey-timeline::before {
        left: 0.2rem;
        transform: none;
      }

      .journey-timeline::after {
        left: 0.2rem;
        transform: translateX(-40%);
      }

      .journey-item,
      .journey-item-left,
      .journey-item-right {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
      }

      .journey-item::before,
      .journey-item-left::before,
      .journey-item-right::before {
        left: -1.42rem;
        right: auto;
      }
    }
  `],
  template: `
    <section id="certifications" class="py-20 journey-section">
      <div class="section-container">
        <div class="mb-12">
          <p class="font-mono text-primary-500 text-sm mb-2 reveal">// {{ t('certifications.title') }}</p>
          <h2 class="section-title mb-4 reveal" style="transition-delay: 0.1s">
            {{ t('certifications.title') }}
          </h2>
          <p class="text-[var(--color-text-muted)] max-w-2xl reveal" style="transition-delay: 0.2s">
            {{ t('certifications.subtitle') }}
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="journey-panel reveal" style="transition-delay: 0.1s">
            <div class="relative z-10">
              <span class="journey-kicker">{{ currentLang() === 'en' ? 'Education in progress' : 'Formacao em andamento' }}</span>

              <div class="journey-stats">
                <div class="journey-stat" *ngFor="let stat of journeyStats">
                  <strong>{{ text(stat.value) }}</strong>
                  <span>{{ text(stat.label) }}</span>
                </div>
              </div>

              <div class="journey-timeline">
                <article
                  class="journey-item"
                  *ngFor="let item of journey"
                  [class.journey-item-left]="item.side === 'left'"
                  [class.journey-item-right]="item.side === 'right'"
                >
                  <span class="journey-period">{{ text(item.period) }}</span>
                  <h3>{{ text(item.title) }}</h3>
                  <h4>{{ text(item.subtitle) }}</h4>
                  <p>{{ text(item.description) }}</p>
                  <div class="journey-tags">
                    <span class="journey-tag" *ngFor="let tag of tags(item.tags)">{{ tag }}</span>
                  </div>
                </article>
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
  currentLang = this.translationService.currentLang;

  journeyStats: JourneyStat[] = [
    {
      value: { pt: 'PUC Minas', en: 'PUC Minas' },
      label: { pt: 'Instituicao', en: 'Institution' },
    },
    {
      value: { pt: '3o periodo', en: '3rd semester' },
      label: { pt: 'Fase atual', en: 'Current stage' },
    },
    {
      value: { pt: 'Backend', en: 'Backend' },
      label: { pt: 'Direcao principal', en: 'Main direction' },
    },
  ];

  journey: JourneyItem[] = [
    {
      period: { pt: 'Agora', en: 'Now' },
      title: { pt: 'Analise e Desenvolvimento de Sistemas', en: 'Analysis and Systems Development' },
      subtitle: { pt: 'PUC Minas', en: 'PUC Minas' },
      description: {
        pt: 'Na faculdade, venho desenvolvendo base pratica em criacao de solucoes reais, trabalho em equipe, desenvolvimento de software, banco de dados e contato com tecnologias como C# e React Native em projetos e atividades.',
        en: 'At university, I have been building a practical foundation in creating real solutions, teamwork, software development, databases, and technologies such as C# and React Native through projects and coursework.',
      },
      tags: {
        pt: ['Trabalho em equipe', 'C#', 'React Native', 'Banco de Dados', 'Solucoes reais'],
        en: ['Teamwork', 'C#', 'React Native', 'Databases', 'Real solutions'],
      },
      side: 'left',
    },
    {
      period: { pt: 'Foco principal', en: 'Main focus' },
      title: { pt: 'Especializacao em Backend', en: 'Backend specialization' },
      subtitle: { pt: 'Projetos, estudos praticos e evolucao tecnica', en: 'Projects, hands-on study, and technical growth' },
      description: {
        pt: 'Direcionando a formacao para Java e Spring Boot, com experiencia em APIs REST, integracao com banco de dados, autenticacao e organizacao de arquitetura.',
        en: 'Directing my education toward Java and Spring Boot, with experience in REST APIs, database integration, authentication, and architectural organization.',
      },
      tags: {
        pt: ['Java', 'Spring Boot', 'APIs REST', 'JPA / Hibernate', 'Spring Security'],
        en: ['Java', 'Spring Boot', 'REST APIs', 'JPA / Hibernate', 'Spring Security'],
      },
      side: 'right',
    },
    {
      period: { pt: 'Complementar', en: 'Complementary' },
      title: { pt: 'Base web e integracao com frontend', en: 'Web foundation and frontend integration' },
      subtitle: { pt: 'Projetos academicos e pessoais', en: 'Academic and personal projects' },
      description: {
        pt: 'Desenvolvendo repertorio em interfaces, consumo de APIs e integracao entre frontend e backend para entregar aplicacoes completas e bem estruturadas.',
        en: 'Building experience with interfaces, API consumption, and frontend-backend integration to deliver complete and well-structured applications.',
      },
      tags: {
        pt: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS'],
        en: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Tailwind CSS'],
      },
      side: 'left',
    },
  ];

  ngOnInit(): void {
    setTimeout(() => this.scrollService.initScrollReveal(), 100);
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  text(value: { pt: string; en: string }): string {
    return this.currentLang() === 'en' ? value.en : value.pt;
  }

  tags(value: { pt: string[]; en: string[] }): string[] {
    return this.currentLang() === 'en' ? value.en : value.pt;
  }
}
