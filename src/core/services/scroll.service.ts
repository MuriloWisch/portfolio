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
    if (!element) return;

    const target = this.getSectionTarget(element);
    const offset = this.getScrollOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth',
    });
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

  getScrollOffset(): number {
    if (!this.isBrowser) return 0;

    const navHeight = getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')
      .trim();
    const parsedNavHeight = Number.parseFloat(navHeight);

    return (Number.isFinite(parsedNavHeight) ? parsedNavHeight : 72) + 8;
  }

  private getSectionTarget(section: HTMLElement): HTMLElement {
    if (section.id === 'home') return section;

    return section.querySelector<HTMLElement>('.section-title') ?? section;
  }
}
