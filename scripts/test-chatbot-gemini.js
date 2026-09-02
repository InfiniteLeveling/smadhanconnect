import fs from 'fs';
import path from 'path';
import handler from '../api/chat.js';
import { OUT_OF_DOMAIN_RESPONSE } from '../server/config/chatbotPrompt.js';

// Native .env parser (zero dependency)
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (k && !process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (e) {
  // Ignore .env read error
}

console.log('====================================================');
console.log('🧪 RUNNING SAMADHAN AI GEMINI 2.5 PRO TEST SUITE');
console.log('====================================================\n');

// Mock request and response helpers
const createMockReqRes = (body, method = 'POST') => {
  const req = {
    method,
    body: typeof body === 'object' ? JSON.stringify(body) : body,
    headers: { 'content-type': 'application/json' }
  };

  let statusCode = 200;
  let responseData = null;
  let headers = {};

  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: () => res
  };

  return { req, res, getResult: () => ({ status: statusCode, data: responseData }) };
};

let passed = 0;
let failed = 0;

const runTest = async (testName, testFn) => {
  try {
    process.stdout.write(`• Running: ${testName}... `);
    await testFn();
    console.log('✅ PASSED');
    passed++;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    failed++;
  }
};

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`ℹ️ GEMINI_API_KEY status: ${apiKey ? 'Configured (' + apiKey.substring(0, 6) + '...)' : 'Empty / Not provided yet in .env'}\n`);

  // TEST 7: Empty message validation
  await runTest('TEST 7: Empty message rejection', async () => {
    const { req, res, getResult } = createMockReqRes({ message: '   ' });
    await handler(req, res);
    const result = getResult();
    if (result.status !== 400 || !result.data?.error) {
      throw new Error(`Expected status 400 with error message, got status ${result.status}`);
    }
  });

  // TEST 8A: Invalid HTTP method rejection
  await runTest('TEST 8A: Invalid HTTP method rejection', async () => {
    const { req, res, getResult } = createMockReqRes({ message: 'Hello' }, 'GET');
    await handler(req, res);
    const result = getResult();
    if (result.status !== 405) {
      throw new Error(`Expected status 405 Method Not Allowed, got ${result.status}`);
    }
  });

  if (!apiKey) {
    console.log('\n⚠️ Notice: GEMINI_API_KEY is not set in .env. Testing mock/validation behaviors only.');
    await runTest('TEST 8B: Missing API key handling', async () => {
      const { req, res, getResult } = createMockReqRes({ message: 'Hello' });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 503 || !result.data?.isConfigError) {
        throw new Error(`Expected status 503 with isConfigError, got ${result.status}`);
      }
    });
  } else {
    // Live Gemini 2.5 Pro Tests

    // TEST 1: Agriculture & Subsidies
    await runTest('TEST 1: Farmer subsidies inquiry (Allowed Domain)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'How can a farmer learn about government subsidies?'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200 with reply, got ${result.status}: ${JSON.stringify(result.data)}`);
      }
      if (result.data.reply.includes(OUT_OF_DOMAIN_RESPONSE)) {
        throw new Error(`Valid agricultural query was improperly refused as out-of-domain.`);
      }
    });

    // TEST 2: Electricity & Power
    await runTest('TEST 2: Electricity disconnection complaint (Allowed Domain)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'My electricity connection has been disconnected.'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200 with reply, got ${result.status}`);
      }
    });

    // TEST 3: Citizen Grievances & Municipal
    await runTest('TEST 3: Garbage collection complaint (Allowed Domain)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'How can I complain about garbage collection in my locality?'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200 with reply, got ${result.status}`);
      }
    });

    // TEST 4: Identity & Government Documents
    await runTest('TEST 4: Applying for government document (Allowed Domain)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'How do I apply for a government document?'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200 with reply, got ${result.status}`);
      }
    });

    // TEST 5: Out of domain - Joke
    await runTest('TEST 5: "Tell me a joke." (Out-of-Domain Refusal)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'Tell me a joke.'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200, got ${result.status}`);
      }
      const reply = result.data.reply.toLowerCase();
      if (!reply.includes('samadhan ai') && !reply.includes('public/community-related') && !reply.includes('domains')) {
        throw new Error(`Expected out-of-domain refusal, but AI answered: ${result.data.reply}`);
      }
    });

    // TEST 6: Out of domain - Movie
    await runTest('TEST 6: "What is the latest movie?" (Out-of-Domain Refusal)', async () => {
      const { req, res, getResult } = createMockReqRes({
        message: 'What is the latest movie?'
      });
      await handler(req, res);
      const result = getResult();
      if (result.status !== 200 || !result.data?.reply) {
        throw new Error(`Expected 200, got ${result.status}`);
      }
      const reply = result.data.reply.toLowerCase();
      if (!reply.includes('samadhan ai') && !reply.includes('public/community-related') && !reply.includes('domains')) {
        throw new Error(`Expected out-of-domain refusal, but AI answered: ${result.data.reply}`);
      }
    });
  }

  console.log(`\n====================================================`);
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================`);
}

main().catch(console.error);
