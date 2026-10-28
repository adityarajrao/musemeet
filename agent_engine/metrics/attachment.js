/**
 * Attachment & Relational Dynamics Engine
 *
 * Implements Layer 3 attachment psychometrics and empirical relationship survival modeling.
 * Grounded in:
 * - Hazan & Shaver (1987) / Mikulincer & Shaver (2007): Adult attachment styles and the Anxious-Avoidant trap
 * - Gottman & Levenson (2002): Repair attempts and emotional decompression latency
 * - Hochschild (2012) / Amato et al. (2007): Domestic cognitive labor and chore resentment
 * - Dew et al. (2012): Financial risk alignment and long-term marital stability
 */

/**
 * Computes individual attachment security score.
 * Formula: AttachmentSecurity = 1.0 - (AnxietyScore * AvoidanceScore)
 *
 * @param {number} anxiety Anxiety score in [0.0, 1.0]
 * @param {number} avoidance Avoidance score in [0.0, 1.0]
 * @returns {number} Security score in [0.0, 1.0]
 */
export function computeAttachmentSecurity(anxiety, avoidance) {
  const anx = Math.max(0.0, Math.min(1.0, Number(anxiety) || 0.0));
  const avd = Math.max(0.0, Math.min(1.0, Number(avoidance) || 0.0));
  return Number((1.0 - anx * avd).toFixed(4));
}

/**
 * Classifies continuous anxiety and avoidance into standard Hazan & Shaver 4-quadrant typology.
 *
 * @param {number} anxiety
 * @param {number} avoidance
 * @param {number} [threshold=0.45]
 * @returns {"Secure" | "Anxious-Preoccupied" | "Dismissive-Avoidant" | "Fearful-Avoidant"}
 */
export function classifyAttachmentQuadrant(anxiety, avoidance, threshold = 0.45) {
  const isHighAnx = anxiety >= threshold;
  const isHighAvd = avoidance >= threshold;

  if (!isHighAnx && !isHighAvd) return 'Secure';
  if (isHighAnx && !isHighAvd) return 'Anxious-Preoccupied';
  if (!isHighAnx && isHighAvd) return 'Dismissive-Avoidant';
  return 'Fearful-Avoidant';
}

/**
 * Evaluates dyadic relational dynamics, attachment stability, and empirical pre-mortem risks.
 *
 * @param {object} userA Profile with attachment and lifestyle
 * @param {object} userB Profile with attachment and lifestyle
 * @returns {object} Comprehensive relational telemetry
 */
export function evaluateDyadicAttachmentDynamics(userA, userB) {
  const attA = userA.attachment || {
    anxiety: 0.25,
    avoidance: 0.25,
    decompression_mode: 'auto_regulation',
    repair_velocity: 0.75
  };
  const attB = userB.attachment || {
    anxiety: 0.25,
    avoidance: 0.25,
    decompression_mode: 'auto_regulation',
    repair_velocity: 0.75
  };

  const securityA = computeAttachmentSecurity(attA.anxiety, attA.avoidance);
  const securityB = computeAttachmentSecurity(attB.anxiety, attB.avoidance);
  const styleA = classifyAttachmentQuadrant(attA.anxiety, attA.avoidance);
  const styleB = classifyAttachmentQuadrant(attB.anxiety, attB.avoidance);

  // Dyadic cross-partner security: captures cross-partner attachment polarization
  const crossThreat = Math.max(attA.anxiety * attB.avoidance, attB.anxiety * attA.avoidance);
  const crossSecurity = Number((1.0 - crossThreat).toFixed(4));
  const dyadicSecurity = Number((((securityA + securityB) / 2) * 0.5 + crossSecurity * 0.5).toFixed(4));

  // 1. Detect Anxious-Avoidant pursuer-distancer spiral (Hazan & Shaver 1987)
  const isPursuerDistancer =
    (attA.anxiety >= 0.45 && attB.avoidance >= 0.45) ||
    (attB.anxiety >= 0.45 && attA.avoidance >= 0.45);

  // 2. Decompression mode analysis
  const modeA = attA.decompression_mode || 'auto_regulation';
  const modeB = attB.decompression_mode || 'auto_regulation';
  const isDecompressionMatch = modeA === modeB;

  let decompressionAnalysis = '';
  let decompressionHarmonyScore = 1.0;
  if (isDecompressionMatch && modeA === 'auto_regulation') {
    decompressionAnalysis =
      'Harmonious Autonomy: Both partners need independent solitary time to decompress before re-engaging.';
    decompressionHarmonyScore = 0.95;
  } else if (isDecompressionMatch && modeA === 'co_regulation') {
    decompressionAnalysis =
      'Immediate Co-Regulation: Both partners seek immediate verbal connection to soothe emotional tension.';
    decompressionHarmonyScore = 0.95;
  } else {
    decompressionAnalysis =
      'Asymmetric Decompression: One partner craves immediate discussion while the other needs space to regulate. Requires an explicit 30-minute cooling protocol.';
    decompressionHarmonyScore = 0.65;
  }

  // 3. Repair attempt velocity (Gottman & Levenson 2002)
  const repVelA = attA.repair_velocity ?? 0.7;
  const repVelB = attB.repair_velocity ?? 0.7;
  const avgRepairVelocity = Number(((repVelA + repVelB) / 2).toFixed(4));
  const repairVelocityDelta = Number(Math.abs(repVelA - repVelB).toFixed(4));

  // 4. Domestic & Cognitive Workload Alignment (Amato 2007; Hochschild 2012)
  const lifeA = userA.lifestyle || {};
  const lifeB = userB.lifestyle || {};
  const entropyA = lifeA.domestic_entropy ?? 0.4;
  const entropyB = lifeB.domestic_entropy ?? 0.4;
  const domesticEntropyDelta = Number(Math.abs(entropyA - entropyB).toFixed(4));
  const domesticAlignmentScore = Number((1.0 - domesticEntropyDelta).toFixed(4));

  // 5. Financial Risk Alignment (Dew et al. 2012)
  const finA = lifeA.financial_risk ?? 0.4;
  const finB = lifeB.financial_risk ?? 0.4;
  const financialRiskDelta = Number(Math.abs(finA - finB).toFixed(4));
  const financialAlignmentScore = Number((1.0 - financialRiskDelta).toFixed(4));

  // Synthesize Pre-Mortem Warnings
  const preMortemWarnings = [];

  if (isPursuerDistancer) {
    preMortemWarnings.push({
      category: 'Attachment Loop',
      severity: 'HIGH',
      title: 'Pursuer-Distancer Polarization Risk',
      description:
        'One partner’s urgency for immediate reassurance directly triggers the other partner’s instinctual withdrawal, creating an escalating anxiety-avoidance spiral (Hazan & Shaver, 1987).',
      mitigation:
        'Establish an agreed-upon "Safe Pause" signal: when flooded, either partner can pause for up to 60 minutes with a promised time to resume conversation.'
    });
  }

  if (!isDecompressionMatch) {
    preMortemWarnings.push({
      category: 'Stress Regulation',
      severity: 'MODERATE',
      title: 'Decompression Cadence Mismatch',
      description:
        'Clash between co-regulation (talk it out immediately) and auto-regulation (retreat to solo cave). Unchecked, the auto-regulator feels interrogated and the co-regulator feels abandoned.',
      mitigation:
        'Agree on post-work transitional buffers. Allow 30 minutes of undisturbed solo arrival before substantive domestic debriefing.'
    });
  }

  if (domesticEntropyDelta > 0.4) {
    preMortemWarnings.push({
      category: 'Domestic Ecology',
      severity: 'HIGH',
      title: 'Chore Entropy & Second Shift Imbalance Risk',
      description:
        'Substantial gap in domestic organizational tolerance (Amato et al. 2007). The lower-entropy partner risks carrying invisible cognitive load, culminating in quiet roommate contempt.',
      mitigation:
        'Codify shared living baseline standards explicitly early on; externalize routine domestic maintenance via structured calendar scheduling.'
    });
  }

  if (financialRiskDelta > 0.45) {
    preMortemWarnings.push({
      category: 'Resource Philosophy',
      severity: 'MODERATE',
      title: 'Capital Allocation & Risk Tolerance Asymmetry',
      description:
        'Disparity in financial risk appetite (frugality vs. experiential expenditure). High predictor of recurring friction in multi-year commitments (Dew et al. 2012).',
      mitigation:
        'Maintain independent discretionary spending envelopes alongside a unified, automated joint reserve account.'
    });
  }

  // Calculate composite Relational Stability Index (RSI)
  const penalty = isPursuerDistancer ? 0.35 : 0.0;
  const rsi =
    0.35 * dyadicSecurity +
    0.20 * (1.0 - penalty) +
    0.15 * decompressionHarmonyScore +
    0.15 * domesticAlignmentScore +
    0.15 * financialAlignmentScore;

  const relationalStabilityIndex = Number(Math.max(0.0, Math.min(1.0, rsi)).toFixed(4));

  return {
    userA: {
      style: styleA,
      security: securityA,
      decompressionMode: modeA,
      repairVelocity: repVelA
    },
    userB: {
      style: styleB,
      security: securityB,
      decompressionMode: modeB,
      repairVelocity: repVelB
    },
    dyadicSecurity,
    relationalStabilityIndex,
    isPursuerDistancer,
    decompressionAnalysis,
    domesticAlignment: {
      score: domesticAlignmentScore,
      entropyDelta: domesticEntropyDelta
    },
    financialAlignment: {
      score: financialAlignmentScore,
      riskDelta: financialRiskDelta
    },
    preMortemWarnings
  };
}
