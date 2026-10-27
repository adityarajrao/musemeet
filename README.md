# MuseMeet — Autonomous Agent-to-Agent Matchmaking & Serendipity Engine

<div align="center">

[![Meta Global AI Developer Hackathon 2026](https://img.shields.io/badge/Meta_AI_Hackathon-2026-blue?style=for-the-badge&logo=meta)](https://dev.meta.ai/)
[![Track: Indie Developer](https://img.shields.io/badge/Track-Indie_Developer-orange?style=for-the-badge)](https://devpost.com/)
[![Theme: Build for Your World](https://img.shields.io/badge/Theme-Build_for_Your_World-purple?style=for-the-badge)](https://devpost.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-emerald?style=for-the-badge)](LICENSE)

*Transforming superficial swipe loops into sovereign, agent-mediated human connection.*

[Live Rendezvous UI](frontend/live_lounge.html) • [Explainable Dossier UI](frontend/dossier.html) • [Architecture](#-architecture) • [Academic Grounding](#-academic-grounding) • [Quickstart](#-quickstart)

</div>

---

## 💡 The Core Problem

Modern connection platforms are broken by superficial swipe fatigue and the **"Self-Reporting Paradox"** ([Joel et al., PNAS 2020](https://www.pnas.org/doi/10.1073/pnas.1921455117)):
* Static self-reported questionnaires and 3-minute onboarding surveys explain **near-zero variance** in long-term relational compatibility. Humans either performatively curate masks or cannot articulate what they actually value in a peer or partner.
* Users spend 10+ hours a week swiping on curated photos, only to discover fundamental lifestyle friction or conversational flatlines on day one.

---

## 🎯 The Autonomous Solution

**MuseMeet** replaces manual swiping with autonomous, agent-mediated matchmaking:

```
+-----------------------------------------------------------------------------------+
|                            SOVEREIGN USER VAULT (LOCAL)                           |
|  Raw Digital Footprint (Reading, Media, Notes, Habits)                            |
|       |                                                                           |
|       v [Explicit User Consent Opt-In Required]                                   |
|  Meta Muse Spark 1.3 (1M-token context distillation)                              |
|       |                                                                           |
|       v                                                                           |
|  Sanitized Persona Card (5-Layer Cognitive Profile: No raw telemetry leaks)      |
+-----------------------------------------------------------------------------------+
                                         |
                                         | (Enters Digital Lounge)
                                         v
+-----------------------------------------------------------------------------------+
|                        AUTONOMOUS RENDEZVOUS PROTOCOL                             |
|                                                                                   |
|  [Stage 1: Discovery]   Turns 1-4   --> Niche passion probing & patience depth    |
|  [Stage 2: Banter]      Turns 5-8   --> Witty repartee & linguistic style matching|
|  [Stage 3: Friction]    Turns 9-12  --> Gottman bid response & lifestyle clash    |
|  [Stage 4: Synthesis]   Turns 13-16 --> Reciprocal vulnerability & introduction   |
|                                                                                   |
|  * Anti-Sycophancy: Agents prompt-conditioned as skeptical talent scouts with      |
|    an Opportunity Cost Budget (1 date/week).                                      |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                       NEUTRAL LOUNGE MODERATOR (3RD PARTY)                        |
|  - Eliminates bilateral agent scoring bias                                        |
|  - Computes Linguistic Style Matching (LSM) across 9 function-word categories     |
|  - Computes Gottman Bid Ratio & Perceived Partner Responsiveness (PPR) composite  |
|  - Issues Verdict: [MATCH] | [GRACEFUL ABORT] | [EARLY EXIT]                      |
+-----------------------------------------------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       | (If Verified Match >= 85%)        | (If Clash or Flatline)
                       v                                   v
+--------------------------------------+  +-----------------------------------------+
|     EXPLAINABLE DOSSIER & DATE       |  |          SAFE INTRODUCTION WITHHELD     |
| - Shared Cognitive Resonances        |  | - Transparent explanation of divergence |
| - Honest Lifestyle Friction Points   |  | - Hours of unaligned dating avoided     |
| - 3 Curated Mutual Icebreakers       |  +-----------------------------------------+
| - Real Spatial Venue Grounding       |
| - 3-Panel Moodboard (Meta Muse Image)|
+--------------------------------------+
```

---

## 🏛️ System Architecture & Privacy Safeguards

### 1. Two-Tier Memory Isolation (Zero-Leakage Privacy)
* **Vault Tier:** A local sovereign agent runs on the user's machine, continuously observing authentic intellectual rabbit holes, reading lists, and communication rhythms.
* **Lounge Tier:** The chatting agent entering the digital lounge receives **ONLY** the sanitized 5-layer Persona Card. Raw browsing logs and private notes **never** leave the vault. Even under adversarial prompt injection from a peer agent, raw data cannot leak because it literally is not in the lounge context.

### 2. Solving "LLM Sycophancy" with Opportunity Cost Budgeting
Out-of-the-box instruction-tuned models default to polite agreeableness. MuseMeet prompts agents as **protective, skeptical talent scouts** with an explicit **Opportunity Cost Budget**: their human only has time for 1 coffee date this week. The agent actively looks for reasons to reject the match unless genuine multi-dimensional resonance is proven.

### 3. The Neutral Lounge Moderator
A neutral 3rd-party observer agent evaluates the transcript independently from the two participant agents, preventing self-serving scoring collusion ([SOTOPIA, ICLR 2024](https://arxiv.org/abs/2310.11667)).

### 4. Hallucination Grounding in the Date Generator
Rather than hallucinating generic "cozy cafes", the date engine anchors itineraries in a curated real-world spatial venue database ([`data/venues.json`](data/venues.json)) with verified acoustic conversation scores and lighting profiles, paired with micro-callbacks extracted verbatim from the dialogue.

---

## 📚 Academic Grounding

Every algorithmic mechanism in MuseMeet is anchored in peer-reviewed relationship science:

| Scientific Finding | Literature Reference | MuseMeet Implementation |
| :--- | :--- | :--- |
| **Dyadic Compatibility** | Joel et al. (*PNAS*, 2020) | Replaces static questionnaire matching with dynamic, emergent agent interaction. |
| **Linguistic Synchrony (LSM)** | Ireland & Pennebaker (*Psychological Science*, 2011) | Computes turn-by-turn function word overlap across 9 LIWC grammatical classes. |
| **Bids for Connection** | Gottman & Levenson (2002) | Tracks `toward`, `away`, and `against` bid responses during Stage 3 friction probing. |
| **Perceived Responsiveness (PPR)** | Reis, Maniaci, Eastwick (2021) | Combines bid responsiveness (60%) and stylistic synchrony (40%) into a live chemistry gauge. |
| **Generative Social Simulation** | Park et al. (Stanford/Google, *UIST* 2023) | Multi-stage reflection state machine for autonomous character negotiation. |
| **Asymmetric Social Games** | Zhou et al. (*SOTOPIA*, ICLR 2024) | Dual-tier privacy boundaries with distinct private subtext vs. public dialogue. |

---

## 🎬 Three Calibrated Benchmark Scenarios

| Scenario | Pair | Interaction Outcome | Compatibility | Final LSM | Key Dynamic |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pair 1: Bookshop** | Elena × Julian | **Verified Match** | **92%** | **0.881** | Traverses all 4 stages. Deep resonance on analog media (35mm film, vinyl jazz kissa, vintage literature). Generates bespoke first-date itinerary and 3-panel moodboard. |
| **Pair 2: Vinyl Store** | Elena × Marcus | **Graceful Abort** | **64%** | **0.798** | Electric creative banter in Stages 1–2, but Stage 3 reveals fatal dealbreaker collision: Marcus is a 90-day nomad; Elena has tenured local laboratory roots. Introduction safely withheld. |
| **Pair 3: Market** | Elena × David | **Early Exit** | **24%** | **0.428** | Immediate conversational flatline in Stage 1. David frames analog creativity as an inefficient ROI investment; LSM collapses below 0.55 threshold. Aborts at Turn 6, saving ~3.5h of awkward dating. |

---

## 🚀 Quickstart

### Prerequisites
* Node.js >= 20.x
* Meta Model API Key (optional — runs 100% offline in deterministic fixture mode)

### 1. Installation
```bash
git clone https://github.com/adityarajrao/musemeet.git
cd musemeet
cp .env.example .env
```

### 2. Run Master Test Suite
MuseMeet includes zero external npm dependencies for core engine modules:
```bash
npm test
```

This runs all 8 test suites synchronously:
```
  ✅ Connectors: Meta Model API Client & Dry-Run Fallbacks
  ✅ M1: Persona Vault & Zero-Leakage Privacy Gate
  ✅ LSM: Ireland & Pennebaker LIWC Telemetry Calculator
  ✅ M2: 4-Stage Autonomous Rendezvous Protocol State Machine
  ✅ M2b: Neutral Lounge Moderator Evaluator
  ✅ M3: Compatibility Synthesis Engine with Spatial Grounding
  ✅ M4: Meta Muse Image 3-Panel Moodboard Generator
  ✅ E2E: Full Pipeline Integration across all 3 outcomes
```

### 3. Open the Interactive Web Interfaces
* **Dual-Track Live Negotiation Viewer:**
  ```bash
  open frontend/live_lounge.html
  ```
  *Watch the fast-paced agent dialogue on the left, private subtext reasoning on the right, and dynamic SVG LSM sparklines updating turn by turn.*

* **Explainable Compatibility Dossier:**
  ```bash
  open frontend/dossier.html
  ```
  *Explore the animated resonance score gauge, honest friction analysis, copyable icebreakers, transcript micro-callbacks, and 3-panel date moodboard.*

---

## 📂 Repository Structure

```
musemeet/
├── agent_engine/
│   ├── vault/               # M1: Sovereign Persona Distillation & Privacy Gate
│   ├── metrics/             # LSM LIWC Synchrony & Dyadic Scoring
│   ├── protocol/            # M2: 4-Stage Rendezvous Engine & SSE Emitter
│   ├── moderator/           # M2b: Neutral Lounge Moderator Evaluator
│   ├── synthesis/           # M3: Compatibility Dossier Synthesis
│   ├── image/               # M4: Meta Muse Image 3-Panel Moodboard Generator
│   └── fixtures/            # Benchmark Scenarios Loader & Personas
├── connectors/              # Meta Model API (Muse Spark 1.3 / Muse Image 1.0)
├── data/
│   └── venues.json          # Curated Real Spatial Grounding Venues (Tokyo, SF, NYC)
├── frontend/
│   ├── live_lounge.html     # Split-Stream Live Dialogue & Subtext Viewer
│   └── dossier.html         # Explainable Compatibility Dossier UI
├── tests/
│   ├── fixtures/            # Vignette 1, 2, and 3 ground truth datasets
│   ├── test_connectors.js   # API client connector tests
│   ├── test_m1.js           # Vault distillation tests
│   ├── test_lsm.js          # Linguistic style matching tests
│   ├── test_m2.js           # Rendezvous state machine tests
│   ├── test_m2b.js          # Neutral moderator tests
│   ├── test_m3.js           # Synthesis & spatial venue tests
│   ├── test_m4.js           # Moodboard generator tests
│   └── test_e2e.js          # End-to-end integration pipeline tests
├── package.json             # ES Module project metadata & test runners
└── README.md                # Project documentation & judging guide
```

---

## 🛠️ Meta AI Tech Stack Integration

* **Meta Muse Spark 1.3 (via Meta Model API):**
  * Ingests extensive raw reading lists and conversational habits using its **1M-token context window**.
  * Executes autonomous multi-turn tool loops for turn-passing (`pass_turn`).
* **Meta Muse Image 1.0 & SAM 3.1:**
  * Generates cohesive 3-panel date moodboards (Atmosphere, Activity, Moment) with shared chromatic palette directives.
* **Model Context Protocol (MCP) & Connectors:**
  * Clean abstraction layer connecting agents to external spatial venue data.

---

## 🔮 Scope & Future Work

Items deliberately excluded from hackathon scope to prioritize core algorithmic depth:
* Multi-user deferred acceptance queue matching ([Gale & Shapley 1962 / Irving 1985](https://en.wikipedia.org/wiki/Stable_marriage_problem))
* Real-time automated browser extension habit scraping
* Native iOS/Android mobile shells
* Direct calendar booking APIs

---

## 👥 Team & Attribution

Built for the **Meta Global AI Developer Hackathon 2026**:
* **Aditya Raj** ([@adityarajrao](https://github.com/adityarajrao))
* **Aryan Raj** ([@boozards](https://github.com/boozards))

Licensed under the [Apache License, Version 2.0](LICENSE).
