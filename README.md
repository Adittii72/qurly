# 🛍️ Qurly - AI Product Optimization Platform

Qurly helps Shopify merchants optimize their product listings for AI shopping agents and recommendation systems.

## 🌟 Features

- **AI-Powered Analysis**: Analyze product descriptions using advanced NLP
- **Smart Scoring**: Get scores on clarity, trust, completeness, and structure
- **Actionable Insights**: Receive specific recommendations to improve AI visibility
- **Gemini Integration**: AI-powered rewriting and optimization suggestions
- **Dashboard**: Track analysis history and improvements over time
- **Comparison Tools**: Compare products and benchmark against top performers

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 16+
- Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger'); nltk.download('brown')"

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run backend
python run.py
```

Backend will run on http://localhost:8001

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local if needed (default: http://localhost:8001)

# Run frontend
npm start
```

Frontend will run on http://localhost:3000

## 📦 Deployment

### Deploy to Production

See detailed deployment guides:
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Deployment checklist
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Quick reference commands

### Quick Deployment Summary

**Backend (Render)**:
1. Push code to GitHub
2. Create Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Deploy

**Frontend (Vercel)**:
1. Import project from GitHub
2. Set `REACT_APP_API_URL` environment variable
3. Deploy

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=8001
HOST=0.0.0.0
ENVIRONMENT=production
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///./qurly.db
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 📚 API Documentation

Once the backend is running, visit:
- Local: http://localhost:8001/docs
- Production: https://your-backend-url.onrender.com/docs

## 🏗️ Project Structure

```
qurly/
├── backend/
│   ├── app/
│   │   ├── modules/          # Analysis modules
│   │   ├── auth.py           # Authentication
│   │   ├── database.py       # Database setup
│   │   ├── endpoints.py      # API endpoints
│   │   ├── main.py           # FastAPI app
│   │   ├── models.py         # Database models
│   │   └── schemas.py        # Pydantic schemas
│   ├── requirements.txt      # Python dependencies
│   └── run.py               # Startup script
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js           # Main app
│   │   └── index.js         # Entry point
│   ├── package.json         # Node dependencies
│   └── vercel.json          # Vercel config
├── render.yaml              # Render config
└── README.md
```

## 🧪 Testing

### Test Backend
```bash
cd backend
python -m pytest
```

### Test Frontend
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

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **NLTK** - Natural language processing
- **Google Gemini** - AI-powered insights
- **BeautifulSoup** - Web scraping

### Frontend
- **React** - UI framework
- **React Icons** - Icon library
- **Axios** - HTTP client

## 📊 Features in Detail

### Analysis Engine
- NLP-based text analysis
- Sentiment analysis
- Readability scoring
- Keyword extraction
- Spam detection

### Scoring System
- **Clarity**: How easy is the description to understand?
- **Trust**: Does it build confidence and credibility?
- **Completeness**: Is all necessary information included?
- **Structure**: Is the content well-organized?

### AI Optimization
- Description rewriting
- Bullet point generation
- Title optimization
- SEO improvements

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- CORS protection
- Input validation
- Rate limiting (recommended for production)

## 📈 Monitoring

### Render (Backend)
- View logs: Dashboard → Your Service → Logs
- Monitor metrics: Dashboard → Your Service → Metrics

### Vercel (Frontend)
- View analytics: Project → Analytics
- Check deployments: Project → Deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📞 Support

For issues or questions:
- Email: aditi1411ss@gmail.com
- Phone: +91 8799550781

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Bulk product analysis
- [ ] A/B testing features
- [ ] Advanced analytics dashboard
- [ ] Integration with Shopify API
- [ ] Competitor analysis
- [ ] Custom scoring weights

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- FastAPI for the excellent framework
- React community for amazing tools

---

**Version**: 1.0.0  
**Last Updated**: April 30, 2026  
**Status**: Production Ready ✅
