# InsightEdge AI Website

![CI](https://github.com/insightedge-ai/insightedgeai-website/actions/workflows/deploy.yml/badge.svg)
![Docker](https://img.shields.io/badge/docker-GHCR-blue)
![Deploy](https://img.shields.io/badge/deployed-Linode%20%2B%20Caddy-success)

Production website for **InsightEdge AI** — a consultancy focused on **Computer Vision, Edge AI, and LLM-powered Intelligent Agents**.

This repository contains the **Next.js (App Router)** frontend, built with **Tailwind CSS**, containerised with **Docker**, and deployed automatically via **GitHub Actions → GHCR → Linode**, fronted by **Caddy**.

🌐 Live site: **https://insightedgeai.co.uk**

---

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Docker (dev & prod)
- GitHub Actions (CI/CD)
- GitHub Container Registry (GHCR)
- Linode VM
- Caddy (HTTPS reverse proxy)

---

## Local Development (Docker)

```bash
docker compose -f docker-compose.dev.yml up --build
```

Open http://localhost:3000  
Hot reload is enabled.

---

## Production Deployment (Automated)

Push to `main` → GitHub Actions builds image → pushes to GHCR → Linode pulls and deploys.

Secrets:
- GHCR_USERNAME / GHCR_TOKEN
- LINODE_HOST / LINODE_USER / LINODE_SSH_KEY

---

© InsightEdge AI

> Recruiters and hiring managers: see [README.recruiters.md](./README.recruiters.md) for a technical overview.