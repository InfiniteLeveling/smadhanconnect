import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.warn('\x1b[33m[WARN] No .env file found at project root.\x1b[0m');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      env[key.trim()] = values.join('=').trim();
    }
  });
  return env;
}

async function testBackend() {
  console.log('\n======================================================');
  console.log(' 🚀 SAMADHAN.CONNECT — BACKEND CONNECTIVITY TEST');
  console.log('======================================================\n');

  const env = loadEnv();
  const rawUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!rawUrl || rawUrl.includes('placeholder-project')) {
    console.log('\x1b[33m⚠️  Status: OFFLINE MOCK MODE\x1b[0m');
    console.log('• Supabase URL is not configured or using placeholder.');
    console.log('• The frontend will seamlessly use local in-memory mock data.\n');
    return;
  }

  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  console.log(`📡 Target URL : \x1b[36m${cleanUrl}\x1b[0m`);
  console.log(`🔑 Anon Key   : \x1b[36m${anonKey ? anonKey.substring(0, 16) + '...' : 'MISSING'}\x1b[0m\n`);

  const tablesToTest = [
    'districts',
    'categories',
    'challenges',
    'projects',
    'project_tasks',
    'solutions',
    'sponsorships',
    'notifications'
  ];

  let passedTables = 0;
  let totalLatency = 0;

  console.log('Testing Core Table Endpoints via PostgREST API:');
  console.log('------------------------------------------------------------------');

  for (const table of tablesToTest) {
    const endpoint = `${cleanUrl}/rest/v1/${table}?select=*&limit=5`;
    const startTime = Date.now();

    try {
      const response = await fetch(endpoint, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const latency = Date.now() - startTime;
      totalLatency += latency;

      if (response.ok) {
        const data = await response.json();
        const count = Array.isArray(data) ? data.length : 0;
        console.log(` \x1b[32m✔ PASS\x1b[0m | Table: \x1b[1m${table.padEnd(16)}\x1b[0m | Status: \x1b[32m${response.status}\x1b[0m | Records: \x1b[36m${count.toString().padEnd(3)}\x1b[0m | Latency: \x1b[33m${latency}ms\x1b[0m`);
        passedTables++;
      } else {
        const errText = await response.text();
        console.log(` \x1b[31m✖ FAIL\x1b[0m | Table: \x1b[1m${table.padEnd(16)}\x1b[0m | Status: \x1b[31m${response.status} (${response.statusText})\x1b[0m | Response: ${errText.slice(0, 50)}`);
      }
    } catch (err) {
      console.log(` \x1b[31m✖ ERR \x1b[0m | Table: \x1b[1m${table.padEnd(16)}\x1b[0m | Error: ${err.message}`);
    }
  }

  console.log('------------------------------------------------------------------\n');

  const avgLatency = passedTables > 0 ? Math.round(totalLatency / passedTables) : 0;

  if (passedTables === tablesToTest.length) {
    console.log('\x1b[32m🎉 ALL BACKEND CHECKS PASSED!\x1b[0m');
    console.log(`• Cloud Database is \x1b[32mHEALTHY & FULLY ONLINE\x1b[0m`);
    console.log(`• Average Response Latency: \x1b[33m${avgLatency}ms\x1b[0m`);
    console.log(`• Ready for live operations & evaluator testing.\n`);
  } else if (passedTables > 0) {
    console.log('\x1b[33m⚠️  PARTIAL BACKEND AVAILABILITY\x1b[0m');
    console.log(`• ${passedTables}/${tablesToTest.length} tables responded.`);
    console.log(`• Ensure all migration scripts from supabase/migrations/ have been executed.\n`);
  } else {
    console.log('\x1b[31m❌ BACKEND UNREACHABLE\x1b[0m');
    console.log(`• Could not query Supabase tables.`);
    console.log(`• Check project paused status in Supabase dashboard or verify API keys.\n`);
  }
}

testBackend();
