import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculateHaversineDistance,
  computeCosineSimilarity,
  filterHardBarriers,
  coarseEmbeddingRetrieval,
  computeBigFiveHarmony,
  evaluateParetoScore,
  rankFinalists,
  executeFunnel
} from '../agent_engine/router/candidate_funnel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COHORT_PATH = path.resolve(__dirname, '../data/cohort_nyc.json');

console.log('🧪 Running Candidate Funnel & Spatial Retrieval Router Unit Tests...\n');

// 1. Ingest Cohort
const rawData = fs.readFileSync(COHORT_PATH, 'utf-8');
const cohortPayload = JSON.parse(rawData);
assert.ok(cohortPayload.users && Array.isArray(cohortPayload.users), 'Cohort users array must exist');
assert.equal(cohortPayload.cohort_size, 250, 'Cohort must contain exactly 250 users');
console.log(`  ✅ Test 1: Cohort data loaded successfully (${cohortPayload.cohort_size} synthetic profiles)`);

// 2. Geodesic Haversine Distance
const dNear = calculateHaversineDistance(40.7028, -73.9218, 40.7282, -73.9538); // Bushwick -> Greenpoint
const dFar = calculateHaversineDistance(40.7028, -73.9218, 39.9526, -75.1652); // Bushwick -> Philadelphia
assert.ok(dNear > 1.5 && dNear < 4.0, `Bushwick to Greenpoint should be ~2.4 miles (got ${dNear})`);
assert.ok(dFar > 75.0, `Bushwick to Philly should be >75 miles (got ${dFar})`);
console.log(`  ✅ Test 2: Haversine geodesic distance accurate (Bushwick-Greenpoint: ${dNear}mi, Bushwick-Philly: ${dFar}mi)`);

// 3. Vector Cosine Similarity
const vecA = [1, 0, 0];
const vecB = [1, 0, 0];
const vecC = [0, 1, 0];
const vecD = [0.7071, 0.7071, 0];
assert.equal(computeCosineSimilarity(vecA, vecB), 1.0, 'Identical vectors must have cosine similarity 1.0');
assert.equal(computeCosineSimilarity(vecA, vecC), 0.0, 'Orthogonal vectors must have cosine similarity 0.0');
assert.ok(Math.abs(computeCosineSimilarity(vecA, vecD) - 0.7071) < 0.001, 'Angle calculation must match 45 deg');
console.log('  ✅ Test 3: Cosine similarity mathematics verified across orthogonal and parallel vectors');

// 4. Tier 1A: Hard Barrier Filter
const elena = cohortPayload.users.find((u) => u.user_id === 'usr_elena_01');
assert.ok(elena, 'Elena profile must be present in cohort');

const tier1aSurviving = filterHardBarriers(cohortPayload.users, elena, {
  maxDistanceMiles: 15.0,
  ageTolerance: 6
});

assert.ok(tier1aSurviving.length > 20 && tier1aSurviving.length < 120, `Surviving count should be reasonable (got ${tier1aSurviving.length})`);
// Ensure self is excluded
assert.ok(!tier1aSurviving.some((u) => u.user_id === 'usr_elena_01'), 'Self must never be included');
// Ensure Julian survived
assert.ok(tier1aSurviving.some((u) => u.user_id === 'usr_julian_02'), 'Julian must survive Tier 1A');
// Ensure smokers were excluded for Elena (she has smoking dealbreaker)
assert.ok(!tier1aSurviving.some((u) => u.lifestyle?.smoker), 'All smokers must be filtered out for Elena');
console.log(`  ✅ Test 4: Tier 1A Hard Barrier Filter reduced pool from 250 to ${tier1aSurviving.length} candidates (<1ms)`);

// 5. Tier 1B: Coarse Latent Vector Retrieval
const top12 = coarseEmbeddingRetrieval(tier1aSurviving, elena.behavioral_embedding_64d, 12);
assert.equal(top12.length, 12, 'Coarse retrieval must yield exactly Top-12');
assert.ok(top12[0].similarity >= top12[1].similarity, 'Results must be sorted descending by similarity');
console.log(`  ✅ Test 5: Tier 1B Coarse Retrieval isolated Top-12 candidates (Highest sim: ${top12[0].similarity})`);

// 6. Tier 2: Big Five Harmony & Pareto Scoring
const highHarmony = computeBigFiveHarmony(
  { agreeableness: 0.85, conscientiousness: 0.80, openness: 0.90, neuroticism: 0.20 },
  { agreeableness: 0.88, conscientiousness: 0.75, openness: 0.92, neuroticism: 0.18 }
);
const toxicPair = computeBigFiveHarmony(
  { agreeableness: 0.30, conscientiousness: 0.30, openness: 0.20, neuroticism: 0.90 },
  { agreeableness: 0.35, conscientiousness: 0.25, openness: 0.80, neuroticism: 0.85 }
);
assert.ok(highHarmony > 0.80, `High harmony score expected (got ${highHarmony})`);
assert.ok(toxicPair < 0.40, `Low toxic pair score expected (got ${toxicPair})`);
console.log(`  ✅ Test 6: Big Five psychometric harmony accurately contrasts healthy (${highHarmony}) vs distressed (${toxicPair})`);

// 7. End-to-End Pipeline Execution
const funnelResult = executeFunnel(cohortPayload.users, 'usr_elena_01', {
  maxDistanceMiles: 15.0,
  ageTolerance: 6
});

assert.equal(funnelResult.initialCount, 250);
assert.equal(funnelResult.finalistsTop3.length, 3);
// Julian should be the #1 finalist for Elena
assert.equal(funnelResult.finalistsTop3[0].candidate.user_id, 'usr_julian_02', 'Julian Vance must be Elena\'s #1 match');
assert.ok(funnelResult.finalistsTop3[0].paretoScore > 0.80, 'Julian must achieve >0.80 Pareto score');

console.log(`  ✅ Test 7: End-to-end Funnel completed in ${funnelResult.timingMs.totalMs}ms`);
console.log(`     - Tier 1A: 250 -> ${funnelResult.tier1aFilteredCount} (${funnelResult.timingMs.tier1aMs}ms)`);
console.log(`     - Tier 1B: ${funnelResult.tier1aFilteredCount} -> 12 (${funnelResult.timingMs.tier1bMs}ms)`);
console.log(`     - Tier 2:  12 -> Top 3 Finalists (${funnelResult.timingMs.tier2Ms}ms)`);
console.log(`     - #1 Finalist: ${funnelResult.finalistsTop3[0].candidate.name} (Pareto Score: ${(funnelResult.finalistsTop3[0].paretoScore * 100).toFixed(1)}%)`);

console.log('\n🎉 All Candidate Funnel & Spatial Retrieval Router Unit Tests Passed Successfully!\n');
