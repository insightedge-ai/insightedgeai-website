# InsightEdge AI Website

Production website for **InsightEdge AI** — a consultancy focused on **Computer Vision, Edge AI, and LLM-powered Intelligent Agents**.

This repository contains the **Next.js (App Router)** frontend, built with **Tailwind CSS**, containerised with **Docker**, and deployed automatically via **GitHub Actions → GHCR → Linode**, fronted by **Caddy**.

🌐 Live site: **https://insightedgeai.co.uk**

---

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Docker** (dev & production)
- **GitHub Actions** (CI/CD)
- **GitHub Container Registry (GHCR)**
- **Linode VM**
- **Caddy** (reverse proxy + HTTPS)

---

## Repository Structure

```
.
├── app/                    # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/                 # Static assets (icons, favicons, etc.)
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image (hot reload)
├── docker-compose.yml      # Production (Linode)
├── docker-compose.dev.yml  # Local development
├── .github/workflows/      # CI/CD pipelines
└── README.md
```

---

## Local Development (Recommended)

This project supports **fast local development with Docker + live reload**.

### Prerequisites
- Docker
- Docker Compose

### Run dev server
```bash
docker compose -f docker-compose.dev.yml up --build
```

Open:
```
http://localhost:3000
```

Changes to TSX / CSS files will hot-reload instantly.

### Stop dev environment
```bash
Ctrl+C
docker compose -f docker-compose.dev.yml down
```

---

## Alternative: Local Node (No Docker)

```bash
npm ci
npm run dev
```

---

## Production Build & Deployment

Production deployment is **fully automated**:

1. Push to `main`
2. GitHub Actions:
   - Builds production Docker image
   - Pushes to **GHCR**
3. Linode VM:
   - Pulls latest image
   - Runs via `docker-compose`
   - Served behind **Caddy** with HTTPS

### Secrets used in CI
- `GHCR_USERNAME`
- `GHCR_TOKEN`
- `LINODE_HOST`
- `LINODE_USER`
- `LINODE_SSH_KEY`

---

## Styling & Theme

- Dark theme enforced globally
- Tailwind utility-first styling
- Responsive desktop & mobile layout
- No reliance on system light/dark mode

---

## Versioning

Site version is displayed in the footer:

```
© 2025 InsightEdge AI – v0.0.3
```

---

## License

Private repository.  
All rights reserved © InsightEdge AI.

---

## Contact

For business enquiries:

🌐 https://insightedgeai.co.uk  
📧 Contact form on the website
