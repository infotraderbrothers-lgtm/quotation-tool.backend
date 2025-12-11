# Quotation Tool Backend - PDF Generator

This is the backend API for the Trader Brothers Quotation Tool. It converts HTML quotes to PDF format using Puppeteer and Chrome.

## 🚀 Quick Deploy to Railway

### Step 1: Create GitHub Repository

1. Go to GitHub.com and log in
2. Click the **"+"** button (top right) → **"New repository"**
3. Repository name: `quotation-tool-backend`
4. Description: `PDF Generator Backend for Trader Brothers`
5. Make it **Public**
6. **DO NOT** check "Add a README file"
7. Click **"Create repository"**

### Step 2: Upload Files

1. On your new repository page, click **"uploading an existing file"**
2. Upload these 4 files:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `README.md` (this file)
3. Click **"Commit changes"**

### Step 3: Deploy to Railway

1. Go to https://railway.app
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub
4. Click **"New Project"**
5. Click **"Deploy from GitHub repo"**
6. Select **"quotation-tool-backend"** repository
7. Click **"Deploy Now"**
8. Wait 3-5 minutes for deployment

### Step 4: Get Your Backend URL

1. After deployment, click on your project
2. Click on the **"Settings"** tab
3. Scroll down to **"Networking"**
4. Click **"Generate Domain"**
5. Copy the URL (looks like: `https://quotation-tool-backend-production.up.railway.app`)

### Step 5: Update Frontend

Now update your `pdf-generator.js` file with this URL.

Replace this line:
```javascript
const BACKEND_URL = 'YOUR_RAILWAY_URL_HERE';
```

With your actual Railway URL:
```javascript
const BACKEND_URL = 'https://quotation-tool-backend-production.up.railway.app';
```

## 📊 Monitoring Usage

1. Go to Railway dashboard
2. Click on your project
3. Click **"Metrics"** tab
4. You can see:
   - Credit usage
   - Number of requests
   - Response times

## 💰 Cost Estimate

- **Free tier:** $5/month credit
- **Each PDF:** ~$0.0002 (0.02 cents)
- **Estimate:** ~25,000 PDFs per month on free tier

## 🔧 API Endpoints

### Health Check
```
GET /
```
Returns server status

### Generate PDF
```
POST /api/generate-pdf
Content-Type: application/json

{
  "html": "<html>...</html>",
  "filename": "estimate.pdf"
}
```
Returns PDF file

## 🐛 Troubleshooting

**If deployment fails:**
1. Check Railway logs (click "Deployments" → "View Logs")
2. Make sure all files are uploaded correctly
3. Verify Node.js version is 18 or higher

**If PDF generation fails:**
1. Check Railway logs for errors
2. Verify HTML is valid
3. Check that images use absolute URLs (not relative)

**If you run out of credits:**
1. Railway will email you
2. You can add $20/month for unlimited usage
3. Or wait until next month for credit renewal

## 📞 Support

If you need help, check Railway's documentation:
https://docs.railway.app

---

**Created for Trader Brothers Ltd**
Frontend URL: https://infotraderbrothers-lgtm.github.io/quotation.tool/
