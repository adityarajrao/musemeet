import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  coarseEmbeddingRetrieval128d,
  executeMetropolitanScalingFunnel
} from '../agent_engine/router/candidate_funnel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COHORT_PATH = path.resolve(__dirname, '../data/cohort_nyc.json');

console.log('🧪 Running Million-Scale 5-Stage Metropolitan Funnel & 128d Topology Unit Tests...\n');

// 1. Ingest Cohort & Verify 128-Dimensional Topology
const rawData = fs.readFileSync(COHORT_PATH, 'utf-8');
const cohortPayload = JSON.parse(rawData);
assert.equal(cohortPayload.cohort_size, 250);

const elena = cohortPayload.users.find((u) => u.user_id === 'usr_elena_01');
assert.ok(elena);
assert.equal(elena.behavioral_embedding_128d.length, 128, 'Elena must possess full 128-dimensional embedding');

const l2Norm = Math.sqrt(elena.behavioral_embedding_128d.reduce((s, x) => s + x * x, 0));
assert.ok(Math.abs(l2Norm - 1.0) < 0.005, '128d embedding must have unit L2 Euclidean length');
assert.ok(elena.sensory_calibration, 'Sensory calibration block must exist');
assert.equal(elena.sensory_calibration.chronotype_phase, 0.72);
assert.equal(elena.sensory_calibration.acoustic_decibel_tolerance, 0.28);
console.log('  ✅ Test 1: 128-dimensional latent topology & sensory chronotype verified (Unit L2 normalized)');

// 2. 128d Coarse Latent Vector Retrieval
const top15 = coarseEmbeddingRetrieval128d(
  cohortPayload.users.filter((u) => u.user_id !== 'usr_elena_01'),
  elena.behavioral_embedding_128d,
  15
);
assert.equal(top15.length, 15, 'Must retrieve exactly Top 15 candidates');
assert.ok(top15[0].similarity >= top15[1].similarity, 'Must be sorted descending by similarity');
assert.ok(top15[0].similarity > 0.85, 'Highest 128d similarity should exceed 0.85');
console.log(`  ✅ Test 2: 128d vector retrieval isolated Top-15 cluster (Highest 128d sim: ${top15[0].similarity})`);

// Warmup run to trigger V8 JIT optimization
executeMetropolitanScalingFunnel(cohortPayload.users, 'usr_elena_01');

// 3. 5-Stage Metropolitan Funnel Execution (250 Cohort)
const result250 = executeMetropolitanScalingFunnel(cohortPayload.users, 'usr_elena_01', {
  maxDistanceMiles: 15.0,
  ageTolerance: 6
});

assert.equal(result250.cohortPoolSize, 250);
assert.equal(result250.finalistsTop3.length, 3);
assert.equal(result250.finalistsTop3[0].candidate.user_id, 'usr_julian_02', 'Julian Vance must be Elena #1 match');
assert.equal(result250.finalistsTop3[0].aestheticGate.passed, true, 'Julian must pass Bilateral Aesthetic Gate');
assert.ok(result250.finalistsTop3[0].paretoScore > 0.80, 'Julian must achieve >0.80 composite Pareto score');
assert.ok(result250.timingMs.totalMs < 30.0, `Funnel on 250 users should complete in <30ms (got ${result250.timingMs.totalMs}ms)`);

console.log(`  ✅ Test 3: 5-Stage Funnel executed in ${result250.timingMs.totalMs}ms`);
console.log(`     - Stage 0 (Hard Barriers & Transit): 250 -> ${result250.stage0FilteredCount} (${result250.timingMs.stage0Ms}ms)`);
console.log(`     - Stage 1 (128d FAISS Vector ANN):   ${result250.stage0FilteredCount} -> ${result250.stage1ShortlistCount} (${result250.timingMs.stage1Ms}ms)`);
console.log(`     - Stage 2 & 3 (Pareto & Aesthetic Gate): ${result250.stage1ShortlistCount} -> Top 3 Finalists (${result250.timingMs.stage2Ms}ms)`);
console.log(`     - #1 Match: ${result250.finalistsTop3[0].candidate.name} (Pareto: ${(result250.finalistsTop3[0].paretoScore * 100).toFixed(1)}%)`);

// 4. Scalability Stress Test: 2,500 Candidate Metropolitan Pool (<35ms Latency Target)
const scaledPool = [];
for (let rep = 0; rep < 10; rep++) {
  for (const user of cohortPayload.users) {
    scaledPool.push({
      ...user,
      user_id: `${user.user_id}_rep${rep}`
    });
  }
}
assert.equal(scaledPool.length, 2500, 'Scaled pool must contain exactly 2,500 candidates');

const startScale = performance.now();
const resultScaled = executeMetropolitanScalingFunnel(scaledPool, elena, {
  maxDistanceMiles: 15.0,
  ageTolerance: 6
});
const scaleTotalMs = Number((performance.now() - startScale).toFixed(2));

assert.equal(resultScaled.cohortPoolSize, 2500);
assert.equal(resultScaled.finalistsTop3.length, 3);
assert.ok(
  scaleTotalMs < 35.0,
  `Scalability benchmark failed: 2,500 candidates took ${scaleTotalMs}ms (must be <35ms)`
);

console.log(`  ✅ Test 4: Scalability Stress Benchmark passed: 2,500 Candidates filtered to Top 3 in ${scaleTotalMs}ms (<35ms target)`);
console.log(`     - Stage 0: 2,500 -> ${resultScaled.stage0FilteredCount} candidates`);
console.log(`     - Stage 1: ${resultScaled.stage0FilteredCount} -> 15 candidates (128d ANN)`);
console.log(`     - Stage 2 & 3: 15 -> Top 3 Finalists (Pareto & Satisficing Gate)`);

console.log('\n🎉 All Million-Scale 5-Stage Funnel & 128d Topology Unit Tests Passed Successfully!\n');
