# Git Commit Strategy for Qurly

This document outlines the recommended commit sequence for the Qurly project to demonstrate clear development progression to hackathon judges.

---

## Commit Sequence

### Phase 1: Database & Infrastructure

```bash
git add backend/app/database.py backend/app/models.py backend/requirements.txt
git commit -m "feat: migrate database from SQLite to Supabase PostgreSQL

- Update database.py to support postgresql+psycopg2:// driver
- Add psycopg2-binary to requirements.txt
- Ensure all models use PostgreSQL-compatible column types
- Add connection pooling and pre-ping for production reliability"
```

### Phase 2: CORS & Production Config

```bash
git add backend/app/main.py backend/app/config.py backend/.env.example
git commit -m "fix: configure CORS for production deployment

- Update CORS middleware to read from FRONTEND_URL and BACKEND_URL env vars
- Add support for Hostinger frontend and Render backend domains
- Create comprehensive .env.example with all required variables
- Ensure localhost remains accessible for development"
```

### Phase 3: Authentication & Security

```bash
git add backend/app/auth.py backend/app/endpoints.py backend/app/models.py
git commit -m "feat: implement password-based authentication with bcrypt

- Add password_hash field to User model
- Implement signup endpoint with bcrypt password hashing
- Implement login endpoint with password verification
- Update auth schemas to require password for signup/login
- Add passlib[bcrypt] to requirements.txt for secure password hashing"
```

### Phase 4: AI Model Updates

```bash
git add backend/app/modules/gemini_insights.py backend/app/config.py
git commit -m "fix: update Gemini model to gemini-1.5-flash with retry logic

- Replace deprecated gemini-pro with gemini-1.5-flash
- Implement exponential backoff retry logic (3 retries: 1s, 2s, 4s)
- Add timeout configuration (30 seconds default)
- Improve error handling and logging for API failures
- Update config.py to support ai_model_name configuration"
```

### Phase 5: Scraper Robustness

```bash
git add backend/app/modules/shopify_scraper.py
git commit -m "feat: enhance Shopify scraper with fallback and error handling

- Add HTML scraping fallback when JSON API returns 403/404
- Implement 10-second timeout for all HTTP requests
- Add retry strategy with exponential backoff
- Handle non-Shopify URLs gracefully with clear error messages
- Improve error logging for debugging production issues"
```

### Phase 6: Scoring Engine Improvements

```bash
git add backend/app/modules/scoring_engine.py
git commit -m "fix: clamp all scores between 0-10 to prevent invalid values

- Add max(0, min(10, score)) clamping to all scoring functions
- Ensure clarity_score, trust_score, completeness_score, structure_score are always 0-10
- Prevent negative scores from edge cases
- Prevent scores > 10 from calculation errors"
```

### Phase 7: AI Readiness Checklist Feature

```bash
git add backend/app/endpoints.py backend/app/auth.py
git commit -m "feat: add AI readiness checklist endpoint

- Implement POST /api/analyze/checklist endpoint
- Return structured 10-point checklist with pass/fail for each criterion
- Include categories: Title, Description, Trust Signals, Images, Pricing, Structure, Keywords, FAQ
- Calculate readiness percentage and passed_count
- Provide actionable tips for each checklist item"
```

### Phase 8: Score Simulation Feature

```bash
git add backend/app/endpoints.py backend/app/auth.py
git commit -m "feat: add score simulation endpoint for before/after comparison

- Implement POST /api/simulate-score endpoint
- Allow users to preview scores for rewritten descriptions
- Return projected scores without saving to database
- Enable before/after comparison in frontend
- Support product_data parameter for context"
```

### Phase 9: Contact Form Endpoint

```bash
git add backend/app/endpoints.py backend/app/auth.py
git commit -m "feat: implement contact form endpoint

- Add POST /api/contact endpoint
- Accept name, email, message fields
- Log contact submissions for follow-up
- Return success confirmation
- No email sending required for MVP (log-based)"
```

### Phase 10: Missing CRUD Endpoints

```bash
git add backend/app/endpoints.py
git commit -m "feat: complete report CRUD endpoints

- Implement GET /api/reports with pagination (limit/offset)
- Implement DELETE /api/reports/{id} with ownership check
- Implement POST /api/reports/{id}/favorite to toggle favorite status
- Ensure all protected endpoints return 401 (not 500) when token is missing
- Add proper error handling and status codes"
```

### Phase 11: Benchmark Endpoint

```bash
git add backend/app/endpoints.py
git commit -m "feat: add synthetic benchmark comparison by category

- Implement GET /api/benchmark/category endpoint
- Return synthetic benchmark data for electronics, clothing, home-garden, sports, beauty
- Include average scores, product count, distribution percentages
- Enable frontend to show category-specific comparisons
- Use realistic synthetic data based on industry research"
```

### Phase 12: Frontend Authentication

```bash
git add frontend/src/components/LoginForm.js
git commit -m "feat: add password fields to login and signup forms

- Add password input field to login form
- Add password and confirm password fields to signup form
- Implement password visibility toggle (show/hide)
- Add password validation (minimum 8 characters)
- Add password match validation for signup
- Update API calls to include password parameter"
```

### Phase 13: Frontend Contact Form

```bash
git add frontend/src/components/LandingPage.js
git commit -m "feat: connect contact form to backend API

- Update handleContactSubmit to POST to /api/contact
- Add axios import for HTTP requests
- Display success message on submission
- Handle errors gracefully with user feedback
- Clear form after successful submission"
```

### Phase 14: AI Readiness Checklist Component

```bash
git add frontend/src/components/AIReadinessChecklist.js frontend/src/App.js
git commit -m "feat: add AI Readiness Checklist component

- Create AIReadinessChecklist component with progress bar
- Display 10-point checklist with green checkmarks and red X marks
- Show readiness percentage with color-coded progress bar
- Include actionable tips for each checklist item
- Add loading skeleton for better UX
- Integrate into main analysis view"
```

### Phase 15: Loading Skeletons

```bash
git add frontend/src/components/LoadingSkeleton.js frontend/src/App.js
git commit -m "feat: add loading skeletons for better UX

- Create LoadingSkeleton component with shimmer effect
- Replace plain spinner with skeleton during analysis
- Add CSS animations for shimmer effect
- Improve perceived performance
- Show skeleton for scores, issues, and recommendations sections"
```

### Phase 16: Dashboard Empty State

```bash
git add frontend/src/components/Dashboard.js
git commit -m "feat: add empty state UI to dashboard

- Display friendly empty state when user has no saved reports
- Add illustration and CTA to analyze first product
- Improve first-time user experience
- Add 'Analyze Your First Product' button
- Style with gradient background and dashed border"
```

### Phase 17: Copy Shareable Link Feature

```bash
git add frontend/src/components/Dashboard.js
git commit -m "feat: add copy shareable link button to reports

- Add share button with FiShare2 icon
- Copy ?report_id=X URL to clipboard
- Show confirmation alert when link is copied
- Enable easy sharing of analysis reports
- Use navigator.clipboard API"
```

### Phase 18: Environment Variables

```bash
git add frontend/.env.example backend/.env.example
git commit -m "docs: create comprehensive .env.example files

- Add backend/.env.example with all required variables
- Add frontend/.env.example with REACT_APP_API_URL
- Document DATABASE_URL for both SQLite and PostgreSQL
- Include GEMINI_API_KEY, SECRET_KEY, JWT configuration
- Add FRONTEND_URL and BACKEND_URL for CORS
- Provide clear comments for each variable"
```

### Phase 19: README Documentation

```bash
git add README.md
git commit -m "docs: create comprehensive README with architecture and setup

- Add project overview and problem statement
- Document all features with emojis for readability
- Include ASCII architecture diagram
- Provide detailed setup instructions for backend and frontend
- Document all API endpoints with request/response examples
- List tech stack with version badges
- Add deployment instructions for Render, Hostinger, Supabase
- Include scoring methodology explanation
- Add roadmap and contributing guidelines"
```

### Phase 20: Decision Log

```bash
git add DECISION_LOG.md
git commit -m "docs: create decision log with technical rationale

- Document 15 major technical decisions
- Include alternatives considered for each decision
- Explain rationale and trade-offs
- Cover: Gemini vs OpenAI, TextBlob vs spaCy, SQLite vs PostgreSQL
- Document JWT auth, React SPA, Shopify scraping strategy
- Add lessons learned and future decisions
- Provide context for judges to understand technical choices"
```

### Phase 21: Final Polish

```bash
git add .
git commit -m "chore: final polish and production readiness

- Fix any remaining linting issues
- Update all dependencies to latest stable versions
- Add missing error boundaries
- Improve error messages for better UX
- Add console.log cleanup
- Ensure all features are tested and working
- Prepare for demo and submission"
```

---

## Commit Best Practices

### DO:
- ✅ Use conventional commit format: `type(scope): description`
- ✅ Write descriptive commit messages (50 char summary + detailed body)
- ✅ Commit related changes together (e.g., backend + frontend for same feature)
- ✅ Reference issue numbers if applicable
- ✅ Use present tense ("add feature" not "added feature")

### DON'T:
- ❌ Commit unrelated changes together
- ❌ Use vague messages like "fix bug" or "update code"
- ❌ Commit commented-out code or debug statements
- ❌ Commit sensitive data (.env files, API keys)
- ❌ Make massive commits with 50+ file changes

---

## Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, config)
- **ci**: CI/CD changes

---

## Example Commit Message Format

```
feat(backend): add AI readiness checklist endpoint

- Implement POST /api/analyze/checklist endpoint
- Return structured 10-point checklist with pass/fail
- Include categories: Title, Description, Trust, Images, etc.
- Calculate readiness percentage
- Provide actionable tips for each item

Closes #42
```

---

## Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/ai-readiness-checklist
   ```

2. **Make changes and commit**
   ```bash
   git add backend/app/endpoints.py
   git commit -m "feat: add AI readiness checklist endpoint"
   ```

3. **Push to remote**
   ```bash
   git push origin feature/ai-readiness-checklist
   ```

4. **Merge to main** (after review)
   ```bash
   git checkout main
   git merge feature/ai-readiness-checklist
   git push origin main
   ```

---

## Pre-Commit Checklist

Before committing, ensure:
- [ ] Code runs without errors
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Environment variables are in .env (not hardcoded)
- [ ] Dependencies are in requirements.txt / package.json
- [ ] Commit message is descriptive
- [ ] Related files are included in commit

---

**Last Updated**: April 29, 2026
