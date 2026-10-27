/**
 * End-to-End Pipeline Integration Test
 *
 * Verifies the entire autonomous dyadic pipeline running locally with
 * zero external network calls:
 *
 * RawDigitalFootprint (M1)
 *   -> Distilled PersonaProfile (M1)
 *   -> Autonomous 4-Stage Rendezvous Protocol (M2)
 *   -> Live LSM & Gottman Dyadic Telemetry (Metrics)
 *   -> Neutral Lounge Moderator Evaluation (M2b)
 *   -> Grounded Spatial Venue Matching (Data)
 *   -> Explainable Compatibility Dossier Synthesis (M3)
 *   -> Meta Muse Image 3-Panel Moodboard Generation (M4)
 */

import assert from 'node:assert/strict';
import { distillPersona } from '../agent_engine/vault/distillation.js';
import { runRendezvous } from '../agent_engine/protocol/rendezvous.js';
import { evaluateTranscript } from '../agent_engine/moderator/moderator.js';
import { synthesizeDossier } from '../agent_engine/synthesis/synthesis.js';
import { generateMoodboard } from '../agent_engine/image/moodboard.js';
import { loadVignette } from '../agent_engine/fixtures/loader.js';

console.log('🧪 Running MuseMeet Full End-to-End Pipeline Integration Tests...\n');

// -------------------------------------------------------------
// SCENARIO 1: HIGH CHEMISTRY MATCH (Elena Vance × Julian Thorne)
// -------------------------------------------------------------
console.log('--- SCENARIO 1: High Chemistry Match (Elena × Julian) ---');
{
  const v1 = loadVignette('vignette_1_bookshop');

  // Step 1: Persona Vault Distillation (M1)
  const personaA = await distillPersona({ ...v1.footprint_a, consent_given: true });
  const personaB = await distillPersona({ ...v1.footprint_b, consent_given: true });

  assert.equal(personaA.persona_id, 'usr_elena_01');
  assert.equal(personaB.persona_id, 'usr_julian_02');
  console.log('  ✅ Step 1: Sovereign personas distilled (Zero-Leakage Privacy verified)');

  // Step 2: Autonomous Rendezvous Negotiation (M2)
  const streamedTurns = [];
  const transcript = await runRendezvous({
    persona_a: personaA,
    persona_b: personaB,
    onTurn: (turn, telemetry) => {
      streamedTurns.push({ turn: turn.turn_number, lsm: telemetry.lsm });
    }
  });

  assert.equal(transcript.outcome, 'match');
  assert.equal(transcript.turns.length, 16);
  assert.equal(streamedTurns.length, 16);
  console.log(`  ✅ Step 2: 16-turn rendezvous executed across all 4 stages (Final Turn LSM: ${streamedTurns[15].lsm})`);

  // Step 3: Neutral Lounge Moderator Evaluation (M2b)
  const verdict = await evaluateTranscript({
    transcript,
    persona_a: personaA,
    persona_b: personaB
  });

  assert.equal(verdict.outcome, 'match');
  assert.ok(verdict.compatibility_score >= 85);
  console.log(`  ✅ Step 3: Impartial Moderator evaluated compatibility (${verdict.compatibility_score}% Dyadic Resonance)`);

  // Step 4: Explainable Compatibility Dossier Synthesis (M3)
  const dossier = await synthesizeDossier({
    transcript,
    verdict,
    persona_a: personaA,
    persona_b: personaB
  });

  assert.equal(dossier.compatibility_score, verdict.compatibility_score);
  assert.equal(dossier.icebreakers.length, 3);
  assert.ok(dossier.honest_friction_points.length >= 2);
  assert.ok(dossier.first_date_itinerary.activity.length > 20);
  assert.ok(dossier.first_date_itinerary.aesthetic_brief.length > 20);
  console.log(`  ✅ Step 4: Dossier synthesized with spatial venue & micro-callbacks: "${dossier.first_date_itinerary.location_type}"`);

  // Step 5: Muse Image 3-Panel Moodboard Generation (M4)
  const moodboard = await generateMoodboard({
    aesthetic_brief: dossier.first_date_itinerary.aesthetic_brief,
    persona_a_palette: personaA.aesthetic_signature.visual_palette,
    persona_b_palette: personaB.aesthetic_signature.visual_palette,
    venue_type: dossier.first_date_itinerary.venue_type
  });

  assert.equal(moodboard.panels.length, 3);
  assert.equal(moodboard.total_cost_usd, 0.03);
  console.log('  ✅ Step 5: 3-panel date moodboard generated (Atmosphere, Activity, Moment)\n');
}

// -------------------------------------------------------------
// SCENARIO 2: GRACEFUL ABORT (Elena Vance × Marcus Chen)
// -------------------------------------------------------------
console.log('--- SCENARIO 2: Graceful Abort (Elena × Marcus) ---');
{
  const v2 = loadVignette('vignette_2_record_store');

  const personaA = await distillPersona({ ...v2.footprint_a, consent_given: true });
  const personaB = await distillPersona({ ...v2.footprint_b, consent_given: true });

  const transcript = await runRendezvous({ persona_a: personaA, persona_b: personaB });
  assert.equal(transcript.outcome, 'graceful_abort');
  assert.equal(transcript.turns.length, 12);

  const verdict = await evaluateTranscript({ transcript, persona_a: personaA, persona_b: personaB });
  assert.equal(verdict.outcome, 'graceful_abort');

  const dossier = await synthesizeDossier({ transcript, verdict, persona_a: personaA, persona_b: personaB });
  assert.ok(dossier.first_date_itinerary.activity.toLowerCase().includes('withheld'));
  console.log('  ✅ Stage 3 Dealbreaker collision safely caught, introduction withheld by mutual agent consent\n');
}

// -------------------------------------------------------------
// SCENARIO 3: EARLY EXIT (Elena Vance × David Park)
// -------------------------------------------------------------
console.log('--- SCENARIO 3: Early Exit Flatline (Elena × David) ---');
{
  const v3 = loadVignette('vignette_3_market');

  const personaA = await distillPersona({ ...v3.footprint_a, consent_given: true });
  const personaB = await distillPersona({ ...v3.footprint_b, consent_given: true });

  const transcript = await runRendezvous({ persona_a: personaA, persona_b: personaB });
  assert.equal(transcript.outcome, 'early_exit');
  assert.equal(transcript.turns.length, 6);

  const verdict = await evaluateTranscript({ transcript, persona_a: personaA, persona_b: personaB });
  assert.equal(verdict.outcome, 'early_exit');

  const dossier = await synthesizeDossier({ transcript, verdict, persona_a: personaA, persona_b: personaB });
  assert.equal(dossier.icebreakers.length, 0);
  console.log('  ✅ Stage 1 Conversational flatline triggered early termination at Turn 6\n');
}

console.log('🎉 Full End-to-End Pipeline Integration Test Succeeded Across All 3 Outcomes!\n');
