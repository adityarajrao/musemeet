/**
 * Linguistic Style Matching (LSM) Calculator
 *
 * Implements Ireland, Slatcher, Eastwick, Scissors, Finkel, & Pennebaker (2011)
 * "Language Style Matching Predicts Relationship Initiation and Stability"
 * Psychological Science, 22(1), 39-44.
 *
 * Calculates dyadic synchrony across 9 function word classes.
 */

export const FUNCTION_WORD_DICTIONARY = {
  personal_pronouns: new Set([
    'i', 'me', 'my', 'mine', 'myself',
    'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself',
    'we', 'us', 'our', 'ours', 'ourselves',
    'they', 'them', 'their', 'theirs', 'themselves'
  ]),

  impersonal_pronouns: new Set([
    'it', 'its', 'itself',
    'this', 'that', 'these', 'those',
    'which', 'what', 'whatever', 'who', 'whom', 'whose',
    'anything', 'everything', 'something', 'nothing',
    'anyone', 'everyone', 'someone', 'no one', 'nobody',
    'anybody', 'everybody', 'somebody',
    'one', 'ones'
  ]),

  articles: new Set([
    'a', 'an', 'the'
  ]),

  auxiliary_verbs: new Set([
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'done',
    'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must',
    'ought', 'dare', 'need'
  ]),

  adverbs: new Set([
    'very', 'really', 'so', 'quite', 'too', 'well', 'now', 'then',
    'here', 'there', 'where', 'when', 'how', 'why', 'again', 'almost',
    'already', 'also', 'always', 'away', 'even', 'ever', 'far',
    'forward', 'just', 'late', 'maybe', 'more', 'most', 'near',
    'never', 'not', 'often', 'only', 'out', 'perhaps', 'quite',
    'rather', 'seldom', 'simply', 'soon', 'still', 'then', 'there',
    'together', 'usually', 'yesterday'
  ]),

  prepositions: new Set([
    'about', 'above', 'across', 'after', 'against', 'along', 'among',
    'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside',
    'between', 'beyond', 'by', 'down', 'during', 'except', 'for',
    'from', 'in', 'inside', 'into', 'near', 'of', 'off', 'on', 'onto',
    'out', 'outside', 'over', 'past', 'through', 'throughout', 'to',
    'toward', 'towards', 'under', 'underneath', 'until', 'up', 'upon',
    'with', 'within', 'without'
  ]),

  conjunctions: new Set([
    'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
    'although', 'because', 'since', 'unless', 'while', 'whereas',
    'if', 'as', 'whether', 'either', 'neither', 'both', 'though'
  ]),

  negations: new Set([
    'no', 'not', 'never', 'none', 'neither', 'nor', 'nothing',
    'nowhere', 'hardly', 'scarcely', 'barely', "n't", 'cannot',
    "don't", "doesn't", "didn't", "won't", "wouldn't", "can't",
    "couldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't"
  ]),

  quantifiers: new Set([
    'all', 'any', 'few', 'many', 'much', 'more', 'most', 'some',
    'several', 'every', 'each', 'both', 'half', 'little', 'less',
    'least', 'plenty', 'enough', 'whole'
  ])
};

const CATEGORY_KEYS = Object.keys(FUNCTION_WORD_DICTIONARY);
const EPSILON = 0.0001;

/**
 * Tokenizes text into lowercase normalized words.
 * Handles contractions and punctuation stripping.
 *
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Computes frequency distribution across the 9 function word classes.
 *
 * @param {string|string[]} input - Raw text or pre-tokenized array of words
 * @returns {{ wordCount: number, frequencies: Record<string, number> }}
 */
export function computeFunctionWordFrequencies(input) {
  const tokens = Array.isArray(input) ? input : tokenize(input);
  const totalWords = tokens.length;

  const counts = {};
  for (const key of CATEGORY_KEYS) {
    counts[key] = 0;
  }

  if (totalWords === 0) {
    const zeroFreqs = {};
    for (const key of CATEGORY_KEYS) {
      zeroFreqs[key] = 0;
    }
    return { wordCount: 0, frequencies: zeroFreqs };
  }

  for (const token of tokens) {
    for (const key of CATEGORY_KEYS) {
      if (FUNCTION_WORD_DICTIONARY[key].has(token)) {
        counts[key] += 1;
      }
    }
  }

  const frequencies = {};
  for (const key of CATEGORY_KEYS) {
    frequencies[key] = (counts[key] / totalWords) * 100;
  }

  return { wordCount: totalWords, frequencies };
}

/**
 * Computes the Linguistic Style Matching (LSM) metric between two texts
 * according to the Ireland & Pennebaker (2011) formula:
 *
 * LSM_c = 1 - (|F_A,c - F_B,c| / (F_A,c + F_B,c + epsilon))
 * Total_LSM = (1 / 9) * sum(LSM_c)
 *
 * @param {string|string[]} textA
 * @param {string|string[]} textB
 * @returns {{ composite: number, categories: Record<string, number> }}
 */
export function calculateLSM(textA, textB) {
  const profileA = computeFunctionWordFrequencies(textA);
  const profileB = computeFunctionWordFrequencies(textB);

  const categories = {};
  let sumLSM = 0;

  for (const key of CATEGORY_KEYS) {
    const fA = profileA.frequencies[key];
    const fB = profileB.frequencies[key];

    if (fA === 0 && fB === 0) {
      categories[key] = 1.0;
    } else {
      const denominator = fA + fB + EPSILON;
      const difference = Math.abs(fA - fB);
      const categoryScore = 1 - (difference / denominator);
      categories[key] = Math.max(0, Math.min(1, Number(categoryScore.toFixed(4))));
    }

    sumLSM += categories[key];
  }

  const composite = Number((sumLSM / CATEGORY_KEYS.length).toFixed(4));
  return { composite, categories };
}

/**
 * Evaluates a running transcript and returns turn-by-turn LSM telemetry.
 *
 * @param {Array<{ speaker: string, dialogue: string }>} turns
 * @returns {Array<{ turn: number, lsm: number }>}
 */
export function computeRunningLSM(turns) {
  const telemetry = [];
  let corpusA = '';
  let corpusB = '';

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    if (turn.speaker === 'agent_a') {
      corpusA += ' ' + turn.dialogue;
    } else if (turn.speaker === 'agent_b') {
      corpusB += ' ' + turn.dialogue;
    }

    if (corpusA.trim() && corpusB.trim()) {
      const { composite } = calculateLSM(corpusA, corpusB);
      telemetry.push({ turn: i + 1, lsm: composite });
    } else {
      telemetry.push({ turn: i + 1, lsm: 1.0 });
    }
  }

  return telemetry;
}
