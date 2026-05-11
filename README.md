<div align="center">

<!-- Animated banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00D4FF,100:C77DFF&height=200&section=header&text=SwiftStudy&fontSize=72&fontAlignY=35&animation=fadeIn&fontColor=ffffff&desc=AI-curated%20YouTube%20resources%20for%20NLP%20exam%20prep&descAlignY=58&descSize=18" width="100%"/>

<!-- Badges row 1 -->
<p>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
</p>

<!-- Badges row 2 -->
<p>
  <img src="https://img.shields.io/badge/Claude_Sonnet_4-Powered-8A2BE2?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Course-21CSC501T-00D4FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/SRMIST-Chennai-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-6BCB77?style=for-the-badge" />
</p>

<br/>

> **SwiftStudy** is a production-grade, AI-powered web app that curates the best YouTube videos for every topic in the **Natural Language Processing (21CSC501T)** syllabus — built for SRMIST M.Tech Integrated Data Science semester exam preparation.

<br/>

<img src="https://img.shields.io/badge/⚡_Live_Demo-SwiftStudy.pages.dev-00D4FF?style=flat-square&labelColor=07070E" height="28"/>

</div>

---

## ✨ What makes SwiftStudy different?

| Feature | Detail |
|---------|--------|
| 🤖 **AI-curated, not scraped** | Claude Sonnet 4 + live web search finds the *best* videos, not just the most popular |
| 🔒 **Zero API key exposure** | Anthropic key lives only in Cloudflare edge environment — never in the browser |
| 📚 **Full syllabus coverage** | All 5 units · 60+ topics from the complete 21CSC501T SRMIST syllabus |
| 🎯 **4-layer prompt stack** | RISEN + ReAct + Least-to-Most + CO-STAR framework for precision curation |
| ⚡ **Edge-deployed** | Cloudflare Pages + Functions — global sub-100ms response times |
| 📱 **Fully responsive** | Mobile-first, works on phone, tablet, desktop |

---

## 🎓 Syllabus Coverage

<table>
<tr>
<td width="20%" align="center"><b>◈ Unit 1</b><br/><sub>NLP Overview</sub></td>
<td><sub>History · Applications · Information Retrieval · Question Answering · Sentiment Analysis · OCR · Summarization · Spell Check · Machine Translation · Ambiguity Types · NLP Components</sub></td>
</tr>
<tr>
<td align="center"><b>◇ Unit 2</b><br/><sub>NLP Techniques</sub></td>
<td><sub>POS Tagging · Rule-based & HMM POS · Viterbi Algorithm · Phonology · Morphology · Finite State Parsing · Tokenization · Stemming · Lemmatization · Regular Expressions · FSA</sub></td>
</tr>
<tr>
<td align="center"><b>○ Unit 3</b><br/><sub>Probabilistic Models</sub></td>
<td><sub>Porter Stemmer · Spelling Correction · Minimum Edit Distance · N-Gram Models · Unigram/Bigram · Perplexity · Laplace Smoothing · Interpolation · CFG · Top-Down Parsing</sub></td>
</tr>
<tr>
<td align="center"><b>△ Unit 4</b><br/><sub>Neural Networks</sub></td>
<td><sub>NN Architecture · RNN in NLP · Word Sense Disambiguation · WordNet · Backpropagation · Vectorization · Dependency Parsing · Neural Dependency Parser</sub></td>
</tr>
<tr>
<td align="center"><b>✦ Unit 5</b><br/><sub>Deep Learning</sub></td>
<td><sub>Word2Vec · GloVe Vectors · Distributed Representations · Word Vector Space · Pretrained LMs · BERT · GPT · Transfer Learning · LSTM</sub></td>
</tr>
</table>

---

## 🧠 Prompt Engineering Stack

SwiftStudy uses a **4-layer hybrid prompt architecture** to deliver precision video curation:

```
╔════ FRAMEWORK ARCHITECTURE ══════════════════════════════════════╗
║  Layer 1 ▸ RISEN     System role + scope + search mandate        ║
║  Layer 2 ▸ ReAct     Think → Act → Observe search loop           ║
║  Layer 3 ▸ L2M       Least-to-Most topic decomposition           ║
║  Layer 4 ▸ CO-STAR   Output spec: audience, format, response     ║
╚══════════════════════════════════════════════════════════════════╝

RISEN  → Role: Senior NLP Education Curator · 10+ yrs expertise
         Steps: Decompose → 3 targeted searches → Curate → Rank

ReAct  → THINK: Break topic into sub-concepts
         ACT-1: "{topic} NLP tutorial explained youtube"
         ACT-2: "stanford MIT {topic} NLP lecture youtube"
         ACT-3: "{topic} python NLP implementation youtube"
         OBSERVE: Compile, rank, return top 4-6

L2M    → L1: Foundational (what is it?)
         L2: Theoretical depth (math/algorithms)
         L3: Applied (code & implementation)

CO-STAR→ Context: M.Tech Data Science, SRMIST, semester exam
         Audience: Final-year engineering student, strong ML background
         Response: Strict JSON · {title, channel, url, type, difficulty, why_useful}
```

---

## 🏗 Architecture

```
Browser (React + TypeScript)
        │
        │  POST /api/search { topic, unitTitle }
        ▼
Cloudflare Pages Function (Edge)
  ├── Input validation + sanitisation
  ├── CORS origin allowlist
  ├── Body size cap (4 KB)
  └── Anthropic API call (key never leaves edge)
              │
              ▼
      Claude Sonnet 4
      + web_search tool
              │
              ▼
  ├── URL allowlist (youtube.com only)
  ├── Output sanitisation
  └── Response to browser
```

---

## 🔒 Security Model

| Threat | Mitigation |
|--------|------------|
| API key exposure | Lives **only** in Cloudflare env vars · never bundled in JS |
| Prompt injection via topic | Input sanitised · strips `<>"'\`` before Anthropic call |
| Malicious URLs in response | Hard allowlist: only `youtube.com` / `youtu.be` pass through |
| Oversized payloads | 4 KB body cap · `Content-Length` check |
| Clickjacking | `X-Frame-Options: DENY` on every response |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Info leakage | Generic error messages to client · no stack traces |
| CORS abuse | Origin allowlist via `ALLOWED_ORIGINS` env var |
| CSP | Strict Content-Security-Policy in `index.html` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- A free [Anthropic API key](https://console.anthropic.com/)
- A free [Cloudflare account](https://dash.cloudflare.com/)

### Local development

```powershell
# Clone
git clone https://github.com/kumarwaibhav/SwiftStudy.git
cd SwiftStudy

# Install
npm install

# Set up local secrets
Copy-Item .dev.vars.example .dev.vars
# Edit .dev.vars → add your ANTHROPIC_API_KEY

# Start Vite dev server
npm run dev

# In a second terminal: start Cloudflare Pages local (serves /api/search)
npm run pages:dev
```

App is at `http://localhost:5173` · API proxies to `http://localhost:8788`

---

## 📦 Project Structure

```
SwiftStudy/
├── functions/
│   └── api/
│       └── search.ts          # Cloudflare Pages Function — secure API proxy
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App header + prompt toggle
│   │   ├── PromptStack.tsx     # Prompt engineering framework display
│   │   ├── UnitNav.tsx         # 5-unit navigation
│   │   ├── TopicList.tsx       # Scrollable topic list per unit
│   │   ├── ResultsPanel.tsx    # Video results + loading/error states
│   │   └── VideoCard.tsx       # Individual video card with badges
│   ├── data/
│   │   └── syllabus.ts         # Complete 21CSC501T syllabus data
│   ├── hooks/
│   │   └── useVideoSearch.ts   # Search state machine + fetch hook
│   ├── types/
│   │   └── index.ts            # TypeScript domain types
│   ├── utils/
│   │   └── constants.ts        # Video type & difficulty metadata
│   ├── App.tsx                 # Root component + state orchestration
│   ├── main.tsx                # React entry point
│   └── index.css               # Complete CSS design system
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: auto-deploy on push to main
├── .env.example                # Template for local env vars
├── .dev.vars.example           # Template for wrangler local dev
├── .gitignore
├── index.html                  # CSP headers + font preload
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.toml
└── README.md
```

---

## ☁️ Deploy to Cloudflare Pages

### One-time setup (Cloudflare Dashboard)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select `kumarwaibhav/SwiftStudy` → **Begin setup**
3. Build config:

   | Setting | Value |
   |---------|-------|
   | Framework preset | `Vite` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Environment variables** (mark both as **Encrypted**):

   | Variable | Value |
   |----------|-------|
   | `ANTHROPIC_API_KEY` | Your key from [console.anthropic.com](https://console.anthropic.com) |
   | `ALLOWED_ORIGINS` | `https://swift-study.pages.dev` *(update after first deploy)* |

5. **Save and Deploy** — done in ~2 minutes ⚡

### Auto-deploy via GitHub Actions

Add these to **GitHub → Settings → Secrets → Actions**:

| Secret | Where to get it |
|--------|----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → *Edit Cloudflare Pages* template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |

Every push to `main` now builds and deploys automatically.

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + TypeScript | Type-safe, component-driven UI |
| **Build** | Vite 6 | Sub-2s builds, native ESM |
| **Styling** | Custom CSS design system | Full design control, zero runtime overhead |
| **API Proxy** | Cloudflare Pages Functions | Edge serverless, API key stays server-side |
| **AI** | Claude Sonnet 4 + web_search | Real-time web search + structured output |
| **Hosting** | Cloudflare Pages | Global edge CDN, free tier |
| **CI/CD** | GitHub Actions | Auto-deploy on every push to main |

---

## 📊 Build Stats

```
dist/index.html          1.58 kB │ gzip:  0.79 kB
dist/assets/index.css    8.74 kB │ gzip:  2.31 kB
dist/assets/index.js    14.09 kB │ gzip:  5.48 kB
dist/assets/react.js   141.74 kB │ gzip: 45.48 kB
✓ Built in 1.81s
```

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first.

```powershell
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
# Open a PR on GitHub
```

---

## 📄 License

MIT © [Kumar Waibhav Akshat](https://github.com/kumarwaibhav) · SRMIST Chennai · M.Tech Integrated Data Science 2026

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:C77DFF,100:00D4FF&height=100&section=footer" width="100%"/>

**Built with 🤖 Claude + ☁️ Cloudflare + ❤️ for exam season**

<sub>If SwiftStudy helped you, leave a ⭐ on GitHub!</sub>

</div>
