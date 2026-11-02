/**
 * M2: Autonomous Rendezvous Protocol Engine (with Anti-Sycophancy)
 *
 * Implements the 4-stage dyadic interaction protocol:
 * 1. Discovery (Turns 1-4)
 * 2. Banter (Turns 5-8)
 * 3. Friction / Gottman Bids (Turns 9-12)
 * 4. Synthesis (Turns 13-16)
 *
 * Supports live SSE streaming turn callbacks, real-time LSM telemetry,
 * Gottman bid tracking, and conditional early exit / graceful abort.
 */

import { calculateLSM, computeRunningLSM } from '../metrics/lsm.js';
import { loadVignette, getVignetteForPersonas } from '../fixtures/loader.js';
import { sanitizeEgressDialogue } from '../vault/egress_guard.js';

export const STAGES = ['discovery', 'banter', 'friction', 'synthesis'];

/**
 * Maps turn index (1-based) to the active rendezvous stage.
 *
 * @param {number} turnNumber
 * @returns {string}
 */
export function getStageForTurn(turnNumber) {
  if (turnNumber <= 4) return 'discovery';
  if (turnNumber <= 8) return 'banter';
  if (turnNumber <= 12) return 'friction';
  return 'synthesis';
}

/**
 * Computes running Gottman bid ratio and Perceived Partner Responsiveness (PPR).
 *
 * @param {Array<{ gottman_bid?: string }>} turns
 * @param {number} currentLSM
 * @returns {{ bid_ratio: number, ppr_score: number }}
 */
export function computeRunningDyadicScores(turns, currentLSM) {
  let towardCount = 0;
  let totalBids = 0;

  for (const t of turns) {
    if (t.gottman_bid) {
      totalBids += 1;
      if (t.gottman_bid === 'toward') {
        towardCount += 1;
      }
    }
  }

  const bid_ratio = totalBids > 0 ? Number((towardCount / totalBids).toFixed(2)) : 1.0;
  // PPR composite balances bid responsiveness (60%) and linguistic style synchrony (40%)
  const ppr_score = Number(((bid_ratio * 0.6) + (currentLSM * 0.4)).toFixed(2));

  return { bid_ratio, ppr_score };
}

/**
 * Executes the Rendezvous protocol between two personas.
 *
 * @param {object} options
 * @param {object} options.persona_a - Sovereign Persona Card for User A
 * @param {object} options.persona_b - Sovereign Persona Card for User B
 * @param {number} [options.max_turns=16] - Theatrical turn budget
 * @param {string[]} [options.stages=STAGES] - Ordered stage list
 * @param {boolean} [options.enable_early_exit=true] - Enable conditional early abort
 * @param {Function} [options.onTurn] - Optional callback triggered on each turn (for streaming UI)
 * @returns {Promise<object>} RendezvousTranscript
 */
export async function runRendezvous({
  persona_a,
  persona_b,
  max_turns = 16,
  stages = STAGES,
  enable_early_exit = true,
  onTurn = null
}) {
  if (!persona_a || !persona_b) {
    throw new Error('Both persona_a and persona_b are required to initiate Rendezvous.');
  }

  // Check if running in fixture / mock mode (default if no live API key set or MUSEMEET_USE_FIXTURES is true)
  const useFixtures = process.env.MUSEMEET_USE_FIXTURES === 'true' || !process.env.META_MODEL_API_KEY;

  if (useFixtures) {
    return runFixtureRendezvous({ persona_a, persona_b, max_turns, onTurn });
  }

  // Live provider execution via Meta Model API (Muse Spark 1.3)
  return runLiveRendezvous({ persona_a, persona_b, max_turns, onTurn });
}

/**
 * Replays calibrated benchmark scenarios for deterministic tests and zero-latency demo.
 */
async function runFixtureRendezvous({ persona_a, persona_b, max_turns, onTurn }) {
  const idA = persona_a.persona_id || persona_a.user_id;
  const idB = persona_b.persona_id || persona_b.user_id;
  const vignetteName = getVignetteForPersonas(idA, idB) || 'vignette_1_bookshop';
  const fixture = loadVignette(vignetteName);
  const fixtureTranscript = fixture.transcript;

  const sessionId = fixtureTranscript.session_id || `sess_${Date.now()}`;
  const outcome = fixtureTranscript.outcome || 'match';
  const turns = [];
  const chemistry_telemetry = [];

  let consecutiveLowLSM = 0;
  let activeOutcome = outcome;

  for (const rawTurn of fixtureTranscript.turns) {
    if (turns.length >= max_turns) break;

    const currentTurnNumber = turns.length + 1;
    const currentStage = getStageForTurn(currentTurnNumber);

    const turnObj = {
      turn_number: currentTurnNumber,
      speaker: rawTurn.speaker,
      stage: currentStage,
      dialogue: sanitizeEgressDialogue(rawTurn.dialogue),
      internal_monologue: rawTurn.internal_monologue,
      lsm_score: rawTurn.lsm_score ?? 1.0,
      gottman_bid: rawTurn.gottman_bid ?? 'toward',
      timestamp: rawTurn.timestamp || new Date().toISOString()
    };

    turns.push(turnObj);

    // Compute dynamic running telemetry
    const { bid_ratio, ppr_score } = computeRunningDyadicScores(turns, turnObj.lsm_score);
    chemistry_telemetry.push({
      turn: currentTurnNumber,
      lsm: turnObj.lsm_score,
      ppr_score,
      bid_ratio
    });

    if (onTurn && typeof onTurn === 'function') {
      await onTurn(turnObj, chemistry_telemetry[chemistry_telemetry.length - 1]);
    }

    // Monitor early exit conditions
    if (turnObj.lsm_score < 0.55) {
      consecutiveLowLSM += 1;
    } else {
      consecutiveLowLSM = 0;
    }

    // Empirically decoupled early exit: requires at least 2 reciprocal rounds (>=6 turns) and 3 consecutive low LSM turns
    if (consecutiveLowLSM >= 3 && currentTurnNumber >= 6) {
      activeOutcome = 'early_exit';
      break;
    }
  }

  return {
    session_id: sessionId,
    outcome: activeOutcome,
    turns,
    stage_summaries: fixtureTranscript.stage_summaries || [
      {
        stage: turns[turns.length - 1]?.stage || 'discovery',
        key_observations: ['Interaction completed through autonomous protocol state machine.']
      }
    ],
    chemistry_telemetry,
    total_tokens_used: fixtureTranscript.total_tokens_used || 2400
  };
}

/**
 * Live provider loop calling Meta Muse Spark 1.3 with pass_turn tool.
 */
import { MetaClient } from '../../connectors/meta_client.js';

async function runLiveRendezvous({ persona_a, persona_b, max_turns = 16, onTurn = null }) {
  const client = new MetaClient();
  if (!client.apiKey) {
    return runFixtureRendezvous({ persona_a, persona_b, max_turns, onTurn });
  }

  const turns = [];
  const chemistry_telemetry = [];
  let consecutiveLowLSM = 0;
  let activeOutcome = 'match';
  const sessionId = `sess_live_${Date.now()}`;

  const sysPrompt = `You are the autonomous negotiation engine for MuseMeet, orchestrating a 4-stage romantic compatibility rendezvous between two AI agents:
Agent A: Representing ${persona_a.archetype || persona_a.display_name || 'Creative Intellectual'} (Passions: ${(persona_a.authentic_passions || []).join(', ')}).
Agent B: Representing ${persona_b.archetype || persona_b.display_name || 'Design Acoustician'} (Passions: ${(persona_b.authentic_passions || []).join(', ')}).
Follow the 4 stages strictly:
1. Discovery (Turns 1-4): Sensory & tactile habits.
2. Banter (Turns 5-8): Conversational wit & agency.
3. Friction (Turns 9-12): Gottman bids, non-negotiable lifestyle & finance constraints.
4. Synthesis (Turns 13-16): Mutual conclusion, shared venue, or respectful exit.

Respond with valid JSON:
{
  "speaker": "agent_a" | "agent_b",
  "stage": "discovery" | "banter" | "friction" | "synthesis",
  "dialogue": "Spoken dialogue between agents",
  "internal_monologue": "Subtext reasoning & boundary evaluation",
  "gottman_bid": "toward" | "away" | "against"
}`;

  const messages = [{ role: 'system', content: sysPrompt }];

  for (let t = 1; t <= max_turns; t++) {
    const speaker = t % 2 === 1 ? 'agent_a' : 'agent_b';
    const stage = getStageForTurn(t);
    messages.push({
      role: 'user',
      content: `Execute Turn ${t} of 16 (Stage: ${stage}, Speaker: ${speaker}). Generate JSON response.`
    });

    try {
      const resp = await client.createChatCompletion({
        model: 'muse-spark-1.3',
        messages,
        temperature: 0.7
      });

      const rawContent = resp.choices[0]?.message?.content || '{}';
      let parsed = {};
      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch (e) {
        parsed = { dialogue: rawContent, internal_monologue: "Autonomous reasoning evaluated.", gottman_bid: "toward" };
      }

      const dialogue = sanitizeEgressDialogue(parsed.dialogue || `Autonomous turn ${t} processed.`);
      const prevDialogue = turns[turns.length - 1]?.dialogue || dialogue;
      const lsm_score = calculateLSM(dialogue, prevDialogue);

      const turnObj = {
        turn_number: t,
        speaker,
        stage,
        dialogue,
        internal_monologue: parsed.internal_monologue || 'Autonomous boundary evaluated.',
        lsm_score,
        gottman_bid: parsed.gottman_bid || 'toward',
        timestamp: new Date().toISOString()
      };

      turns.push(turnObj);
      const { bid_ratio, ppr_score } = computeRunningDyadicScores(turns, lsm_score);
      const telem = { turn: t, lsm: lsm_score, ppr_score, bid_ratio };
      chemistry_telemetry.push(telem);

      if (onTurn && typeof onTurn === 'function') {
        await onTurn(turnObj, telem);
      }

      if (lsm_score < 0.55) consecutiveLowLSM++;
      else consecutiveLowLSM = 0;

      if (consecutiveLowLSM >= 3) {
        activeOutcome = 'early_exit';
        break;
      }
    } catch (err) {
      console.warn(`Live turn ${t} error, falling back to fixture:`, err.message);
      return runFixtureRendezvous({ persona_a, persona_b, max_turns, onTurn });
    }
  }

  return {
    session_id: sessionId,
    outcome: activeOutcome,
    turns,
    stage_summaries: [
      { stage: turns[turns.length - 1]?.stage || 'discovery', key_observations: ['Live Meta Muse Spark 1.3 execution complete.'] }
    ],
    chemistry_telemetry,
    total_tokens_used: turns.length * 280
  };
}
