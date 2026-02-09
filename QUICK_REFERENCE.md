# 📌 QUICK REFERENCE CARD

## Common Commands You'll Use

### Updating Your Site
```bash
# 1. Make changes to your files
# 2. Save the files
# 3. Upload to GitHub:

git add .
git commit -m "Describe what you changed"
git push

# Cloudflare automatically rebuilds in 2-3 minutes!
```

### Adding New Profile Images
```bash
# 1. Add the person to fetch-images.py
# 2. Run the script:
python3 scripts/fetch-images.py

# 3. Upload to GitHub:
git add public/images/
git commit -m "Add new profile images"
git push
```

### Checking Build Status
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click your project
4. See deployment history and logs

### Testing Locally (Optional)
```bash
# In your project folder:
npm install        # First time only
npm start          # Starts local server

# Opens http://localhost:3000 in your browser
# Press Ctrl+C to stop
```

---

## Your Project URLs

**GitHub Repository:**
https://github.com/YOUR-USERNAME/epstein-accountability

**Live Site (Cloudflare):**
https://your-project.pages.dev

**Cloudflare Dashboard:**
https://dash.cloudflare.com

---

## File Structure Reference

```
accountability-project/
├── README.md                    ← Project overview
├── DEPLOYMENT_GUIDE.md          ← Full deployment steps
├── GETTING_FULL_CODE.md         ← How to get your React code
├── package.json                 ← Dependencies list
│
├── public/
│   ├── index.html               ← Main HTML template
│   └── images/
│       └── profiles/            ← Profile photos go here
│           ├── musk.jpg
│           ├── trump.jpg
│           └── ...
│
├── src/
│   ├── index.js                 ← React entry point
│   └── App.jsx                  ← YOUR MAIN APPLICATION CODE
│
└── scripts/
    └── fetch-images.py          ← Wikipedia image downloader
```

---

## Important Reminders

✓ **Always commit and push** after making changes
✓ **Cloudflare auto-deploys** from GitHub - no manual upload needed
✓ **Free tier limits:** Unlimited bandwidth, 500 builds/month
✓ **Images must be** in `public/images/profiles/` folder
✓ **Build time:** 2-5 minutes per deployment

---

## Getting Help

**Build errors?** Check Cloudflare deployment logs
**Code errors?** Check browser console (F12)
**Git errors?** Make sure you're in the project folder
**Image errors?** Verify filenames match exactly

Come back to this chat anytime for help! 🚀
