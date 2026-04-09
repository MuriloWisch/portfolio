import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslationService } from '../../../core/services/translation.service';
import { ScrollService } from '../../../core/services/scroll.service';

interface ContactInfoItem {
  icon: string;
  labelKey: string;
  value?: string;
  valueKey?: string;
  href?: string;
  external?: boolean;
}

interface SocialItem {
  icon: string;
  labelKey: string;
  url: string;
}

/**
 * ContactComponent - Formulário de contato visual + links sociais
 * O formulário abre o cliente de e-mail do usuário com os dados preenchidos.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="py-20">
      <div class="section-container">

        <!-- Header da seção -->
        <div class="mb-12">
          <p class="font-mono text-primary-500 text-sm mb-2 reveal">// {{ t('contact.title') }}</p>
          <h2 class="section-title mb-4 reveal" style="transition-delay: 0.1s">
            {{ t('contact.title') }}
          </h2>
          <p class="text-[var(--color-text-muted)] max-w-xl reveal" style="transition-delay: 0.2s">
            {{ t('contact.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-5 gap-12">

          <!-- Formulário de contato (3/5 da largura) -->
          <div class="lg:col-span-3 reveal" style="transition-delay: 0.3s">
            <form
              #contactForm="ngForm"
              (ngSubmit)="onSubmit(contactForm)"
              class="space-y-5"
            >
              <!-- Nome + Email -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5">
                    {{ t('contact.name_label') }} <span class="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    [(ngModel)]="formData.name"
                    required
                    minlength="2"
                    #nameField="ngModel"
                    [placeholder]="t('contact.name_placeholder')"
                    class="form-input"
                    [class.border-red-500]="nameField.invalid && nameField.touched"
                  >
                  <p *ngIf="nameField.invalid && nameField.touched"
                     class="text-red-500 text-xs mt-1">
                    {{ t('contact.name_error') }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-1.5">
                    {{ t('contact.email_label') }} <span class="text-primary-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    [(ngModel)]="formData.email"
                    required
                    email
                    #emailField="ngModel"
                    [placeholder]="t('contact.email_placeholder')"
                    class="form-input"
                    [class.border-red-500]="emailField.invalid && emailField.touched"
                  >
                  <p *ngIf="emailField.invalid && emailField.touched"
                     class="text-red-500 text-xs mt-1">
                    {{ t('contact.email_error') }}
                  </p>
                </div>
              </div>

              <!-- Assunto -->
              <div>
                <label class="block text-sm font-medium mb-1.5">
                  {{ t('contact.subject_label') }} <span class="text-primary-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  [(ngModel)]="formData.subject"
                  required
                  #subjectField="ngModel"
                  [placeholder]="t('contact.subject_placeholder')"
                  class="form-input"
                  [class.border-red-500]="subjectField.invalid && subjectField.touched"
                >
              </div>

              <!-- Mensagem -->
              <div>
                <label class="block text-sm font-medium mb-1.5">
                  {{ t('contact.message_label') }} <span class="text-primary-500">*</span>
                </label>
                <textarea
                  name="message"
                  [(ngModel)]="formData.message"
                  required
                  minlength="20"
                  #messageField="ngModel"
                  [placeholder]="t('contact.message_placeholder')"
                  class="form-input"
                  rows="5"
                  [class.border-red-500]="messageField.invalid && messageField.touched"
                ></textarea>
                <p *ngIf="messageField.invalid && messageField.touched"
                   class="text-red-500 text-xs mt-1">
                  {{ t('contact.message_error') }}
                </p>
              </div>

              <p class="text-sm text-[var(--color-text-muted)]">
                {{ t('contact.form_hint') }}
              </p>

              <!-- Botão de envio -->
              <button
                type="submit"
                class="btn-primary w-full justify-center py-4"
                [disabled]="contactForm.invalid"
                [class.opacity-70]="contactForm.invalid"
                [class.cursor-not-allowed]="contactForm.invalid"
              >
                <span class="material-icons text-base">send</span>
                {{ t('contact.send') }}
              </button>

              <!-- Feedback de sucesso -->
              <div
                *ngIf="submitStatus() === 'success'"
                class="flex items-center gap-3 p-4 bg-primary-500/10 border border-primary-500/30
                       rounded-xl text-primary-600 dark:text-primary-400"
              >
                <span class="material-icons text-primary-500">check_circle</span>
                <p class="text-sm">{{ t('contact.success') }}</p>
              </div>

              <!-- Feedback de erro -->
              <div
                *ngIf="submitStatus() === 'error'"
                class="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30
                       rounded-xl text-red-600 dark:text-red-400"
              >
                <span class="material-icons text-red-500">error_outline</span>
                <p class="text-sm">{{ t('contact.error') }}</p>
              </div>
            </form>
          </div>

          <!-- Informações de contato (2/5 da largura) -->
          <div class="lg:col-span-2 space-y-6 reveal" style="transition-delay: 0.4s">

            <!-- Dica amigável -->
            <div class="p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-blue-500/5
                        border border-primary-500/20">
              <div class="flex items-start gap-3">
                <span class="text-2xl">👋</span>
                <div>
                  <h3 class="font-bold mb-1">{{ t('contact.note_title') }}</h3>
                  <p class="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {{ t('contact.note_body') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Cards de informações de contato -->
            <div class="space-y-3">
              <ng-container *ngFor="let info of contactInfo">
                <a
                  *ngIf="info.href; else staticInfoCard"
                  [href]="info.href"
                  [target]="info.external ? '_blank' : '_self'"
                  rel="noopener noreferrer"
                  class="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)]
                         hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-200 group"
                >
                  <div class="w-10 h-10 flex items-center justify-center rounded-xl
                              bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors flex-shrink-0">
                    <span class="material-icons text-primary-500">{{ info.icon }}</span>
                  </div>
                  <div>
                    <p class="text-xs text-[var(--color-text-muted)]">{{ t(info.labelKey) }}</p>
                    <p class="text-sm font-medium">{{ info.valueKey ? t(info.valueKey) : info.value }}</p>
                  </div>
                  <span class="material-icons text-[var(--color-text-muted)] text-sm ml-auto
                               group-hover:text-primary-500 transition-colors">
                    arrow_forward
                  </span>
                </a>

                <ng-template #staticInfoCard>
                  <div
                    class="flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-border)]
                           bg-[var(--color-card)]"
                  >
                    <div class="w-10 h-10 flex items-center justify-center rounded-xl
                                bg-primary-500/10 transition-colors flex-shrink-0">
                      <span class="material-icons text-primary-500">{{ info.icon }}</span>
                    </div>
                    <div>
                      <p class="text-xs text-[var(--color-text-muted)]">{{ t(info.labelKey) }}</p>
                      <p class="text-sm font-medium">{{ info.valueKey ? t(info.valueKey) : info.value }}</p>
                    </div>
                  </div>
                </ng-template>
              </ng-container>
            </div>

            <!-- Divisor -->
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-[var(--color-border)]"></div>
              <span class="text-xs text-[var(--color-text-muted)]">{{ t('contact.or_find_me') }}</span>
              <div class="flex-1 h-px bg-[var(--color-border)]"></div>
            </div>

            <!-- Redes sociais (ícones grandes) -->
            <div class="flex gap-3">
              <a
                *ngFor="let social of socials"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl
                       border border-[var(--color-border)] hover:border-primary-500/50
                       hover:bg-primary-500/5 transition-all duration-200 group"
                [title]="t(social.labelKey)"
              >
                <span class="material-icons text-xl text-[var(--color-text-muted)]
                             group-hover:text-primary-500 transition-colors">
                  {{ social.icon }}
                </span>
                <span class="text-xs text-[var(--color-text-muted)]">{{ t(social.labelKey) }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent implements OnInit {

  private translationService = inject(TranslationService);
  private scrollService = inject(ScrollService);

  submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  // =============================================
  // INFORMAÇÕES DE CONTATO - Substitua pelos seus!
  // =============================================
  contactInfo: ContactInfoItem[] = [
    {
      icon: 'alternate_email',
      labelKey: 'contact.email_direct',
      value: 'murilowisch.dev@gmail.com',
      href: 'mailto:murilowisch.dev@gmail.com',
      external: false,
    },
    {
      icon: 'code',
      labelKey: 'contact.github_label',
      value: 'github.com/MuriloWisch',
      href: 'https://github.com/MuriloWisch',
      external: true,
    },
    {
      icon: 'schedule',
      labelKey: 'contact.response_time',
      valueKey: 'contact.response_time_value',
    },
  ];

  socials: SocialItem[] = [
    { icon: 'code',   labelKey: 'contact.github_label',   url: 'https://github.com/MuriloWisch' },
    { icon: 'work',   labelKey: 'contact.linkedin_label', url: 'https://www.linkedin.com/in/murilowisch/?skipRedirect=true' },
    { icon: 'mail',   labelKey: 'contact.email_direct',   url: 'mailto:murilowisch.dev@gmail.com' },
  ];

  ngOnInit(): void {
    setTimeout(() => this.scrollService.initScrollReveal(), 100);
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) return;
    this.submitStatus.set('idle');

    try {
      const mailSubject = encodeURIComponent(this.formData.subject);
      const mailBody = encodeURIComponent(
        `${this.t('contact.name_label')}: ${this.formData.name}\n` +
        `${this.t('contact.email_label')}: ${this.formData.email}\n\n` +
        `${this.t('contact.message_label')}:\n${this.formData.message}`
      );

      if (typeof window !== 'undefined') {
        window.location.href = `mailto:murilowisch.dev@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      }

      this.submitStatus.set('success');
      form.resetForm();
      this.formData = { name: '', email: '', subject: '', message: '' };
    } catch {
      this.submitStatus.set('error');
    }
  }
}
