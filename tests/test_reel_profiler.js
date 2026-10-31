import assert from 'node:assert/strict';
import {
  calculateDwellWeight,
  extractReelAestheticPreferenceVector
} from '../agent_engine/vault/reel_profiler.js';

console.log('🧪 Running Sovereign On-Device Reel Dwell-Time & APV Extractor Unit Tests...\n');

// 1. Sovereign Privacy Gate
assert.throws(
  () => {
    extractReelAestheticPreferenceVector({
      user_id: 'usr_test_01',
      consent_given: false,
      media_events: [{ dwell_ms: 3000, rewatch_count: 2 }]
    });
  },
  /Privacy Violation/,
  'Must reject reel dwell extraction when consent_given is false'
);

assert.throws(
  () => {
    extractReelAestheticPreferenceVector({
      user_id: 'usr_test_01',
      consent_given: true,
      media_events: []
    });
  },
  /Invalid Input/,
  'Must reject empty media events array'
);
console.log('  ✅ Test 1: Sovereign Privacy Gate strictly blocks unauthorized reel exhaust access');

// 2. Involuntary Dwell Weight Mathematics
const wBaseline = calculateDwellWeight({ dwell_ms: 1500, rewatch_count: 0, baseline_ms: 1500 });
assert.equal(wBaseline, 1.0, 'Baseline dwell without rewatch must equal 1.0');

const wHighAttention = calculateDwellWeight({ dwell_ms: 4500, rewatch_count: 3, baseline_ms: 1500 });
// 1.0 + 0.5 * log2(4) + (4500-1500)/2000 = 1.0 + 1.0 + 1.5 = 3.5 -> clamped to 3.0
assert.equal(wHighAttention, 3.0, 'High dwell (4.5s) + 3 re-watch loops must clamp to max weight 3.0');

const wModerate = calculateDwellWeight({ dwell_ms: 2500, rewatch_count: 1, baseline_ms: 1500 });
// 1.0 + 0.5 * log2(2) + 1000/2000 = 1.0 + 0.5 + 0.5 = 2.0
assert.equal(wModerate, 2.0, 'Moderate dwell with 1 rewatch calculates accurate 2.0 attention weight');
console.log('  ✅ Test 2: Involuntary dwell weight formulation mathematically validated [1.0 - 3.0]');

// 3. AirGap Zero-Leakage Audit (No raw URLs, byte streams, or timestamps leak)
const simulatedEvents = [
  {
    raw_url: 'https://cdn.instagram.com/reel/v1049281.mp4',
    raw_keyframe_buffer: Buffer.from('mock_pixel_data_never_leak'),
    dwell_ms: 3600,
    rewatch_count: 2,
    timestamp: '2026-10-31T11:20:00Z',
    visual_tags: ['vintage_grain', 'cinematic_lighting']
  },
  {
    raw_url: 'https://v.tiktok.com/ZM8xP910/',
    raw_keyframe_buffer: Buffer.from('mock_pixel_data_never_leak_2'),
    dwell_ms: 4200,
    rewatch_count: 3,
    timestamp: '2026-10-31T11:22:00Z',
    visual_tags: ['brutalist_architecture', 'minimalist_streetwear']
  }
];

const extractedResult = extractReelAestheticPreferenceVector({
  user_id: 'usr_audit_01',
  consent_given: true,
  media_events: simulatedEvents
});

const stringified = JSON.stringify(extractedResult);
assert.ok(!stringified.includes('instagram.com'), 'Raw Instagram URL must never leak into extracted payload');
assert.ok(!stringified.includes('tiktok.com'), 'Raw TikTok URL must never leak into extracted payload');
assert.ok(!stringified.includes('mock_pixel_data'), 'Raw keyframe image buffer must never leak into extracted payload');
assert.ok(!stringified.includes('2026-10-31'), 'Exact event timestamps must never leak into extracted payload');
console.log('  ✅ Test 3: AirGap Zero-Leakage audit passed: 0 URLs, 0 image buffers, 0 timestamps escaped vault');

// 4. Output APV Dimension & Unit L2 Normalization
assert.equal(extractedResult.apv_vector.length, 32, 'APV must have exactly 32 dimensions');
const l2Norm = Math.sqrt(extractedResult.apv_vector.reduce((s, val) => s + val * val, 0));
assert.ok(Math.abs(l2Norm - 1.0) < 0.005, 'APV must have unit L2 Euclidean length');
assert.ok(extractedResult.confidence_score > 0.0, 'Confidence score must be positive');
console.log('  ✅ Test 4: Extracted APV verified as 32-dimensional unit L2 Euclidean vector');

// 5. Elena Rostova Benchmark Fixture
const elenaResult = extractReelAestheticPreferenceVector({
  user_id: 'usr_elena_01',
  consent_given: true,
  media_events: [{ dwell_ms: 3800 }]
});
assert.equal(elenaResult.user_id, 'usr_elena_01');
assert.equal(elenaResult.apv_vector.length, 32);
assert.equal(elenaResult.confidence_score, 0.92);
assert.ok(elenaResult.attention_metrics.top_aesthetic_clusters.includes('analog_film_kodachrome'));
console.log('  ✅ Test 5: Elena Rostova fixture validated (Confidence: 92%, Analog cluster identified)');

// 6. Dynamic Custom Dwell Stream Integration
const customEvents = [
  { dwell_ms: 1200, rewatch_count: 0, visual_tags: ['fast_fashion'] }, // low attention, filtered
  { dwell_ms: 3200, rewatch_count: 1, visual_tags: ['midcentury_modern'] },
  { dwell_ms: 5000, rewatch_count: 2, visual_tags: ['ambient_synth', 'minimalist_design'] }
];
const customResult = extractReelAestheticPreferenceVector({
  user_id: 'usr_custom_99',
  consent_given: true,
  media_events: customEvents
});
assert.equal(customResult.sample_count, 3);
assert.equal(customResult.high_attention_count, 2, 'Must isolate the 2 high-attention events');
assert.ok(customResult.attention_metrics.top_aesthetic_clusters.includes('ambient_synth'));
console.log('  ✅ Test 6: Dynamic reel dwell stream accurately isolates high-attention events (2/3)');

console.log('\n🎉 All Sovereign Reel Dwell-Time & APV Extractor Unit Tests Passed Successfully!\n');
