# 🚀 Deploy Qurly Now - Simple Steps

All code changes are done! Just follow these steps.

---

## Step 1: Push to GitHub (5 minutes)

```bash
# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Push to GitHub (create repo first if needed)
git push origin main
```

**If you don't have a GitHub repo yet:**
1. Go to https://github.com/new
2. Create a new repository named "qurly"
3. Don't initialize with README (you already have one)
4. Copy the commands shown and run them

---

## Step 2: Deploy Backend on Render (10 minutes)

### 2.1 Create Account & Service
1. Go to https://render.com
2. Sign up / Log in
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** to link GitHub
5. Select your **qurly** repository
6. Click **"Connect"**

### 2.2 Configure Service

**Basic Settings:**
- **Name**: `qurly-backend`
- **Region**: `Oregon` (or closest to you)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Start:**
- **Build Command**: 
  ```
  pip install -r requirements.txt && python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger'); nltk.download('brown')"
  ```
- **Start Command**: 
  ```
  python run.py
  ```

**Plan:**
- Select **Free**

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 7 variables:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `PORT` | `8001` |
| `HOST` | `0.0.0.0` |
| `ENVIRONMENT` | `production` |
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `DATABASE_URL` | `sqlite:///./qurly.db` |

**To generate SECRET_KEY:**
- Windows PowerShell: Use an online generator or any random 64-character string
- Mac/Linux: Run `openssl rand -hex 32` in terminal

**To get GEMINI_API_KEY:**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll see a URL like: `https://qurly-backend-xxxx.onrender.com`
4. **SAVE THIS URL** - you'll need it for frontend!

### 2.5 Test Backend

Visit: `https://your-backend-url.onrender.com/docs`

You should see the API documentation page. ✅

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

### 3.1 Create Account & Import Project
1. Go to https://vercel.com
2. Sign up / Log in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find and select your **qurly** repository
5. Click **"Import"**

### 3.2 Configure Project

**Framework Preset:** `Create React App` (auto-detected)

**Build Settings:**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3.3 Add Environment Variable

Click **"Environment Variables"**

Add this variable:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | Your Render backend URL (from Step 2.4) |

Example: `https://qurly-backend-xxxx.onrender.com`

**Important:** Use the EXACT URL from Render, no trailing slash!

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes
3. You'll get a URL like: `https://qurly-frontend.vercel.app`
4. **SAVE THIS URL** - this is your live app!

### 3.5 Test Frontend

Visit your Vercel URL and test:
- Landing page loads ✅
- Sign up works ✅
- Login works ✅
- Product analysis works ✅

---

## Step 4: Update CORS (2 minutes)

Now that you have your Vercel URL, update the backend CORS:

### 4.1 Edit backend/app/main.py

Find this section (around line 30):
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*.vercel.app",
    "https://qurly-frontend.vercel.app",  # Update this line
],
```

Replace `qurly-frontend.vercel.app` with YOUR actual Vercel URL.

### 4.2 Push Changes

```bash
git add backend/app/main.py
git commit -m "Update CORS with production URL"
git push origin main
```

Render will automatically redeploy (takes 2-3 minutes).

---

## 🎉 You're Live!

Your app is now deployed:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **API Docs**: https://your-backend.onrender.com/docs

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds (cold start)
- ✅ 750 hours/month free
- ✅ Automatic HTTPS

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always fast (no cold starts)
- ✅ Automatic HTTPS

### Upgrading (Optional)

To eliminate cold starts:
- Render Starter Plan: $7/month
- Keeps backend always running
- Instant response times

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Build fails
- Check environment variables are set correctly
- Verify GEMINI_API_KEY is valid
- Check Render logs for specific errors

**Problem**: Cold starts are slow
- This is normal for free tier
- First request after 15 min takes 30-60 seconds
- Subsequent requests are fast
- Upgrade to paid plan to eliminate

**Problem**: API returns 500 errors
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set
- Test endpoints at `/docs`

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `REACT_APP_API_URL` is correct
- Check it matches your Render URL exactly
- No trailing slash in URL
- Redeploy frontend after changing env vars

**Problem**: CORS errors in browser console
- Update CORS in `backend/app/main.py`
- Add your Vercel URL to `allow_origins`
- Push changes to trigger redeploy

**Problem**: 404 on page refresh
- Already handled by `vercel.json`
- If still happening, check Vercel logs

---

## 📊 Monitoring

### Check Backend Status
- Render Dashboard: https://dashboard.render.com
- View logs, metrics, and deployment history

### Check Frontend Status
- Vercel Dashboard: https://vercel.com/dashboard
- View analytics, deployments, and logs

---

## 🔄 Making Updates

After deployment, to update your app:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

Both Render and Vercel will automatically redeploy! 🚀

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed on Render
- [ ] Backend URL saved
- [ ] Environment variables set on Render
- [ ] Backend tested at `/docs`
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] `REACT_APP_API_URL` set on Vercel
- [ ] Frontend tested in browser
- [ ] CORS updated with Vercel URL
- [ ] Changes pushed to GitHub
- [ ] Full app tested end-to-end

---

## 🎯 Next Steps

1. Share your app URL with users
2. Set up custom domain (optional)
3. Monitor usage and errors
4. Collect user feedback
5. Plan new features

---

## 📞 Need Help?

- **Email**: aditi1411ss@gmail.com
- **Phone**: +91 8799550781
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Estimated Total Time**: 20-25 minutes

**Difficulty**: Easy ⭐⭐☆☆☆

**Cost**: Free (with limitations)

---

Good luck with your deployment! 🚀
