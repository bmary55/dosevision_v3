#!/bin/bash

echo "🚀 DoseVision Deployment Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""
echo "📝 Logging into Vercel..."
vercel login

echo ""
echo "🔨 Building project locally first..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo ""
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
