/**
 * M6: Turn Streaming Emitter (Fixture & Live Replay Engine)
 *
 * Emits turn events with configurable delay to simulate real-time
 * agent dialogue streaming, subtext reasoning, and dynamic chemistry telemetry.
 *
 * Can be used as an async generator or as an SSE stream handler.
 */

import { loadVignette, getVignetteForPersonas } from '../fixtures/loader.js';
import { getStageForTurn, computeRunningDyadicScores } from './rendezvous.js';

/**
 * Creates an async iterator that yields turns one by one with a delay.
 *
 * @param {object} options
 * @param {string} [options.vignette='vignette_1_bookshop']
 * @param {number} [options.delayMs=350] - Milliseconds between turns
 * @param {number} [options.maxTurns=16]
 * @returns {AsyncGenerator<object>}
 */
export async function* createTurnStream({
  vignette = 'vignette_1_bookshop',
  delayMs = 350,
  maxTurns = 16
} = {}) {
  const data = loadVignette(vignette);
  const turns = data.transcript.turns;
  const runningTurns = [];

  for (let i = 0; i < turns.length && i < maxTurns; i++) {
    const rawTurn = turns[i];
    const turnNumber = i + 1;
    const stage = getStageForTurn(turnNumber);

    const turnObj = {
      turn_number: turnNumber,
      speaker: rawTurn.speaker,
      stage,
      dialogue: rawTurn.dialogue,
      internal_monologue: rawTurn.internal_monologue,
      lsm_score: rawTurn.lsm_score ?? 1.0,
      gottman_bid: rawTurn.gottman_bid ?? 'toward',
      timestamp: rawTurn.timestamp || new Date().toISOString()
    };

    runningTurns.push(turnObj);
    const { bid_ratio, ppr_score } = computeRunningDyadicScores(runningTurns, turnObj.lsm_score);

    const telemetry = {
      turn: turnNumber,
      lsm: turnObj.lsm_score,
      ppr_score,
      bid_ratio
    };

    if (delayMs > 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    yield {
      type: 'turn',
      data: {
        turn: turnObj,
        telemetry,
        is_final: i === turns.length - 1 || turnNumber === maxTurns,
        outcome: data.transcript.outcome
      }
    };
  }

  // Yield final completion event
  yield {
    type: 'complete',
    data: {
      session_id: data.transcript.session_id,
      outcome: data.transcript.outcome,
      verdict: data.moderator_verdict,
      dossier: data.dossier
    }
  };
}

/**
 * CLI runner for testing streaming emitter directly.
 */
if (process.argv[1] && process.argv[1].endsWith('fixture_emitter.js')) {
  console.log('📡 Starting Turn Streaming Emitter (Bookshop Scenario)...\n');
  (async () => {
    for await (const event of createTurnStream({ vignette: 'vignette_1_bookshop', delayMs: 100 })) {
      if (event.type === 'turn') {
        const { turn, telemetry } = event.data;
        console.log(`[Turn ${turn.turn_number}] [${turn.stage.toUpperCase()}] ${turn.speaker}: "${turn.dialogue.slice(0, 50)}..."`);
        console.log(`   Telemetry -> LSM: ${telemetry.lsm.toFixed(3)} | PPR: ${telemetry.ppr_score} | Bid: ${turn.gottman_bid}\n`);
      } else {
        console.log(`🏁 Stream complete! Outcome: ${event.data.outcome}`);
      }
    }
  })();
}
