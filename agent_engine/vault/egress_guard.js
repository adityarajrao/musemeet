/**
 * AirGap Egress Security Guardrail
 *
 * Implements defensive egress filtering for sovereign user privacy.
 * Grounded in Nissenbaum's Contextual Integrity (2004) and AirGap cryptographic boundaries.
 * Intercepts, sanitizes, and prevents unintentional egress of personally identifiable
 * information (PII) such as emails, phone numbers, exact physical addresses,
 * calendar clock timestamps, and arbitrary external URLs before dialogue enters the lounge.
 */

export class SecurityViolation extends Error {
  /**
   * @param {string} message
   * @param {Array<{ type: string, match: string }>} [detectedPatterns=[]]
   */
  constructor(message, detectedPatterns = []) {
    super(message);
    this.name = 'SecurityViolation';
    this.detectedPatterns = detectedPatterns;
  }
}

/**
 * Standard PII intercept regex patterns
 */
export const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi,
  phone: /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/gi,
  address: /\b\d{1,5}\s+(?:[A-Za-z0-9.]+\s+){1,4}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Way|Drive|Dr|Lane|Ln|Court|Ct)\b/gi,
  timestamp: /\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/gi,
  url: /https?:\/\/[^\s]+/gi
};

export const DEFAULT_MASK = '[PROTECTED_VAULT_METADATA]';

/**
 * Scans input text and returns all detected PII entities.
 *
 * @param {string} text
 * @returns {Array<{ type: string, match: string, index: number }>}
 */
export function scanForPII(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    return [];
  }

  const detections = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    // Clone regex with sticky/global flags reset
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      detections.push({
        type,
        match: match[0],
        index: match.index
      });
    }
  }

  return detections;
}

/**
 * Verifies whether text complies with contextual integrity boundaries (zero PII).
 *
 * @param {string} text
 * @returns {boolean} True if text is 100% free of prohibited PII patterns
 */
export function verifyContextualIntegrity(text) {
  return scanForPII(text).length === 0;
}

/**
 * Sanitizes turn dialogue by redacting prohibited PII patterns.
 *
 * @param {string} turnDialogue Input conversational turn
 * @param {object} [options={}] Configuration options
 * @param {boolean} [options.throwOnViolation=false] Whether to throw SecurityViolation on detection
 * @param {string} [options.maskReplacement=DEFAULT_MASK] Replacement token
 * @param {boolean} [options.returnAudit=false] If true, returns audit wrapper object instead of string
 * @returns {string | { sanitizedDialogue: string, interceptedCount: number, detectedPatterns: string[], events: Array<object> }}
 */
export function sanitizeEgressDialogue(turnDialogue, options = {}) {
  const {
    throwOnViolation = false,
    maskReplacement = DEFAULT_MASK,
    returnAudit = false
  } = options;

  if (typeof turnDialogue !== 'string') {
    if (returnAudit) {
      return {
        sanitizedDialogue: '',
        interceptedCount: 0,
        detectedPatterns: [],
        events: []
      };
    }
    return '';
  }

  const detections = scanForPII(turnDialogue);

  if (detections.length > 0 && throwOnViolation) {
    throw new SecurityViolation(
      `Contextual integrity violation: Detected ${detections.length} prohibited PII patterns in egress dialogue.`,
      detections
    );
  }

  let sanitized = turnDialogue;
  const events = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const regex = new RegExp(pattern.source, pattern.flags);
    sanitized = sanitized.replace(regex, (match) => {
      events.push({
        type,
        original: match,
        timestamp: new Date().toISOString()
      });
      return maskReplacement;
    });
  }

  if (returnAudit) {
    return {
      sanitizedDialogue: sanitized,
      interceptedCount: events.length,
      detectedPatterns: Array.from(new Set(events.map(e => e.type))),
      events
    };
  }

  return sanitized;
}
