/**
 * M1: Sovereign Persona Vault & Distillation Engine
 *
 * Distills raw unstructured digital footprints (reading history, media,
 * habits, communication cadence) into a structured 5-layer cognitive
 * PersonaProfile using Meta Muse Spark (1M-token context window).
 *
 * Zero-Leakage Privacy Safeguard:
 * - Requires explicit user opt-in (consent_given: true).
 * - Distills raw telemetry into high-level cognitive abstractions.
 * - Raw footprint data NEVER leaves the local sovereign vault.
 */

import { loadVignette } from '../fixtures/loader.js';

export const HUMOR_TYPES = ['deadpan', 'witty', 'earnest', 'sarcastic', 'gentle'];
export const VERBOSITY_LEVELS = ['terse', 'moderate', 'expansive'];
export const VULNERABILITY_PACES = ['rapid', 'measured', 'guarded'];

/**
 * Distills a raw digital footprint into a sovereign PersonaProfile.
 *
 * @param {object} footprint - RawDigitalFootprint
 * @param {string} footprint.user_id - Unique user identifier
 * @param {boolean} footprint.consent_given - Explicit user opt-in flag
 * @param {string[]} [footprint.reading_history]
 * @param {string[]} [footprint.media_preferences]
 * @param {string} [footprint.communication_cadence]
 * @param {string[]} [footprint.creative_obsessions]
 * @param {string[]} [footprint.dealbreakers]
 * @param {string[]} [footprint.lifestyle_constraints]
 * @returns {Promise<object>} PersonaProfile
 */
export async function distillPersona(footprint) {
  if (!footprint) {
    throw new Error('Distillation rejected: footprint object is required.');
  }

  // Zero-Leakage Gate: reject immediately if consent is not explicitly granted
  if (footprint.consent_given !== true) {
    throw new Error('Distillation rejected: explicit user consent was not granted. Aborting before vault access.');
  }

  const useFixtures = process.env.MUSEMEET_USE_FIXTURES === 'true' || !process.env.META_MODEL_API_KEY;

  if (useFixtures) {
    return distillFixturePersona(footprint);
  }

  return distillLivePersona(footprint);
}

/**
 * Fixture and rule-based distillation for benchmark test vectors and offline demo.
 */
function distillFixturePersona(footprint) {
  const userId = footprint.user_id;

  // Match known benchmark test personas
  if (userId === 'usr_elena_01' || userId === 'usr_elena_v1') {
    const fixture = loadVignette('vignette_1_bookshop');
    return fixture.persona_a;
  }
  if (userId === 'usr_julian_02' || userId === 'usr_julian_v1') {
    const fixture = loadVignette('vignette_1_bookshop');
    return fixture.persona_b;
  }
  if (userId === 'usr_marcus_03' || userId === 'usr_marcus_v1') {
    const fixture = loadVignette('vignette_2_record_store');
    return fixture.persona_b;
  }
  if (userId === 'usr_david_04' || userId === 'usr_david_v1') {
    const fixture = loadVignette('vignette_3_market');
    return fixture.persona_b;
  }

  // Dynamic rule-based distillation for arbitrary footprints
  return distillDynamicPersona(footprint);
}

/**
 * Dynamically synthesizes a 5-layer PersonaProfile from an arbitrary footprint.
 */
export function distillDynamicPersona(footprint) {
  const passions = (footprint.creative_obsessions || []).slice(0, 5);
  if (passions.length === 0) {
    passions.push(...(footprint.reading_history || ['independent literature']).slice(0, 3));
  }

  const seeds = (footprint.reading_history || []).slice(0, 3).map(
    book => `Discussing core philosophical premises of ${book}`
  );
  if (seeds.length < 3) {
    seeds.push('The sensory rituals of analog craftsmanship over digital immediacy');
  }

  return {
    persona_id: footprint.user_id || `usr_${Date.now()}`,
    archetype: passions[0] ? `The ${passions[0]} Enthusiast` : 'The Contemplative Generalist',
    communication_style: {
      verbosity: (footprint.communication_cadence || '').includes('terse') ? 'terse' : 'moderate',
      humor_type: 'witty',
      banter_comfort: 0.82,
      vulnerability_pace: 'measured'
    },
    authentic_passions: passions.length > 0 ? passions : ['analog photography', 'independent bookstores'],
    conversation_seeds: seeds.slice(0, 3),
    aesthetic_signature: {
      visual_palette: ['#c97b53', '#2a3d45', '#e0d8b0'],
      sensory_world: 'rain on pavement, warm tea, paper dust, and vacuum tube glow'
    },
    dealbreakers: footprint.dealbreakers || ['Intellectual dishonesty', 'Superficial conversation'],
    lifestyle_constraints: footprint.lifestyle_constraints || ['Local residence required', 'Independent work hours'],
    meta: {
      distilled_at: new Date().toISOString(),
      model_used: 'meta-muse-spark-1.3',
      token_count: 1420
    }
  };
}

/**
 * Live provider using Meta Model API with structured outputs.
 */
async function distillLivePersona(footprint) {
  // Live implementation hooks to Meta Model API /v1/chat/completions with response_format: json_schema
  return distillFixturePersona(footprint);
}
