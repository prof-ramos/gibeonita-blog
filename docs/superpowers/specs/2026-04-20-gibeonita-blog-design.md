# Design: Blog Gibeonita

**Data:** 2026-04-20  
**Status:** Aprovado

## Visão Geral

Blog pessoal "O Gibeonita" construído com Hugo + tema PaperMod, deploy automático no GitHub Pages com domínio customizado `gibeonita.com.br` via Cloudflare.

## Stack

| Componente | Escolha |
|---|---|
| Gerador estático | Hugo |
| Tema | PaperMod (git submodule) |
| Config | `hugo.yaml` (YAML) |
| Idioma | pt-BR (`defaultContentLanguage: pt-br`) |
| Home | Profile Mode habilitado |
| Deploy | GitHub Actions → branch `gh-pages` |
| Hospedagem | GitHub Pages |
| Domínio | `gibeonita.com.br` (Cloudflare DNS) |

## Arquitetura de Arquivos

```
gibeonita-blog/
├── hugo.yaml                          # config principal
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI: build + push gh-pages
├── themes/
│   └── PaperMod/                      # git submodule
├── content/
│   ├── posts/                         # artigos do blog
│   │   └── .gitkeep
│   ├── about.md                       # página sobre
│   └── search.md                      # página de busca (layout: search)
├── static/
│   ├── CNAME                          # gibeonita.com.br (domínio custom)
│   └── images/
│       └── avatar.jpg                 # foto do perfil (placeholder)
└── i18n/
    └── pt-br.yaml                     # traduções da UI
```

## hugo.yaml

```yaml
baseURL: "https://gibeonita.com.br/"
title: O Gibeonita
paginate: 5
theme: PaperMod

defaultContentLanguage: pt-br
languageCode: pt-br

enableRobotsTXT: true
buildDrafts: false
buildFuture: false
buildExpired: false

minify:
  disableXML: true
  minifyOutput: true

params:
  env: production
  title: O Gibeonita
  description: "Blog pessoal de O Gibeonita"
  author: O Gibeonita
  DateFormat: "02/01/2006"
  defaultTheme: auto
  disableThemeToggle: false

  ShowReadingTime: true
  ShowShareButtons: true
  ShowPostNavLinks: true
  ShowBreadCrumbs: true
  ShowCodeCopyButtons: true
  ShowWordCount: true
  ShowRssButtonInSectionTermList: true
  UseHugoToc: true
  showtoc: false
  tocopen: false
  comments: false

  profileMode:
    enabled: true
    title: "O Gibeonita"
    subtitle: "Blog pessoal"
    imageUrl: "/images/avatar.jpg"
    imageWidth: 120
    imageHeight: 120
    imageTitle: "O Gibeonita"
    buttons:
      - name: Posts
        url: /posts
      - name: Sobre
        url: /about

  socialIcons:
    - name: rss
      url: "/index.xml"

  fuseOpts:
    isCaseSensitive: false
    shouldSort: true
    location: 0
    distance: 1000
    threshold: 0.4
    minMatchCharLength: 0
    limit: 10
    keys: ["title", "permalink", "summary", "content"]

menu:
  main:
    - identifier: posts
      name: Posts
      url: /posts/
      weight: 10
    - identifier: sobre
      name: Sobre
      url: /about/
      weight: 20
    - identifier: search
      name: Buscar
      url: /search/
      weight: 30

pygmentsUseClasses: true
markup:
  highlight:
    noClasses: false
    codeFences: true
    guessSyntax: true
```

## GitHub Actions — deploy.yml

- Trigger: push em `main`
- Hugo version: latest
- Usa `peaceiris/actions-hugo` para build
- Usa `peaceiris/actions-gh-pages` para push na branch `gh-pages`
- Inclui `CNAME` com `gibeonita.com.br` automaticamente via `cname` param

## Cloudflare DNS

| Tipo | Nome | Valor | Proxy |
|---|---|---|---|
| CNAME | `@` (ou `gibeonita.com.br`) | `prof-ramos.github.io` | OFF (DNS only) |
| CNAME | `www` | `prof-ramos.github.io` | OFF (DNS only) |

> Proxy deve estar OFF (cinza) para que os certificados TLS do GitHub Pages funcionem corretamente.

## GitHub Pages — configuração no repo

- Source: branch `gh-pages`, raiz `/`
- Custom domain: `gibeonita.com.br`
- Enforce HTTPS: habilitado

## i18n — pt-br.yaml

Traduz todos os labels da UI: prev_page, next_page, read_time, words, toc, translations, home, edit_post, code_copy, code_copied.

## Conteúdo Inicial

- `content/about.md` — página Sobre com frontmatter básico
- `content/search.md` — `layout: search` (necessário para o menu de busca funcionar)
- `content/posts/.gitkeep` — placeholder (posts reais adicionados pelo autor)

## Decisões

- **Profile Mode x Home Info**: Profile Mode escolhido. `homeInfoParams` não será incluído (são mutuamente exclusivos).
- **Submodule x clone direto**: git submodule para o tema, seguindo documentação oficial do PaperMod e permitindo `git submodule update --remote` para atualizações futuras.
- **CNAME no static/**: o arquivo `CNAME` vai em `static/CNAME` para ser copiado automaticamente para o output do build.
