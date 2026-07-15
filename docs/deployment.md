# Deployment

This site is a static Astro build — the output is plain HTML, CSS, and JS in `dist/`. It can be deployed to any static hosting provider. This guide covers the build process and the most common options.

## Table of contents

- [Build process](#build-process)
- [Quick reference](#quick-reference)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Cloudflare Pages](#cloudflare-pages)
- [Google Cloud Storage](#google-cloud-storage)
- [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Adding a custom domain](#adding-a-custom-domain)
- [Troubleshooting](#troubleshooting)

---

## Build process

```bash
pnpm install         # install dependencies
pnpm build           # type-check + static build → dist/
pnpm preview         # preview the production build locally
```

The build command runs `astro check` (type-checking) before `astro build` (static site generation). The output lands in `dist/` — a self-contained directory of static files you can serve from any web server or CDN.

### Build output

```
dist/
├── index.html               # homepage
├── blog/index.html          # blog listing
├── blog/hello-world/        # individual blog post
├── blog/image-retrieval/    # individual blog post
├── projects/index.html      # projects listing
├── projects/hello-world/    # individual project
├── resume/index.html        # resume page
├── _astro/                  # hashed CSS, JS, assets
└── favicon.svg
```

A `pnpm preview` serves the `dist/` directory on `localhost:4321` so you can verify everything looks right before pushing live.

---

## Quick reference

| Provider | Free tier | Build integration | Custom domain | CDN |
|---|---|---|---|---|
| GitHub Pages | Unlimited (public repos) | GitHub Actions | Yes | Fastly |
| Netlify | 100 GB bandwidth/mo | Auto-detect | Yes + TLS | Netlify Edge |
| Vercel | 100 GB bandwidth/mo | Auto-detect | Yes + TLS | Vercel Edge |
| Cloudflare Pages | Unlimited bandwidth | Auto-detect | Yes + TLS | Cloudflare Global |
| Google Cloud Storage | 1 GB free egress/mo | Manual (CI/CD) | Yes (via LB) | Cloud CDN |
| AWS S3 + CloudFront | 1 GB free egress/mo | Manual (CI/CD) | Yes (via CF) | CloudFront |

---

## GitHub Pages

### 1. Push to the `main` branch

Push your code to the repository (GitHub detects the project root automatically).

### 2. Configure via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Enable Pages in repo settings

Go to **Settings → Pages → Source → GitHub Actions**. The action above handles the rest.

### 4. (Optional) Custom domain

Set **Settings → Pages → Custom domain** to `nievespg.dev` and add the `CNAME` or `A` records in your DNS provider.

### Notes

- GitHub Pages does not support SPA redirect rules out of the box. Astro's static output is a perfect fit since every route is a real `.html` file.
- If you use a `CNAME` file in `public/`, GitHub picks it up automatically. The action above uses `configure-pages` instead, which is the modern approach.

---

## Netlify

### 1. Push to Git and connect

1. Push your repo to GitHub/GitLab/Bitbucket.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import existing project**.
3. Select your repo and branch.

### 2. Configure build settings

Netlify auto-detects Astro. Confirm or set:

| Field | Value |
|---|---|
| Base directory | (leave blank) |
| Build command | `pnpm build` |
| Publish directory | `dist` |

### 3. (Optional) Add `netlify.toml`

Create `netlify.toml` in the project root for explicit config:

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 4. Custom domain

Go to **Site settings → Domain management → Add custom domain**. Netlify provisions a TLS certificate automatically (Let's Encrypt).

### Notes

- Netlify is the most straightforward option for Astro — zero-config if you skip the `netlify.toml`.
- Deploy previews are free: every PR branch gets a unique URL.

---

## Vercel

### 1. Push to Git and connect

1. Push your repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **Add new project**.
3. Import your repo. Vercel auto-detects Astro.

### 2. Configure build settings

Vercel auto-detects Astro. Confirm:

| Field | Value |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Install command | `pnpm install` |

### 3. (Optional) Add `vercel.json`

```json
{
  "framework": "astro",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

### 4. Custom domain

Go to **Project settings → Domains** and add your domain. Vercel provisions a TLS certificate automatically.

### Notes

- Vercel is optimized for Astro and offers the fastest build times of the major platforms.
- **Astro islands** (client-side interactivity) work out of the box on Vercel's serverless edge.

---

## Cloudflare Pages

### 1. Push to Git and connect

1. Push your repo to GitHub/GitLab.
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Pages → Create a project**.
3. Connect your Git provider and select the repo.

### 2. Configure build settings

| Field | Value |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Build output | `dist` |
| Root directory | (leave blank) |

### 3. Environment variables (if needed)

Set `NODE_VERSION = "22"` in **Settings → Environment variables**.

### 4. Custom domain

Go to **Workers & Pages → your site → Custom domains → Set up custom domain**. Since Cloudflare is your DNS provider, the domain and TLS are handled automatically.

### Notes

- Cloudflare's global network is the largest of any provider on this list.
- **Unlimited bandwidth** on the free plan — unusual among the major platforms.
- Like GitHub Pages, this is static-only, so Astro's pre-rendered output is a natural fit.

---

## Google Cloud Storage

### Option A: Cloud Storage + Cloud CDN (recommended)

1. **Create a bucket**

```bash
gcloud storage buckets create gs://nievespg.dev \
  --location=us-east1 \
  --uniform-bucket-level-access
```

2. **Make the bucket publicly readable**

```bash
gcloud storage buckets add-iam-policy-binding gs://nievespg.dev \
  --member=allUsers \
  --role=roles/storage.objectViewer
```

3. **Build and upload**

```bash
pnpm build
gcloud storage cp dist/** gs://nievespg.dev --recursive
```

4. **Set the index and error pages**

```bash
gcloud storage buckets update gs://nievespg.dev \
  --web-main-page-suffix=index.html \
  --web-error-page=404.html
```

5. **(Optional) Add a Cloud CDN and HTTPS load balancer**

For a custom domain with TLS, set up an [External HTTPS Load Balancer](https://cloud.google.com/load-balancing/docs/https) with a Cloud CDN backend bucket pointing to `gs://nievespg.dev`.

### Option B: Cloud Run (for dynamic features)

If you later add server-side rendering or Astro islands, Cloud Run can serve the Astro adapter:

```bash
gcloud run deploy \
  --source . \
  --region us-east1 \
  --allow-unauthenticated
```

This requires the `@astrojs/node` or `@astrojs/vercel` adapter depending on your needs.

### CI/CD via Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  - name: node:22
    entrypoint: pnpm
    args: ["install"]
  - name: node:22
    entrypoint: pnpm
    args: ["build"]
  - name: gcr.io/cloud-builders/gsutil
    args: ["-m", "rsync", "-r", "-d", "dist/", "gs://nievespg.dev"]
```

---

## AWS S3 + CloudFront

### 1. Create an S3 bucket

```bash
aws s3 mb s3://nievespg.dev --region us-east-1
```

Enable static website hosting:

```bash
aws s3 website s3://nievespg.dev \
  --index-document index.html \
  --error-document 404.html
```

Block public access (CloudFront will use an Origin Access Control):

```bash
aws s3api put-public-access-block \
  --bucket nievespg.dev \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Build and upload

```bash
pnpm build
aws s3 sync dist/ s3://nievespg.dev --delete
```

### 3. Create a CloudFront distribution

In the AWS Console → **CloudFront → Create distribution**:

| Field | Value |
|---|---|
| Origin domain | `nievespg.dev.s3.amazonaws.com` |
| Origin access | Origin access control (OAC) |
| Viewer protocol | Redirect HTTP to HTTPS |
| Cache policy | CachingOptimized |
| Default root object | `index.html` |
| Price class | Use only North America and Europe (cheaper) |

Update the S3 bucket policy after CloudFront creates the OAC — CloudFront will provide the policy template.

### 4. Custom domain + TLS

1. Request a certificate in **AWS Certificate Manager** (us-east-1) for `nievespg.dev`
2. Add `nievespg.dev` as an alternate domain in the CloudFront distribution
3. Create a `CNAME` record in your DNS pointing to the CloudFront distribution domain (`d123.cloudfront.net`)

### 5. CI/CD via GitHub Actions

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://nievespg.dev --delete
      - run: aws cloudfront create-invalidation
          --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}
          --paths "/*"
```

---

## Adding a custom domain

Most providers handle TLS certificates automatically (Netlify, Vercel, Cloudflare, GitHub Pages). For Google Cloud and AWS, you manage certificates through their respective services.

Generic DNS steps:

1. Add a `CNAME` record pointing your domain to the provider's default domain:
   - GitHub Pages: `your-org.github.io`
   - Netlify: `your-site.netlify.app`
   - Vercel: `your-site.vercel.app`
   - Cloudflare Pages: `your-site.pages.dev`
   - CloudFront: `d123.cloudfront.net`
   - GCP LB: the load balancer IP
2. Wait for DNS propagation (minutes to hours).
3. Configure the custom domain in the provider's settings panel.

---

## Troubleshooting

### Build fails with type errors

```bash
pnpm build    # runs astro check first
```

If `astro check` reports errors, fix them and rebuild. Run `pnpm lint` to catch ESLint issues too.

### Assets return 404

Check that all asset paths are relative or use the `import` syntax in Astro components:

```astro
---
import logo from "../assets/logo.svg";
---
<img src={logo} alt="" />
```

Static files in `public/` are copied as-is to `dist/` — reference them with a leading slash: `/favicon.svg`.

### "Page not found" on sub-routes

Some providers (S3, GCS) need explicit configuration for HTML extensions. Astro's static output generates `blog/hello-world/index.html`, and most modern hosting handles this automatically. If not, double-check the provider's settings for clean URLs / trailing slash support.

### Deployment triggers but nothing changes

Hard refresh or clear the CDN cache. Most providers offer cache invalidation in their dashboard. For S3+CloudFront, use:

```bash
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```