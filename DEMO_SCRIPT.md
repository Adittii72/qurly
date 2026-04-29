# QURLY Demo Script & Product Thinking

## Demo Recording Script (5 Minutes)

Use this script as a guide for recording your 3-5 minute demo video. The demo should showcase the complete user journey and key features.

### **Scene 1: Landing Page & Authentication (1 min)**

**Actions:**
1. Open QURLY at http://localhost:3000
2. Show landing page with "✨ Qurly - AI Product Analysis Platform"
3. Click "Get Started"
4. Show signup form
5. **SAY**: "Qurly helps merchants understand how AI shopping agents perceive their products. Let me walk you through the platform."
6. Enter email, username, and password
7. Click "Sign Up"
8. Show success and redirect to app

**Key Points to Mention:**
- Password-based authentication with bcrypt security
- JWT tokens for stateless API calls
- User account creation for saving reports

---

### **Scene 2: Product Analysis (2 min)**

**Actions:**
1. Explain: "The core of Qurly is product analysis. Let me analyze a Shopify product."
2. Paste a Shopify product URL (e.g., https://example.myshopify.com/products/test)
3. Click "Analyze Now"
4. **Watch the analysis loading** (show LoadingSkeleton animation)
5. Show the result with:
   - AI Perception score and feedback
   - 4-metric scoring breakdown (Clarity, Trust, Completeness, Structure)
   - Issues list with specific problems
   - Confidence scores explaining why
   - Benchmark comparison to category average

**Key Points to Mention:**
- Scrapes Shopify JSON API with HTML fallback
- Real-time NLP analysis with TextBlob
- 4-metric scoring system designed for actionability
- AI perception simulation to show merchant perspective
- Category benchmarking for competitive positioning

**Narration:**
"Qurly uses advanced NLP to analyze your product description from the AI's perspective. The 4 scores - Clarity, Trust, Completeness, and Structure - each map to actionable improvements."

---

### **Scene 3: Score Simulation & Optimization (1 min)**

**Actions:**
1. Click "Generate AI-Optimized Description"
2. Show the rewrite modal
3. **SAY**: "Qurly can suggest optimized descriptions. Let me simulate the impact."
4. Copy the optimized description
5. Paste into description field
6. Click "Simulate Score"
7. Show projected score improvements
   - "Original Clarity: 6.2 → Optimized Clarity: 7.8"
   - "Estimated improvement: +1.6 points"

**Key Points to Mention:**
- AI-powered description rewrites via Gemini
- Score simulation without database save
- Shows impact before committing changes
- Helps merchants understand what drives AI perception

---

### **Scene 4: Report Saving & Dashboard (1 min)**

**Actions:**
1. Save the analysis to dashboard
2. Click "Dashboard"
3. Show saved reports list with:
   - Product title and URL
   - Overall score with color coding
   - 4-metric breakdown cards
   - Trend analysis (improving/declining)
4. Show action buttons:
   - **Copy link** (now emphasize this)
   - Favorite toggle
   - JSON export
   - Delete option
5. Click copy link button
6. **SAY**: "Reports are instantly shareable via link"

**Key Points to Mention:**
- Centralized dashboard for all analyses
- Historical tracking shows trends over time
- Multiple export formats (JSON, PDF, Markdown)
- One-click shareable links for collaboration

---

### **Scene 5: Closing (Optional)**

**Actions:**
1. Show the 10-point AI readiness checklist
2. Mention that it helps merchants understand specific areas
3. Thank you slide

**Final Narration:**
"Qurly empowers Shopify merchants to optimize for AI agents - the fastest-growing customer acquisition channel. With data-driven insights and actionable recommendations, merchants can improve visibility across AI shopping assistants and boost conversions."

---

## Demo Recording Tips

1. **Audio**: Record with clear, confident narration. Speak slowly and deliberately.
2. **Pacing**: Give viewers time to read scores and metrics (2-3 second dwell time)
3. **Cursor**: Move mouse deliberately; avoid rapid jerky movements
4. **Editing**: Add title card (5 sec) + closing slide (3 sec) for professionalism
5. **Export**: 1080p, 30 fps, MP4 format for YouTube
6. **Duration**: Aim for 3-5 minutes including intro/outro

---

## Video Editing Checklist

- [ ] Title card (0-5s): "QURLY - AI Product Analysis for Shopify"
- [ ] Intro narration (5-10s): Problem statement
- [ ] Demo walkthrough (10-240s): Features showcase
- [ ] Closing slide (240-250s): CTA + social media
- [ ] Background music (subtle, royalty-free)
- [ ] Text overlays on key metrics
- [ ] Transitions between scenes (smooth fades)
- [ ] Final resolution: 1920x1080, 30fps, H.264 codec

---

## Talking Points for Judges

**Problem (10 seconds):**
"AI shopping agents like ShopGPT are changing how customers discover products. But merchants have no way to know: Are my product descriptions optimized for AI perception? What's driving AI agents to show or hide my products?"

**Solution (10 seconds):**
"Qurly analyzes product listings from the AI agent's perspective, providing 4 actionable metrics: Clarity, Trust, Completeness, and Structure. Merchants get specific recommendations to improve AI visibility."

**Why It Matters (10 seconds):**
"AI is the fastest-growing customer acquisition channel. E-commerce merchants who optimize for AI agents now will dominate the conversational commerce space. Qurly gives them the competitive advantage."

**Differentiation (10 seconds):**
"Unlike generic SEO tools, Qurly specifically measures AI perception using real Gemini API simulation. Real scores. Real insights. Real impact on conversions."

