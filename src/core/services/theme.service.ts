import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  isDark = signal<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initTheme();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initTheme(): void {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('portfolio-theme');

    if (saved) {
      this.setDark(saved === 'dark');
    } else {
      this.setDark(true);
    }
  }

  toggle(): void {
    this.setDark(!this.isDark());
  }

  setDark(dark: boolean): void {
    this.isDark.set(dark);

    if (!this.isBrowser) return;

    const root = document.documentElement;

    dark
      ? root.classList.add('dark')
      : root.classList.remove('dark');

    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  }
}
