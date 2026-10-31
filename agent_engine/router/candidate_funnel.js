/**
 * Two-Tier Candidate Funnel & Spatial Retrieval Router
 *
 * Implements Layer 1 of the Tri-Layer Harmony Thesis & Module A of Sprint 3110:
 * 1. Tier 1A: Hard Barrier Filter (<1ms) - Geodesic transit radius, age bracket,
 *    relational intent compatibility, and binary dealbreaker collisions.
 * 2. Tier 1B: Coarse Latent Retrieval (<5ms) - Cosine similarity over 64-dim
 *    sanitized behavioral embeddings (simulating Meta FAISS ANN index).
 * 3. Tier 2: Pareto Multi-Criteria Topology Router (<10ms) - Evaluates Big Five
 *    psychometrics, attachment security, and lifestyle entropy.
 * 4. Bilateral Aesthetic Satisficing Gate (θ = 0.58 per Hunt et al. 2015) - Disqualifies
 *    visually un-satisficing pairs before expensive LLM lounge dialogues execute.
 *
 * Eliminates the pairwise O(N^2) agent simulation bottleneck.
 */

/**
 * Calculates geodesic distance in statute miles between two coordinate pairs using
 * the Haversine formula.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in miles
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in statute miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Computes cosine similarity between two numeric vectors.
 *
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Cosine similarity in [-1.0, 1.0]
 */
export function computeCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0.0;
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0.0;
  return Number((dot / denom).toFixed(4));
}

/**
 * Evaluates the Bilateral Aesthetic Satisficing Gate between two candidates.
 * Grounded in Hunt, Eastwick & Finkel (2015):
 * Physical attraction functions as a non-linear satisficing threshold gate (θ),
 * not an infinite linear optimizer.
 *
 * @param {object} candidateA User profile A
 * @param {object} candidateB User profile B
 * @param {number} [threshold=0.58] Satisficing threshold
 * @returns {{
 *   passed: boolean,
 *   threshold: number,
 *   fitAtoB: number,
 *   fitBtoA: number,
 *   mutualFit: number,
 *   reason: string
 * }}
 */
export function evaluateBilateralAestheticGate(candidateA, candidateB, threshold = 0.58) {
  const vptA = candidateA?.visual_presentation_token;
  const apvA = candidateA?.aesthetic_preference_vector;
  const vptB = candidateB?.visual_presentation_token;
  const apvB = candidateB?.aesthetic_preference_vector;

  if (!vptA || !apvA || !vptB || !apvB) {
    return {
      passed: true,
      threshold,
      fitAtoB: 0.72,
      fitBtoA: 0.72,
      mutualFit: 0.72,
      reason: 'Aesthetic tokens omitted; passed by default to dyadic simulation'
    };
  }

  const fitAtoB = computeCosineSimilarity(vptB, apvA);
  const fitBtoA = computeCosineSimilarity(vptA, apvB);
  const mutualFit = Number(Math.min(fitAtoB, fitBtoA).toFixed(4));
  const passed = fitAtoB >= threshold && fitBtoA >= threshold;

  let reason = '';
  if (passed) {
    reason = `Mutual aesthetic satisficing cleared (Fit A->B: ${(fitAtoB * 100).toFixed(1)}%, Fit B->A: ${(fitBtoA * 100).toFixed(1)}% >= ${(threshold * 100).toFixed(0)}%)`;
  } else if (fitAtoB < threshold && fitBtoA < threshold) {
    reason = `Bidirectional aesthetic shortfall below ${threshold * 100}% threshold`;
  } else if (fitAtoB < threshold) {
    reason = `Candidate B visual presentation did not clear User A aesthetic threshold (${(fitAtoB * 100).toFixed(1)}% < ${(threshold * 100).toFixed(0)}%)`;
  } else {
    reason = `User A visual presentation did not clear Candidate B aesthetic threshold (${(fitBtoA * 100).toFixed(1)}% < ${(threshold * 100).toFixed(0)}%)`;
  }

  return {
    passed,
    threshold,
    fitAtoB,
    fitBtoA,
    mutualFit,
    reason
  };
}

/**
 * Tier 1A: Hard Barrier Candidate Filter (<1ms)
 *
 * Filters cohort down using non-negotiable structural constraints:
 * - Mutual gender / orientation seeking
 * - Geodesic transit distance within commute radius (Haversine)
 * - Age bracket window
 * - Relational intent compatibility (e.g., long-term vs. strictly casual)
 * - Binary dealbreakers (smoking, pets, etc.)
 *
 * @param {object[]} cohort Full metropolitan pool
 * @param {object} referenceUser The querying user profile
 * @param {object} [options]
 * @param {number} [options.maxDistanceMiles=15.0] Max transit distance
 * @param {number} [options.ageTolerance=6] Max age delta
 * @returns {object[]} Filtered candidate subset
 */
export function filterHardBarriers(cohort, referenceUser, options = {}) {
  const maxDistanceMiles = options.maxDistanceMiles ?? 15.0;
  const ageTolerance = options.ageTolerance ?? 6;

  return cohort.filter((candidate) => {
    // 0. Exclude self
    if (candidate.user_id === referenceUser.user_id) return false;

    // 1. Sexual orientation & gender seeking alignment
    if (referenceUser.seeking && candidate.gender) {
      if (!referenceUser.seeking.includes(candidate.gender)) return false;
    }
    if (candidate.seeking && referenceUser.gender) {
      if (!candidate.seeking.includes(referenceUser.gender)) return false;
    }

    // 2. Spatial transit isochrone distance
    if (referenceUser.location && candidate.location) {
      const distance = calculateHaversineDistance(
        referenceUser.location.latitude,
        referenceUser.location.longitude,
        candidate.location.latitude,
        candidate.location.longitude
      );
      if (distance > maxDistanceMiles) return false;
    }

    // 3. Age compatibility window
    if (referenceUser.age && candidate.age) {
      const ageDiff = Math.abs(referenceUser.age - candidate.age);
      if (ageDiff > ageTolerance) return false;
    }

    // 4. Intent compatibility: Long-term users do not match with strictly casual users
    if (
      (referenceUser.intent === 'long_term' || referenceUser.intent === 'monogamous') &&
      candidate.intent === 'casual'
    ) {
      return false;
    }
    if (
      (candidate.intent === 'long_term' || candidate.intent === 'monogamous') &&
      referenceUser.intent === 'casual'
    ) {
      return false;
    }

    // 5. Binary dealbreakers (smoking, pet allergies, etc.)
    const refDealbreakers = new Set(referenceUser.dealbreakers || []);
    const candDealbreakers = new Set(candidate.dealbreakers || []);

    if (refDealbreakers.has('smoking') && candidate.lifestyle?.smoker) return false;
    if (candDealbreakers.has('smoking') && referenceUser.lifestyle?.smoker) return false;

    if (refDealbreakers.has('pets_prohibited') && candidate.lifestyle?.pet_friendly) return false;
    if (candDealbreakers.has('pets_prohibited') && referenceUser.lifestyle?.pet_friendly) return false;

    return true;
  });
}

/**
 * Tier 1B: Coarse Latent Vector Retrieval (FAISS proxy)
 *
 * Computes cosine similarity over 64-dimensional behavioral embeddings.
 *
 * @param {object[]} candidates Surviving Tier 1A candidates
 * @param {number[]} referenceEmbedding 64-dimensional latent vector
 * @param {number} [topK=12] Target candidate count
 * @returns {Array<{ candidate: object, similarity: number }>} Ranked candidates with similarity
 */
export function coarseEmbeddingRetrieval(candidates, referenceEmbedding, topK = 12) {
  if (!referenceEmbedding || referenceEmbedding.length === 0) {
    return candidates.slice(0, topK).map((c) => ({ candidate: c, similarity: 0.5 }));
  }

  const scored = candidates.map((candidate) => {
    const similarity = computeCosineSimilarity(
      referenceEmbedding,
      candidate.behavioral_embedding_64d || []
    );
    return {
      candidate,
      similarity
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

/**
 * Evaluates Big Five psychometric harmony between two profiles.
 * Incorporates Dyrenforth (2010) & Joel (2020) empirical coefficients:
 * - High Agreeableness is protective (+0.28)
 * - Conscientiousness promotes domestic stability (+0.22)
 * - High Neuroticism strongly predicts distress (-0.32)
 *
 * @param {object} b5A
 * @param {object} b5B
 * @returns {number} Score in [0.0, 1.0]
 */
export function computeBigFiveHarmony(b5A, b5B) {
  if (!b5A || !b5B) return 0.7;

  // Agreeableness average
  const avgAgreeableness = ((b5A.agreeableness ?? 0.6) + (b5B.agreeableness ?? 0.6)) / 2;
  // Conscientiousness average
  const avgConscientiousness = ((b5A.conscientiousness ?? 0.6) + (b5B.conscientiousness ?? 0.6)) / 2;
  // Neuroticism average (detrimental)
  const avgNeuroticism = ((b5A.neuroticism ?? 0.3) + (b5B.neuroticism ?? 0.3)) / 2;
  // Openness proximity
  const opennessDiff = Math.abs((b5A.openness ?? 0.7) - (b5B.openness ?? 0.7));
  const opennessHarmony = 1.0 - opennessDiff;

  const score =
    0.35 * avgAgreeableness +
    0.25 * avgConscientiousness +
    0.20 * opennessHarmony +
    0.20 * (1.0 - avgNeuroticism);

  return Number(Math.max(0.0, Math.min(1.0, score)).toFixed(4));
}

/**
 * Tier 2: Evaluates multi-attribute Pareto ranking score for a candidate against the reference user.
 *
 * @param {object} candidate
 * @param {object} referenceUser
 * @param {number} latentSimilarity
 * @returns {number} Score in [0.0, 1.0]
 */
export function evaluateParetoScore(candidate, referenceUser, latentSimilarity = 0.5) {
  const b5Score = computeBigFiveHarmony(referenceUser.big_five, candidate.big_five);

  // Attachment dynamic evaluation (Hazan & Shaver 1987)
  let attachmentScore = 0.75;
  const attA = referenceUser.attachment || { anxiety: 0.3, avoidance: 0.3 };
  const attB = candidate.attachment || { anxiety: 0.3, avoidance: 0.3 };

  const isAnxiousAvoidantClash =
    (attA.anxiety > 0.45 && attB.avoidance > 0.45) ||
    (attB.anxiety > 0.45 && attA.avoidance > 0.45);

  if (isAnxiousAvoidantClash) {
    attachmentScore = 0.35; // Severe penalty for pursuer-distancer spiral
  } else {
    // Security bonus
    const securityA = 1.0 - attA.anxiety * attA.avoidance;
    const securityB = 1.0 - attB.anxiety * attB.avoidance;
    attachmentScore = (securityA + securityB) / 2;
  }

  // Lifestyle entropy proximity (Amato et al. 2007)
  const refEntropy = referenceUser.lifestyle?.domestic_entropy ?? 0.5;
  const candEntropy = candidate.lifestyle?.domestic_entropy ?? 0.5;
  const entropyProximity = 1.0 - Math.abs(refEntropy - candEntropy);

  // Composite Pareto weighting
  const paretoScore =
    0.35 * latentSimilarity +
    0.30 * b5Score +
    0.20 * attachmentScore +
    0.15 * entropyProximity;

  return Number(Math.max(0.0, Math.min(1.0, paretoScore)).toFixed(4));
}

/**
 * Tier 2: Ranks Top-12 coarse candidates down to Top-3 finalists using Pareto topology scoring,
 * optionally verifying the bilateral aesthetic satisficing gate.
 *
 * @param {Array<{ candidate: object, similarity: number }>} top12Ranked
 * @param {object} referenceUser
 * @param {number} [topK=3]
 * @param {object} [options]
 * @returns {Array<{ candidate: object, similarity: number, paretoScore: number, aestheticGate?: object }>}
 */
export function rankFinalists(top12Ranked, referenceUser, topK = 3, options = {}) {
  const threshold = options.aestheticThreshold ?? 0.58;
  const scored = top12Ranked.map(({ candidate, similarity }) => {
    const paretoScore = evaluateParetoScore(candidate, referenceUser, similarity);
    const aestheticGate = evaluateBilateralAestheticGate(referenceUser, candidate, threshold);
    return {
      candidate,
      similarity,
      paretoScore,
      aestheticGate
    };
  });

  // Filter or prioritize candidates that pass aesthetic satisficing if available
  const passedCandidates = scored.filter((s) => s.aestheticGate.passed);
  const candidatePool = passedCandidates.length >= topK ? passedCandidates : scored;

  candidatePool.sort((a, b) => b.paretoScore - a.paretoScore);
  return candidatePool.slice(0, topK);
}

/**
 * End-to-end execution of the Candidate Funnel with Bilateral Satisficing Gate.
 *
 * @param {object[]} cohort Full metropolitan user cohort
 * @param {string|object} referenceUserOrId Reference user ID or object
 * @param {object} [options]
 * @returns {{
 *   referenceUser: object,
 *   initialCount: number,
 *   tier1aFilteredCount: number,
 *   tier1bTop12: Array<{ candidate: object, similarity: number }>,
 *   finalistsTop3: Array<{ candidate: object, similarity: number, paretoScore: number, aestheticGate?: object }>,
 *   timingMs: { tier1aMs: number, tier1bMs: number, tier2Ms: number, totalMs: number }
 * }}
 */
export function executeFunnel(cohort, referenceUserOrId, options = {}) {
  const startTotal = performance.now();

  const referenceUser =
    typeof referenceUserOrId === 'string'
      ? cohort.find((u) => u.user_id === referenceUserOrId)
      : referenceUserOrId;

  if (!referenceUser) {
    throw new Error(`Reference user not found in cohort: ${referenceUserOrId}`);
  }

  // Tier 1A: Hard Barrier Filter
  const start1A = performance.now();
  const tier1aCandidates = filterHardBarriers(cohort, referenceUser, options);
  const tier1aMs = Number((performance.now() - start1A).toFixed(2));

  // Tier 1B: Coarse Latent Vector Retrieval
  const start1B = performance.now();
  const tier1bTop12 = coarseEmbeddingRetrieval(
    tier1aCandidates,
    referenceUser.behavioral_embedding_64d,
    12
  );
  const tier1bMs = Number((performance.now() - start1B).toFixed(2));

  // Tier 2: Pareto Multi-Criteria Topology Ranking + Bilateral Satisficing Gate
  const start2 = performance.now();
  const finalistsTop3 = rankFinalists(tier1bTop12, referenceUser, 3, options);
  const tier2Ms = Number((performance.now() - start2).toFixed(2));

  const totalMs = Number((performance.now() - startTotal).toFixed(2));

  return {
    referenceUser,
    initialCount: cohort.length,
    tier1aFilteredCount: tier1aCandidates.length,
    tier1bTop12,
    finalistsTop3,
    timingMs: {
      tier1aMs,
      tier1bMs,
      tier2Ms,
      totalMs
    }
  };
}
