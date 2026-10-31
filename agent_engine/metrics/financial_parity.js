/**
 * Sovereign Financial Parity & Lifestyle Compatibility Engine
 *
 * Implements Module B of Sprint 3110:
 * Longitudinal relationship research (Dew et al., Family Relations 2012; Papp et al. 2009)
 * demonstrates that financial disagreements are longer, more intense, and the single
 * strongest statistical predictor of relationship breakdown and divorce.
 *
 * Field reality (Reddit r/Marriage, r/datingoverthirty, r/Money):
 * Relational friction is NOT caused by absolute net-worth or salary disparity.
 * It is caused by lifestyle entropy and capital allocation philosophy asymmetry:
 * 1. Saver vs. Spender friction (frugal minimalist vs. impulsive consumer)
 * 2. Leisure & Experiential spending parity (street food/camping vs. luxury omakase/5-star)
 * 3. Risk tolerance asymmetry (crypto/startup vs. fixed bond/hyper-conservative)
 *
 * Non-Classist Anti-Elitism Principle:
 * We reject income brackets and net-worth filters. Compatibility is evaluated via
 * continuous philosophical parity (delta distance), ensuring alignment without discrimination.
 */

/**
 * Calculates continuous financial compatibility and lifestyle parity between two profiles.
 *
 * @param {object} lifestyleA Profile A financial lifestyle object
 * @param {object} lifestyleB Profile B financial lifestyle object
 * @returns {{
 *   parityScore: number,
 *   compositeDelta: number,
 *   leisureDelta: number,
 *   entropyDelta: number,
 *   riskDelta: number,
 *   classification: 'high_resonance' | 'manageable_asymmetry' | 'severe_friction',
 *   frictionFlag: boolean,
 *   diagnosticSummary: string
 * }}
 */
export function computeFinancialParity(lifestyleA, lifestyleB) {
  const leisureA = Number(lifestyleA?.leisure_expenditure_tier ?? 0.5);
  const leisureB = Number(lifestyleB?.leisure_expenditure_tier ?? 0.5);

  const entropyA = Number(lifestyleA?.consumption_entropy ?? 0.5);
  const entropyB = Number(lifestyleB?.consumption_entropy ?? 0.5);

  const riskA = Number(lifestyleA?.financial_risk_tolerance ?? 0.5);
  const riskB = Number(lifestyleB?.financial_risk_tolerance ?? 0.5);

  const leisureDelta = Number(Math.abs(leisureA - leisureB).toFixed(4));
  const entropyDelta = Number(Math.abs(entropyA - entropyB).toFixed(4));
  const riskDelta = Number(Math.abs(riskA - riskB).toFixed(4));

  // Weighted composite delta: Leisure parity is most immediate for dating (45%),
  // followed by spending discipline/entropy (35%), and long-term risk appetite (20%).
  const compositeDelta = Number(
    (0.45 * leisureDelta + 0.35 * entropyDelta + 0.20 * riskDelta).toFixed(4)
  );

  const parityScore = Number(Math.max(0.0, 1.0 - compositeDelta).toFixed(4));

  let classification = 'high_resonance';
  let frictionFlag = false;
  let diagnosticSummary = '';

  if (compositeDelta <= 0.30) {
    classification = 'high_resonance';
    diagnosticSummary = `Organic lifestyle harmony (Composite delta: ${(compositeDelta * 100).toFixed(1)}%). Shared expectations around leisure, dining, and resource velocity.`;
  } else if (compositeDelta <= 0.60) {
    classification = 'manageable_asymmetry';
    diagnosticSummary = `Moderate lifestyle asymmetry (Composite delta: ${(compositeDelta * 100).toFixed(1)}%). Requires proactive alignment on experiential leisure budgets.`;
  } else {
    classification = 'severe_friction';
    frictionFlag = true;
    const primaryDriver =
      leisureDelta >= entropyDelta && leisureDelta >= riskDelta
        ? 'Experiential leisure expenditure disparity'
        : entropyDelta >= riskDelta
        ? 'Saver vs. impulsive spender lifestyle friction'
        : 'High-risk vs. ultra-conservative capital volatility';
    diagnosticSummary = `Severe lifestyle divergence flagged (Composite delta: ${(compositeDelta * 100).toFixed(1)}%). Primary clash: ${primaryDriver}.`;
  }

  return {
    parityScore,
    compositeDelta,
    leisureDelta,
    entropyDelta,
    riskDelta,
    classification,
    frictionFlag,
    diagnosticSummary
  };
}

/**
 * Distills raw unstructured digital footprints (dining, shopping, travel, subscriptions)
 * into structured continuous financial lifestyle dimensions within the sovereign vault.
 *
 * @param {object} input
 * @param {boolean} input.consent_given Explicit privacy opt-in
 * @param {Array<string>} [input.dining_habits] e.g. ["neighborhood bistros", "street food", "local craft coffee"]
 * @param {Array<string>} [input.retail_brands] e.g. ["thrift", "vintage", "patagonia", "independent bookstores"]
 * @param {Array<string>} [input.travel_preferences] e.g. ["train journeys", "cabin getaways", "budget backpacking"]
 * @param {string} [input.financial_temperament] e.g. "disciplined_saver" | "experiential_spender" | "high_risk_founder"
 * @returns {object} 3-dimensional financial lifestyle vector
 */
export function inferLifestyleFinancialDimensions({
  consent_given,
  dining_habits = [],
  retail_brands = [],
  travel_preferences = [],
  financial_temperament
}) {
  if (consent_given !== true) {
    throw new Error(
      'Privacy Violation: Financial lifestyle inference requires explicit consent_given: true'
    );
  }

  let leisureScore = 0.5;
  let entropyScore = 0.5;
  let riskScore = 0.5;

  const luxuryKeywords = ['michelin', 'tasting menu', 'omakase', 'four seasons', 'first class', 'designer', 'boutique luxury', 'valet'];
  const humbleKeywords = ['street food', 'home cook', 'thrift', 'vintage', 'camping', 'hostel', 'subway', 'public transit', 'local diner'];
  const impulsiveKeywords = ['spontaneous', 'splurge', 'unplanned', 'maximalist', 'collector', 'trend'];
  const disciplinedKeywords = ['budget', 'meal prep', 'frugal', 'fire', 'index fund', 'minimalist', 'savings goal'];

  const allHabits = [
    ...dining_habits,
    ...retail_brands,
    ...travel_preferences
  ].join(' ').toLowerCase();

  let luxuryHits = 0;
  let humbleHits = 0;
  luxuryKeywords.forEach((kw) => {
    if (allHabits.includes(kw)) luxuryHits++;
  });
  humbleKeywords.forEach((kw) => {
    if (allHabits.includes(kw)) humbleHits++;
  });

  if (luxuryHits > humbleHits) {
    leisureScore = Math.min(0.95, 0.5 + 0.12 * (luxuryHits - humbleHits));
  } else if (humbleHits > luxuryHits) {
    leisureScore = Math.max(0.15, 0.5 - 0.10 * (humbleHits - luxuryHits));
  }

  let impulsiveHits = 0;
  let disciplinedHits = 0;
  impulsiveKeywords.forEach((kw) => {
    if (allHabits.includes(kw)) impulsiveHits++;
  });
  disciplinedKeywords.forEach((kw) => {
    if (allHabits.includes(kw)) disciplinedHits++;
  });

  if (impulsiveHits > disciplinedHits) {
    entropyScore = Math.min(0.90, 0.5 + 0.12 * (impulsiveHits - disciplinedHits));
  } else if (disciplinedHits > impulsiveHits) {
    entropyScore = Math.max(0.15, 0.5 - 0.10 * (disciplinedHits - impulsiveHits));
  }

  // Temperament override / prior
  if (financial_temperament === 'high_risk_founder' || financial_temperament === 'speculative_crypto') {
    riskScore = 0.85;
  } else if (financial_temperament === 'disciplined_saver' || financial_temperament === 'debt_averse') {
    riskScore = 0.25;
    entropyScore = Math.min(entropyScore, 0.35);
  } else if (financial_temperament === 'experiential_balanced') {
    riskScore = 0.45;
  }

  return {
    leisure_expenditure_tier: Number(leisureScore.toFixed(2)),
    consumption_entropy: Number(entropyScore.toFixed(2)),
    financial_risk_tolerance: Number(riskScore.toFixed(2))
  };
}
