# 🛍️ Qurly - AI Representation Optimizer

> **Merchant-facing analytics tool that analyzes how AI shopping agents perceive Shopify product pages and provides actionable recommendations to improve AI recommendation visibility**

---

## 🎯 Problem Statement

AI shopping agents (like Google Shopping, Amazon, and emerging agentic commerce platforms) are becoming crucial for product discovery. However, many merchants don't understand how these agents perceive their product pages. 

**Qurly solves this** by analyzing products through an AI agent's lens and providing specific, data-driven optimizations to improve visibility and recommendation likelihood.

## 👥 Who Is This For?

- **Shopify Merchants** - Want to maximize visibility to AI shopping agents
- **E-commerce Teams** - Need data on how AI agents perceive product listings  
- **Product Managers** - Optimizing product information architecture

## ✨ Key Features

| Feature | Description |
|---------|-----------|
| **AI Perception Analysis** | See exactly how AI agents perceive your product |
| **4-Metric Scoring System** | Clarity, Trust, Completeness, Structure (0-10 each) |
| **Issue Detection** | Identify specific problems blocking AI recommendations |
| **Confidence Explainability** | Understand WHY each score is what it is |
| **AI Readiness Checklist** | 10-point checklist of AI readiness criteria |
| **Description Rewriting** | Get Gemini-powered optimized descriptions |
| **Before/After Simulation** | See how changes impact scores |
| **Historical Tracking** | Monitor improvements over time |
| **Multi-Product Benchmarking** | Compare against category averages |
| **Report Generation** | Export as JSON, Text, Markdown, or PDF |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      QURLY PLATFORM                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────┐         │
│  │  React Frontend  │◄────────►│  FastAPI Backend  │        │
│  │  (Hostinger)     │ (REST)   │  (Render)         │        │
│  └──────────────────┘          └──────────────────┘        │
│         │                              │                     │
│         │                              ├─► Shopify Scraper   │
│         │                              │   (JSON + HTML)     │
│         │                         ┌────┴────────────┐       │
│         │                         │   Core Modules  │       │
│         │                         ├─────────────────┤       │
│         │                         │ • NLP Analysis  │       │
│         │                         │ • Scoring Eng.  │       │
│         │                         │ • Gemini AI     │       │
│         │                         │ • Reporting     │       │
│         │                         └─────────────────┘       │
│         │                                                    │
│         └────────────────►┌──────────────────┐             │
│                           │   Supabase       │             │
│                           │   PostgreSQL     │             │
│                           │   (Production)   │             │
│                           └──────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern component-based UI
- **React Icons** - Professional icon library
- **Axios** - HTTP client
- **CSS Grid/Flexbox** - Responsive design
- **Error Boundaries** - Graceful error handling

### Backend
- **FastAPI** - High-performance Python framework
- **SQLAlchemy 2.0** - ORM for both SQLite & PostgreSQL
- **Pydantic** - Type-safe data validation
- **Google Gemini API** - AI-powered suggestions
- **TextBlob** - NLP analysis (sentiment, readability)
- **BeautifulSoup** - HTML scraping (fallback)
- **ReportLab** - PDF generation

### Database
- **Supabase PostgreSQL** - Production database (free tier)
- **SQLite** - Local development database

### Deployment
- **Render** - FastAPI backend (free tier)
- **Hostinger cPanel** - Static React hosting

## 📋 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- Google Gemini API key (free at https://makersuite.google.com)
- Optional: Supabase account for production

### Backend Setup (Local)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
# or
source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=sqlite:///./qurly.db
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your-secret-key-min-32-characters
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
ENVIRONMENT=development
DEBUG=true
EOF

# Initialize database
python -c "from app.database import init_db; init_db()"

# Start backend (http://localhost:8000)
python run.py
```

### Frontend Setup (Local)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server (http://localhost:3000)
npm start
```

### Production Deployment

#### Backend on Render
1. Create Render account (https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set environment variables:
   - `DATABASE_URL` - Supabase PostgreSQL connection string
   - `GEMINI_API_KEY` - Your Gemini API key
   - Other env vars from `.env.example`
5. Deploy

#### Database on Supabase
1. Create Supabase project (https://supabase.com)
2. Get PostgreSQL connection string: `postgresql+psycopg2://user:pass@host:5432/db`
3. Add to `DATABASE_URL` in Render environment

#### Frontend on Hostinger cPanel
1. Build: `npm run build`
2. Upload `build/` folder to public_html
3. Configure `.htaccess` for SPA routing

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account (email + password)
- `POST /api/auth/login` - Login (email + password)
- `GET /api/users/me` - Get current user

### Analysis
- `POST /api/analyze` - Analyze Shopify product
- `POST /api/analyze/checklist` - Generate AI readiness checklist
- `POST /api/simulate-score` - Simulate scores for description

### Reports
- `GET /api/reports` - List user's reports
- `POST /api/reports` - Save new report
- `GET /api/reports/{id}` - Get report details
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/{id}/favorite` - Toggle favorite

### Export
- `GET /api/reports/{id}/export/json` - Export as JSON
- `GET /api/reports/{id}/export/text` - Export as text
- `GET /api/reports/{id}/export/markdown` - Export as Markdown
- `GET /api/reports/{id}/export/pdf` - Export as PDF

### Advanced
- `GET /api/reports/{id}/history` - Historical tracking
- `GET /api/benchmark/category?category=electronics` - Category benchmarks
- `POST /api/contact` - Contact form

## 🎨 React Components

```
App (Main)
├── ErrorBoundary (Error handling)
├── LoginForm (Authentication)
├── LandingPage (Marketing home)
├── Dashboard (Report management)
│   └── LoadingSkeleton (Loading state)
├── Analysis View
│   ├── ScoreCard (4 metrics display)
│   ├── IssuesList (Problems detected)
│   ├── AIPerception (AI agent view)
│   ├── BenchmarkComparison (vs category)
│   ├── BeforeAfter (Description preview)
│   ├── AIReadinessChecklist (10-point checklist)
│   └── RecommendationActions (AI suggestions)
├── Report Detail
│   ├── ConfidenceExplainer (Why scores)
│   └── HistoricalTracking (Trends)
└── ComparisonView (Multi-product)
```

## 📊 Scoring Methodology

### 4-Metric System (AI-Optimized)

**Clarity Score** (0-10)
- How clearly AI agents understand the product
- Based on: title clarity, description readability, structure
- Ideal: Clear attributes, specific benefits

**Trust Score** (0-10)
- Legitimacy and quality signals
- Based on: reviews, return policy, warranty
- Ideal: Social proof, risk mitigation

**Completeness Score** (0-10)
- Information availability
- Based on: description length, specs, images
- Ideal: Comprehensive without fluff

**Structure Score** (0-10)
- Content organization for AI readability
- Based on: bullet points, paragraphs, formatting
- Ideal: Scannable, well-formatted

**Overall Score** = Average of 4 metrics

### Score Interpretation
- **8-10**: Excellent - likely ranks well in AI recommendations
- **7-8**: Good - strong baseline with minor tweaks
- **6-7**: Average - optimization opportunities
- **4-6**: Below average - significant issues
- **<4**: Critical - blocking AI recommendations

## 🤖 AI Features

### Powered by Google Gemini 1.5 Flash
- Fast inference (suitable for Render free tier)
- Free tier availability
- Good at structured product analysis

### Smart Retry Logic
- 3 automatic retries with exponential backoff
- 1s → 2s → 4s delays
- Handles rate limiting gracefully

### AI Readiness Checklist
Validates 10 key criteria:
1. Product title descriptive
2. Description 150-300 words
3. Has customer reviews
4. Has return policy
5. Has shipping info
6. 3+ product images
7. Price clearly listed
8. Structured formatting
9. Searchable keywords
10. FAQ section

## 🔐 Security

- **JWT Authentication** - Token-based access
- **Bcrypt Password Hashing** - Secure password storage
- **CORS Protection** - Whitelisted domains only
- **Pydantic Validation** - Type-safe inputs
- **SQL Injection Protection** - Parameterized queries (SQLAlchemy)
- **Environment Secrets** - Never in source code

## 🚢 Production Considerations

### Performance
- SQLAlchemy connection pooling (5 pool size, 10 overflow)
- Database index on `user_id` and `product_url`
- Lazy loading for related objects
- Frontend code splitting ready

### Monitoring
- Error logging on backend
- Render error tracking
- Client-side error boundaries

### Rate Limiting
- Shopify scraper: 10s timeout, 3 max retries
- Gemini API: 3 retries with backoff
- Request validation on all endpoints

### Scalability
- Stateless FastAPI design
- Database-agnostic ORM (supports PostgreSQL)
- Horizontal scaling ready

## 📈 File Structure

```
QURLY/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app + routes
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── config.py            # Settings management
│   │   ├── auth.py              # Auth schemas + utilities
│   │   ├── models.py            # ORM models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── endpoints.py         # API routes
│   │   └── modules/             # Core business logic
│   │       ├── shopify_scraper.py      # Product scraping
│   │       ├── nlp_analyzer.py         # Text analysis
│   │       ├── advanced_nlp.py         # Advanced NLP
│   │       ├── scoring_engine.py       # Scoring logic
│   │       ├── explainability.py       # Score reasoning
│   │       ├── gemini_insights.py      # AI suggestions
│   │       └── report_generator.py     # Export formats
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── components/
│   │       ├── ErrorBoundary.js         # Error handling
│   │       ├── LoadingSkeleton.js       # Loading UI
│   │       ├── LoginForm.js             # Auth UI
│   │       ├── Dashboard.js             # Report list
│   │       ├── ScoreCard.js             # Score display
│   │       ├── IssuesList.js            # Issues UI
│   │       ├── AIPerception.js          # AI view
│   │       ├── BenchmarkComparison.js   # Benchmarks
│   │       ├── BeforeAfter.js           # Description preview
│   │       ├── AIReadinessChecklist.js  # Checklist
│   │       ├── RecommendationActions.js # Suggestions
│   │       ├── ConfidenceExplainer.js   # Score reasons
│   │       ├── HistoricalTracking.js    # Trends
│   │       ├── RewriteModal.js          # Modal
│   │       ├── ComparisonView.js        # Comparison
│   │       └── LandingPage.js           # Home page
│   ├── package.json
│   └── .env.example
│
├── README.md
├── DECISION_LOG.md
└── .env.example
```

## 🚀 Getting Started

1. **Clone & Setup**: Follow setup instructions above
2. **Get API Key**: [Google Gemini API](https://makersuite.google.com)
3. **Test**: Navigate to http://localhost:3000
4. **Deploy**: See production deployment section

## 📝 Environment Variables

### Backend (`.env`)
```
# Database (choose one)
DATABASE_URL=sqlite:///./qurly.db
# OR
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db

# APIs
GEMINI_API_KEY=your_api_key

# Security
SECRET_KEY=min-32-characters
JWT_SECRET_KEY=min-32-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Environment
ENVIRONMENT=development
DEBUG=true
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:8000
```

## 🎓 Key Design Decisions

See [DECISION_LOG.md](./DECISION_LOG.md) for detailed architectural choices.

**Highlights**:
- ✅ Gemini 1.5 Flash over OpenAI (free tier, fast)
- ✅ SQLAlchemy ORM (database agnostic)
- ✅ JWT auth (stateless, scalable)
- ✅ Supabase (free tier doesn't delete data)
- ✅ React hooks (simple state management)

## 📊 Usage Example

```bash
# 1. Analyze a product
curl -X POST http://localhost:8000/api/analyze?url=https://example.myshopify.com/products/...

# 2. Response includes:
{
  "scores": {
    "clarity_score": 7.2,
    "trust_score": 6.8,
    "completeness_score": 7.5,
    "structure_score": 7.1,
    "overall_score": 7.15
  },
  "issues": [...],
  "ai_perception": {...},
  "gemini_insights": {...}
}
```

## 🧪 Testing

```bash
# Backend tests (if added)
cd backend && pytest

# Frontend tests
cd frontend && npm test
```

## 📞 Support

- **Email**: Use contact form in app
- **Docs**: See inline code comments
- **Issues**: Submit via app contact form

## 🎯 Roadmap

### Current (Phase 1 - MVP)
- ✅ Product analysis
- ✅ AI scoring
- ✅ Gemini suggestions
- ✅ Reports export
- ✅ Historical tracking

### Future (Phase 2)
- [ ] Video product analysis
- [ ] Multi-platform scraping
- [ ] Competitor analysis
- [ ] A/B testing
- [ ] Shopify webhook sync
- [ ] Bulk uploads
- [ ] Team collaboration

## 📄 License

MIT - See LICENSE file

## 🙏 Acknowledgments

- Kasparro Agentic Commerce Hackathon
- Google Gemini API team
- Supabase and Render for free tiers

---

**Built with ❤️ for the Kasparro Agentic Commerce Hackathon**

*Track 5: AI Representation Optimizer*  
*Submission Date: April 30, 2026*

- **Frontend**: React, Tailwind CSS
- **Scraping**: BeautifulSoup4

## 📊 Scoring System

Score breakdown:
- **Clarity** (25%): How clear and readable is the description?
- **Trust** (25%): How trustworthy? (reviews, policies, certifications)
- **Completeness** (30%): How complete? (specs, images, FAQs, policies)
- **Structure** (20%): How well-structured? (formatting, bullet points)

## 🤝 Contributing

This is a solo project. Contributions welcome!

## 📜 License

MIT
