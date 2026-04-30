# 🛍️ Qurly - AI Product Optimization Platform

**Kasparro Agentic Commerce Hackathon | April 2026**

Qurly helps Shopify merchants optimize their product listings for AI shopping agents and recommendation systems, ensuring maximum visibility in the age of AI-powered commerce.

---

## 👥 Team Information

**Team Name**: Qurly Team

**Team Members**:
- **Aditi Shrimankar** - Product & Full-Stack Development
- **Bushra Mahek** - Backend Development & AI Integration

**Contact**: aditi1411ss@gmail.com | +91 8799550781

---

## 🎯 Problem Statement

**Track 3: AI Shopping Agents**

In the emerging era of AI-powered shopping, traditional product listings optimized for human browsing are failing to capture AI agent attention. Merchants are losing visibility as AI shopping assistants like ChatGPT Shopping, Google Shopping AI, and Perplexity Shopping become the primary discovery channels.

**The Problem**: 
- 70% of product descriptions lack the structured data AI agents need
- Merchants have no visibility into how AI perceives their products
- No tools exist to optimize listings specifically for AI recommendation algorithms
- Lost sales opportunities as AI agents skip poorly-optimized products

**Our Solution**:
Qurly analyzes product listings through an AI lens, providing actionable insights and optimization recommendations to ensure maximum visibility in AI-powered shopping experiences.

---

## ✨ Key Features

### 🔍 AI Perception Analysis
- Analyze how AI shopping agents interpret your product listings
- Get scores on clarity, trust, completeness, and structure
- Understand AI confidence levels in recommending your products

### 📊 Intelligent Scoring System
- **Clarity Score**: How easy is the description to understand?
- **Trust Score**: Does it build confidence and credibility?
- **Completeness Score**: Is all necessary information included?
- **Structure Score**: Is the content well-organized for AI parsing?

### 🎯 Actionable Recommendations
- Prioritized list of optimization opportunities
- Specific suggestions with expected impact
- AI-powered description rewriting
- Bullet point generation
- Title optimization

### 📈 Performance Tracking
- Historical score tracking over time
- Benchmark comparison against top performers
- Improvement trend visualization
- Multi-product comparison

### 🤖 Gemini AI Integration
- Advanced NLP analysis using Google Gemini
- Sentiment analysis and readability scoring
- Keyword extraction and spam detection
- AI-generated optimization suggestions

### 💾 Dashboard & Analytics
- Save and track multiple product analyses
- View historical improvements
- Export reports for team collaboration
- Daily analysis limits with user authentication

---

## 🏗️ Technical Architecture

### **Frontend**
- **Framework**: React 18.2.0
- **Styling**: Custom CSS with responsive design
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: Vercel

### **Backend**
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn with async support
- **Database**: SQLAlchemy with SQLite (PostgreSQL-ready)
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: Bcrypt via Passlib
- **AI/ML**: 
  - Google Gemini API for advanced insights
  - NLTK for natural language processing
  - TextBlob for sentiment analysis
- **Web Scraping**: BeautifulSoup4 + Requests
- **Deployment**: Render

### **Key Technologies**
- **NLP Processing**: NLTK, TextBlob
- **AI Integration**: Google Generative AI (Gemini)
- **Data Validation**: Pydantic with email-validator
- **Security**: JWT authentication, bcrypt hashing, CORS protection
- **API Documentation**: Auto-generated with FastAPI/Swagger

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 16+
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Download NLTK data**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger'); nltk.download('brown')"
```

5. **Configure environment variables**

Create `backend/.env` file:
```env
PORT=8001
HOST=0.0.0.0
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=sqlite:///./qurly.db
```

6. **Run backend server**
```bash
python run.py
```

Backend will run on: http://localhost:8001

API Documentation: http://localhost:8001/docs

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `frontend/.env.local` file:
```env
REACT_APP_API_URL=http://localhost:8001
```

4. **Run frontend**
```bash
npm start
```

Frontend will run on: http://localhost:3000

---

## 📱 Usage Guide

### 1. **Sign Up / Login**
- Create an account with email and password
- Secure JWT-based authentication
- 5 free analyses per day

### 2. **Analyze a Product**
- Paste any Shopify product URL
- Click "Analyze Now"
- Wait 10-15 seconds for comprehensive analysis

### 3. **Review Insights**
- View overall AI perception score
- Check individual metric scores
- Read prioritized optimization recommendations
- Understand confidence levels

### 4. **Optimize Your Listing**
- Use AI-powered rewrite suggestions
- Generate compelling bullet points
- Optimize product titles
- Apply recommendations

### 5. **Track Progress**
- Save analyses to dashboard
- Compare before/after scores
- Track improvements over time
- Benchmark against competitors

---

## 🎨 Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)

### Analysis Dashboard
![Dashboard](screenshots/dashboard.png)

### AI Insights
![AI Insights](screenshots/ai-insights.png)

### Optimization Recommendations
![Recommendations](screenshots/recommendations.png)

---

## 📹 Demo Video & Resources

**[📁 Google Drive - Project Resources](https://drive.google.com/drive/folders/1aKmtHIunsTFmkYBrDnj6b0GSj85CmQjT?usp=sharing)**

*This folder contains:*
- 🎥 Demo video (3-5 minute screen recording with narration)
- 📸 Screenshots of the application
- 📄 Additional documentation
- 🎨 Presentation materials

*Demo video demonstrates:*
- Product analysis workflow
- AI insights interpretation
- Optimization recommendations
- Dashboard features
- Before/after comparison

---

## 🌐 Live Deployment

### Production URLs
- **Frontend**: https://qurly-frontend.vercel.app
- **Backend API**: https://qurly-backend.onrender.com
- **API Documentation**: https://qurly-backend.onrender.com/docs

### Test Credentials
```
Email: test@qurly.com
Password: testpass123
```

---

## 📊 Project Structure

```
qurly/
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── advanced_nlp.py       # NLP analysis engine
│   │   │   ├── explainability.py     # Confidence scoring
│   │   │   ├── gemini_insights.py    # Gemini AI integration
│   │   │   ├── nlp_analyzer.py       # Text analysis
│   │   │   ├── scoring_engine.py     # Scoring algorithms
│   │   │   ├── shopify_scraper.py    # Product data extraction
│   │   │   └── report_generator.py   # Report generation
│   │   ├── auth.py                   # Authentication logic
│   │   ├── config.py                 # Configuration
│   │   ├── database.py               # Database setup
│   │   ├── endpoints.py              # API endpoints
│   │   ├── main.py                   # FastAPI app
│   │   ├── models.py                 # Database models
│   │   └── schemas.py                # Pydantic schemas
│   ├── requirements.txt              # Python dependencies
│   └── run.py                        # Server startup
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIPerception.js       # AI perception display
│   │   │   ├── AIReadinessChecklist.js
│   │   │   ├── BenchmarkComparison.js
│   │   │   ├── ComparisonView.js     # Product comparison
│   │   │   ├── ConfidenceExplainer.js
│   │   │   ├── Dashboard.js          # User dashboard
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── HistoricalTracking.js # Score tracking
│   │   │   ├── IssuesList.js         # Recommendations
│   │   │   ├── LandingPage.js        # Landing page
│   │   │   ├── LoadingSkeleton.js
│   │   │   ├── LoginForm.js          # Authentication
│   │   │   ├── RecommendationActions.js
│   │   │   ├── RewriteModal.js       # AI rewrite feature
│   │   │   └── ScoreCard.js          # Score display
│   │   ├── styles/
│   │   │   └── LandingPage.css
│   │   ├── App.js                    # Main app component
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json                  # Node dependencies
│   └── vercel.json                   # Vercel config
├── DEPLOY_NOW.md                     # Deployment guide
├── README.md                         # This file
└── render.yaml                       # Render config
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login

### Analysis
- `POST /api/analyze` - Analyze product URL
- `POST /api/rewrite` - AI-powered rewrite
- `POST /api/compare` - Compare two products

### Reports
- `GET /api/reports` - Get user's saved reports
- `POST /api/reports` - Save analysis report
- `GET /api/reports/{id}` - Get specific report
- `GET /api/reports/{id}/history` - Get score history

### Recommendations
- `POST /api/recommendations/generate` - Generate suggestions
- `POST /api/recommendations/apply` - Apply recommendation

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8001/api/health

# Analyze product
curl -X POST "http://localhost:8001/api/analyze?url=https://example.myshopify.com/products/sample"
```

---

## 🤝 Contribution Breakdown

### Aditi Shrimankar
**Role**: Product Lead & Full-Stack Developer

**Responsibilities**:
- Product vision and strategy
- Frontend architecture and development
  - React component design
  - UI/UX implementation
  - Landing page and dashboard
  - Responsive design
- Backend API integration
- User authentication flow
- Deployment configuration (Vercel & Render)
- Documentation and README
- Testing and quality assurance

**Time Split**: 60% Product/Design, 40% Development

### Bushra Mahek
**Role**: Backend Developer & AI Integration Specialist

**Responsibilities**:
- Backend architecture design
- FastAPI endpoint development
- Database schema and models
- NLP analysis engine implementation
- Google Gemini AI integration
- Scoring algorithms
- Shopify scraper development
- Authentication and security
- API documentation

**Time Split**: 70% Development, 30% AI/ML Integration

---

## 📝 Decision Log

### Key Technical Decisions

**1. Framework Selection**
- **Decision**: FastAPI for backend, React for frontend
- **Reasoning**: FastAPI's async support and auto-documentation; React's component reusability
- **Date**: April 2026

**2. AI Integration**
- **Decision**: Google Gemini API for advanced insights
- **Reasoning**: Superior NLP capabilities, cost-effective, easy integration
- **Alternative Considered**: OpenAI GPT-4 (more expensive)

**3. Database Choice**
- **Decision**: SQLite for development, PostgreSQL-ready for production
- **Reasoning**: Quick setup, easy migration path, sufficient for MVP

**4. Authentication Strategy**
- **Decision**: JWT tokens with 7-day expiration
- **Reasoning**: Stateless, scalable, industry standard
- **Security**: Bcrypt hashing with 12 rounds

**5. Deployment Platform**
- **Decision**: Vercel (frontend) + Render (backend)
- **Reasoning**: Free tier, auto-deployment, easy setup
- **Alternative**: AWS (more complex, overkill for MVP)

**6. Scoring Algorithm**
- **Decision**: Multi-factor weighted scoring system
- **Factors**: Clarity (25%), Trust (25%), Completeness (30%), Structure (20%)
- **Reasoning**: Balanced approach covering all AI agent needs

---

## 🔐 Security Features

- JWT-based authentication with secure token generation
- Bcrypt password hashing (12 rounds)
- CORS protection with whitelist
- Input validation using Pydantic
- SQL injection prevention via SQLAlchemy ORM
- Rate limiting ready (5 analyses/day per user)
- Environment variable protection
- HTTPS enforcement in production

---

## 🚧 Known Limitations

1. **Free Tier Constraints**:
   - Render backend sleeps after 15 min inactivity (30-60s cold start)
   - Limited to 5 analyses per day per user

2. **Shopify Scraping**:
   - Some Shopify stores may block scraping
   - Fallback to demo data when scraping fails

3. **AI Analysis**:
   - Gemini API rate limits apply
   - Analysis quality depends on product description length

4. **Database**:
   - SQLite not recommended for high-traffic production
   - Migration to PostgreSQL recommended for scale

---

## 🔮 Future Enhancements

- [ ] Multi-platform support (Amazon, eBay, Etsy)
- [ ] Bulk product analysis
- [ ] A/B testing features
- [ ] Competitor analysis
- [ ] Custom scoring weights
- [ ] Team collaboration features
- [ ] API access for merchants
- [ ] Shopify app integration
- [ ] Real-time monitoring
- [ ] Advanced analytics dashboard

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 📞 Support & Contact

**Email**: aditi1411ss@gmail.com  
**Phone**: +91 8799550781

**GitHub Repository**: https://github.com/Adittii72/qurly

---

## 🙏 Acknowledgments

- **Kasparro** for organizing the Agentic Commerce Hackathon
- **Google** for Gemini API access
- **FastAPI** and **React** communities for excellent documentation
- **Vercel** and **Render** for free hosting tiers

---

## 📋 Submission Checklist

- [x] Product Document
- [x] Technical Document
- [x] Working code in public GitHub repo
- [x] Demo video (3-5 minutes) - [Google Drive](https://drive.google.com/drive/folders/1aKmtHIunsTFmkYBrDnj6b0GSj85CmQjT?usp=sharing)
- [x] README with setup instructions
- [x] Contribution note
- [x] Decision log
- [x] Screenshots
- [x] Live deployment

---

**Built with ❤️ for the Kasparro Agentic Commerce Hackathon | April 2026**

*Optimizing e-commerce for the AI-powered future*
