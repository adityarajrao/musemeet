import assert from 'node:assert/strict';
import { runRendezvous, getStageForTurn, computeRunningDyadicScores } from '../agent_engine/protocol/rendezvous.js';
import { loadVignette } from '../agent_engine/fixtures/loader.js';

console.log('🧪 Running M2 Rendezvous Protocol Engine Unit Tests...\n');

// Load synthetic test personas
const pair1 = loadVignette('vignette_1_bookshop');
const pair2 = loadVignette('vignette_2_record_store');
const pair3 = loadVignette('vignette_3_market');

// Test 1: Stage mapping logic
{
  assert.equal(getStageForTurn(1), 'discovery');
  assert.equal(getStageForTurn(4), 'discovery');
  assert.equal(getStageForTurn(5), 'banter');
  assert.equal(getStageForTurn(8), 'banter');
  assert.equal(getStageForTurn(9), 'friction');
  assert.equal(getStageForTurn(12), 'friction');
  assert.equal(getStageForTurn(13), 'synthesis');
  assert.equal(getStageForTurn(16), 'synthesis');
  console.log('  ✅ Test 1: Stage progression mapping verified (Turns 1-16)');
}

// Test 2: Input validation
{
  await assert.rejects(
    async () => runRendezvous({ persona_a: null, persona_b: pair1.persona_b }),
    /Both persona_a and persona_b are required/,
    'Should throw error when persona_a is missing'
  );
  console.log('  ✅ Test 2: Input validation rejects missing personas');
}

// Test 3: Pair 1 (Elena + Julian) -> High Chemistry MATCH across all 4 stages
{
  const streamedTurns = [];
  const transcript = await runRendezvous({
    persona_a: pair1.persona_a,
    persona_b: pair1.persona_b,
    onTurn: (turn, telemetry) => {
      streamedTurns.push({ turnNumber: turn.turn_number, lsm: telemetry.lsm });
    }
  });

  assert.equal(transcript.outcome, 'match', 'Pair 1 should yield outcome: match');
  assert.equal(transcript.turns.length, 16, 'Pair 1 should have 16 turns across 4 stages');
  assert.equal(streamedTurns.length, 16, 'onTurn streaming callback should fire 16 times');

  // Verify all 4 stages are present
  const stagesCovered = new Set(transcript.turns.map(t => t.stage));
  assert.ok(stagesCovered.has('discovery'), 'Must cover discovery stage');
  assert.ok(stagesCovered.has('banter'), 'Must cover banter stage');
  assert.ok(stagesCovered.has('friction'), 'Must cover friction stage');
  assert.ok(stagesCovered.has('synthesis'), 'Must cover synthesis stage');

  // Verify chemistry telemetry
  assert.equal(transcript.chemistry_telemetry.length, 16, 'Should have 16 telemetry entries');
  const finalTelemetry = transcript.chemistry_telemetry[15];
  assert.ok(finalTelemetry.lsm > 0.80, `Final LSM for Pair 1 should be >0.80, got ${finalTelemetry.lsm}`);
  assert.ok(finalTelemetry.ppr_score > 0.85, `Final PPR score should be >0.85, got ${finalTelemetry.ppr_score}`);
  assert.ok(finalTelemetry.bid_ratio > 0.90, `Final bid ratio should be >0.90, got ${finalTelemetry.bid_ratio}`);

  console.log(`  ✅ Test 3: Pair 1 completes full 4-stage match (16 turns, Final LSM: ${finalTelemetry.lsm})`);
}

// Test 4: Pair 2 (Elena + Marcus) -> Graceful Abort in Stage 3 (Friction Dealbreaker)
{
  const transcript = await runRendezvous({
    persona_a: pair2.persona_a,
    persona_b: pair2.persona_b
  });

  assert.equal(transcript.outcome, 'graceful_abort', 'Pair 2 should yield outcome: graceful_abort');
  assert.equal(transcript.turns.length, 12, 'Pair 2 should abort after 12 turns (end of Stage 3)');

  const lastTurn = transcript.turns[transcript.turns.length - 1];
  assert.equal(lastTurn.stage, 'friction', 'Last turn should be in friction stage');
  console.log('  ✅ Test 4: Pair 2 triggers graceful abort at Stage 3 dealbreaker collision');
}

// Test 5: Pair 3 (Elena + David) -> Early Exit in Stage 1 (Conversational Flatline)
{
  const transcript = await runRendezvous({
    persona_a: pair3.persona_a,
    persona_b: pair3.persona_b
  });

  assert.equal(transcript.outcome, 'early_exit', 'Pair 3 should yield outcome: early_exit');
  assert.equal(transcript.turns.length, 6, 'Pair 3 should terminate early at turn 6');

  const finalTelemetry = transcript.chemistry_telemetry[transcript.chemistry_telemetry.length - 1];
  assert.ok(finalTelemetry.lsm < 0.55, `Pair 3 LSM should collapse below 0.55, got ${finalTelemetry.lsm}`);
  console.log(`  ✅ Test 5: Pair 3 triggers early exit at Turn 6 (LSM: ${finalTelemetry.lsm})`);
}

console.log('\n🎉 All M2 Rendezvous Protocol Engine Unit Tests Passed Successfully!\n');
