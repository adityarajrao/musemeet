# AGENTS.md — AI Agent Pairing Guidelines & Context

This document is the **primary context anchor** for any AI coding assistant (Antigravity, Claude Code, Cursor, Copilot, etc.) working on this repository or the companion public repo.

---

## 🎯 1. Mission & Hackathon Context

* **Event:** Meta Global AI Developer Hackathon ($1,000,000 Prize Pool)
* **Track:** Indie Developer Track (Judged on *creativity, technical ambition, and whether it works*)
* **Theme:** Theme 1: Build for Your World (Solving real-world burnout and human connection)
* **Submission Deadline:** **November 4, 2026 @ 9:00 PM ET** (Kickoff: Oct 26; Demo finals: Nov 9)
* **Official Public Submission Repo:** [`adityarajrao/musemeet`](https://github.com/adityarajrao/musemeet)
* **Private Research Repo:** [`adityarajrao/musemeet-research`](https://github.com/adityarajrao/musemeet-research) (This repo)

---

## 💡 2. Product Vision: MuseMeet

### The Core Problem
Modern dating and connection platforms suffer from superficial swipe fatigue and the **"self-reporting paradox"**:
* When filling out profiles or 3-minute onboarding surveys, humans either intentionally mask their quirks, succumb to social desirability bias, or cannot articulate what they actually value in a long-term partner or peer.
* Humans spend 10+ hours a week swiping on curated masks, only to find fundamental lifestyle or communication friction on day one.

### The Autonomous Solution
**MuseMeet** introduces autonomous, agent-mediated matchmaking:
1. **Continuous Persona Distillation (With Explicit Permission):** A personal Muse agent runs locally as a sovereign companion, continuously observing the user's authentic interests, media consumption, intellectual rabbit holes, reading tastes, and communication cadence over time on a rolling basis.
2. **Zero-Knowledge Sovereign Privacy:** Raw browsing telemetry, private bookmarks, and personal habits **never** leave the user's sovereign agent vault.
3. **Autonomous Agent-to-Agent Rendezvous:** When looking for a match, User A's Muse agent and User B's Muse agent enter a private digital lounge. The agents conduct a structured multi-turn negotiation (wit & banter check, lifestyle friction probing, core dealbreakers, intellectual resonance).
4. **Explainable Introductions & Date Generation:** If and only if both agents confirm multi-dimensional chemistry, they introduce their humans with:
   * An **Explainable Compatibility Dossier** (why you match, potential friction points, shared curiosities).
   * **Mutual Icebreakers** (hyper-specific conversation sparks).
   * A **Bespoke First-Date Itinerary** with visual scene moodboards generated via **Muse Image**.

---

## 🛠️ 3. Meta AI Tech Stack & Model Integration

* **Meta Muse Spark (1.3 / Open) via Meta Model API:**
  * Ingests long unstructured context (reading lists, chats, essays) using its **1M-token context window**.
  * Executes multi-step agentic reasoning and tool loops for the Rendezvous Protocol.
* **Meta Muse Image & SAM 3.1:**
  * Generates visual aesthetic moodboards and date spot visualizers tailored to the couple's mutual tastes.
* **Meta AI Connectors & Model Context Protocol (MCP):**
  * Standardized tool-calling interface for agent-to-agent negotiation (`probe_lifestyle`, `evaluate_dealbreaker`, `synthesize_chemistry`).
* **Partner Inference Support:** Baseten ($100 credit), Modal ($100 credit), Fireworks ($25 credit).

---

## 🏛️ 4. Two-Repository Workflow Rules for Agents

| Repository | Visibility | Content & Rules |
| :--- | :--- | :--- |
| **`musemeet`** | 🌍 **PUBLIC** | **ONLY production-grade runnable code.** Frontend (Next.js/Vite), backend API, agent engine, clean tests, and judge-facing documentation. Keep commit messages clean and professional. |
| **`musemeet-research`** | 🔒 **PRIVATE** | **Research, prompt evals, datasets, and notes.** Raw prompt iterations, synthetic persona JSONs, benchmark logs, and pitch notes. |

> ⚠️ **CRITICAL SECURITY RULE:** Never commit `.env` files, Meta Model API keys, or partner credentials to either repository. Always use `.env.example` as a template and load keys via environment variables.

---

## 📂 5. Directory Map of this Research Repo

* `/prompts/`: System prompts for persona distillation, agent-to-agent banter, dealbreaker probes, and chemistry scoring.
* `/datasets/`: Sample digital footprints, mock reading lists, and synthetic persona test vectors.
* `/benchmarks/`: Model latency, token consumption, and compatibility evaluation matrices.
* `/notes/`: Technical specifications, architecture diagrams, meeting logs, and submission copy.
* `/scratch/`: Throwaway exploratory scripts.
EOF
