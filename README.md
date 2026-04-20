# 🛍️ Qurly - AI Representation Optimizer

Build a merchant-facing tool that analyzes how AI shopping agents perceive product pages and provides data-driven recommendations to improve AI recommendation visibility.

## 📊 Features

- **Product Analysis Engine**: Scrape Shopify product pages and extract key data
- **AI Scoring System**: Generate 0-100 score based on 4 metrics (Clarity, Trust, Completeness, Structure)
- **AI Perception Simulation**: Show merchants how AI agents perceive their products
- **Benchmark Comparison**: Compare against ideal product standard
- **Actionable Recommendations**: Ranked, prioritized action items
- **Description Rewrite**: Use Gemini API to optimize product descriptions
- **Interactive Dashboard**: Clean, modern UI showing all insights

## 🏗️ Project Structure

```
QURLY/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── modules/   # Core logic
│   │   ├── main.py    # FastAPI app
│   │   └── schemas.py # Pydantic models
│   └── requirements.txt
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # Windows
   # or
   source venv/bin/activate      # macOS/Linux
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   python -m textblob.download_corpora
   ```

4. **Get Gemini API Key**:
   - Go to https://ai.google.dev/
   - Create a new API key
   - Add to `.env` file: `GEMINI_API_KEY=your_key`

5. **Run backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env.local`**:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Run frontend**:
   ```bash
   npm start
   ```

Frontend will be available at `http://localhost:3000`

## 📝 API Endpoints

- `POST /api/analyze` - Analyze a Shopify product URL
- `POST /api/rewrite-description` - Rewrite product description using Gemini

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python
- **NLP**: spaCy, TextBlob
- **LLM**: Google Gemini API
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
