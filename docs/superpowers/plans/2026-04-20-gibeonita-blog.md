# Blog Gibeonita — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar blog pessoal "O Gibeonita" com Hugo + PaperMod em profile mode, pt-BR, deploy automático no GitHub Pages com domínio `gibeonita.com.br`.

**Architecture:** Hugo gera o site estático a partir de `main`; GitHub Actions faz o build e deploy via `actions/deploy-pages` (API nativa do GitHub Pages). O tema PaperMod é incluído como git submodule. O domínio customizado é apontado via Cloudflare DNS (CNAME → `prof-ramos.github.io`, proxy OFF).

**Tech Stack:** Hugo Extended, PaperMod (git submodule), GitHub Actions, GitHub Pages, Cloudflare DNS.

---

## File Map

| Arquivo | Responsabilidade |
|---|---|
| `hugo.yaml` | Config principal do site |
| `static/CNAME` | Domínio customizado copiado para o output do build |
| `static/images/avatar.jpg` | Foto do perfil (placeholder gerado) |
| `i18n/pt-br.yaml` | Traduções de todos os labels da UI |
| `content/about.md` | Página Sobre |
| `content/search.md` | Página de busca (`layout: search`) |
| `content/posts/.gitkeep` | Mantém a pasta no git sem conteúdo |
| `.github/workflows/deploy.yml` | CI: build Hugo + deploy GitHub Pages |
| `themes/PaperMod/` | Git submodule do tema |

---

### Task 1: Instalar Hugo Extended

**Files:**
- Sistema (Homebrew)

- [ ] **Step 1: Instalar Hugo Extended**

```bash
brew install hugo
```

- [ ] **Step 2: Verificar instalação**

```bash
hugo version
```

Esperado: linha contendo `hugo v0.1xx.x+extended`

---

### Task 2: Adicionar PaperMod como git submodule

**Files:**
- Create: `themes/PaperMod/` (via submodule)
- Modify: `.gitmodules` (criado automaticamente)

- [ ] **Step 1: Adicionar submodule**

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
```

- [ ] **Step 2: Verificar**

```bash
ls themes/PaperMod/layouts/
```

Esperado: lista de diretórios do tema (partials, _default, etc.)

- [ ] **Step 3: Commit**

```bash
git add .gitmodules themes/PaperMod
git commit -m "feat: adiciona PaperMod como git submodule"
```

---

### Task 3: Criar hugo.yaml

**Files:**
- Create: `hugo.yaml`

- [ ] **Step 1: Criar o arquivo**

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
  hidemeta: false
  hideSummary: false

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

- [ ] **Step 2: Verificar build local**

```bash
hugo server --buildDrafts
```

Esperado: site sobe em `http://localhost:1313` sem erros. Parar com Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add hugo.yaml
git commit -m "feat: adiciona configuração principal do Hugo"
```

---

### Task 4: Criar CNAME e avatar placeholder

**Files:**
- Create: `static/CNAME`
- Create: `static/images/avatar.jpg`

- [ ] **Step 1: Criar CNAME**

```bash
mkdir -p static/images
echo "gibeonita.com.br" > static/CNAME
```

- [ ] **Step 2: Gerar avatar placeholder (600×600 px cinza)**

```bash
convert -size 600x600 xc:#cccccc static/images/avatar.jpg 2>/dev/null || \
  curl -sL "https://placehold.co/600x600/cccccc/ffffff/jpg" -o static/images/avatar.jpg
```

> Nota: O avatar é um placeholder. Substituir por foto real em `static/images/avatar.jpg` quando disponível.

- [ ] **Step 3: Verificar**

```bash
cat static/CNAME
ls -lh static/images/avatar.jpg
```

Esperado:
```
gibeonita.com.br
-rw-r--r-- ... static/images/avatar.jpg
```

- [ ] **Step 4: Commit**

```bash
git add static/
git commit -m "feat: adiciona CNAME e avatar placeholder"
```

---

### Task 5: Criar traduções pt-BR

**Files:**
- Create: `i18n/pt-br.yaml`

- [ ] **Step 1: Criar o arquivo**

```bash
mkdir -p i18n
```

Conteúdo de `i18n/pt-br.yaml`:

```yaml
- id: prev_page
  translation: "Anterior"

- id: next_page
  translation: "Próximo"

- id: read_time
  translation:
    one: "1 min de leitura"
    other: "{{ .Count }} min de leitura"

- id: words
  translation:
    one: "palavra"
    other: "{{ .Count }} palavras"

- id: toc
  translation: "Índice"

- id: translations
  translation: "Traduções"

- id: home
  translation: "Início"

- id: edit_post
  translation: "Editar"

- id: code_copy
  translation: "copiar"

- id: code_copied
  translation: "copiado!"
```

- [ ] **Step 2: Commit**

```bash
git add i18n/
git commit -m "feat: adiciona traduções pt-BR"
```

---

### Task 6: Criar páginas de conteúdo

**Files:**
- Create: `content/about.md`
- Create: `content/search.md`
- Create: `content/posts/.gitkeep`

- [ ] **Step 1: Criar página Sobre**

Conteúdo de `content/about.md`:

```markdown
---
title: "Sobre"
layout: "about"
url: "/about/"
summary: "sobre"
---

Olá! Sou O Gibeonita.

Escrevo sobre minha vida, pensamentos e experiências.
```

- [ ] **Step 2: Criar página de busca**

Conteúdo de `content/search.md`:

```markdown
---
title: "Buscar"
layout: "search"
url: "/search/"
summary: "buscar"
---
```

- [ ] **Step 3: Criar placeholder para posts**

```bash
mkdir -p content/posts
touch content/posts/.gitkeep
```

- [ ] **Step 4: Verificar build local**

```bash
hugo server --buildDrafts
```

Acessar `http://localhost:1313` e verificar:
- Home com profile mode (foto, título, botões)
- Menu com Posts / Sobre / Buscar
- Página `/about/` acessível
- Página `/search/` acessível
Parar com Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: adiciona páginas about, search e estrutura de posts"
```

---

### Task 7: Criar workflow GitHub Actions

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Criar o arquivo**

```bash
mkdir -p .github/workflows
```

Conteúdo de `.github/workflows/deploy.yml`:

```yaml
name: Build and deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.147.1
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Install Hugo Extended
        run: |
          curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          mkdir -p "${HOME}/.local/hugo"
          tar -C "${HOME}/.local/hugo" -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          rm "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
          echo "${HOME}/.local/hugo" >> "${GITHUB_PATH}"

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build
        run: |
          hugo build \
            --gc \
            --minify \
            --baseURL "https://gibeonita.com.br/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: adiciona workflow GitHub Actions para deploy"
```

---

### Task 8: Configurar GitHub Pages e fazer push

**Files:**
- GitHub repo settings (via gh CLI)

- [ ] **Step 1: Push para o GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Configurar GitHub Pages para usar GitHub Actions**

```bash
gh api repos/prof-ramos/gibeonita-blog/pages \
  --method POST \
  -f build_type=workflow \
  -f source='{"branch":"main","path":"/"}' \
  2>/dev/null || \
gh api repos/prof-ramos/gibeonita-blog/pages \
  --method PUT \
  -f build_type=workflow
```

> Se falhar, configurar manualmente: Settings > Pages > Source > "GitHub Actions"

- [ ] **Step 3: Acompanhar o deploy**

```bash
gh run list --repo prof-ramos/gibeonita-blog --limit 3
```

Aguardar o workflow completar:

```bash
gh run watch --repo prof-ramos/gibeonita-blog
```

Esperado: `✓ Build and deploy` com status `completed / success`

- [ ] **Step 4: Configurar domínio customizado no GitHub Pages**

```bash
gh api repos/prof-ramos/gibeonita-blog/pages \
  --method PUT \
  -f cname=gibeonita.com.br
```

- [ ] **Step 5: Verificar**

```bash
gh api repos/prof-ramos/gibeonita-blog/pages --jq '{url, cname, status}'
```

Esperado:
```json
{
  "url": "https://api.github.com/repos/prof-ramos/gibeonita-blog/pages",
  "cname": "gibeonita.com.br",
  "status": "built"
}
```

---

### Task 9: Verificar site em produção

- [ ] **Step 1: Aguardar propagação DNS (pode levar até 10 min)**

```bash
dig gibeonita.com.br CNAME +short
```

Esperado: `prof-ramos.github.io.`

- [ ] **Step 2: Acessar o site**

```bash
curl -sI https://gibeonita.com.br | head -5
```

Esperado: `HTTP/2 200` com headers do GitHub Pages.

- [ ] **Step 3: Verificar HTTPS no GitHub Pages**

```bash
gh api repos/prof-ramos/gibeonita-blog/pages --jq '{https_enforced, https_certificate}'
```

Se `https_enforced` for `false`, habilitar:

```bash
gh api repos/prof-ramos/gibeonita-blog/pages \
  --method PUT \
  -f https_enforced=true
```
