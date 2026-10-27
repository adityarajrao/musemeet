import assert from 'node:assert/strict';
import { distillPersona, distillDynamicPersona } from '../agent_engine/vault/distillation.js';
import { loadVignette } from '../agent_engine/fixtures/loader.js';

console.log('🧪 Running M1 Persona Vault & Distillation Engine Unit Tests...\n');

// Load benchmark fixtures
const pair1 = loadVignette('vignette_1_bookshop');

// Test 1: Consent-First Privacy Enforcement (consent_given: false throws immediately)
{
  const unauthorizedFootprint = {
    ...pair1.footprint_a,
    consent_given: false
  };

  await assert.rejects(
    async () => distillPersona(unauthorizedFootprint),
    /Distillation rejected: explicit user consent was not granted/,
    'Must throw error when consent_given is false'
  );

  await assert.rejects(
    async () => distillPersona(null),
    /Distillation rejected: footprint object is required/,
    'Must throw error when footprint is null'
  );

  console.log('  ✅ Test 1: Zero-Leakage Privacy Gate strictly rejects unauthorized footprint access');
}

// Test 2: Elena's Distillation (Persona A)
{
  const elenaFootprint = {
    ...pair1.footprint_a,
    consent_given: true
  };

  const persona = await distillPersona(elenaFootprint);

  assert.ok(persona.persona_id, 'Persona must contain persona_id');
  assert.ok(persona.archetype.length > 5, 'Archetype must be non-empty');
  assert.ok(persona.communication_style, 'Must contain communication_style object');
  assert.ok(persona.communication_style.humor_type, 'Must define humor_type');
  assert.ok(persona.authentic_passions.length > 0, 'Must extract authentic passions');
  assert.equal(persona.conversation_seeds.length, 3, 'Must extract exactly 3 conversation seeds');
  assert.ok(persona.aesthetic_signature.visual_palette.length >= 3, 'Must define at least 3-color aesthetic palette');
  assert.ok(persona.dealbreakers.length > 0, 'Must extract dealbreakers');
  assert.ok(persona.lifestyle_constraints.length > 0, 'Must extract lifestyle constraints');
  assert.ok(persona.meta.distilled_at, 'Must contain distillation metadata timestamp');

  console.log(`  ✅ Test 2: Persona A distilled successfully (Archetype: "${persona.archetype}")`);
}

// Test 3: Julian's Distillation (Persona B)
{
  const julianFootprint = {
    ...pair1.footprint_b,
    consent_given: true
  };

  const persona = await distillPersona(julianFootprint);

  assert.ok(persona.persona_id, 'Persona must contain persona_id');
  assert.ok(persona.authentic_passions.some(p => p.toLowerCase().includes('vinyl') || p.toLowerCase().includes('analog') || p.toLowerCase().includes('vacuum')), 'Must capture core passions');
  assert.equal(persona.conversation_seeds.length, 3, 'Must extract 3 conversation seeds');
  assert.ok(persona.dealbreakers.length > 0, 'Must extract dealbreakers');

  console.log(`  ✅ Test 3: Persona B distilled successfully (Archetype: "${persona.archetype}")`);
}

// Test 4: Dynamic rule-based distillation for arbitrary footprints
{
  const arbitraryFootprint = {
    user_id: 'usr_custom_99',
    consent_given: true,
    reading_history: ['Gödel, Escher, Bach', 'The Structure of Scientific Revolutions'],
    media_preferences: ['Ambient drone music', '1970s Polish cinema'],
    communication_cadence: 'slow, reflective, terse',
    creative_obsessions: ['modular synthesizers', 'hand-bound book restoration'],
    dealbreakers: ['Superficial small talk', 'Constant notifications'],
    lifestyle_constraints: ['Strict sleep schedule', 'Requires daily solitary deep work']
  };

  const persona = distillDynamicPersona(arbitraryFootprint);

  assert.equal(persona.persona_id, 'usr_custom_99');
  assert.equal(persona.communication_style.verbosity, 'terse');
  assert.ok(persona.authentic_passions.includes('modular synthesizers'));
  assert.equal(persona.conversation_seeds.length, 3);
  assert.equal(persona.dealbreakers.length, 2);
  assert.ok(persona.aesthetic_signature.visual_palette.length === 3);

  console.log(`  ✅ Test 4: Dynamic distillation on custom arbitrary footprint passed (Archetype: "${persona.archetype}")`);
}

console.log('\n🎉 All M1 Persona Vault & Distillation Engine Unit Tests Passed Successfully!\n');
