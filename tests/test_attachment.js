import assert from 'node:assert/strict';
import {
  computeAttachmentSecurity,
  classifyAttachmentQuadrant,
  evaluateDyadicAttachmentDynamics
} from '../agent_engine/metrics/attachment.js';

console.log('🧪 Running Attachment & Relational Dynamics Engine Unit Tests...\n');

// 1. Continuous Attachment Security Formula
const secPerfect = computeAttachmentSecurity(0.0, 0.0);
const secLow = computeAttachmentSecurity(0.9, 0.9);
const secModerate = computeAttachmentSecurity(0.2, 0.3);

assert.equal(secPerfect, 1.0, 'Zero anxiety and avoidance must yield 1.0 security');
assert.equal(secLow, 0.19, '0.9 anxiety and 0.9 avoidance must yield 0.19 security');
assert.equal(secModerate, 0.94, '0.2 anxiety and 0.3 avoidance must yield 0.94 security');
console.log(`  ✅ Test 1: Continuous attachment security math verified (Perfect: ${secPerfect}, Low: ${secLow}, Moderate: ${secModerate})`);

// 2. 4-Quadrant Attachment Style Classification
assert.equal(classifyAttachmentQuadrant(0.2, 0.2), 'Secure');
assert.equal(classifyAttachmentQuadrant(0.7, 0.2), 'Anxious-Preoccupied');
assert.equal(classifyAttachmentQuadrant(0.2, 0.8), 'Dismissive-Avoidant');
assert.equal(classifyAttachmentQuadrant(0.65, 0.75), 'Fearful-Avoidant');
console.log('  ✅ Test 2: 4-quadrant Hazan & Shaver attachment typology classification accurate');

// 3. Elena & Julian Dynamics (Harmonious Secure / Auto-Regulation Pair)
const elenaProfile = {
  attachment: {
    anxiety: 0.26,
    avoidance: 0.22,
    decompression_mode: 'auto_regulation',
    repair_velocity: 0.78
  },
  lifestyle: {
    domestic_entropy: 0.35,
    financial_risk: 0.40
  }
};

const julianProfile = {
  attachment: {
    anxiety: 0.20,
    avoidance: 0.25,
    decompression_mode: 'auto_regulation',
    repair_velocity: 0.82
  },
  lifestyle: {
    domestic_entropy: 0.30,
    financial_risk: 0.35
  }
};

const elenaJulianDynamics = evaluateDyadicAttachmentDynamics(elenaProfile, julianProfile);
assert.equal(elenaJulianDynamics.userA.style, 'Secure');
assert.equal(elenaJulianDynamics.userB.style, 'Secure');
assert.equal(elenaJulianDynamics.isPursuerDistancer, false);
assert.ok(elenaJulianDynamics.relationalStabilityIndex > 0.85, 'Elena & Julian RSI must be >0.85');
assert.equal(elenaJulianDynamics.preMortemWarnings.length, 0, 'No severe relational warnings expected for secure pair');
console.log(`  ✅ Test 3: Elena & Julian dyadic dynamics verified (RSI: ${(elenaJulianDynamics.relationalStabilityIndex * 100).toFixed(1)}%, Zero pursuer-distancer clash)`);

// 4. Anxious-Avoidant Polarization Loop Detection
const anxiousProfile = {
  attachment: {
    anxiety: 0.82,
    avoidance: 0.15,
    decompression_mode: 'co_regulation',
    repair_velocity: 0.50
  },
  lifestyle: {
    domestic_entropy: 0.75,
    financial_risk: 0.80
  }
};

const avoidantProfile = {
  attachment: {
    anxiety: 0.18,
    avoidance: 0.88,
    decompression_mode: 'auto_regulation',
    repair_velocity: 0.20
  },
  lifestyle: {
    domestic_entropy: 0.20,
    financial_risk: 0.25
  }
};

const polarizedDynamics = evaluateDyadicAttachmentDynamics(anxiousProfile, avoidantProfile);
assert.equal(polarizedDynamics.userA.style, 'Anxious-Preoccupied');
assert.equal(polarizedDynamics.userB.style, 'Dismissive-Avoidant');
assert.equal(polarizedDynamics.isPursuerDistancer, true, 'Pursuer-distancer clash must be detected');
assert.ok(polarizedDynamics.relationalStabilityIndex < 0.65, 'Polarized RSI must reflect substantial penalty');

const warningTitles = polarizedDynamics.preMortemWarnings.map((w) => w.title);
assert.ok(
  warningTitles.includes('Pursuer-Distancer Polarization Risk'),
  'Must include Pursuer-Distancer warning'
);
assert.ok(
  warningTitles.includes('Decompression Cadence Mismatch'),
  'Must include Decompression Mismatch warning'
);
assert.ok(
  warningTitles.includes('Chore Entropy & Second Shift Imbalance Risk'),
  'Must flag chore entropy gap'
);
assert.ok(
  warningTitles.includes('Capital Allocation & Risk Tolerance Asymmetry'),
  'Must flag financial risk gap'
);
console.log(`  ✅ Test 4: Anxious-avoidant loop and domestic pre-mortem warnings caught (${polarizedDynamics.preMortemWarnings.length} empirical risks flagged)`);

console.log('\n🎉 All Attachment & Relational Dynamics Engine Unit Tests Passed Successfully!\n');
