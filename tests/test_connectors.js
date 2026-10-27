import assert from 'node:assert/strict';
import { MetaClient } from '../connectors/meta_client.js';

console.log('🧪 Running Meta Model API Connectors Unit Tests...\n');

// Test 1: Instantiation with defaults
{
  const client = new MetaClient();
  assert.equal(client.baseUrl, 'https://api.meta.ai/v1');
  console.log('  ✅ Test 1: Client initialized with default Meta Model endpoint');
}

// Test 2: Input validation
{
  const client = new MetaClient();
  await assert.rejects(
    async () => client.createChatCompletion({ messages: null }),
    /Messages array is required/,
    'Should throw error on missing messages'
  );
  await assert.rejects(
    async () => client.generateImage({ prompt: '' }),
    /Prompt is required/,
    'Should throw error on empty prompt'
  );
  console.log('  ✅ Test 2: Input validation rejects malformed requests');
}

// Test 3: Chat completion dry-run fallback
{
  const client = new MetaClient();
  const res = await client.createChatCompletion({
    model: 'muse-spark-1.3',
    messages: [{ role: 'user', content: 'Hello' }]
  });

  assert.ok(res.id);
  assert.equal(res.choices.length, 1);
  assert.equal(res.choices[0].message.role, 'assistant');
  console.log('  ✅ Test 3: Chat completion dry-run returns valid OpenAI-compatible envelope');
}

// Test 4: Image generation dry-run fallback
{
  const client = new MetaClient();
  const res = await client.generateImage({
    model: 'muse-image-1.0',
    prompt: 'Warm indie bookshop in Tokyo'
  });

  assert.ok(res.data.length >= 1);
  assert.ok(res.data[0].url.startsWith('http'));
  console.log('  ✅ Test 4: Image generation dry-run returns structured image data');
}

console.log('\n🎉 All Meta Model API Connectors Unit Tests Passed Successfully!\n');
