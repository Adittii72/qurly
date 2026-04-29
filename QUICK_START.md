# ⚡ Qurly Quick Start Guide

Get Qurly running in 5 minutes.

---

## 🚀 Prerequisites

- Python 3.9+
- Node.js 16+
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))

---

## 🔧 Backend Setup (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env

# 6. Edit .env and add your Gemini API key
# DATABASE_URL=sqlite:///./qurly.db
# GEMINI_API_KEY=your_gemini_api_key_here
# SECRET_KEY=your_jwt_secret_key_minimum_32_characters_long

# 7. Start the server
uvicorn app.main:app --reload
```

Backend will be running at `http://localhost:8000`

---

## 🎨 Frontend Setup (2 minutes)

```bash
# 1. Navigate to frontend (in a new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local

# 4. Edit .env.local
# REACT_APP_API_URL=http://localhost:8000

# 5. Start the development server
npm start
```

Frontend will be running at `http://localhost:3000`

---

## ✅ Verify Installation

1. Open `http://localhost:3000` in your browser
2. You should see the Qurly landing page
3. Click "Sign Up" and create an account
4. Paste a Shopify product URL (e.g., `https://shop.gymshark.com/products/gymshark-speed-t-shirt-black`)
5. Click "Analyze Now"
6. You should see scores and recommendations

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'app'`**
```bash
# Make sure you're in the backend directory
cd backend
# And virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

**Error: `GEMINI_API_KEY not found`**
```bash
# Make sure .env file exists and has GEMINI_API_KEY
cat .env  # macOS/Linux
type .env # Windows
```

**Error: `Port 8000 already in use`**
```bash
# Kill the process using port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Error: `npm: command not found`**
```bash
# Install Node.js from https://nodejs.org/
# Then verify:
node --version
npm --version
```

**Error: `Port 3000 already in use`**
```bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: `REACT_APP_API_URL not defined`**
```bash
# Make sure .env.local file exists
cat .env.local  # macOS/Linux
type .env.local # Windows
# Restart the dev server after creating .env.local
```

---

## 📝 Test Shopify URLs

Use these URLs for testing:

1. **Gymshark** (Fitness Apparel):
   ```
   https://shop.gymshark.com/products/gymshark-speed-t-shirt-black
   ```

2. **Allbirds** (Sustainable Shoes):
   ```
   https://www.allbirds.com/products/mens-wool-runners
   ```

3. **Beardbrand** (Grooming Products):
   ```
   https://www.beardbrand.com/products/utility-beard-oil
   ```

4. **MVMT** (Watches):
   ```
   https://www.mvmt.com/products/classic-black-leather
   ```

5. **Pura Vida** (Jewelry):
   ```
   https://www.puravidabracelets.com/products/original-bracelet
   ```

---

## 🎯 Quick Feature Tour

### 1. Product Analysis
- Paste Shopify URL
- Click "Analyze Now"
- View 4 dimension scores (Clarity, Trust, Completeness, Structure)

### 2. AI Readiness Checklist
- Scroll down after analysis
- See 10-point checklist with pass/fail
- View readiness percentage

### 3. Gemini Rewrite
- Click "Generate AI-Optimized Description"
- View original vs rewritten
- See estimated score boost

### 4. Before/After Simulation
- Click "Simulate Score" after rewrite
- Compare original vs projected scores
- See which dimensions improved

### 5. Dashboard
- Click "Save Analysis" after analyzing
- Click "Dashboard" in navigation
- View all saved reports
- Export, share, or delete reports

---

## 🔑 Environment Variables

### Backend (.env)
```env
# Required
DATABASE_URL=sqlite:///./qurly.db
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_jwt_secret_key_minimum_32_characters_long

# Optional
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
ENVIRONMENT=development
```

### Frontend (.env.local)
```env
# Required
REACT_APP_API_URL=http://localhost:8000
```

---

## 📚 Next Steps

1. **Read the docs**: Check out `README.md` for detailed documentation
2. **Understand decisions**: Read `DECISION_LOG.md` for technical rationale
3. **Learn the product**: Read `PRODUCT_THINKING.md` for product strategy
4. **Deploy**: Follow deployment instructions in `README.md`

---

## 🆘 Need Help?

- **Documentation**: See `README.md`
- **Technical Decisions**: See `DECISION_LOG.md`
- **Product Strategy**: See `PRODUCT_THINKING.md`
- **File Locations**: See `MANIFEST.md`
- **Evaluation**: See `JUDGES_VERIFICATION_CHECKLIST.md`

---

## 🎉 You're Ready!

Qurly is now running locally. Start analyzing Shopify products and optimizing for AI agents!

**Happy analyzing! 🚀**
