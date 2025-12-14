# InsightEdge AI — Technical Overview (Recruiter Edition)

This repository demonstrates **production-grade frontend engineering and DevOps practices** used to deploy a real commercial website.

It is intentionally small in scope, but **end-to-end complete**.

Live site: https://insightedgeai.co.uk

---

## What this repo demonstrates

### Frontend Engineering
- Modern **Next.js App Router**
- TypeScript-first codebase
- Tailwind CSS with enforced dark theme
- Responsive desktop & mobile layout

### DevOps & Deployment
- Multi-stage Docker builds
- Separate dev vs prod containers
- Deterministic dependency installs (`npm ci`)
- Automated CI/CD using GitHub Actions
- Image publishing to GHCR
- Secure SSH-based deployment to Linode
- Caddy reverse proxy with HTTPS

### Engineering Maturity
- Clean repo structure
- Environment separation (dev / prod)
- No reliance on Vercel or managed platforms
- Real production hosting & DNS

---

## Why this matters

This repo mirrors how I approach **AI systems, CV pipelines, and production software**:

- Infrastructure-as-code mindset
- Reproducible builds
- Automation over manual steps
- Deployment parity across environments

The same principles scale directly to:
- ML inference services
- Edge AI deployments
- Evaluation pipelines
- Cloud + on-device systems

---

## Author

Amin Merati  
Computer Vision & Edge AI Systems Engineer  

