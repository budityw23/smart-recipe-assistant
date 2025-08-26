# Deployment Guide

This comprehensive guide covers deploying the Smart Recipe Assistant to various platforms, with detailed instructions for production-ready deployments.

## Quick Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js application is using Vercel:

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/smart-recipe-assistant&env=GEMINI_API_KEY)

### Manual Vercel Deployment

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project root
   vercel --prod
   ```

2. **Configure Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your Google API key

3. **Custom Domain (Optional)**:
   - In project settings, go to Domains
   - Add your custom domain
   - Configure DNS records as instructed

---

## Environment Variables

### Required Variables

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Optional Variables

```env
# Analytics (if implemented)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Custom API endpoints
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api

# Feature flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_SHARING=true
```

### Environment Variable Setup

1. **Get Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for environment configuration

2. **Local Development**:
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your values
   GEMINI_API_KEY=your_actual_api_key
   ```

3. **Production Deployment**:
   - Add environment variables in your hosting platform's dashboard
   - Never commit `.env.local` to version control

---

## Platform-Specific Deployments

### Vercel (Recommended)

**Pros**: Optimized for Next.js, automatic deployments, edge functions
**Cons**: Usage limits on free tier

**Configuration** (`vercel.json`):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Netlify

**Pros**: Great for static sites, form handling, edge functions
**Cons**: Less optimized for Next.js than Vercel

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**Deployment Steps**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

### AWS Amplify

**Pros**: AWS integration, scalable, CI/CD built-in
**Cons**: More complex setup, AWS knowledge required

**Configuration** (`amplify.yml`):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### DigitalOcean App Platform

**Pros**: Simple pricing, good performance, Docker support
**Cons**: Less Next.js optimization than Vercel

**Configuration** (`.do/app.yaml`):
```yaml
name: smart-recipe-assistant
services:
- name: web
  source_dir: /
  github:
    repo: your-username/smart-recipe-assistant
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: GEMINI_API_KEY
    scope: RUN_TIME
    value: your_api_key
```

### Docker Deployment

**For containerized deployments**:

**Dockerfile**:
```dockerfile
# Multi-stage build for optimized image size
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

**Build and Run**:
```bash
# Build image
docker build -t smart-recipe-assistant .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key smart-recipe-assistant
```

---

## Production Optimizations

### Performance Optimizations

1. **Build Optimization**:
   ```bash
   # Production build with optimizations
   npm run build
   
   # Analyze bundle size
   npx @next/bundle-analyzer
   ```

2. **Image Optimization**:
   - Use Next.js Image component for automatic optimization
   - Configure image domains in `next.config.js`
   - Enable WebP conversion

3. **Caching Strategy**:
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, s-maxage=60, stale-while-revalidate=30'
             }
           ]
         }
       ]
     }
   }
   ```

### Security Configuration

1. **Content Security Policy**:
   ```javascript
   // next.config.js
   const ContentSecurityPolicy = `
     default-src 'self';
     script-src 'self' 'unsafe-eval' 'unsafe-inline';
     style-src 'self' 'unsafe-inline';
     img-src 'self' blob: data:;
     font-src 'self';
     object-src 'none';
     base-uri 'self';
     form-action 'self';
     frame-ancestors 'none';
     upgrade-insecure-requests;
   `
   
   const securityHeaders = [
     {
       key: 'Content-Security-Policy',
       value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
     },
     {
       key: 'Referrer-Policy',
       value: 'origin-when-cross-origin'
     },
     {
       key: 'X-Frame-Options',
       value: 'DENY'
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'false'
     },
     {
       key: 'Strict-Transport-Security',
       value: 'max-age=31536000; includeSubDomains; preload'
     },
     {
       key: 'Permissions-Policy',
       value: 'camera=(), microphone=(), geolocation=()'
     }
   ]
   ```

2. **Environment Security**:
   - Use environment variables for secrets
   - Enable HTTPS in production
   - Regular dependency updates

### Monitoring and Analytics

1. **Performance Monitoring**:
   ```javascript
   // lib/analytics.ts
   export function reportWebVitals(metric) {
     // Send to analytics service
     if (process.env.NEXT_PUBLIC_GA_ID) {
       gtag('event', metric.name, {
         value: Math.round(metric.value),
         event_label: metric.id,
         non_interaction: true,
       })
     }
   }
   ```

2. **Error Tracking**:
   - Implement error boundary components
   - Use services like Sentry for production error tracking
   - Monitor API failure rates

---

## Database Integration (Future)

### Supabase Setup

```javascript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### PlanetScale Setup

```javascript
// lib/db.ts
import { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

const connection = connect({
  url: process.env.DATABASE_URL
})

export const db = new PlanetScaleDatabase(connection)
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run build
        run: npm run build
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run lint
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Health Checks and Monitoring

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    // Check external API availability
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    })
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### Uptime Monitoring

```javascript
// Monitor endpoints
const endpoints = [
  'https://your-app.com',
  'https://your-app.com/api/health'
]

// Use services like:
// - UptimeRobot
// - Pingdom
// - StatusCake
```

---

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm ci
   npm run build
   ```

2. **Environment Variable Issues**:
   - Check variable names match exactly
   - Verify variables are set in deployment platform
   - Test locally with production build

3. **API Route Errors**:
   - Check function timeout limits
   - Verify external API connectivity
   - Review error logs in platform dashboard

4. **Performance Issues**:
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and fonts

### Debug Mode

```javascript
// Enable debug mode
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Add logging
console.log('Environment:', process.env.NODE_ENV)
console.log('API Key configured:', !!process.env.GEMINI_API_KEY)
```

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints responding correctly
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking working
- [ ] Error monitoring active
- [ ] Performance metrics baseline established
- [ ] Backup strategy implemented
- [ ] Security headers validated
- [ ] SEO meta tags verified