#!/bin/bash

# Vercel Deployment Script
# This script will deploy the project to Vercel

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Link project (if not already linked)
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linking project to Vercel..."
    vercel link --yes
fi

# Set environment variables
echo "🔧 Setting environment variables..."
vercel env add DATABASE_URL production <<< "postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
vercel env add DATABASE_URL preview <<< "postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
vercel env add DATABASE_URL development <<< "postgresql://neondb_owner:npg_QXT1iH4ukyWs@ep-shiny-queen-adr8kwr8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Deploy to production
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Check the deployment URL"
echo "   2. Verify environment variables in Vercel Dashboard"
echo "   3. Test API endpoints"

