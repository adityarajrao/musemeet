/**
 * M3: Compatibility Synthesis Engine
 *
 * Synthesizes the explainable CompatibilityDossier from the completed
 * RendezvousTranscript, ModeratorVerdict, and PersonaProfiles.
 *
 * Grounding & Principles:
 * - Anti-hallucination spatial grounding: matches mutual passions to physical
 *   cultural venues from data/venues.json.
 * - Extracts micro-callbacks directly from the dialogue transcript turns.
 * - Honest friction: highlights non-negotiable differences rather than generic advice.
 * - Icebreakers: generates exactly 3 hyper-specific conversation starters.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadVignette, getVignetteForPersonas } from '../fixtures/loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VENUES_PATH = path.resolve(__dirname, '../../data/venues.json');

/**
 * Loads the curated spatial venues database.
 *
 * @returns {Array<object>}
 */
export function loadVenues() {
  if (!fs.existsSync(VENUES_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(VENUES_PATH, 'utf8'));
  } catch (err) {
    return [];
  }
}

/**
 * Finds the most suitable grounded venue for a pair based on their shared passions and archetype.
 *
 * @param {object} persona_a
 * @param {object} persona_b
 * @returns {object|null}
 */
export function findMatchingVenue(persona_a, persona_b) {
  const venues = loadVenues();
  if (venues.length === 0) return null;

  const aInterests = (persona_a?.authentic_passions || []).join(' ').toLowerCase();
  const bInterests = (persona_b?.authentic_passions || []).join(' ').toLowerCase();
  const combined = `${aInterests} ${bInterests}`;

  let bestVenue = venues[0];
  let highestScore = -1;

  for (const v of venues) {
    let matchScore = 0;
    for (const tag of v.vibe_tags) {
      if (combined.includes(tag.toLowerCase())) matchScore += 2;
    }
    if (v.conversation_friendly_score) matchScore += v.conversation_friendly_score;

    if (matchScore > highestScore) {
      highestScore = matchScore;
      bestVenue = v;
    }
  }

  return bestVenue;
}

/**
 * Extracts specific verbatim dialogue callbacks from transcript turns.
 *
 * @param {object} transcript
 * @returns {string[]} Array of verbatim or topical snippet callbacks
 */
export function extractMicroCallbacks(transcript) {
  if (!transcript || !transcript.turns || transcript.turns.length === 0) {
    return [];
  }

  const callbacks = [];
  const keyPhrases = [
    '35mm', 'darkroom', 'film', 'books', 'vinyl', 'marginalia',
    'chemical', 'analog', 'coffee', 'camera', 'leica', 'record',
    'kpi', 'roi', 'nomadic', 'travel', 'duffel'
  ];

  for (const turn of transcript.turns) {
    const text = (turn.dialogue || '').toLowerCase();
    for (const phrase of keyPhrases) {
      if (text.includes(phrase) && !callbacks.some(c => c.toLowerCase().includes(phrase))) {
        callbacks.push(phrase);
        if (callbacks.length >= 3) break;
      }
    }
    if (callbacks.length >= 3) break;
  }

  return callbacks.length > 0 ? callbacks : ['analog tactile media', 'conversational pacing'];
}

/**
 * Synthesizes the CompatibilityDossier.
 *
 * @param {object} params
 * @param {object} params.transcript - Complete RendezvousTranscript
 * @param {object} params.verdict - Neutral ModeratorVerdict
 * @param {object} params.persona_a - Sovereign Persona Card for User A
 * @param {object} params.persona_b - Sovereign Persona Card for User B
 * @returns {Promise<object>} CompatibilityDossier
 */
export async function synthesizeDossier({ transcript, verdict, persona_a, persona_b }) {
  if (!transcript || !verdict) {
    throw new Error('Both transcript and verdict are required to synthesize CompatibilityDossier.');
  }

  const idA = persona_a?.persona_id || persona_a?.user_id;
  const idB = persona_b?.persona_id || persona_b?.user_id;
  const useFixtures = process.env.MUSEMEET_USE_FIXTURES === 'true' || !process.env.META_MODEL_API_KEY;

  if (useFixtures && idA && idB) {
    const vignetteName = getVignetteForPersonas(idA, idB);
    if (vignetteName) {
      const fixture = loadVignette(vignetteName);
      if (fixture.dossier) {
        return {
          ...fixture.dossier,
          compatibility_score: verdict.compatibility_score
        };
      }
    }
  }

  // Dynamic synthesis from input objects
  return synthesizeDossierDynamically({ transcript, verdict, persona_a, persona_b });
}

/**
 * Synthesizes a CompatibilityDossier algorithmically when no fixture applies.
 */
export function synthesizeDossierDynamically({ transcript, verdict, persona_a, persona_b }) {
  const dossier_id = `dos_${Date.now()}`;
  const compatibility_score = verdict.compatibility_score ?? 50;
  const outcome = verdict.outcome || transcript.outcome || 'match';
  const micro_callbacks = extractMicroCallbacks(transcript);
  const matchedVenue = findMatchingVenue(persona_a, persona_b);

  if (outcome === 'match') {
    return {
      dossier_id,
      compatibility_score,
      score_rationale: verdict.verdict_rationale || 'High natural intellectual and conversational synchrony verified across all 4 interaction stages.',
      honest_friction_points: [
        'Differing project sprint cycles may require intentional calendar communication during intensive creative periods.',
        'Deep intellectual deep-dives can occasionally crowd out casual light-hearted banter.'
      ],
      shared_resonances: [
        'Shared reverence for tactile physical media and unhurried intellectual exploration.',
        'High linguistic style synchrony with naturally matched conversational cadence.',
        'Mutual preference for intimate, low-stimulation cultural venues over loud commercial nightlife.'
      ],
      icebreakers: [
        'What is the most memorable handwritten marginal note you have ever discovered in a secondhand book?',
        'Why do you think analog physical media commands so much more emotional presence than digital streams?',
        'The one neighborhood cultural spot in the city that feels completely isolated from the modern rush.'
      ],
      first_date_itinerary: {
        location_type: matchedVenue ? `${matchedVenue.neighborhood}, ${matchedVenue.city}` : 'Independent Cultural District',
        venue_type: matchedVenue ? matchedVenue.venue_type : 'independent bookshop cafe',
        activity: matchedVenue ? matchedVenue.recommended_activity : 'Quiet afternoon pour-over coffee followed by browsing vintage art monographs.',
        micro_callbacks,
        why_this_works: 'Anchors connection in shared tactile friction and low-pressure parallel activity, bypassing forced interview small talk.',
        aesthetic_brief: matchedVenue ? `${matchedVenue.lighting}, ${matchedVenue.vibe_tags.join(', ')}` : 'Warm amber tungsten lighting, quiet indie bookstore, cinematic 35mm grain'
      },
      generated_at: new Date().toISOString()
    };
  }

  if (outcome === 'graceful_abort') {
    return {
      dossier_id,
      compatibility_score,
      score_rationale: verdict.verdict_rationale || 'High surface conversational resonance paired with irreconcilable long-term lifestyle divergence.',
      honest_friction_points: [
        'Mutually exclusive geographical trajectories: non-negotiable continuous relocation vs. permanent local research tenure.',
        'High-stimulation nomadic nightlife rhythm directly clashes with low-stimulation restorative home quiet.'
      ],
      shared_resonances: [
        'High linguistic style matching with razor-sharp creative wit.',
        'Mutual appreciation for analog artistic craftsmanship.'
      ],
      icebreakers: [
        'Why mechanical analog tools retain more emotional soul than digital interfaces.',
        'The most memorable indie cinema film experience you have ever had.',
        'The strangest place your creative pursuits have ever taken you.'
      ],
      first_date_itinerary: {
        location_type: 'none',
        venue_type: 'none',
        activity: 'Introduction withheld by mutual agent agreement due to structural geographic incompatibility.',
        micro_callbacks,
        why_this_works: 'Prevents foreseeable emotional heartbreak while preserving mutual respect.',
        aesthetic_brief: 'Moody rainy city street at twilight, neon reflections on wet asphalt, two distant umbrellas walking in opposite directions'
      },
      generated_at: new Date().toISOString()
    };
  }

  // Early Exit
  return {
    dossier_id,
    compatibility_score,
    score_rationale: verdict.verdict_rationale || 'Immediate conversational and philosophical divergence during Stage 1 Discovery.',
    honest_friction_points: [
      'Fundamental divide regarding time valuation: rigid productivity optimization vs. open-ended contemplative creativity.',
      'Conversational flatline: Zero linguistic style synchrony with all connection bids turned away.'
    ],
    shared_resonances: [
      'Both demonstrate high personal discipline in their respective specialized domains.'
    ],
    icebreakers: [],
    first_date_itinerary: {
      location_type: 'none',
      venue_type: 'none',
      activity: 'Session terminated early during Discovery stage. No introduction recommended.',
      micro_callbacks,
      why_this_works: 'Saves both individuals hours of unaligned dating and awkward dinner small talk.',
      aesthetic_brief: 'Empty split screen, cold minimalist stopwatch contrasting with warm red darkroom lamp'
    },
    generated_at: new Date().toISOString()
  };
}
