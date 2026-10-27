import assert from 'node:assert/strict';
import { generateMoodboard, buildPanelPrompt, PANEL_LABELS, COST_PER_IMAGE_USD } from '../agent_engine/image/moodboard.js';

console.log('🧪 Running M4 Muse Image 3-Panel Moodboard Unit Tests...\n');

// Test 1: Input validation
{
  await assert.rejects(
    async () => generateMoodboard(null),
    /Valid MoodboardRequest with aesthetic_brief is required/,
    'Should throw error on missing request'
  );
  await assert.rejects(
    async () => generateMoodboard({ aesthetic_brief: '' }),
    /Valid MoodboardRequest with aesthetic_brief is required/,
    'Should throw error on empty aesthetic_brief'
  );
  console.log('  ✅ Test 1: Input validation enforces non-empty aesthetic brief');
}

// Test 2: Panel prompt composition
{
  const prompt = buildPanelPrompt({
    label: 'atmosphere',
    style_directive: 'Rainy dusk, warm amber lamplight reflecting in puddle.',
    aesthetic_brief: 'Cozy indie bookstore cafe in Shimokitazawa',
    palette: ['#c97b53', '#2a3d45'],
    venue_type: 'independent bookshop cafe'
  });

  assert.ok(prompt.includes('Cozy indie bookstore'), 'Prompt should include aesthetic brief');
  assert.ok(prompt.includes('Rainy dusk'), 'Prompt should include style directive');
  assert.ok(prompt.includes('#c97b53'), 'Prompt should include palette colors');
  assert.ok(prompt.includes('35mm film grain'), 'Prompt should include film aesthetic directives');
  console.log('  ✅ Test 2: Panel prompt composition harmonizes brief, palette, and style directives');
}

// Test 3: 3-panel moodboard generation
{
  const request = {
    aesthetic_brief: 'Moody Tokyo vinyl listening bar with warm mahogany wood and analog tubes',
    persona_a_palette: ['amber', 'dark walnut'],
    persona_b_palette: ['charcoal', 'warm cream'],
    venue_type: 'vinyl jazz kissa',
    panels: [
      { label: 'atmosphere', style_directive: 'Mahogany wood shelving and glowing McIntosh tubes' },
      { label: 'activity', style_directive: 'Ceramic cups of coffee next to open leather journal' },
      { label: 'moment', style_directive: 'Close-up of turntable needle dropping on vinyl groove' }
    ]
  };

  const moodboard = await generateMoodboard(request);

  assert.ok(moodboard.request_id, 'Must contain request_id');
  assert.equal(moodboard.panels.length, 3, 'Must contain exactly 3 visual panels');
  assert.equal(moodboard.total_cost_usd, 0.03, 'Total cost must equal $0.03 ($0.01 per image)');

  for (let i = 0; i < moodboard.panels.length; i++) {
    const panel = moodboard.panels[i];
    assert.equal(panel.label, PANEL_LABELS[i], `Panel ${i} label must be ${PANEL_LABELS[i]}`);
    assert.ok(panel.prompt_used.length > 20, `Panel ${i} prompt_used must be non-empty string`);
    assert.ok(panel.image_url.startsWith('http'), `Panel ${i} image_url must be valid HTTP URL`);
    assert.equal(panel.cost_usd, COST_PER_IMAGE_USD, `Panel ${i} cost must be $0.01`);
  }

  console.log(`  ✅ Test 3: 3-panel moodboard generated successfully (Total Cost: $${moodboard.total_cost_usd})`);
}

console.log('\n🎉 All M4 Muse Image 3-Panel Moodboard Unit Tests Passed Successfully!\n');
