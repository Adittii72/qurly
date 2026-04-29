# Qurly — Product Thinking Document

This document outlines the product strategy, user research, and design decisions behind Qurly.

---

## The Problem

### What problem are we solving?

E-commerce merchants are optimizing their product pages for **human customers and search engines**, but they're completely overlooking **AI shopping agents** — the fastest-growing channel for product discovery.

AI agents like ChatGPT Shopping, Google Shopping AI, Perplexity Shopping, and Anthropic Claude are becoming the new gatekeepers of e-commerce. When a user asks "What's the best wireless headphones under $200?", these AI agents scrape, analyze, and recommend products based on how well they can **understand and trust** the product information.

**The problem**: Merchants have no visibility into how AI agents perceive their products. They don't know:
- Is my product description clear enough for AI to parse?
- Does my product page have enough trust signals for AI to recommend it?
- What specific changes would improve my AI recommendation score?
- How do I compare to competitors in AI readiness?

This is a **$4.5 trillion problem** (global e-commerce market size) that will only grow as AI agents become the primary shopping interface.

---

## Who is the user?

### Primary User: E-commerce Merchants

**Demographics**:
- Shopify store owners (primary focus)
- 25-45 years old
- Tech-savvy but not developers
- Running businesses with $50K-$5M annual revenue
- Selling physical products (electronics, fashion, home goods, beauty)

**Psychographics**:
- Growth-minded: Always looking for new channels to drive sales
- Data-driven: Make decisions based on metrics and analytics
- Time-constrained: Need actionable insights, not just data
- Competitive: Want to stay ahead of competitors
- ROI-focused: Will invest in tools that show clear revenue impact

**Pain Points**:
1. **Visibility gap**: Can't see how AI agents perceive their products
2. **Optimization paralysis**: Don't know what to fix first
3. **Competitive disadvantage**: Competitors may already be optimizing for AI
4. **Revenue risk**: Missing out on AI-driven sales without knowing it
5. **Technical complexity**: Don't have time to learn NLP or AI

**Jobs to Be Done**:
- "When I launch a new product, I want to ensure it's optimized for AI agents, so I don't miss out on AI-driven sales"
- "When I see declining organic traffic, I want to understand if AI agents are recommending competitors instead of me"
- "When I update product descriptions, I want to know if the changes will improve AI perception"

---

## What did we build?

### Core Features

#### 1. AI Perception Analysis
**What**: Analyze how AI shopping agents perceive a Shopify product page

**Why**: Merchants need visibility into the "black box" of AI recommendations

**How**: 
- Scrape product data from Shopify URL
- Run NLP analysis (readability, sentiment, keywords, structure)
- Calculate 4-dimensional scores (Clarity, Trust, Completeness, Structure)
- Generate AI perception summary

**User Value**: "Now I know exactly how AI agents see my product"

#### 2. Actionable Recommendations
**What**: Prioritized list of specific improvements to boost AI scores

**Why**: Merchants don't want data — they want action items

**How**:
- Detect issues based on scoring thresholds
- Prioritize by impact (HIGH, MEDIUM, LOW)
- Provide specific suggestions (not generic advice)
- Estimate score improvement for each fix

**User Value**: "I know exactly what to fix and why it matters"

#### 3. AI Readiness Checklist
**What**: 10-point checklist showing pass/fail for AI optimization criteria

**Why**: Merchants need a simple "health check" they can understand at a glance

**How**:
- Check 10 specific criteria (title length, description length, images, reviews, policies, etc.)
- Show green checkmarks for passed items, red X for failed
- Display readiness percentage (0-100%)
- Provide tips for each failed item

**User Value**: "I can see my progress and know when I'm 'AI-ready'"

#### 4. Before/After Simulation
**What**: Preview score improvements before applying changes

**Why**: Merchants want to validate that changes will actually help

**How**:
- User applies Gemini-generated rewrite
- Backend simulates scores for new description
- Frontend shows side-by-side comparison
- User can decide whether to use the rewrite

**User Value**: "I can test changes without committing to them"

#### 5. Gemini-Powered Rewriting
**What**: Auto-generate AI-optimized product descriptions

**Why**: Merchants don't have time to rewrite descriptions manually

**How**:
- Send current description + issues to Gemini API
- Gemini generates optimized version (150-300 words, bullet points, trust signals)
- User can copy, edit, or regenerate
- Integrated with before/after simulation

**User Value**: "I get professional copywriting in seconds, not hours"

#### 6. Dashboard & Historical Tracking
**What**: Save analyses, track improvements over time, manage favorites

**Why**: Merchants need to monitor progress and prove ROI

**How**:
- Save analysis reports to database
- Display historical scores in line chart
- Show trend (improving/declining)
- Export reports as PDF/JSON/Markdown

**User Value**: "I can prove to my team that AI optimization is working"

---

## What did we consciously choose NOT to build (and why)?

### 1. Real-Time Collaboration
**Why not**: 
- Most merchants analyze products solo, not in teams
- Adds significant complexity (WebSockets, conflict resolution)
- Not critical for MVP — can add later if demand exists

**Trade-off**: Limits enterprise use cases, but enables faster MVP launch

### 2. A/B Testing Framework
**Why not**:
- Requires Shopify app installation for conversion tracking
- Adds complexity (experiment management, statistical significance)
- Merchants want recommendations first, testing second

**Trade-off**: Can't prove ROI with conversion data, but focuses on core analysis

### 3. Multi-Platform Support (Amazon, WooCommerce, etc.)
**Why not**:
- Shopify has 4.4M stores — large enough market for MVP
- Each platform has different scraping requirements
- Dilutes focus and slows development

**Trade-off**: Smaller addressable market, but deeper Shopify integration

### 4. Chrome Extension
**Why not**:
- Requires separate codebase and distribution channel
- Most merchants prefer web app for serious analysis
- Can add later as convenience feature

**Trade-off**: Less convenient for power users, but simpler architecture

### 5. Bulk Product Analysis
**Why not**:
- Adds complexity (job queues, progress tracking, rate limiting)
- Most merchants want to optimize top products first, not all 1000 SKUs
- Can add later with background job processing

**Trade-off**: Slower for large catalogs, but simpler MVP

### 6. Competitor Tracking
**Why not**:
- Legal/ethical concerns with scraping competitors at scale
- Requires ongoing monitoring infrastructure
- Synthetic benchmarks provide directional guidance

**Trade-off**: Less accurate comparisons, but avoids legal risk

### 7. Mobile App
**Why not**:
- Web app works on mobile browsers
- Separate iOS/Android apps require 3x development effort
- Most merchants prefer desktop for serious analysis

**Trade-off**: Less convenient on mobile, but faster time to market

### 8. White-Label Solution
**Why not**:
- Adds complexity (multi-tenancy, custom branding, billing)
- Not validated demand yet
- Can add later if agencies request it

**Trade-off**: Smaller revenue potential, but simpler product

---

## Product Principles

### 1. Actionable over Informational
**Principle**: Every insight must come with a specific action

**Example**: Instead of "Your description is too complex", we say "Simplify language. Use short sentences and common words. Could boost clarity score by 2-3 points."

**Why**: Merchants don't have time to interpret data — they need to know what to do

### 2. Speed over Perfection
**Principle**: 2-second analysis is better than 10-second perfect analysis

**Example**: We use TextBlob (fast, 80% accurate) instead of BERT (slow, 95% accurate)

**Why**: Merchants want instant feedback, not academic precision

### 3. Transparency over Black Box
**Principle**: Users should understand why they got a certain score

**Example**: We show confidence breakdowns, factor contributions, and calculation methodology

**Why**: Trust is critical — merchants won't act on scores they don't understand

### 4. Progressive Disclosure
**Principle**: Show simple overview first, details on demand

**Example**: Dashboard shows overall score, click to see detailed breakdown

**Why**: Reduces cognitive load, makes product accessible to non-technical users

### 5. Opinionated Defaults
**Principle**: Make recommendations, don't just present options

**Example**: We say "Description should be 150-300 words" not "Description length varies"

**Why**: Merchants want guidance, not ambiguity

---

## Success Metrics

### North Star Metric
**Average AI Readiness Score Improvement per User**

Why: Directly measures product value — are we actually helping merchants improve?

Target: 15-point improvement (e.g., 60 → 75) within 30 days

### Supporting Metrics

**Acquisition**:
- Signups per week: 50+ (MVP target)
- Conversion rate (landing page → signup): 10%+
- Organic traffic: 1000+ visitors/month

**Activation**:
- % of users who analyze first product within 24 hours: 80%+
- % of users who save first report: 60%+
- Time to first analysis: < 5 minutes

**Engagement**:
- Analyses per user per week: 3+
- % of users who return within 7 days: 40%+
- % of users who apply Gemini rewrite: 30%+

**Retention**:
- 7-day retention: 40%+
- 30-day retention: 20%+
- % of users who analyze same product twice (tracking improvement): 25%+

**Revenue** (future):
- Free → Paid conversion: 5%+
- Average revenue per user (ARPU): $20/month
- Churn rate: < 5%/month

---

## User Journey

### Discovery
1. Merchant hears about AI shopping agents (ChatGPT, Perplexity)
2. Googles "optimize products for AI agents"
3. Finds Qurly via SEO, social media, or word-of-mouth

### Onboarding
1. Lands on landing page, sees value prop
2. Clicks "Sign Up Free"
3. Creates account (email + password)
4. Redirected to analysis view

### First Analysis
1. Pastes Shopify product URL
2. Clicks "Analyze Now"
3. Sees loading skeleton (2-3 seconds)
4. Views results: overall score, 4 dimension scores, AI perception
5. Scrolls to AI Readiness Checklist (sees 6/10 passed)
6. Reads top 3 issues (HIGH priority)
7. Clicks "Generate AI-Optimized Description"
8. Sees Gemini rewrite, clicks "Simulate Score"
9. Sees before/after comparison (60 → 75)
10. Copies rewrite, updates Shopify product page
11. Clicks "Save Analysis" to dashboard

### Ongoing Usage
1. Returns weekly to re-analyze product
2. Sees historical tracking chart (score improving)
3. Analyzes more products
4. Exports reports to share with team
5. Compares products against benchmarks

### Advocacy
1. Sees 20-point score improvement
2. Notices increase in organic traffic
3. Shares Qurly with other merchants
4. Leaves positive review

---

## Competitive Landscape

### Direct Competitors
**None** — No tool specifically optimizes for AI shopping agents

### Indirect Competitors

**1. SEO Tools (Ahrefs, SEMrush, Moz)**
- Focus: Search engine optimization
- Gap: Don't analyze AI agent perception
- Advantage: Established market, large user base
- Our Edge: AI-first, not SEO-first

**2. Product Description Generators (Jasper, Copy.ai)**
- Focus: AI copywriting
- Gap: Don't score or analyze existing descriptions
- Advantage: Better copywriting quality
- Our Edge: Analysis + recommendations + rewriting

**3. Shopify Analytics (Shopify Admin, Google Analytics)**
- Focus: Traffic and conversion metrics
- Gap: No AI perception analysis
- Advantage: Built into Shopify
- Our Edge: Proactive optimization, not reactive analytics

**4. Conversion Rate Optimization Tools (Optimizely, VWO)**
- Focus: A/B testing and experimentation
- Gap: Don't optimize for AI agents
- Advantage: Proven ROI with conversion data
- Our Edge: AI-specific, not just human conversion

### Positioning
**Qurly is the only tool that helps e-commerce merchants optimize products specifically for AI shopping agents**

---

## Future Vision (12-24 months)

### Phase 1: MVP (Current)
- Single product analysis
- 4-dimensional scoring
- Gemini-powered rewriting
- Dashboard & historical tracking

### Phase 2: Shopify App (3-6 months)
- Install directly in Shopify admin
- Bulk product analysis
- Automated monitoring (alert when scores drop)
- Conversion tracking (prove ROI)

### Phase 3: Multi-Platform (6-12 months)
- Amazon product optimization
- WooCommerce support
- BigCommerce support
- Platform-agnostic API

### Phase 4: AI Agent Partnerships (12-18 months)
- Partner with ChatGPT, Perplexity, Google Shopping
- Get real AI agent recommendation data
- Train ML model on actual AI agent behavior
- Offer "Verified AI-Ready" badge

### Phase 5: Enterprise (18-24 months)
- White-label solution for agencies
- Team collaboration features
- Advanced analytics and reporting
- Custom scoring models

---

## Risks & Mitigation

### Risk 1: AI agents don't become mainstream
**Likelihood**: Low (ChatGPT already has 100M+ users)
**Impact**: High (invalidates entire product)
**Mitigation**: Pivot to general product optimization tool

### Risk 2: Shopify blocks scraping
**Likelihood**: Medium (some stores already block)
**Impact**: High (can't analyze products)
**Mitigation**: Build Shopify app with API access

### Risk 3: Gemini API becomes expensive
**Likelihood**: Medium (pricing can change)
**Impact**: Medium (increases costs)
**Mitigation**: Cache results, offer freemium model, switch to open-source LLM

### Risk 4: Competitors copy our approach
**Likelihood**: High (no moat yet)
**Impact**: Medium (market share dilution)
**Mitigation**: Build Shopify app, get AI agent partnerships, focus on brand

### Risk 5: Merchants don't see ROI
**Likelihood**: Medium (hard to attribute sales to AI agents)
**Impact**: High (churn)
**Mitigation**: Add conversion tracking, case studies, before/after testimonials

---

## Key Learnings

### What We Learned from User Research
1. **Merchants trust scores more than qualitative feedback** → We made scores prominent
2. **Merchants want specific actions, not general advice** → We prioritize issues by impact
3. **Merchants don't have time to rewrite descriptions** → We added Gemini rewriting
4. **Merchants want to track progress over time** → We added historical tracking
5. **Merchants are skeptical of "black box" AI** → We added confidence explanations

### What Surprised Us
1. **Merchants care more about completeness than clarity** → We weighted completeness 30%
2. **Merchants want benchmarks, even if synthetic** → We added category benchmarks
3. **Merchants prefer email/password over OAuth** → We built both
4. **Merchants analyze products multiple times** → We added before/after simulation
5. **Merchants share reports with teams** → We added export and shareable links

---

**Last Updated**: April 29, 2026
