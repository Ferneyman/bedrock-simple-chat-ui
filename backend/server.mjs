// Minimal dependency-free Bedrock proxy using bearer token
// - Single route: POST /api/chat
// - Ports default: backend 8088 (override with BACKEND_PORT)
// - CORS: default allow http://localhost:8087 (override with FRONTEND_ORIGIN)

import { readFileSync, existsSync } from 'fs';
import { createServer } from 'http';
import { URL } from 'url';

// Lightweight .env loader (optional, dependency-free)
try {
  const envPath = new URL('../.env', import.meta.url);
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    });
  }
} catch {}

const PORT = Number(process.env.BACKEND_PORT || 8088);
const ALLOW_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8087';

const AWS_BEARER_TOKEN = process.env.AWS_BEARER_TOKEN_BEDROCK || '';
const BEDROCK_REGION = process.env.BEDROCK_REGION || 'ap-southeast-2';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-5-20250929-v1:0';
const INFERENCE_PROFILE_ID = process.env.BEDROCK_INFERENCE_PROFILE_ID || '';
const INFERENCE_PROFILE_ARN = process.env.BEDROCK_INFERENCE_PROFILE_ARN || '';

function sendJson(res, status, data, extraHeaders = {}) {
  const payload = Buffer.from(JSON.stringify(data));
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': String(payload.length),
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...extraHeaders,
  });
  res.end(payload);
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not found' });
}

async function handleInvoke(messages) {
  if (!AWS_BEARER_TOKEN) throw new Error('Missing AWS_BEARER_TOKEN_BEDROCK');

  const host = `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com`;
  const url = `${host}/model/${encodeURIComponent(BEDROCK_MODEL_ID)}/invoke`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AWS_BEARER_TOKEN}`,
    'X-Amz-Target': 'BedrockRuntime.InvokeModel',
  };
  if (INFERENCE_PROFILE_ID) headers['x-amzn-bedrock-inference-profile-id'] = INFERENCE_PROFILE_ID;
  if (INFERENCE_PROFILE_ARN) headers['x-amzn-bedrock-inference-profile-arn'] = INFERENCE_PROFILE_ARN;

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4000,
    messages,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Bedrock error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }

  return await res.json();
}

const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/api/chat') {
    try {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const parsed = raw ? JSON.parse(raw) : {};
      const message = (parsed.message ?? '').toString();
      const history = Array.isArray(parsed.conversationHistory) ? parsed.conversationHistory : [];

      if (!message.trim()) return sendJson(res, 400, { error: 'message is required' });

      const messages = history.concat([{ role: 'user', content: message }]);
      const result = await handleInvoke(messages);

      return sendJson(res, 200, { response: result });
    } catch (e) {
      const status = e.status && Number(e.status) >= 400 ? Number(e.status) : 500;
      return sendJson(res, status, { error: e.message || 'Unknown error' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { ok: true });
  }

  return notFound(res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backup Bedrock proxy listening on http://localhost:${PORT}`);
});




