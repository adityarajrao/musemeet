import assert from 'node:assert/strict';
import {
  computeFinancialParity,
  inferLifestyleFinancialDimensions
} from '../agent_engine/metrics/financial_parity.js';

console.log('🧪 Running Sovereign Financial Parity & Lifestyle Compatibility Unit Tests...\n');

// 1. Sovereign Privacy Gate
assert.throws(
  () => {
    inferLifestyleFinancialDimensions({
      consent_given: false,
      dining_habits: ['neighborhood bistros']
    });
  },
  /Privacy Violation/,
  'Must reject financial lifestyle inference when consent_given is false'
);
console.log('  ✅ Test 1: Sovereign Privacy Gate strictly blocks unauthorized financial profiling');

// 2. High Resonance Pair (Elena × Julian alignment)
const elenaLifestyle = {
  leisure_expenditure_tier: 0.42,
  consumption_entropy: 0.35,
  financial_risk_tolerance: 0.40
};
const julianLifestyle = {
  leisure_expenditure_tier: 0.45,
  consumption_entropy: 0.38,
  financial_risk_tolerance: 0.45
};

const highResonance = computeFinancialParity(elenaLifestyle, julianLifestyle);
assert.ok(highResonance.parityScore >= 0.90, 'High resonance pair must score >= 90% parity');
assert.ok(highResonance.compositeDelta <= 0.10, 'Composite delta must be <= 0.10');
assert.equal(highResonance.classification, 'high_resonance');
assert.equal(highResonance.frictionFlag, false);
console.log(`  ✅ Test 2: Elena × Julian lifestyle resonance verified (Parity: ${(highResonance.parityScore * 100).toFixed(1)}%, Delta: ${(highResonance.compositeDelta * 100).toFixed(1)}%)`);

// 3. Moderate Asymmetry Pair (Requires conscious budget communication)
const moderateLifestyle = {
  leisure_expenditure_tier: 0.85,
  consumption_entropy: 0.70,
  financial_risk_tolerance: 0.60
};
const moderateResult = computeFinancialParity(elenaLifestyle, moderateLifestyle);
assert.ok(moderateResult.compositeDelta > 0.30 && moderateResult.compositeDelta <= 0.60);
assert.equal(moderateResult.classification, 'manageable_asymmetry');
assert.equal(moderateResult.frictionFlag, false);
console.log(`  ✅ Test 3: Moderate lifestyle asymmetry accurately classified without friction flag (Delta: ${(moderateResult.compositeDelta * 100).toFixed(1)}%)`);

// 4. Severe Divergence Pair (Extreme saver vs. luxury maximalist)
const luxuryMaximalist = {
  leisure_expenditure_tier: 0.95,
  consumption_entropy: 0.85,
  financial_risk_tolerance: 0.90
};
const frugalMonastic = {
  leisure_expenditure_tier: 0.15,
  consumption_entropy: 0.15,
  financial_risk_tolerance: 0.15
};

const severeResult = computeFinancialParity(luxuryMaximalist, frugalMonastic);
assert.ok(severeResult.compositeDelta > 0.60, 'Divergent lifestyles must trigger high composite delta');
assert.equal(severeResult.classification, 'severe_friction');
assert.equal(severeResult.frictionFlag, true, 'Severe divergence must set frictionFlag = true');
assert.ok(severeResult.diagnosticSummary.includes('Severe lifestyle divergence flagged'));
console.log(`  ✅ Test 4: Severe lifestyle divergence correctly flagged (Friction Flag: true, Delta: ${(severeResult.compositeDelta * 100).toFixed(1)}%)`);

// 5. Passive Footprint Heuristic Distillation
const distilledHumble = inferLifestyleFinancialDimensions({
  consent_given: true,
  dining_habits: ['street food', 'home cook', 'local diner'],
  retail_brands: ['thrift', 'vintage', 'independent bookstores'],
  travel_preferences: ['camping', 'train journeys', 'hostel'],
  financial_temperament: 'disciplined_saver'
});
assert.ok(distilledHumble.leisure_expenditure_tier <= 0.35, 'Humble footprint must yield leisure tier <= 0.35');
assert.ok(distilledHumble.consumption_entropy <= 0.35, 'Disciplined saver must yield entropy <= 0.35');
assert.ok(distilledHumble.financial_risk_tolerance <= 0.30, 'Disciplined saver must yield risk <= 0.30');

const distilledLuxury = inferLifestyleFinancialDimensions({
  consent_given: true,
  dining_habits: ['michelin', 'tasting menu', 'omakase'],
  retail_brands: ['designer', 'boutique luxury'],
  travel_preferences: ['four seasons', 'first class'],
  financial_temperament: 'high_risk_founder'
});
assert.ok(distilledLuxury.leisure_expenditure_tier >= 0.75, 'Luxury footprint must yield leisure tier >= 0.75');
assert.ok(distilledLuxury.financial_risk_tolerance >= 0.75, 'Founder temperament must yield risk >= 0.75');
console.log('  ✅ Test 5: Passive digital exhaust heuristic distillation verified across opposite lifestyles');

// 6. Non-Classist Anti-Elitism Principle
const pairBothBudget = computeFinancialParity(
  { leisure_expenditure_tier: 0.20, consumption_entropy: 0.25, financial_risk_tolerance: 0.20 },
  { leisure_expenditure_tier: 0.22, consumption_entropy: 0.24, financial_risk_tolerance: 0.21 }
);
const pairBothLuxury = computeFinancialParity(
  { leisure_expenditure_tier: 0.90, consumption_entropy: 0.85, financial_risk_tolerance: 0.80 },
  { leisure_expenditure_tier: 0.88, consumption_entropy: 0.86, financial_risk_tolerance: 0.82 }
);
assert.ok(pairBothBudget.parityScore >= 0.95, 'Two budget profiles must achieve near-perfect parity');
assert.ok(pairBothLuxury.parityScore >= 0.95, 'Two luxury profiles must achieve near-perfect parity');
console.log('  ✅ Test 6: Non-classist anti-elitism mathematically verified (Both budget & luxury achieve >95% parity when aligned)');

console.log('\n🎉 All Sovereign Financial Parity & Lifestyle Compatibility Unit Tests Passed Successfully!\n');
