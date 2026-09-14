import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

export type Language = 'pt-BR' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  currentLang = signal<Language>('pt-BR');
  private translations: Record<string, any> = {};

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async loadTranslations(defaultLang: Language): Promise<void> {
    const saved = this.isBrowser
      ? (localStorage.getItem('portfolio-lang') as Language | null)
      : null;

    const targetLang: Language = saved || defaultLang;

    try {
      const data = await firstValueFrom(
        this.http.get<Record<string, any>>(
          `assets/i18n/${targetLang}.json`
        )
      );

      this.translations = data;
      this.currentLang.set(targetLang);
    } catch (err) {
      console.error('Erro ao carregar traduções:', err);
    }
  }

  async toggleLanguage(): Promise<void> {
    const next: Language =
      this.currentLang() === 'pt-BR' ? 'en' : 'pt-BR';

    await this.loadTranslations(next);

    if (this.isBrowser) {
      localStorage.setItem('portfolio-lang', next);
    }
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }
}