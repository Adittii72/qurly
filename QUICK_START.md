# QURLY - Quick Start Guide (For Judges)

**⏱️ 5-Minute Setup** | Get the full system running locally

---

## Prerequisites

- Python 3.8+ (`python --version`)
- Node.js 16+ (`node --version`)
- Git

---

## Step 1: Clone & Setup Backend (2 minutes)

```bash
cd QURLY/backend

# Install dependencies
pip install -r requirements.txt

# Start server
python run.py
```

**Expected Output**:
```
✓ Database initialized
✓ Application startup complete
✓ Uvicorn running on http://127.0.0.1:8000
```

✅ Backend is now running on `http://localhost:8000`

---

## Step 2: Setup Frontend (2 minutes)

*In a new terminal*:

```bash
cd QURLY/frontend

# Install dependencies
npm install

# Start React app
npm start
```

**Expected Output**:
```
Compiled successfully!
You can now view the app in the browser.
  Local:            http://localhost:3000
```

✅ Frontend is now running on `http://localhost:3000`

---

## Step 3: Test the System (1 minute)

### Option A: Run Automated Tests
```bash
cd QURLY/backend
python test_endpoints.py
```

**Expected Output**:
```
✓ PASS - POST /api/analyze/checklist
✓ PASS - GET /api/benchmark/category
✓ PASS - POST /api/contact
...
Test execution completed successfully
```

### Option B: Try the UI
1. Open `http://localhost:3000`
2. Click "Start Analyzing"
3. Enter a Shopify URL: `https://example.myshopify.com/products/test-product`
4. Click "Analyze"
5. See results in 5-10 seconds ✨

---

## API Endpoints Reference

### Health Check
```bash
curl http://localhost:8000/api/health
# Response: {"status": "healthy"}
```

### AI Readiness Checklist
```bash
curl -X POST http://localhost:8000/api/analyze/checklist \
  -H "Content-Type: application/json" \
  -d '{"product_title":"Organic Cotton T-Shirt","product_description":"Premium sustainable..."}'
```

### Category Benchmark
```bash
curl "http://localhost:8000/api/benchmark/category?category=electronics"
# Shows avg scores for Electronics category
```

### Contact Form
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"judge@example.com","message":"Great product!"}'
```

---

## Project Structure

```
QURLY/
├── backend/                    # FastAPI server
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── auth.py            # JWT + password auth
│   │   ├── endpoints.py        # 17 API routes
│   │   ├── models.py           # SQLAlchemy ORM
│   │   ├── database.py         # DB setup
│   │   ├── config.py           # Environment config
│   │   └── modules/            # Analysis modules
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                  # Server startup
│   └── test_endpoints.py        # API tests
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.js              # Main app (with ErrorBoundary)
│   │   ├── components/         # React components
│   │   │   ├── LoginForm.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AIReadinessChecklist.js
│   │   │   ├── ErrorBoundary.js
│   │   │   └── ...
│   │   └── App.css             # Styling
│   ├── package.json            # JS dependencies
│   └── public/index.html        # HTML shell
│
├── README.md                    # Setup guide
├── DECISION_LOG.md              # 13 architecture decisions
├── PRODUCT_THINKING.md          # Problem/solution/market analysis
├── GIT_COMMITS.md               # 13 meaningful commits
├── DEMO_SCRIPT.md               # 5-minute demo walkthrough
├── SUBMISSION_REPORT.md         # This submission (comprehensive)
└── QUICK_START.md               # This file
```

---

## Key Features to Try

### 1. AI Readiness Checklist
- **Demo**: Enter a product title/description
- **See**: Pass/fail on 10 criteria
- **Action**: Shows what to improve

### 2. Score Simulation
- **Demo**: See original vs optimized scores
- **Try**: Rewrite product description
- **See**: Projected score improvement

### 3. Category Benchmarking
- **Demo**: Check Electronics category average
- **See**: Distribution of scores in category
- **Compare**: How your product ranks

### 4. Dashboard
- **After**: You save an analysis (optional)
- **See**: Saved reports with 4-metric scores
- **Action**: Export as JSON/PDF/Markdown

---

## Troubleshooting

### Port Already in Use

**Backend port 8000 is taken?**
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Restart backend
python run.py
```

**Frontend port 3000 is taken?**
```bash
npm start
# React will offer to run on port 3001 instead
# Answer 'y' to use alternative port
```

### Dependencies Installation Fails

```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Clear cache
pip cache purge

# Reinstall
pip install -r requirements.txt
```

### Database Error

The app uses SQLite (zero setup). If you see a database error:

```bash
# Delete old database and let it auto-recreate
rm backend/qurly.db

# Restart server
python run.py
```

---

## Performance Notes

- **Analysis Speed**: 5-10 seconds (Gemini API call)
- **First Load**: 30 seconds (models loading)
- **Subsequent Calls**: 2-5 seconds (cached models)

*If slow, check your internet connection (Gemini API requires network)*

---

## What You're Evaluating

### Judge Checklist ✓

- [ ] **Backend starts** (`python run.py` → healthy)
- [ ] **Frontend starts** (`npm start` → loads on localhost:3000)
- [ ] **API responds** (`curl http://localhost:8000/api/health`)
- [ ] **Analysis works** (Enter Shopify URL → get scores)
- [ ] **Documentation is comprehensive** (Read DECISION_LOG.md)
- [ ] **Code is organized** (Clean separation of concerns)
- [ ] **Error handling works** (Try invalid inputs)
- [ ] **UI is polished** (Professional, responsive design)

---

## Next: Deep Dive

After the quick start, explore:

1. **[DECISION_LOG.md](DECISION_LOG.md)** - Why we made architectural choices
2. **[PRODUCT_THINKING.md](PRODUCT_THINKING.md)** - Market opportunity & strategy
3. **[README.md](README.md)** - Complete feature documentation
4. **[backend/app/endpoints.py](backend/app/endpoints.py)** - See all 17 endpoints
5. **[backend/test_endpoints.py](backend/test_endpoints.py)** - See how system works

---

## Questions?

Check the comprehensive [SUBMISSION_REPORT.md](SUBMISSION_REPORT.md) for:
- Feature explanations
- Architecture decisions
- Test results
- Deployment instructions
- Roadmap & future plans

---

**Ready?** → Run `python run.py` (backend) + `npm start` (frontend) in two terminals, then open `http://localhost:3000` ✨

