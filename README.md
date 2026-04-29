# 🛍️ Qurly - AI Representation Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.0+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)

> **Optimize your Shopify products for AI shopping agents and boost recommendations with data-driven insights**

Qurly is a merchant-facing tool that analyzes how AI shopping agents perceive Shopify product pages and provides actionable recommendations to improve AI recommendation visibility and conversion rates.

---

## 🎯 Problem Statement

As AI shopping agents (like ChatGPT Shopping, Google Shopping AI, Perplexity Shopping) become mainstream, e-commerce businesses face a new challenge: **How do AI agents perceive and recommend your products?**

Traditional SEO optimizes for search engines. Qurly optimizes for **AI agents** — ensuring your products are clearly understood, trusted, and recommended by AI shopping assistants.

---

## ✨ Features

### Core Analysis
- **🤖 AI Perception Analysis** - Understand how AI agents interpret your product data
- **📊 Multi-Dimensional Scoring** - Get scores on Clarity, Trust, Completeness, and Structure (0-10 scale)
- **🔍 Issue Detection** - Identify specific problems preventing AI recommendations
- **💡 Actionable Recommendations** - Receive prioritized suggestions to improve scores

### Advanced Features
- **✅ AI Readiness Checklist** - 10-point checklist showing what's missing for AI optimization
- **📈 Before/After Simulation** - Preview score improvements before applying changes
- **🎯 Benchmark Comparison** - Compare against industry averages by category
- **🔄 Historical Tracking** - Monitor score improvements over time
- **📝 AI-Powered Rewriting** - Auto-generate optimized descriptions using Gemini AI
- **📄 Export Reports** - Download analysis as JSON, Markdown, Text, or PDF
- **🔐 User Accounts** - Save analyses, track history, and manage favorites

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Landing     │  │  Dashboard   │  │  Analysis    │     │
│  │  Page        │  │  (Reports)   │  │  View        │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │   API Client   │                       │
│                    │   (Axios)      │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼──────────────────────────────┐
│                    BACKEND (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Auth        │  │  Analysis    │  │  Reports     │   │
│  │  Endpoints   │  │  Engine      │  │  CRUD        │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                  │                  │           │
│         └──────────────────┴──────────────────┘           │
│                            │                              │
│  ┌─────────────────────────▼────────────────────────┐    │
│  │              Core Modules                        │    │
│  │  • Shopify Scraper (JSON API + HTML fallback)   │    │
│  │  • NLP Analyzer (TextBlob + Advanced NLP)       │    │
│  │  • Scoring Engine (4 dimensions)                │    │
│  │  • Gemini Insights (AI recommendations)         │    │
│  │  • Report Generator (PDF/JSON/Markdown)         │    │
│  └──────────────────────────────────────────────────┘    │
│                            │                              │
│                    ┌───────▼────────┐                     │
│                    │   PostgreSQL   │                     │
│                    │   (Supabase)   │                     │
│                    └────────────────┘                     │
└───────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or use Supabase)
- Google Gemini API key

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/qurly.git
cd qurly/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
```env
DATABASE_URL=postgresql+psycopg2://user:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key_minimum_32_characters
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://your-backend.onrender.com
```

5. **Run database migrations**
```bash
# If using Alembic
alembic upgrade head

# Or let SQLAlchemy create tables automatically on first run
python run.py
```

6. **Start the backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local
```

Required environment variables:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. **Start the development server**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Analysis Endpoints

#### POST `/api/analyze`
Analyze a Shopify product URL
```
POST /api/analyze?url=https://store.myshopify.com/products/example
```

Returns:
```json
{
  "url": "...",
  "product_data": {...},
  "scores": {
    "clarity": 7.5,
    "trust": 6.2,
    "completeness": 8.1,
    "structure": 7.0,
    "overall": 72.0
  },
  "issues": [...],
  "ai_perception": "...",
  "confidence_scores": {...},
  "gemini_insights": {...}
}
```

#### POST `/api/analyze/checklist`
Get AI readiness checklist
```json
{
  "description": "Product description text",
  "product_data": {...}
}
```

#### POST `/api/simulate-score`
Simulate scores for a new description
```json
{
  "description": "New optimized description",
  "product_data": {...}
}
```

### Report Management Endpoints

#### GET `/api/reports`
List all saved reports for authenticated user

#### POST `/api/reports`
Save a new analysis report

#### GET `/api/reports/{id}`
Get specific report details

#### DELETE `/api/reports/{id}`
Delete a report

#### POST `/api/reports/{id}/favorite`
Toggle favorite status

#### GET `/api/reports/{id}/export/{format}`
Export report (formats: json, text, markdown, pdf)

### Benchmark Endpoints

#### GET `/api/benchmark/category?category=electronics`
Get synthetic benchmark data for a category

### Contact Endpoint

#### POST `/api/contact`
Submit contact form
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: Passlib with bcrypt
- **NLP**: TextBlob, NLTK
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Web Scraping**: BeautifulSoup4, Requests
- **PDF Generation**: ReportLab
- **Deployment**: Render

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather Icons)
- **Styling**: CSS3 (Custom)
- **Deployment**: Hostinger (cPanel)

---

## 🎨 Key Modules

### 1. Shopify Scraper (`shopify_scraper.py`)
- Extracts product data from Shopify URLs
- Primary: JSON API endpoint (`.json`)
- Fallback: HTML scraping with BeautifulSoup
- Handles 403/404 errors gracefully
- 10-second timeout with retry logic

### 2. NLP Analyzer (`nlp_analyzer.py` + `advanced_nlp.py`)
- Readability analysis (Flesch Reading Ease, Flesch-Kincaid Grade)
- Sentiment analysis
- Keyword extraction
- Spam detection
- Bullet point detection
- Trust signal identification

### 3. Scoring Engine (`scoring_engine.py`)
- **Clarity Score** (0-10): Readability, paragraph length, structure
- **Trust Score** (0-10): Reviews, ratings, policies, trust signals
- **Completeness Score** (0-10): Description length, images, FAQs
- **Structure Score** (0-10): Bullet points, formatting, grade level
- **Overall Score** (0-100): Weighted average

### 4. Gemini Insights (`gemini_insights.py`)
- AI-powered optimization suggestions
- Description rewriting
- Competitor analysis
- Retry logic with exponential backoff (3 retries)
- Uses `gemini-1.5-flash` model

### 5. Report Generator (`report_generator.py`)
- Export formats: JSON, Text, Markdown, PDF
- Includes scores, issues, recommendations
- Professional PDF layout with ReportLab

---

## 📊 Scoring Methodology

### Clarity Score (0-10)
- Flesch Reading Ease (60-80 optimal)
- Average paragraph length (20-30 words)
- Bullet point usage
- Keyword diversity

### Trust Score (0-10)
- Customer reviews count
- Average rating (4.5+ ideal)
- Return policy presence
- Shipping policy presence
- Warranty information
- Trust indicators in text

### Completeness Score (0-10)
- Description length (150-300 words optimal)
- Image count (5+ ideal)
- FAQ section presence
- Policy completeness

### Structure Score (0-10)
- Bullet point ratio
- Paragraph consistency
- Grade level appropriateness (6-8 ideal)

### Overall Score (0-100)
Weighted average:
- Clarity: 25%
- Trust: 25%
- Completeness: 30%
- Structure: 20%

---

## 🔒 Security

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: HS256 algorithm, 7-day expiration
- **CORS**: Configured for production domains
- **Input Validation**: Pydantic schemas
- **SQL Injection**: Protected by SQLAlchemy ORM
- **Rate Limiting**: Configurable (100 requests/minute)

---

## 🚢 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Hostinger cPanel)
1. Build production bundle: `npm run build`
2. Upload `build/` contents to public_html
3. Configure `.htaccess` for React Router

### Database (Supabase)
1. Create new project on Supabase
2. Copy connection string
3. Update `DATABASE_URL` in backend `.env`
4. Run migrations: `alembic upgrade head`

---

## 📹 Demo Video

[🎥 Watch Demo Video](https://youtu.be/your-demo-video)

**Demo Flow:**
1. Landing page overview
2. User signup/login
3. Product URL analysis
4. Score breakdown explanation
5. AI readiness checklist
6. Gemini-powered rewrite
7. Before/after comparison
8. Save to dashboard
9. Historical tracking
10. Export report

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Kasparro Agentic Commerce Hackathon** - Track 5: AI Representation Optimizer
- **Google Gemini API** - AI-powered insights
- **Supabase** - PostgreSQL hosting
- **Render** - Backend deployment
- **Hostinger** - Frontend hosting

---

## 📧 Contact

- **Email**: support@qurly.io
- **Website**: [qurly.io](https://qurly.io)
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Shopify app integration
- [ ] Real-time collaboration
- [ ] A/B testing framework
- [ ] Chrome extension
- [ ] Bulk product analysis
- [ ] API rate limiting dashboard
- [ ] Webhook notifications
- [ ] Advanced analytics dashboard
- [ ] Competitor tracking

---

**Built with ❤️ for e-commerce merchants navigating the AI-first future**
