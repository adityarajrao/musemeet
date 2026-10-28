# MuseMeet — Autonomous Agent-to-Agent Matchmaking & Serendipity Engine

<div align="center">

[![Meta Global AI Developer Hackathon 2026](https://img.shields.io/badge/Meta_AI_Hackathon-2026-blue?style=for-the-badge&logo=meta)](https://dev.meta.ai/)
[![Track: Indie Developer](https://img.shields.io/badge/Track-Indie_Developer-orange?style=for-the-badge)](https://devpost.com/)
[![Theme: Build for Your World](https://img.shields.io/badge/Theme-Build_for_Your_World-purple?style=for-the-badge)](https://devpost.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-emerald?style=for-the-badge)](LICENSE)

*Transforming superficial swipe loops into sovereign, agent-mediated human connection.*

[Live Rendezvous & Funnel UI](frontend/live_lounge.html) • [Explainable Dossier UI](frontend/dossier.html) • [The Tri-Layer Harmony Thesis](#-the-tri-layer-harmony-thesis) • [Architecture](#-architecture) • [Academic Grounding](#-academic-grounding) • [Quickstart](#-quickstart)

</div>

---

## 💡 The Core Problem

Modern connection platforms are broken by superficial swipe fatigue and the **"Self-Reporting Paradox"** ([Joel et al., PNAS 2020](https://www.pnas.org/doi/10.1073/pnas.1921455117)):
* Static self-reported questionnaires and 3-minute onboarding surveys explain **near-zero variance** ($\Delta R^2 \approx 0.00$) in actual romantic satisfaction. Humans either performatively curate masks or cannot articulate what they actually value in a peer or partner.
* Users spend 10+ hours a week swiping on curated photos, only to discover fundamental lifestyle friction or conversational flatlines on day one.
* **The $O(N^2)$ Pairwise Scaling Bottleneck:** In a local metropolitan pool of 300 eligible singles, naive agent-to-agent conversational simulation across all pairs would require 44,850 multi-turn sessions (over 700 million tokens), making unguided conversational matchmaking computationally intractable.

---

## 🌐 The Tri-Layer Harmony Thesis

MuseMeet formalizes human compatibility across three mathematically distinct, non-linear architectural layers:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE TRI-LAYER HARMONY THESIS                                     │
├────────────────────────────────┬────────────────────────────────┬────────────────────────────────┤
│ Layer                          │ Algorithmic Mechanism          │ Scientific & Empirical Proof   │
├────────────────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ Layer 1: Spatial & Structural  │ 250-User Local Cohort Funnel   │ Eliminates O(N²) scaling trap; │
│ Candidate Retrieval            │ (Location + Hard Barriers +    │ geographic proximity is #1     │
│                                │ Meta FAISS Coarse Embedding)   │ prerequisite for physical date.│
├────────────────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ Layer 2: Sovereign Visual &    │ On-Device Aesthetic Threshold  │ Hunt, Eastwick & Finkel (2015):│
│ Aesthetic Calibration          │ Protocol (Satisficing Gate via │ Physical attraction is a binary│
│                                │ Meta Llama Vision / SAM 3.1)   │ threshold, not an optimizer.   │
├────────────────────────────────┼────────────────────────────────┼────────────────────────────────┤
│ Layer 3: Dynamic Dyadic &      │ 4-Stage Autonomous Lounge      │ Pickering (2004), Gottman,     │
│ Attachment Enactment           │ (LSM, Gottman Bids, Attachment │ Reddit consensus: Real failure │
│                                │ Decompression Probes)          │ stems from conflict dysregulation│
└────────────────────────────────┴────────────────────────────────┴────────────────────────────────┘
```

---

## 🎯 The Autonomous System Flow

```
+-----------------------------------------------------------------------------------+
|                        LOCAL SOVEREIGN VAULT (CLIENT-SIDE)                        |
|                                                                                   |
|  1. Cognitive Distillation:                                                       |
|     - Raw Digital Footprint (Reading, Media, Notes, Habits)                       |
|     - Meta Muse Spark 1.3 (1M-token context window)                               |
|     - Sanitized 5-Layer Persona Card (Zero raw telemetry leaks)                   |
|                                                                                   |
|  2. On-Device Aesthetic Profiling:                                                |
|     - Meta Llama 3.2 Vision / SAM 3.1 extracts 32-dim Visual Presentation Token   |
|     - Inferred Aesthetic Preference Vector (Pinterest / cinema bookmarks)         |
|     - Raw photos NEVER leave local device storage                                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|            TIER 1 & 2: SCALABLE METROPOLITAN CANDIDATE FUNNEL (<2ms)              |
|                                                                                   |
|  [250 NYC/Brooklyn Cohort]                                                        |
|         │                                                                         |
|         ▼  Tier 1A: Hard Barrier Filter (Distance <= 15mi, Age, Intent)           |
|  [62 Surviving Candidates] (<1ms)                                                 |
|         │                                                                         |
|         ▼  Tier 1B: Latent Coarse Retrieval (64-dim cosine similarity)            |
|  [Top-12 Candidates] (<1ms)                                                       |
|         │                                                                         |
|         ▼  Tier 2: Pareto Topology Router (7-Domain Hybrid Harmony)               |
|  [Top-3 Finalists: Julian, Marcus, David] (<1ms)                                  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        AUTONOMOUS RENDEZVOUS PROTOCOL                             |
|                                                                                   |
|  [Stage 1: Discovery]   Turns 1-4   --> Baseline aesthetic gate & passion depth   |
|  [Stage 2: Banter]      Turns 5-8   --> Witty repartee & linguistic synchrony     |
|  [Stage 3: Friction]    Turns 9-12  --> Gottman bids, roots, & attachment probe   |
|  [Stage 4: Synthesis]   Turns 13-16 --> Reciprocal vulnerability & mutual intro   |
|                                                                                   |
|  * Anti-Sycophancy: Agents prompt-conditioned as skeptical talent scouts with      |
|    an Opportunity Cost Budget (1 date/week).                                      |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       NEUTRAL LOUNGE MODERATOR (3RD PARTY)                        |
|  - Eliminates bilateral agent scoring collusion (SOTOPIA ICLR 2024)               |
|  - Computes Linguistic Style Matching (LSM) across 9 function-word categories     |
|  - Computes Gottman Bid Ratio & Perceived Partner Responsiveness (PPR) composite  |
|  - Continuous Adult Attachment Security & Dyadic Harmony Index                    |
|  - Issues Verdict: [MATCH] | [GRACEFUL ABORT] | [EARLY EXIT]                      |
+-----------------------------------------------------------------------------------+
                                         │
                       +-----------------+-----------------+
                       │ (If Verified Match >= 85%)        │ (If Clash or Flatline)
                       ▼                                   ▼
+--------------------------------------+  +-----------------------------------------+
|     EXPLAINABLE DOSSIER & DATE       |  |          SAFE INTRODUCTION WITHHELD     |
| - Shared Cognitive Resonances        |  | - Transparent explanation of divergence |
| - Honest Lifestyle Friction Points   |  | - Hours of unaligned dating avoided     |
| - 3 Curated Mutual Icebreakers       |  +-----------------------------------------+
| - Dyadic Attachment Harmony    |
| - Real Spatial Venue Grounding       |
| - 3-Panel Moodboard (Meta Muse Image)|
+--------------------------------------+
```

---

## 🏛️ System Architecture & Privacy Safeguards

### 1. Two-Tier Memory Isolation (Zero-Leakage Privacy)
* **Vault Tier:** A local sovereign agent runs on the user's machine, continuously observing authentic intellectual rabbit holes, reading lists, and communication rhythms.
* **Lounge Tier:** The chatting agent entering the digital lounge receives **ONLY** the sanitized 5-layer Persona Card. Raw browsing logs and private notes **never** leave the vault. Even under adversarial prompt injection from a peer agent, raw data cannot leak because it literally is not in the lounge context.

### 2. Sovereign Visual Satisficing Protocol (Layer 2)
Physical attraction is an on-device binary threshold gate ($\theta_{\text{attract}}$), NOT a linear optimizer ([Hunt, Eastwick & Finkel, Psych Science 2015](https://journals.sagepub.com/doi/10.1177/0956797615591967)). 
* Visual Presentation Tokens (VPT) and Aesthetic Preference Vectors (APV) are computed on-device via Meta Llama 3.2 Vision / SAM 3.1 with **zero raw photo egress**.
* If the mutual satisficing threshold clears ($\theta \ge 0.60$), interpersonal compatibility determines 95% of relationship longevity.

### 3. Attachment Dynamics & Relational Stability (Layer 3)
Relationship failure stems from conflict dysregulation, mental load / chore imbalance, and contempt ([Gottman & Levenson 2002](https://psycnet.apa.org/record/2002-01431-002); longitudinal Reddit field synthesis across `r/Marriage` and `r/datingoverthirty`).
* Continuous Hazan & Shaver 4-quadrant attachment tracking flags pursuer-distancer traps:
  $$\text{AttachmentSecurity} = 1.0 - \big(\text{AnxietyScore} \times \text{AvoidanceScore}\big)$$
* Generates an **Emotional Decompression Blueprint** and evaluates **Domestic Labor Entropy** ([Hochschild 2012](https://www.ucpress.edu/book/9780520273160/the-second-shift)).

### 4. Solving "LLM Sycophancy" with Opportunity Cost Budgeting
Out-of-the-box instruction-tuned models default to polite agreeableness. MuseMeet prompts agents as **protective, skeptical talent scouts** with an explicit **Opportunity Cost Budget**: their human only has time for 1 coffee date this week. The agent actively looks for reasons to reject the match unless genuine multi-dimensional resonance is proven.

### 5. The Neutral Lounge Moderator
A neutral 3rd-party observer agent evaluates the transcript independently from the two participant agents, preventing self-serving scoring collusion ([SOTOPIA, ICLR 2024](https://arxiv.org/abs/2310.11667)).

### 6. Hallucination Grounding in the Date Generator
Rather than hallucinating generic "cozy cafes", the date engine anchors itineraries in a curated real-world spatial venue database ([`data/venues.json`](data/venues.json)) with verified acoustic conversation scores and lighting profiles, paired with micro-callbacks extracted verbatim from the dialogue.

---

## 📚 Academic Grounding

Every algorithmic mechanism in MuseMeet is anchored in peer-reviewed relationship science:

| Scientific Finding | Literature Reference | MuseMeet Implementation |
| :--- | :--- | :--- |
| **Dyadic Compatibility** | Joel et al. (*PNAS*, 2020) | Replaces static questionnaire matching with dynamic, emergent agent interaction. |
| **Aesthetic Satisficing Gate** | Hunt, Eastwick & Finkel (*Psych Science*, 2015) | On-device 32D visual presentation tokens; physical spark as binary threshold gate. |
| **Linguistic Synchrony (LSM)** | Ireland & Pennebaker (*Psych Science*, 2011) | Computes turn-by-turn function word overlap across 9 LIWC grammatical classes. |
| **Bids for Connection** | Gottman & Levenson (2002) | Tracks `toward`, `away`, and `against` bid responses during Stage 3 friction probing. |
| **Adult Attachment Styles** | Hazan & Shaver (1987) / Mikulincer (2007) | Continuous anxiety $\times$ avoidance modeling; prevents anxious-avoidant traps. |
| **Domestic Cognitive Labor** | Hochschild (2012) / Amato (2007) | Evaluates chore entropy and domestic workload alignment in relational dynamics. |
| **Perceived Responsiveness (PPR)** | Reis, Maniaci, Eastwick (2021) | Combines bid responsiveness (60%) and stylistic synchrony (40%) into a live chemistry gauge. |
| **Generative Social Simulation** | Park et al. (Stanford/Google, *UIST* 2023) | Multi-stage reflection state machine for autonomous character negotiation. |
| **Asymmetric Social Games** | Zhou et al. (*SOTOPIA*, ICLR 2024) | Dual-tier privacy boundaries with distinct private subtext vs. public dialogue. |

---

## 🎬 Three Calibrated Benchmark Scenarios

| Scenario | Pair | Interaction Outcome | Compatibility | Final LSM | Key Dynamic |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pair 1: Bookshop** | Elena × Julian | **Verified Match** | **92%** | **0.881** | Traverses all 4 stages. Deep resonance on analog media (35mm film, vinyl jazz kissa, vintage literature). Passes aesthetic gate (78.3%) and achieves 95.7% relational stability. |
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

This runs all 12 test suites synchronously (62 assertions):
```
  ✅ Connectors: Meta Model API Client & Dry-Run Fallbacks
  ✅ M1: Persona Vault & Zero-Leakage Privacy Gate
  ✅ AirGap: Contextual Integrity Egress Guardrail & PII Filter
  ✅ Funnel: 250-User Local Cohort & Spatial Retrieval Router
  ✅ Vision: Sovereign On-Device Vision Profiler & Satisficing Gate
  ✅ Attachment: Continuous Attachment Psychometrics & Relational Dynamics
  ✅ LSM: Ireland & Pennebaker LIWC Telemetry Calculator
  ✅ M2: 4-Stage Autonomous Rendezvous Protocol State Machine
  ✅ M2b: Neutral Lounge Moderator Evaluator
  ✅ M3: Compatibility Synthesis Engine with Spatial Grounding
  ✅ M4: Meta Muse Image 3-Panel Moodboard Generator
  ✅ E2E: Full Pipeline Integration across all 3 outcomes
```

### 3. Open the Interactive Web Interfaces
* **Dual-Track Live Negotiation Viewer & Cohort Funnel:**
  ```bash
  open frontend/live_lounge.html
  ```
  *Click **"🗺 Cohort Funnel (250 NYC)"** to watch the candidate pool collapse from 250 singles → 62 → Top 12 → Top 3 Finalists on an interactive Brooklyn map in <0.3ms, then launch directly into the 16-turn live lounge simulation.*

* **Explainable Compatibility Dossier:**
  ```bash
  open frontend/dossier.html
  ```
  *Explore the animated resonance score gauge, Layer 2 aesthetic satisficing results, Layer 3 attachment stability, attachment harmony, honest friction points, copyable icebreakers, and 3-panel date moodboard.*

---

## 📂 Repository Structure

```
musemeet/
├── agent_engine/
│   ├── vault/               # M1: Distillation, On-Device Vision & AirGap Egress Guard
│   ├── router/              # Layer 1: Candidate Funnel & FAISS Coarse Retrieval
│   ├── metrics/             # LSM LIWC Synchrony & Attachment Dynamics
│   ├── protocol/            # M2: 4-Stage Rendezvous Engine & SSE Emitter
│   ├── moderator/           # M2b: Neutral Lounge Moderator Evaluator
│   ├── synthesis/           # M3: Compatibility Dossier Synthesis
│   ├── image/               # M4: Meta Muse Image 3-Panel Moodboard Generator
│   └── fixtures/            # Benchmark Scenarios Loader & Personas
├── connectors/              # Meta Model API (Muse Spark 1.3 / Muse Image 1.0)
├── data/
│   ├── cohort_nyc.json      # 250 Synthetic Brooklyn/NYC Singles Cohort
│   └── venues.json          # Curated Real Spatial Grounding Venues (Tokyo, SF, NYC)
├── frontend/
│   ├── live_lounge.html     # Split-Stream Live Dialogue, Subtext & Cohort Funnel
│   └── dossier.html         # Explainable Compatibility Dossier UI
├── tests/
│   ├── fixtures/            # Vignette 1, 2, and 3 ground truth datasets
│   ├── test_connectors.js   # API client connector tests
│   ├── test_m1.js           # Vault distillation tests
│   ├── test_egress_guard.js # AirGap egress PII interceptor tests
│   ├── test_candidate_funnel.js # Scalable spatial cohort retrieval tests
│   ├── test_vision_profiler.js  # Sovereign vision & satisficing gate tests
│   ├── test_attachment.js   # Attachment style & relational dynamics tests
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
* **Meta Llama 3.2 Vision (On-Device):**
  * Extracts compact 32-dim Visual Presentation Tokens (VPT) locally with zero photo egress.
* **Model Context Protocol (MCP) & Connectors:**
  * Clean abstraction layer connecting agents to external spatial venue data.

---

## 👥 Authors

* **Aditya Raj** ([@adityarajrao](https://github.com/adityarajrao))
* **Aryan Raj** ([@boozards](https://github.com/boozards))

Built for the **Meta Global AI Developer Hackathon 2026** — *Theme 1: Build for Your World (Indie Developer Track)*.
