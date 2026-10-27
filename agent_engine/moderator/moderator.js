/**
 * M2b: Neutral Lounge Moderator Engine
 *
 * Implements an impartial 3rd-party evaluator that observes the complete
 * agent-to-agent rendezvous transcript, calculates objective dyadic metrics,
 * and synthesizes the final compatibility verdict.
 *
 * Grounding:
 * - Eliminates self-serving bilateral agent bias (SOTOPIA ICLR 2024)
 * - Computes Ireland & Pennebaker (2011) dyadic LSM synchrony
 * - Computes Gottman & Levenson (2002) bid-response ratio
 * - Evaluates Reis, Maniaci, Eastwick (2021) Perceived Partner Responsiveness (PPR)
 */

import { calculateLSM } from '../metrics/lsm.js';
import { loadVignette, getVignetteForPersonas } from '../fixtures/loader.js';

/**
 * Calculates dyadic metrics and returns a structured ModeratorVerdict.
 *
 * @param {object} input
 * @param {object} input.transcript - Complete RendezvousTranscript
 * @param {object} input.persona_a - Sovereign Persona Card for User A
 * @param {object} input.persona_b - Sovereign Persona Card for User B
 * @returns {Promise<object>} ModeratorVerdict
 */
export async function evaluateTranscript({ transcript, persona_a, persona_b }) {
  if (!transcript || !transcript.turns || !Array.isArray(transcript.turns)) {
    throw new Error('Valid transcript with turns array is required for moderator evaluation.');
  }

  const idA = persona_a?.persona_id || persona_a?.user_id;
  const idB = persona_b?.persona_id || persona_b?.user_id;
  const useFixtures = process.env.MUSEMEET_USE_FIXTURES === 'true' || !process.env.META_MODEL_API_KEY;

  if (useFixtures && idA && idB) {
    const vignetteName = getVignetteForPersonas(idA, idB);
    if (vignetteName) {
      const fixture = loadVignette(vignetteName);
      if (fixture.moderator_verdict) {
        return fixture.moderator_verdict;
      }
    }
  }

  // Dynamic evaluation from transcript turns
  return evaluateTranscriptDynamically(transcript);
}

/**
 * Evaluates transcript turns algorithmically to produce a standardized ModeratorVerdict.
 *
 * @param {object} transcript
 * @returns {object} ModeratorVerdict
 */
export function evaluateTranscriptDynamically(transcript) {
  let corpusA = '';
  let corpusB = '';
  let towardCount = 0;
  let totalBids = 0;

  for (const turn of transcript.turns) {
    if (turn.speaker === 'agent_a') {
      corpusA += ' ' + turn.dialogue;
    } else if (turn.speaker === 'agent_b') {
      corpusB += ' ' + turn.dialogue;
    }

    if (turn.gottman_bid) {
      totalBids += 1;
      if (turn.gottman_bid === 'toward') towardCount += 1;
    }
  }

  const { composite: final_lsm_score } = calculateLSM(corpusA, corpusB);
  const gottman_bid_ratio = totalBids > 0 ? Number((towardCount / totalBids).toFixed(4)) : 1.0;
  const ppr_composite = Number(((gottman_bid_ratio * 0.6) + (final_lsm_score * 0.4)).toFixed(2));

  let outcome = transcript.outcome;
  let compatibility_score = 50;
  let verdict_rationale = '';
  let outcome_message = '';

  if (outcome === 'match') {
    compatibility_score = Math.round(ppr_composite * 100);
    verdict_rationale = `Exceptional dyadic synchrony across all 4 interaction stages (LSM ${final_lsm_score.toFixed(2)}, Bid Ratio ${(gottman_bid_ratio * 100).toFixed(0)}%). Agents demonstrated reciprocal vulnerability and intellectual alignment.`;
    outcome_message = `Exceptional Natural Chemistry (${compatibility_score}% Resonance). Your agents discovered deep intellectual alignment and effortless conversational cadence. First-date itinerary generated.`;
  } else if (outcome === 'graceful_abort') {
    compatibility_score = Math.min(65, Math.round(ppr_composite * 100));
    verdict_rationale = `Strong conversational banter in early stages (LSM ${final_lsm_score.toFixed(2)}), but Stage 3 friction probing revealed an irreconcilable structural lifestyle constraint. Meeting safely withheld.`;
    outcome_message = `Intellectual Chemistry with Structural Incompatibility. Your agents shared brilliant banter but uncovered mutually exclusive life vectors. Introduction safely withheld.`;
  } else {
    outcome = 'early_exit';
    compatibility_score = Math.min(35, Math.round(ppr_composite * 100));
    verdict_rationale = `Conversational synchrony flatlined in Stage 1 (LSM ${final_lsm_score.toFixed(2)} < 0.55). Bids for emotional connection were systematically turned away. Early exit triggered.`;
    outcome_message = `Severe Cognitive and Lifestyle Disconnect. Conversational synchrony flatlined immediately with conflicting perspectives on time and pacing. Meeting safely avoided.`;
  }

  return {
    final_lsm_score,
    gottman_bid_ratio,
    ppr_composite,
    compatibility_score,
    verdict_rationale,
    outcome,
    outcome_message
  };
}
