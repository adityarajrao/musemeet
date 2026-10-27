import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_ROOT = path.resolve(__dirname, '../../tests/fixtures');

/**
 * Maps persona ID pairings to standard vignette directory names.
 */
export const VIGNETTE_MAP = {
  // Production benchmark persona IDs
  'usr_elena_01:usr_julian_02': 'vignette_1_bookshop',
  'usr_julian_02:usr_elena_01': 'vignette_1_bookshop',
  'usr_elena_01:usr_marcus_03': 'vignette_2_record_store',
  'usr_marcus_03:usr_elena_01': 'vignette_2_record_store',
  'usr_elena_01:usr_david_04': 'vignette_3_market',
  'usr_david_04:usr_elena_01': 'vignette_3_market',

  // Alias formats
  'usr_elena_v1:usr_julian_v1': 'vignette_1_bookshop',
  'usr_julian_v1:usr_elena_v1': 'vignette_1_bookshop',
  'usr_elena_v1:usr_marcus_v1': 'vignette_2_record_store',
  'usr_marcus_v1:usr_elena_v1': 'vignette_2_record_store',
  'usr_elena_v1:usr_david_v1': 'vignette_3_market',
  'usr_david_v1:usr_elena_v1': 'vignette_3_market'
};

/**
 * Returns the fixture directory path for a given pair of personas.
 *
 * @param {string} personaAId
 * @param {string} personaBId
 * @returns {string|null}
 */
export function getVignetteForPersonas(personaAId, personaBId) {
  const key = `${personaAId}:${personaBId}`;
  return VIGNETTE_MAP[key] || null;
}

/**
 * Loads a full vignette bundle by directory name.
 *
 * @param {string} vignetteName
 * @returns {{
 *   footprint_a: object,
 *   footprint_b: object,
 *   persona_a: object,
 *   persona_b: object,
 *   transcript: object,
 *   moderator_verdict: object,
 *   dossier: object,
 *   moodboard?: object
 * }}
 */
export function loadVignette(vignetteName) {
  const dir = path.join(FIXTURES_ROOT, vignetteName);
  if (!fs.existsSync(dir)) {
    throw new Error(`Fixture directory not found: ${dir}`);
  }

  const readJson = (file) => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  };

  return {
    footprint_a: readJson('footprint_a.json'),
    footprint_b: readJson('footprint_b.json'),
    persona_a: readJson('persona_a.json'),
    persona_b: readJson('persona_b.json'),
    transcript: readJson('transcript.json'),
    moderator_verdict: readJson('moderator_verdict.json'),
    dossier: readJson('dossier.json'),
    moodboard: readJson('moodboard.json')
  };
}
