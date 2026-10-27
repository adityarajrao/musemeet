import assert from 'node:assert/strict';
import { calculateLSM, computeFunctionWordFrequencies, computeRunningLSM, tokenize } from '../agent_engine/metrics/lsm.js';

console.log('🧪 Running LSM Calculator Unit Tests...\n');

// Test 1: Tokenizer
{
  const tokens = tokenize("Hello, world! It's a brand-new day: let's test this.");
  assert.ok(tokens.includes('hello'), 'Tokenize should lowercase words');
  assert.ok(tokens.includes('a'), 'Tokenize should include single-letter articles');
  console.log('  ✅ Test 1: Tokenizer handles punctuation and contractions correctly');
}

// Test 2: Frequency distribution
{
  const text = 'I am going to the library because it is quiet and peaceful.';
  const { wordCount, frequencies } = computeFunctionWordFrequencies(text);
  assert.equal(wordCount, 12, 'Word count should be 12');
  assert.ok(frequencies.personal_pronouns > 0, 'Should detect personal pronoun "I"');
  assert.ok(frequencies.articles > 0, 'Should detect article "the"');
  assert.ok(frequencies.conjunctions > 0, 'Should detect conjunction "because", "and"');
  console.log('  ✅ Test 2: Function word frequency profiling accurate');
}

// Test 3: Identical texts should yield 1.0 composite LSM
{
  const text = 'We were walking in the park when she told me about her favorite book.';
  const { composite, categories } = calculateLSM(text, text);
  assert.equal(composite, 1.0, 'Identical texts must produce an LSM score of 1.0');
  for (const cat in categories) {
    assert.equal(categories[cat], 1.0, `Category ${cat} must be 1.0 for identical text`);
  }
  console.log('  ✅ Test 3: Identical texts produce perfect 1.0 LSM synchrony');
}

// Test 4: Completely divergent functional styles should produce low LSM
{
  const formalTechnical = 'Topological data analysis demonstrates persistent homology across multidimensional simplicial complexes.';
  const casualColloquial = 'I mean, honestly, you know how it is when we just want to go there and relax, right?';
  const { composite } = calculateLSM(formalTechnical, casualColloquial);
  assert.ok(composite < 0.60, `Divergent styles should produce low LSM, got ${composite}`);
  console.log(`  ✅ Test 4: Stylistic divergence yields expected low LSM score (${composite})`);
}

// Test 5: Running transcript telemetry
{
  const turns = [
    { speaker: 'agent_a', dialogue: 'I was thinking about the records we listened to yesterday in that small cafe. It was really such a quiet space.' },
    { speaker: 'agent_b', dialogue: 'You know, I remember that too. We really felt the warmth of the vinyl in that room, and it was so peaceful.' },
    { speaker: 'agent_a', dialogue: 'It is rare to find a place that honors the physical medium with so much care and without any pretense.' },
    { speaker: 'agent_b', dialogue: 'Exactly. Because when you slow down and focus on it with someone who gets it, everything changes for the better.' }
  ];
  const running = computeRunningLSM(turns);
  assert.equal(running.length, 4, 'Should compute running telemetry for each turn');
  assert.ok(running[3].lsm > 0.60, `Running transcript should yield >0.60 LSM, got ${running[3].lsm}`);
  console.log(`  ✅ Test 5: Running dialogue telemetry computed successfully (Final turn LSM: ${running[3].lsm})`);
}

console.log('\n🎉 All LSM Calculator Unit Tests Passed Successfully!\n');
