# 🚀 Portfolio Angular — Alexandre Silva

Portfólio pessoal moderno construído com **Angular 17**, **TailwindCSS** e **Angular Material**.

## ✨ Funcionalidades

- 🌗 Dark / Light Mode com persistência em LocalStorage
- 🌍 Internacionalização PT-BR / EN (i18n)
- 📱 Totalmente responsivo (mobile-first)
- 🎞️ Animações de scroll reveal suaves
- ⚡ Angular 17 com Standalone Components e Signals
- 🚀 Pronto para deploy na Vercel ou Netlify

## 📂 Estrutura de Pastas

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── theme.service.ts       ← Dark mode
│   │       ├── translation.service.ts ← i18n
│   │       └── scroll.service.ts      ← Scroll reveal
│   ├── shared/
│   │   └── components/
│   │       ├── header/               ← Navegação fixa
│   │       └── footer/               ← Rodapé
│   ├── features/
│   │   ├── home/
│   │   │   ├── home.component.ts     ← Hero + Sobre
│   │   │   └── portfolio-page.component.ts
│   │   ├── projects/
│   │   │   └── projects.component.ts ← Cards + filtro
│   │   ├── certifications/
│   │   │   └── certifications.component.ts
│   │   └── contact/
│   │       └── contact.component.ts  ← Formulário
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   └── i18n/
│       ├── pt-BR.json
│       └── en.json
└── styles.css
```

## 🛠️ Instalação e Uso

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
ng serve
# Acesse: http://localhost:4200

# 3. Build de produção
ng build
# Gera: dist/portfolio/browser/
```

## 📝 Como personalizar

### Seus dados pessoais
Edite em `src/app/features/home/home.component.ts`:
```typescript
stats    = [/* seus números */]
skills   = [/* suas habilidades */]
aboutInfo = [/* seus dados */]
```

### Seus projetos
Edite em `src/app/features/projects/projects.component.ts`:
```typescript
projects: Project[] = [
  {
    title: 'Meu Projeto',
    description: 'Descrição...',
    // ...
  }
]
```

### Suas certificações
Edite em `src/app/features/certifications/certifications.component.ts`:
```typescript
certifications: Certification[] = [...]
```

### Tradução dos textos
Edite os arquivos:
- `src/assets/i18n/pt-BR.json` — Textos em português
- `src/assets/i18n/en.json` — Textos em inglês

### Foto de perfil
No `home.component.ts`, substitua o emoji por:
```html
<img src="assets/images/avatar.jpg" alt="Foto" class="w-full h-full object-cover">
```

### Formulário de contato real
No `contact.component.ts`, no método `onSubmit()`, substitua o `setTimeout` por:

**Formspree** (recomendado, gratuito):
```typescript
await fetch('https://formspree.io/f/SEU_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(this.formData)
});
```

## 🚀 Deploy

### Vercel (recomendado)
```bash
# 1. Instale a CLI da Vercel
npm i -g vercel

# 2. Na raiz do projeto
vercel

# Ou conecte o repositório GitHub em vercel.com
```
O arquivo `vercel.json` já está configurado.

### Netlify
Arraste a pasta `dist/portfolio/browser` para [netlify.com/drop](https://app.netlify.com/drop)

Ou conecte via GitHub: o arquivo `netlify.toml` já está configurado.

## 📦 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 17 | Framework principal |
| TailwindCSS | 3.3 | Estilização |
| Angular Material | 17 | Componentes UI |
| TypeScript | 5.2 | Tipagem |

## 📄 Licença

MIT — use à vontade! ⭐
