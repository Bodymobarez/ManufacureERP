# Vercel Deployment Setup Guide

## 📋 Prerequisites

1. Vercel account
2. GitHub repository connected
3. Neon PostgreSQL database

## 🚀 Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `Bodymobarez/ManufacureERP`
4. Vercel will auto-detect the framework (Vite)

### 2. Configure Build Settings

Vercel will automatically detect:
- **Framework Preset**: Vite
- **Build Command**: `pnpm build` (or `npm run build`)
- **Output Directory**: `dist/spa`
- **Install Command**: `pnpm install` (or `npm install`)

### 3. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

#### Required Variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Optional Variables:

```
NODE_ENV=production
POSTGRES_URL=postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_QXT1iH4ukyWs
POSTGRES_DATABASE=neondb
```

**Important**: Set these for all environments (Production, Preview, Development)

### 4. Deploy Database Migrations

Before deploying, run migrations on your database:

```bash
# Locally or via CI/CD
pnpm db:deploy
```

Or use Vercel's build command to run migrations:

Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "pnpm db:generate && pnpm db:deploy && pnpm build"
  }
}
```

### 5. Deploy

1. Click "Deploy" in Vercel Dashboard
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

## 🔧 Configuration Files

### vercel.json
- Configures routing for SPA and API routes
- Sets up CORS headers
- Defines build settings

### api/index.ts
- Serverless function handler for all API routes
- Wraps Express app with serverless-http
- Handles CORS and error handling

## 📝 Post-Deployment Checklist

- [ ] Verify API endpoints work: `/api/ping`, `/api/health`
- [ ] Test database connection: `/api/health`
- [ ] Verify frontend loads correctly
- [ ] Test authentication (if applicable)
- [ ] Check environment variables are set correctly
- [ ] Verify CORS is working for API calls

## 🐛 Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 18+)
4. Check for TypeScript errors: `pnpm typecheck`

### API Routes Not Working

1. Verify `api/index.ts` exists
2. Check `vercel.json` rewrites configuration
3. Ensure `serverless-http` is installed
4. Check server logs in Vercel Dashboard

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Check Neon database is accessible
3. Ensure SSL mode is set: `?sslmode=require`
4. Verify Prisma Client is generated: `pnpm db:generate`

### CORS Errors

1. Check `vercel.json` headers configuration
2. Verify CORS middleware in `server/index.ts`
3. Check browser console for specific errors

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

