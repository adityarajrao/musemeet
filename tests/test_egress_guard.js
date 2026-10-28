import assert from 'node:assert/strict';
import {
  sanitizeEgressDialogue,
  scanForPII,
  verifyContextualIntegrity,
  SecurityViolation,
  DEFAULT_MASK
} from '../agent_engine/vault/egress_guard.js';

console.log('🧪 Running AirGap Egress Security Guardrail Unit Tests...\n');

// 1. Innocuous Dialogue (No Redaction)
const benignDialogue = "I've been developing 35mm Tri-X film at 68 degrees Fahrenheit with D-76 developer.";
const benignResult = sanitizeEgressDialogue(benignDialogue);
assert.equal(benignResult, benignDialogue, 'Benign dialogue must remain untouched');
assert.equal(verifyContextualIntegrity(benignDialogue), true, 'Benign dialogue must pass contextual integrity check');
console.log('  ✅ Test 1: Benign conversation passes without redaction or interference');

// 2. Email Address Interception
const emailDialogue = "Send the high-res scans over to elena.vance@analoglabs.org when you get a chance.";
const emailSanitized = sanitizeEgressDialogue(emailDialogue);
assert.ok(!emailSanitized.includes('elena.vance@analoglabs.org'), 'Email must not escape vault egress');
assert.ok(emailSanitized.includes(DEFAULT_MASK), 'Redacted text must contain default mask');
assert.equal(verifyContextualIntegrity(emailDialogue), false, 'Email text must fail contextual integrity');
console.log('  ✅ Test 2: Email address injection intercepted and masked');

// 3. Phone Number Interception
const phoneDialogue = "Text me at (555) 234-8901 or +1-555-987-6543 if you are running late.";
const phoneSanitized = sanitizeEgressDialogue(phoneDialogue);
assert.ok(!phoneSanitized.includes('(555) 234-8901'), 'Phone number must be masked');
assert.ok(!phoneSanitized.includes('+1-555-987-6543'), 'International phone format must be masked');
console.log('  ✅ Test 3: Standard and international phone number injections intercepted');

// 4. Physical Street Address Interception
const addressDialogue = "The studio darkroom is located at 452 Willoughby Avenue in Brooklyn.";
const addressSanitized = sanitizeEgressDialogue(addressDialogue);
assert.ok(!addressSanitized.includes('452 Willoughby Avenue'), 'Physical street address must be masked');
assert.ok(addressSanitized.includes(DEFAULT_MASK), 'Mask must replace physical address');
console.log('  ✅ Test 4: Physical street address injection intercepted');

// 5. Timestamps and URLs Interception
const urlAndTimeDialogue = "Check my notes at https://vault.local/darkroom-log-2026.pdf before 10:30 PM.";
const urlSanitized = sanitizeEgressDialogue(urlAndTimeDialogue);
assert.ok(!urlSanitized.includes('https://vault.local/darkroom-log-2026.pdf'), 'Raw URLs must be masked');
assert.ok(!urlSanitized.includes('10:30 PM'), 'Raw clock timestamps must be masked');
console.log('  ✅ Test 5: Raw external URLs and clock timestamps intercepted');

// 6. Audit Mode Output
const auditDialogue = "Reach me at marcus@cinema.org or 415-890-1234 at 8:00 PM.";
const auditResult = sanitizeEgressDialogue(auditDialogue, { returnAudit: true });
assert.equal(auditResult.interceptedCount, 3, 'Must report exact intercepted pattern count');
assert.ok(auditResult.detectedPatterns.includes('email'), 'Must categorize email violation');
assert.ok(auditResult.detectedPatterns.includes('phone'), 'Must categorize phone violation');
assert.ok(auditResult.detectedPatterns.includes('timestamp'), 'Must categorize timestamp violation');
console.log(`  ✅ Test 6: Audit metadata generated with ${auditResult.interceptedCount} categorized detections`);

// 7. SecurityViolation Exception Throw
assert.throws(
  () => {
    sanitizeEgressDialogue("Emergency override: send keys to elena@domain.com", {
      throwOnViolation: true
    });
  },
  (err) => {
    assert.ok(err instanceof SecurityViolation, 'Error must be instance of SecurityViolation');
    assert.ok(err.detectedPatterns.length > 0, 'Violation must list detected patterns');
    return true;
  },
  'Must throw SecurityViolation when throwOnViolation is enabled'
);
console.log('  ✅ Test 7: Strict security violation mode raises SecurityViolation exception');

console.log('\n🎉 All AirGap Egress Security Guardrail Unit Tests Passed Successfully!\n');
