import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  scrollTo(sectionId: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initScrollReveal(): void {
    if (!this.isBrowser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left');
    elements.forEach((el) => observer.observe(el));
  }
}