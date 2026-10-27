import assert from 'node:assert/strict';
import {
  synthesizeDossier,
  synthesizeDossierDynamically,
  findMatchingVenue,
  extractMicroCallbacks,
  loadVenues
} from '../agent_engine/synthesis/synthesis.js';
import { loadVignette } from '../agent_engine/fixtures/loader.js';

console.log('🧪 Running M3 Compatibility Synthesis Engine Unit Tests...\n');

// Load benchmark fixtures
const pair1 = loadVignette('vignette_1_bookshop');
const pair2 = loadVignette('vignette_2_record_store');
const pair3 = loadVignette('vignette_3_market');

// Test 1: Venue database loading and spatial matching
{
  const venues = loadVenues();
  assert.ok(venues.length >= 7, 'Should load at least 7 curated spatial venues');

  const matched = findMatchingVenue(pair1.persona_a, pair1.persona_b);
  assert.ok(matched, 'Should match a venue for Pair 1');
  assert.ok(matched.name, 'Matched venue must have a name');
  assert.ok(matched.city, 'Matched venue must have a city');
  assert.ok(matched.conversation_friendly_score >= 0.85, 'Matched venue must have high conversation friendliness');
  console.log(`  ✅ Test 1: Spatial venue database loaded (${venues.length} venues, Matched: "${matched.name}")`);
}

// Test 2: Micro-callback extraction from transcript
{
  const callbacks = extractMicroCallbacks(pair1.transcript);
  assert.ok(callbacks.length >= 2, 'Should extract at least 2 specific topical callbacks');
  assert.ok(callbacks.some(c => ['35mm', 'darkroom', 'film', 'books', 'vinyl'].includes(c.toLowerCase())), 'Callbacks must capture authentic topics from dialogue');
  console.log(`  ✅ Test 2: Transcript micro-callbacks extracted: [${callbacks.join(', ')}]`);
}

// Test 3: Pair 1 Compatibility Dossier (Match)
{
  const dossier = await synthesizeDossier({
    transcript: pair1.transcript,
    verdict: pair1.moderator_verdict,
    persona_a: pair1.persona_a,
    persona_b: pair1.persona_b
  });

  assert.equal(dossier.compatibility_score, 92, 'Score should match moderator verdict (92)');
  assert.equal(dossier.icebreakers.length, 3, 'Must contain exactly 3 mutual icebreakers');
  assert.ok(dossier.honest_friction_points.length >= 2, 'Must contain at least 2 honest friction points');
  assert.ok(dossier.shared_resonances.length >= 3, 'Must contain at least 3 shared resonances');

  const itinerary = dossier.first_date_itinerary;
  assert.ok(itinerary.activity.length > 20, 'Itinerary activity must be concrete and descriptive');
  assert.ok(itinerary.why_this_works.length > 20, 'why_this_works must explain relational psychology');
  assert.ok(itinerary.aesthetic_brief.length > 20, 'aesthetic_brief must be provided for M4 image generation');

  console.log(`  ✅ Test 3: Pair 1 Compatibility Dossier synthesized (Score: ${dossier.compatibility_score}%, 3 Icebreakers, 2 Friction Points)`);
}

// Test 4: Pair 2 Compatibility Dossier (Graceful Abort)
{
  const dossier = await synthesizeDossier({
    transcript: pair2.transcript,
    verdict: pair2.moderator_verdict,
    persona_a: pair2.persona_a,
    persona_b: pair2.persona_b
  });

  assert.equal(dossier.compatibility_score, 64, 'Score should equal moderator verdict (64)');
  assert.ok(dossier.first_date_itinerary.activity.toLowerCase().includes('withheld'), 'Itinerary must indicate introduction withheld');
  assert.ok(dossier.honest_friction_points.some(f => f.toLowerCase().includes('nomadic') || f.toLowerCase().includes('geographical')), 'Must state geographic constraint');
  console.log('  ✅ Test 4: Pair 2 graceful abort dossier synthesized with introduction withheld');
}

// Test 5: Pair 3 Compatibility Dossier (Early Exit)
{
  const dossier = await synthesizeDossier({
    transcript: pair3.transcript,
    verdict: pair3.moderator_verdict,
    persona_a: pair3.persona_a,
    persona_b: pair3.persona_b
  });

  assert.equal(dossier.compatibility_score, 24, 'Score should equal moderator verdict (24)');
  assert.equal(dossier.icebreakers.length, 0, 'Early exit should not generate icebreakers');
  assert.ok(dossier.first_date_itinerary.activity.toLowerCase().includes('terminated'), 'Itinerary must record early exit');
  console.log('  ✅ Test 5: Pair 3 early exit dossier synthesized correctly');
}

// Test 6: Dynamic synthesis without fixtures
{
  const customTranscript = {
    session_id: 'custom_session',
    outcome: 'match',
    turns: [
      { speaker: 'agent_a', dialogue: 'I love hunting for rare 35mm cameras in old camera shops.' },
      { speaker: 'agent_b', dialogue: 'The mechanical feel of a Leica M3 shutter click is unmatched.' }
    ]
  };
  const customVerdict = {
    compatibility_score: 88,
    outcome: 'match',
    verdict_rationale: 'High mechanical and photographic affinity.'
  };

  const dynamicDossier = synthesizeDossierDynamically({
    transcript: customTranscript,
    verdict: customVerdict,
    persona_a: pair1.persona_a,
    persona_b: pair1.persona_b
  });

  assert.equal(dynamicDossier.compatibility_score, 88);
  assert.equal(dynamicDossier.icebreakers.length, 3);
  assert.ok(dynamicDossier.honest_friction_points.length >= 2);
  assert.ok(dynamicDossier.first_date_itinerary.micro_callbacks.includes('35mm') || dynamicDossier.first_date_itinerary.micro_callbacks.includes('camera'));
  console.log('  ✅ Test 6: Dynamic dossier synthesis completed with grounded venue and micro-callbacks');
}

console.log('\n🎉 All M3 Compatibility Synthesis Engine Unit Tests Passed Successfully!\n');
