# Epstein Accountability Index - Deployment Guide

## What This Is
A transparency website tracking individuals mentioned in the Epstein files, their government connections, and taxpayer-funded contracts.

## Prerequisites
- GitHub account ✓ (you have this)
- Cloudflare account ✓ (you have this)
- A domain name (we'll help you choose)

## Quick Start Deployment Steps

### Step 1: Upload Code to GitHub
1. Go to https://github.com/new
2. Name your repository: `epstein-accountability` (or whatever you prefer)
3. Keep it **PUBLIC** (for free Cloudflare Pages hosting)
4. Click "Create repository"
5. Follow the instructions below to upload files

### Step 2: Connect to Cloudflare Pages
1. Log into Cloudflare: https://dash.cloudflare.com
2. Click "Workers & Pages" in left sidebar
3. Click "Create application" → "Pages" → "Connect to Git"
4. Select your GitHub repository
5. Build settings:
   - **Framework preset**: Create React App
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
6. Click "Save and Deploy"
7. Wait 2-3 minutes - your site will be live!

### Step 3: Add Custom Domain (Optional)
1. In Cloudflare Pages, go to your project
2. Click "Custom domains" tab
3. Add your domain
4. Follow DNS instructions

## Files in This Package

```
accountability-project/
├── README.md (this file)
├── package.json (dependencies)
├── public/
│   └── index.html (main HTML file)
├── src/
│   ├── App.jsx (main React component)
│   └── index.js (entry point)
└── scripts/
    └── fetch-images.py (Wikipedia image downloader)
```

## Next Steps After Deployment

1. Run the image fetcher script to get profile photos
2. Test the site thoroughly
3. Share for feedback
4. Monitor for issues

## Need Help?
This guide assumes minimal coding knowledge. Each step is designed to be copy-paste simple.
