import assert from 'node:assert/strict';
import { evaluateTranscript, evaluateTranscriptDynamically } from '../agent_engine/moderator/moderator.js';
import { loadVignette } from '../agent_engine/fixtures/loader.js';

console.log('🧪 Running M2b Neutral Lounge Moderator Unit Tests...\n');

// Load benchmark fixtures
const pair1 = loadVignette('vignette_1_bookshop');
const pair2 = loadVignette('vignette_2_record_store');
const pair3 = loadVignette('vignette_3_market');

// Test 1: Input validation
{
  await assert.rejects(
    async () => evaluateTranscript({ transcript: null }),
    /Valid transcript with turns array is required/,
    'Should throw error when transcript is null'
  );
  console.log('  ✅ Test 1: Input validation rejects invalid transcripts');
}

// Test 2: Pair 1 Evaluation (Bookshop Match)
{
  const verdict = await evaluateTranscript({
    transcript: pair1.transcript,
    persona_a: pair1.persona_a,
    persona_b: pair1.persona_b
  });

  assert.equal(verdict.outcome, 'match', 'Pair 1 must be evaluated as match');
  assert.ok(verdict.compatibility_score >= 85, `Compatibility score should be >= 85, got ${verdict.compatibility_score}`);
  assert.ok(verdict.final_lsm_score > 0.80, `Final LSM should be > 0.80, got ${verdict.final_lsm_score}`);
  assert.ok(verdict.gottman_bid_ratio > 0.85, 'Gottman bid ratio should be > 0.85');
  assert.ok(verdict.verdict_rationale.length > 20, 'Verdict rationale must be descriptive');
  assert.ok(verdict.outcome_message.length > 20, 'Outcome message must be populated');

  console.log(`  ✅ Test 2: Pair 1 evaluated correctly (Score: ${verdict.compatibility_score}%, LSM: ${verdict.final_lsm_score})`);
}

// Test 3: Pair 2 Evaluation (Record Store Graceful Abort)
{
  const verdict = await evaluateTranscript({
    transcript: pair2.transcript,
    persona_a: pair2.persona_a,
    persona_b: pair2.persona_b
  });

  assert.equal(verdict.outcome, 'graceful_abort', 'Pair 2 must be evaluated as graceful_abort');
  assert.ok(verdict.compatibility_score <= 65, `Compatibility score should be <= 65, got ${verdict.compatibility_score}`);
  assert.ok(verdict.verdict_rationale.includes('lifestyle') || verdict.verdict_rationale.includes('constraint') || verdict.verdict_rationale.includes('collision'), 'Rationale should mention lifestyle constraint');

  console.log(`  ✅ Test 3: Pair 2 graceful abort evaluated correctly (Score: ${verdict.compatibility_score}%)`);
}

// Test 4: Pair 3 Evaluation (Market Early Exit)
{
  const verdict = await evaluateTranscript({
    transcript: pair3.transcript,
    persona_a: pair3.persona_a,
    persona_b: pair3.persona_b
  });

  assert.equal(verdict.outcome, 'early_exit', 'Pair 3 must be evaluated as early_exit');
  assert.ok(verdict.compatibility_score <= 38, `Compatibility score should be <= 38, got ${verdict.compatibility_score}`);
  assert.ok(verdict.final_lsm_score < 0.55, `Final LSM should be < 0.55, got ${verdict.final_lsm_score}`);

  console.log(`  ✅ Test 4: Pair 3 early exit evaluated correctly (Score: ${verdict.compatibility_score}%, LSM: ${verdict.final_lsm_score})`);
}

// Test 5: Dynamic evaluation on un-fixture'd custom transcript
{
  const customTranscript = {
    session_id: 'custom_001',
    outcome: 'match',
    turns: [
      { speaker: 'agent_a', dialogue: 'I really love wandering through old used bookstores on rainy afternoons.', gottman_bid: 'toward' },
      { speaker: 'agent_b', dialogue: 'I completely agree, there is something so magical about the scent of old paper and dust.', gottman_bid: 'toward' },
      { speaker: 'agent_a', dialogue: 'Yes! And finding an unexpected annotation in the margins feels like finding a secret note.', gottman_bid: 'toward' },
      { speaker: 'agent_b', dialogue: 'Exactly, it connects you across time to another mind in the most quiet and intimate way.', gottman_bid: 'toward' }
    ]
  };

  const dynamicVerdict = evaluateTranscriptDynamically(customTranscript);
  assert.equal(dynamicVerdict.outcome, 'match');
  assert.equal(dynamicVerdict.gottman_bid_ratio, 1.0);
  assert.ok(dynamicVerdict.final_lsm_score > 0.45, `Expected LSM > 0.45, got ${dynamicVerdict.final_lsm_score}`);
  assert.ok(dynamicVerdict.ppr_composite >= 0.70, `Expected PPR >= 0.70, got ${dynamicVerdict.ppr_composite}`);
  assert.ok(dynamicVerdict.compatibility_score >= 60, `Expected score >= 60, got ${dynamicVerdict.compatibility_score}`);

  console.log(`  ✅ Test 5: Dynamic transcript evaluation computed successfully (LSM: ${dynamicVerdict.final_lsm_score}, Score: ${dynamicVerdict.compatibility_score}%)`);
}

console.log('\n🎉 All M2b Neutral Lounge Moderator Unit Tests Passed Successfully!\n');
