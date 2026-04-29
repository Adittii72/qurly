# 📊 Qurly User Dashboard - Complete Workflow Guide

## 🎯 Overview

This document walks through the complete user-side dashboard workflow, showing where each feature is implemented and what the expected outcome is.

---

## 🚀 Servers Running

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Status**: ✅ Both servers running successfully

---

## 📋 Complete User Journey

### 1. Landing Page (First Visit)

**URL**: `http://localhost:3000`

**File**: `frontend/src/components/LandingPage.js`

**What You See**:
- Hero section with project tagline
- "Sign Up" and "Login" buttons
- Features section (3 cards: Analyze, Score, Optimize)
- How It Works section (3 steps)
- About section
- Contact form
- Footer

**Expected Outcome**:
- Clean, professional landing page
- All sections visible
- Buttons are clickable

**Actions Available**:
1. Click "Sign Up" → Opens signup modal
2. Click "Login" → Opens login modal
3. Scroll to "Contact" → Fill and submit form
4. Click "Get Started" → Redirects to app (requires login)

---

### 2. Sign Up Flow

**Trigger**: Click "Sign Up" button on landing page

**File**: `frontend/src/components/LoginForm.js`

**Backend Endpoint**: `POST /api/auth/signup`
**Backend File**: `backend/app/endpoints.py` (lines 40-72)

**What You See**:
- Modal with signup form
- Fields:
  - Email (required)
  - Username (required)
  - Password (required, min 8 characters)
  - Confirm Password (required, must match)
- Password visibility toggle (eye icon)
- "Sign Up" button

**Expected Outcome**:
1. Fill in all fields
2. Click "Sign Up"
3. Backend creates user with bcrypt-hashed password
4. JWT token generated and stored in localStorage
5. User automatically logged in
6. Redirected to main app view

**Backend Process**:
```python
# backend/app/endpoints.py
@router.post("/auth/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    # 2. Check if username already taken
    # 3. Hash password with bcrypt
    # 4. Create new user in database
    # 5. Generate JWT token
    # 6. Return token + user data
```

**Database Changes**:
- New row in `users` table
- Fields: id, email, username, password_hash, created_at

---

### 3. Login Flow

**Trigger**: Click "Login" button on landing page

**File**: `frontend/src/components/LoginForm.js`

**Backend Endpoint**: `POST /api/auth/login`
**Backend File**: `backend/app/endpoints.py` (lines 75-95)

**What You See**:
- Modal with login form
- Fields:
  - Email (required)
  - Password (required)
- Password visibility toggle
- "Login" button
- Link to switch to signup

**Expected Outcome**:
1. Enter email and password
2. Click "Login"
3. Backend verifies password with bcrypt
4. JWT token generated and stored in localStorage
5. User logged in
6. Redirected to main app view

**Backend Process**:
```python
# backend/app/endpoints.py
@router.post("/auth/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Find user by email
    # 2. Verify password with bcrypt
    # 3. Generate JWT token
    # 4. Return token + user data
```

**Error Handling**:
- Invalid email → "Invalid email or password"
- Wrong password → "Invalid email or password"
- No password set → "Password not set. Please use Google OAuth or reset password"

---

### 4. Main App View (After Login)

**URL**: `http://localhost:3000` (after authentication)

**File**: `frontend/src/App.js`

**What You See**:
- Navigation bar with:
  - Qurly logo (click to go back to landing)
  - Welcome message with username
  - "Dashboard" button
  - Logout button
- Hero section with:
  - Title: "Optimize Your Shopify Products for AI Agents"
  - URL input field
  - "Analyze Now" button
- Features section (if no analysis yet)

**Expected Outcome**:
- User is authenticated
- Can paste Shopify URL and analyze
- Can navigate to dashboard
- Can logout

---

### 5. Product Analysis Flow

**Trigger**: Paste Shopify URL and click "Analyze Now"

**File**: `frontend/src/App.js` (handleAnalyze function)

**Backend Endpoint**: `POST /api/analyze?url={shopify_url}`
**Backend File**: `backend/app/main.py` (lines 70-150)

**What You See During Analysis**:
1. **Loading State** (2-3 seconds):
   - File: `frontend/src/components/LoadingSkeleton.js`
   - Shimmer effect on placeholders
   - Spinner with "Analyzing your product with AI..."
   - Message: "This may take a few seconds"

**What You See After Analysis**:

#### A. AI Perception Overview
**File**: `frontend/src/components/AIPerception.js`
- Overall score (0-100) with color coding
- AI perception summary (e.g., "⚠️ Moderate - Room for Improvement")
- Reasoning text

#### B. AI Readiness Checklist ✨ NEW FEATURE
**File**: `frontend/src/components/AIReadinessChecklist.js`
**Backend Endpoint**: `POST /api/analyze/checklist`
**Backend File**: `backend/app/endpoints.py` (lines 350-430)

**What You See**:
- Progress bar showing readiness percentage (0-100%)
- Color-coded: Green (80%+), Orange (60-80%), Red (<60%)
- 10-point checklist with:
  - ✅ Green checkmarks for passed items
  - ❌ Red X marks for failed items
  - Category (e.g., "Product Title", "Description", "Trust Signals")
  - Check description
  - 💡 Tip for improvement
- Summary cards:
  - Passed count
  - Needs Work count
  - Readiness percentage

**Checklist Items**:
1. Title is descriptive and includes key attributes
2. Description is 150-300 words
3. Has customer reviews
4. Has return policy
5. Has shipping info
6. Has at least 3 product images
7. Price is clearly listed
8. Uses bullet points or structured formatting
9. Contains specific, searchable keywords
10. Has FAQ section

**Expected Outcome**:
- User sees exactly what's missing
- Gets actionable tips for each failed item
- Understands overall AI readiness

#### C. Confidence Explainer
**File**: `frontend/src/components/ConfidenceExplainer.js`
- Breakdown of confidence scores
- Factor contributions
- Explanation of scoring methodology

#### D. Performance Metrics (4 Scores)
**File**: `frontend/src/components/ScoreCard.js` (used 4 times)
- **Clarity Score** (0-10): Readability, paragraph length, structure
- **Trust Score** (0-10): Reviews, ratings, policies
- **Completeness Score** (0-10): Description length, images, FAQs
- **Structure Score** (0-10): Bullet points, formatting

**Backend Calculation**:
**File**: `backend/app/modules/scoring_engine.py`
- All scores clamped between 0-10 (no negatives, no >10)
- Weighted average for overall score

#### E. Benchmark Comparison
**File**: `frontend/src/components/BenchmarkComparison.js`
**Backend Endpoint**: `GET /api/benchmark/category?category=electronics`
**Backend File**: `backend/app/endpoints.py` (lines 550-600)

**What You See**:
- Bar chart comparing your scores to category average
- Distribution (Excellent, Good, Average, Below Average)
- Product count in category

#### F. Issues List
**File**: `frontend/src/components/IssuesList.js`
- Prioritized list of issues (HIGH, MEDIUM, LOW)
- Each issue shows:
  - Priority badge
  - Title
  - Description
  - Suggestion
  - Estimated impact

#### G. Recommendation Actions
**File**: `frontend/src/components/RecommendationActions.js`
- "Generate AI-Optimized Description" button
- "Compare with Another Product" button

---

### 6. Gemini Rewrite Flow

**Trigger**: Click "Generate AI-Optimized Description"

**File**: `frontend/src/components/RewriteModal.js`

**Backend Endpoint**: `POST /api/rewrite-description`
**Backend File**: `backend/app/main.py` (lines 153-200)

**Backend AI Integration**:
**File**: `backend/app/modules/gemini_insights.py`
- Uses `gemini-1.5-flash` model
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)
- 30-second timeout

**What You See**:
1. Modal opens
2. Loading spinner (2-5 seconds)
3. Side-by-side comparison:
   - **Left**: Original description
   - **Right**: Rewritten description
4. Improvements list:
   - ✅ Simplified language for better AI parsing
   - ✅ Added structured bullet points
   - ✅ Enhanced trust signals
   - ✅ Optimized for readability
   - ✅ Improved keyword visibility
5. Estimated score boost (e.g., "+12 points")
6. "Copy Rewritten Text" button
7. "Simulate Score" button ✨ NEW FEATURE

**Expected Outcome**:
- Gemini generates optimized description
- User can copy and paste to Shopify
- User can simulate new scores

---

### 7. Before/After Score Simulation ✨ NEW FEATURE

**Trigger**: Click "Simulate Score" in rewrite modal

**File**: `frontend/src/components/BeforeAfter.js`

**Backend Endpoint**: `POST /api/simulate-score`
**Backend File**: `backend/app/endpoints.py` (lines 470-520)

**What You See**:
- Side-by-side score comparison:
  - **Before** (original scores)
  - **After** (projected scores with rewrite)
- Score changes highlighted:
  - Green arrow up for improvements
  - Score difference (e.g., "+1.7")
- Dimension-by-dimension breakdown:
  - Clarity: 7.2 → 8.9 (+1.7)
  - Trust: 6.5 → 6.8 (+0.3)
  - Completeness: 7.8 → 8.2 (+0.4)
  - Structure: 6.9 → 8.5 (+1.6)
  - Overall: 68 → 80 (+12)

**Backend Process**:
```python
# backend/app/endpoints.py
@router.post("/simulate-score")
def simulate_score(request_data: SimulateScoreRequest):
    # 1. Take new description
    # 2. Run NLP analysis
    # 3. Calculate scores (same algorithm as original)
    # 4. Return scores WITHOUT saving to database
```

**Expected Outcome**:
- User sees projected improvements
- Can make informed decision
- Knows exactly which dimensions will improve

---

### 8. Save Analysis to Dashboard

**Trigger**: Click "Save Analysis" button

**File**: `frontend/src/App.js` (handleSaveReport function)

**Backend Endpoint**: `POST /api/reports`
**Backend File**: `backend/app/endpoints.py` (lines 130-165)

**What You See**:
- Yellow banner: "Save this analysis to your dashboard?"
- "Save Analysis" button (green)
- "Later" button

**Backend Process**:
```python
# backend/app/endpoints.py
@router.post("/reports")
def save_report(report_data: ReportCreateRequest, token: str):
    # 1. Verify JWT token
    # 2. Create new Report in database
    # 3. Save all scores, issues, NLP features
    # 4. Return report ID
```

**Database Changes**:
- New row in `reports` table
- Fields: user_id, product_url, product_title, scores, nlp_features, issues, etc.

**Expected Outcome**:
- Report saved to database
- User can view in dashboard
- Banner disappears

---

### 9. Dashboard View

**Trigger**: Click "Dashboard" button in navigation

**File**: `frontend/src/components/Dashboard.js`

**Backend Endpoint**: `GET /api/reports`
**Backend File**: `backend/app/endpoints.py` (lines 190-205)

**What You See**:

#### A. If No Reports (Empty State)
- Friendly illustration
- Message: "No analyses yet"
- Subtext: "Start by analyzing your first Shopify product..."
- "Analyze Your First Product →" button
- Gradient background with dashed border

#### B. If Reports Exist
- Header: "📊 Your Analysis Reports"
- Logout button
- Grid of report cards, each showing:
  - Product title
  - Product URL (truncated)
  - Overall score (large, color-coded)
  - 4 mini scores (Clarity, Trust, Completeness, Structure)
  - Date created
  - Action buttons:
    - 🔗 **Share** (copy shareable link) ✨ NEW FEATURE
    - ⭐ **Favorite** (toggle favorite status)
    - 📥 **Export** (download as JSON)
    - 🗑️ **Delete** (remove report)

**Backend Endpoints Used**:
- `GET /api/reports` - List all reports
- `POST /api/reports/{id}/favorite` - Toggle favorite
- `GET /api/reports/{id}/export/json` - Export report
- `DELETE /api/reports/{id}` - Delete report

**Expected Outcome**:
- User sees all saved analyses
- Can manage reports (favorite, export, delete)
- Can share reports with team

---

### 10. Copy Shareable Link ✨ NEW FEATURE

**Trigger**: Click share button (🔗) on a report card

**File**: `frontend/src/components/Dashboard.js` (lines 80-90)

**What Happens**:
1. Generates shareable URL: `http://localhost:3000?report_id=123`
2. Copies to clipboard using `navigator.clipboard.writeText()`
3. Shows alert: "Link copied to clipboard! 📋"

**Expected Outcome**:
- Link copied to clipboard
- User can paste and share with team
- Anyone with link can view report (if implemented)

---

### 11. Export Report

**Trigger**: Click export button (📥) on a report card

**File**: `frontend/src/components/Dashboard.js` (exportReport function)

**Backend Endpoints**:
- `GET /api/reports/{id}/export/json` - JSON format
- `GET /api/reports/{id}/export/text` - Text format
- `GET /api/reports/{id}/export/markdown` - Markdown format
- `GET /api/reports/{id}/export/pdf` - PDF format

**Backend File**: `backend/app/endpoints.py` (lines 250-350)

**What Happens**:
1. User clicks export
2. Backend generates file
3. Browser downloads file
4. Filename: `qurly-report-{id}.{format}`

**Expected Outcome**:
- File downloads to user's computer
- Contains all report data (scores, issues, recommendations)

---

### 12. Delete Report

**Trigger**: Click delete button (🗑️) on a report card

**File**: `frontend/src/components/Dashboard.js` (deleteReport function)

**Backend Endpoint**: `DELETE /api/reports/{id}`
**Backend File**: `backend/app/endpoints.py` (lines 210-230)

**What Happens**:
1. Confirmation dialog: "Delete this report?"
2. If confirmed:
   - Backend deletes from database
   - Frontend removes from UI
3. If cancelled:
   - Nothing happens

**Expected Outcome**:
- Report removed from database
- Report card disappears from dashboard
- No way to recover (permanent delete)

---

### 13. Toggle Favorite

**Trigger**: Click favorite button (⭐) on a report card

**File**: `frontend/src/components/Dashboard.js` (toggleFavorite function)

**Backend Endpoint**: `POST /api/reports/{id}/favorite`
**Backend File**: `backend/app/endpoints.py` (lines 235-250)

**What Happens**:
1. Backend toggles `is_favorite` field
2. Frontend refreshes report list
3. Star icon changes color (filled vs outline)

**Expected Outcome**:
- Report marked as favorite
- Can filter favorites later (if implemented)

---

### 14. Historical Tracking

**Trigger**: Analyze same product URL multiple times

**File**: `frontend/src/components/HistoricalTracking.js`

**Backend Endpoint**: `GET /api/reports/{id}/history`
**Backend File**: `backend/app/endpoints.py` (lines 270-300)

**What You See**:
- Line chart showing score over time
- X-axis: Date
- Y-axis: Score (0-100)
- Multiple lines for each dimension
- Trend indicator: "improving" or "declining"

**Expected Outcome**:
- User sees score improvements over time
- Can prove ROI of optimizations
- Motivates continued optimization

---

### 15. Contact Form

**Trigger**: Fill and submit contact form on landing page

**File**: `frontend/src/components/LandingPage.js` (handleContactSubmit function)

**Backend Endpoint**: `POST /api/contact`
**Backend File**: `backend/app/endpoints.py` (lines 430-450)

**What Happens**:
1. User fills: name, email, message
2. Clicks "Send Message"
3. Backend logs to console
4. Frontend shows success message
5. Form clears

**Backend Process**:
```python
# backend/app/endpoints.py
@router.post("/api/contact")
def contact_form(contact_data: ContactRequest):
    # 1. Log contact message
    # 2. Return success confirmation
    # (No email sending in MVP)
```

**Expected Outcome**:
- Success message: "✓ Thank you! We'll get back to you soon."
- Form clears
- Message logged in backend console

---

### 16. Logout

**Trigger**: Click logout button in navigation

**File**: `frontend/src/App.js` (handleLogout function)

**What Happens**:
1. Clear JWT token from localStorage
2. Clear user data from state
3. Redirect to landing page
4. Reset all state

**Expected Outcome**:
- User logged out
- Redirected to landing page
- Must login again to access app

---

## 🔍 Backend Endpoints Summary

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | endpoints.py:40 | Create account |
| `/api/auth/login` | POST | endpoints.py:75 | Login |
| `/api/analyze` | POST | main.py:70 | Analyze product |
| `/api/analyze/checklist` | POST | endpoints.py:350 | AI readiness checklist |
| `/api/simulate-score` | POST | endpoints.py:470 | Score simulation |
| `/api/reports` | GET | endpoints.py:190 | List reports |
| `/api/reports` | POST | endpoints.py:130 | Save report |
| `/api/reports/{id}` | GET | endpoints.py:170 | Get report |
| `/api/reports/{id}` | DELETE | endpoints.py:210 | Delete report |
| `/api/reports/{id}/favorite` | POST | endpoints.py:235 | Toggle favorite |
| `/api/reports/{id}/export/json` | GET | endpoints.py:250 | Export JSON |
| `/api/reports/{id}/export/pdf` | GET | endpoints.py:320 | Export PDF |
| `/api/benchmark/category` | GET | endpoints.py:550 | Benchmarks |
| `/api/contact` | POST | endpoints.py:430 | Contact form |

---

## 🎯 Testing Checklist

### 1. Authentication
- [ ] Sign up with new email
- [ ] Login with correct password
- [ ] Login fails with wrong password
- [ ] Logout works
- [ ] Token stored in localStorage

### 2. Product Analysis
- [ ] Paste Shopify URL
- [ ] Loading skeleton appears
- [ ] Scores displayed (0-10 for each dimension)
- [ ] AI Readiness Checklist shows
- [ ] Issues list appears
- [ ] Gemini rewrite works

### 3. Dashboard
- [ ] Empty state shows when no reports
- [ ] Reports list shows after saving
- [ ] Share link copies to clipboard
- [ ] Export downloads file
- [ ] Delete removes report
- [ ] Favorite toggles

### 4. New Features
- [ ] AI Readiness Checklist displays correctly
- [ ] Progress bar shows percentage
- [ ] Before/After simulation works
- [ ] Score improvements highlighted
- [ ] Contact form submits

---

## 🐛 Known Issues

1. **Gemini API Warning**: FutureWarning about deprecated package (doesn't affect functionality)
2. **ESLint Warnings**: Unused imports in frontend (doesn't affect functionality)
3. **No PDF Export**: Backend endpoint exists but may need testing

---

## 📝 Next Steps

1. **Test Full Workflow**: Go through each step manually
2. **Fix ESLint Warnings**: Remove unused imports
3. **Add Error Handling**: Improve error messages
4. **Test with Real Shopify URLs**: Verify scraping works
5. **Record Demo Video**: Follow DEMO_SCRIPT.md

---

**Servers Running**:
- Backend: http://localhost:8000 ✅
- Frontend: http://localhost:3000 ✅

**Ready for Testing!** 🚀
