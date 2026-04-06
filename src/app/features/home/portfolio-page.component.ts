import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ProjectsComponent } from '../projects/projects.component';
import { CertificationsComponent } from '../certifications/certifications.component';
import { ContactComponent } from '../contact/contact.component';

/**
 * PortfolioPageComponent - Página principal que agrega todas as seções
 * Cada seção é um componente standalone independente
 */
@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    ProjectsComponent,
    CertificationsComponent,
    ContactComponent,
  ],
  template: `
    <main>
      <app-home></app-home>
      <app-projects></app-projects>
      <app-certifications></app-certifications>
      <app-contact></app-contact>
    </main>
  `
})
export class PortfolioPageComponent {}
