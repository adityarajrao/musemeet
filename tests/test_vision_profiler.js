import assert from 'node:assert/strict';
import {
  normalizeL2,
  extractVisualPresentationToken,
  inferAestheticPreferenceVector,
  computeVisualFit,
  evaluateAestheticGate
} from '../agent_engine/vault/vision_profiler.js';

console.log('🧪 Running Sovereign On-Device Vision Profiler & Aesthetic Satisficing Gate Unit Tests...\n');

// 1. Sovereign Privacy Gate
assert.throws(
  () => {
    extractVisualPresentationToken({
      consent_given: false,
      local_photos: ['/local/vault/photo1.jpg']
    });
  },
  /Privacy Violation/,
  'Must reject photo extraction when consent_given is false'
);

assert.throws(
  () => {
    inferAestheticPreferenceVector({
      consent_given: false,
      visual_tastes: ['cinematic lighting', 'grainy 35mm']
    });
  },
  /Privacy Violation/,
  'Must reject aesthetic vector inference when consent_given is false'
);
console.log('  ✅ Test 1: Sovereign Privacy Gate rejects unauthorized visual feature extraction');

// 2. Vector L2 Normalization & Token Length
const sampleFeatures = [1, 2, 3, 4, 5];
const normalized = normalizeL2(sampleFeatures);
const normSum = Math.sqrt(normalized.reduce((s, x) => s + x * x, 0));
assert.ok(Math.abs(normSum - 1.0) < 0.001, 'Normalized vector must have unit L2 length');

const vpt = extractVisualPresentationToken({
  consent_given: true,
  local_photos: ['/local/photos/portrait_35mm_01.jpg', '/local/photos/darkroom_02.jpg']
});
assert.equal(vpt.length, 32, 'VPT must have exactly 32 dimensions');
console.log('  ✅ Test 2: 32-dimensional VPT extracted with unit L2 Euclidean normalization');

// 3. Aesthetic Preference Vector Inference
const apv = inferAestheticPreferenceVector({
  consent_given: true,
  visual_tastes: ['vintage cinema', 'kodachrome warm tones', 'architectural brutalism']
});
assert.equal(apv.length, 32, 'APV must have exactly 32 dimensions');
console.log('  ✅ Test 3: 32-dimensional APV inferred from authentic visual taste bookmarks');

// 4. Directional Visual Fit Math
const fitHigh = computeVisualFit(vpt, vpt);
assert.equal(fitHigh, 1.0, 'Self-fit must yield 1.0');
const orthogonalVec = new Array(32).fill(0);
orthogonalVec[0] = 1.0;
const testVec = new Array(32).fill(0);
testVec[1] = 1.0;
const fitZero = computeVisualFit(orthogonalVec, testVec);
assert.equal(fitZero, 0.0, 'Orthogonal visual vectors must yield 0.0');
console.log('  ✅ Test 4: Directional visual fit verified across boundary conditions');

// 5. High-Compatibility Pair (Elena & Julian Satisficing Gate)
const elenaProfile = {
  visual_presentation_token: [
    0.25, 0.22, 0.28, 0.20, 0.18, 0.24, 0.21, 0.19,
    0.15, 0.18, 0.16, 0.14, 0.12, 0.15, 0.17, 0.19,
    0.10, 0.11, 0.12, 0.14, 0.15, 0.13, 0.12, 0.11,
    0.10, 0.09, 0.12, 0.11, 0.10, 0.12, 0.11, 0.10
  ],
  aesthetic_preference_vector: [
    0.24, 0.21, 0.27, 0.21, 0.17, 0.23, 0.20, 0.18,
    0.16, 0.17, 0.15, 0.15, 0.13, 0.14, 0.16, 0.18,
    0.11, 0.12, 0.11, 0.13, 0.14, 0.12, 0.13, 0.12,
    0.11, 0.10, 0.11, 0.12, 0.11, 0.11, 0.10, 0.11
  ]
};

const julianProfile = {
  visual_presentation_token: elenaProfile.aesthetic_preference_vector,
  aesthetic_preference_vector: elenaProfile.visual_presentation_token
};

const gatePass = evaluateAestheticGate(elenaProfile, julianProfile, 0.60);
assert.equal(gatePass.passed, true, 'Elena and Julian must clear the 0.60 satisficing gate');
assert.ok(gatePass.mutualFit >= 0.60, 'Mutual fit must clear threshold');
console.log(`  ✅ Test 5: Elena & Julian pass mutual aesthetic satisficing gate (Fit: ${(gatePass.mutualFit * 100).toFixed(1)}%)`);

// 6. Divergent Pair (Aesthetic Threshold Failure)
const mismatchedProfile = {
  visual_presentation_token: [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
    0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25
  ],
  aesthetic_preference_vector: [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
    0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25
  ]
};

const gateFail = evaluateAestheticGate(elenaProfile, mismatchedProfile, 0.60);
assert.equal(gateFail.passed, false, 'Mismatched aesthetic vectors must fail the satisficing gate');
assert.ok(gateFail.mutualFit < 0.60, 'Mutual fit must be below threshold');
console.log(`  ✅ Test 6: Incompatible pair triggers polite satisficing exit (Fit: ${(gateFail.mutualFit * 100).toFixed(1)}% < 60%)`);

console.log('\n🎉 All Sovereign On-Device Vision Profiler Unit Tests Passed Successfully!\n');
