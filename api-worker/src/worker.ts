/**
 * Cloudflare Worker — Planora API proxy (hardened)
 */
interface Env {
  OPENAI_API_KEY: string;
  OPENAI_MODEL?: string;     
  
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

/* -------------------- CORS (allowlist dev + prod) -------------------- */


const ALLOWED_EXACT = new Set<string>([
  'http://localhost:5173',
  'http://localhost:5175',
  'https://localhost:5173',
  'https://localhost:5175',
  
]);

// Allow any localhost port 
function isAllowedLocalhost(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

// Fallback 
const DEFAULT_DEV_ORIGIN = 'http://localhost:5175';

function pickOrigin(req: Request): string {
  const o = req.headers.get('Origin') || '';
  if (!o) return DEFAULT_DEV_ORIGIN;
  if (ALLOWED_EXACT.has(o)) return o;
  if (isAllowedLocalhost(o)) return o; 
  return DEFAULT_DEV_ORIGIN;
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function corsPreflight(origin: string): Response {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

/* -------------------- Worker handler -------------------- */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = pickOrigin(request);

  
    if (request.method === 'OPTIONS') return corsPreflight(origin);

    // Basic routes 
    if (url.pathname === '/message' && request.method === 'GET') {
      return new Response('Hello, World!', { headers: corsHeaders(origin) });
    }
    if (url.pathname === '/random' && request.method === 'GET') {
      return new Response(crypto.randomUUID(), { headers: corsHeaders(origin) });
    }

    // Main endpoint
    if (url.pathname === '/api/plan' && request.method === 'POST') {
      try {
        if (!env.OPENAI_API_KEY) {
          return json({ ok: false, error: 'Missing OPENAI_API_KEY secret' }, 500, origin);
        }

        const { messages, model }: { messages: ChatMessage[]; model?: string } = await request.json();
        if (!Array.isArray(messages) || messages.length === 0) {
          return json({ ok: false, error: 'Body must include non-empty `messages` array' }, 400, origin);
        }

        const usedModel = model || env.OPENAI_MODEL || 'gpt-4o-mini';

        //  trace 
        console.log('plan request', {
          model: usedModel,
          ua: request.headers.get('user-agent'),
          origin,
        });

        const OPENAI_BASE = 'https://api.openai.com/v1';

        // Timeout guard
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort('timeout'), 30_000);

        const r = await fetch(`${OPENAI_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: usedModel,
            messages,
            temperature: 0.5, 
            response_format: { type: 'json_object' }, 
          }),
          signal: controller.signal,
        }).catch((e) => {
          throw new Error(`Upstream fetch failed: ${String(e)}`);
        });
        clearTimeout(timer);

        if (!r.ok) {
          const errTxt = await r.text();
          return json({ ok: false, error: `OpenAI error ${r.status}: ${errTxt}` }, 502, origin);
        }

        const data = (await r.json()) as {
          choices?: { message?: { content?: string } }[];
        };

        const content = data.choices?.[0]?.message?.content ?? '{}';
        return json({ ok: true, content }, 200, origin);
      } catch (e: any) {
        console.error('plan error', e?.stack || e);
        return json({ ok: false, error: String(e?.message || e) }, 500, origin);
      }
    }

    return json({ ok: false, error: 'Not Found' }, 404, origin);
  },
} satisfies ExportedHandler<Env>;

// JSON helper with CORS
function json(data: unknown, status = 200, origin = DEFAULT_DEV_ORIGIN): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}
