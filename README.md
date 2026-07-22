# LuzTech Blog

[![Astro](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC%20BY--NC--SA%204.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE-content)

Official LuzTech technical blog — engineering articles, tutorials and insights, built with Astro.

## Features

- AstroPaper v6-based blog foundation adapted for LuzTech
- Markdown and MDX content support
- Tag pages, archives, pagination, and static search with Pagefind
- RSS feed, sitemap, SEO metadata, and automatic Open Graph images
- Light and dark mode with LuzTech accent colors
- Space Grotesk typography and LuzTech mesh-gradient hero styling
- Accessible, responsive layout with syntax highlighting powered by Shiki

## Tech stack

- [Astro](https://astro.build/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [AstroPaper](https://github.com/satnaing/astro-paper)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)

## Getting started

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Deployment

The blog deploys to **Azure Static Web Apps** via
`.github/workflows/azure-static-web-apps.yml`. The workflow has two jobs:

- **Validate** — runs on every pull request against `main`. Installs
  dependencies, runs `pnpm lint`, `pnpm format:check`, and the full
  `pnpm run build` (which includes `astro check`, `astro build`, and
  Pagefind indexing). **No deployment happens.**
- **Build and Deploy** — runs on push to `main` (and on manual
  `workflow_dispatch`). Builds and uploads `dist/` to the production
  environment.

Runtime headers, cache policy, MIME types for Pagefind's binary index files,
and the locale-aware 404 fallback live in [`staticwebapp.config.json`](./staticwebapp.config.json).
The root `/404.html`, `/rss.xml`, and `/` are all locale-detecting redirects
(see `src/pages/{404.astro,index.astro,rss.xml.ts}`) so users always land on
the `pt-BR` or `en-US` variant of the page they were looking for.

The workflow expects one repository secret:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` — the deployment token from the
  Static Web App resource in the Azure Portal.

## Writing a post

Add a new `.md` or `.mdx` file inside `src/content/blog/` with frontmatter like this:

```md
---
title: Your post title
description: A short summary of the article.
pubDatetime: 2026-07-22T00:00:00Z
tags:
  - engineering
  - tutorial
author: LuzTech Team
---
```

### Using third-party assets in posts

If a post embeds or references content you do **not** own (screenshots of
documentation, diagrams, logos, photos, code snippets, etc.), that material
is **not** covered by this repository's
[CC BY-NC-SA 4.0 content license](LICENSE-content). It remains the property
of its original owner.

Whenever you include or reference a third-party asset, always give explicit
attribution inline in the post — credit the original author/owner and link
to the source when available. Mentioning the specific license or legal
basis (fair use, CC BY, etc.) is encouraged when it's relevant, but not
required for every reference (e.g., a passing mention like _"inspired by
this AWS architecture diagram"_ is fine as long as the source is credited).

Example:

```markdown
![Kubernetes architecture](/posts/my-post/k8s-architecture.svg)
_Image: [Kubernetes Authors](https://kubernetes.io/docs/concepts/overview/components/)._
```

When in doubt about whether an asset can be reused, prefer creating your own
(e.g., Excalidraw, Mermaid, tldraw) or sourcing from openly licensed
repositories (Unsplash, Wikimedia Commons, Simple Icons, etc.).

## Branding

LuzTech typography, colors, and brand guidance live in the official repository:
https://github.com/LuzTech-Development/Typography

## 📖 License

This repository uses a **dual license**:

- **Source code** (Astro components, scripts, styles, configuration) —
  [MIT License](LICENSE).
- **Blog content** (articles, images, editorial materials under
  `src/content/`) — [CC BY-NC-SA 4.0](LICENSE-content).
- **LuzTech brand assets** (name, logo, icons, typography) — see the
  [LuzTech trademark notice](https://github.com/LuzTech-Development/Typography/blob/master/TRADEMARKS.md).

If you reference or quote an article, please credit **LuzTech Development**
and link back to the original post.

## Credits

Thanks to [AstroPaper](https://github.com/satnaing/astro-paper) for the free template that powers this project.
