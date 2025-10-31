/**
 * Cloudflare Worker — Planora API proxy
 */
interface Env {
  OPENAI_API_KEY: string;
  OPENAI_MODEL?: string;
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

/* -------------------- CORS -------------------- */

/** Exact origins you allow (scheme + host [+ port]) */
const ALLOWED_EXACT = new Set<string>([
  'http://localhost:5173',
  'http://localhost:5175',
  'https://localhost:5173',
  'https://localhost:5175',
  'https://planora-gamma.vercel.app', 
]);

/** Allow any localhost/127.0.0.1 with any port */
function isAllowedLocalhost(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

/** (Optional) allow any *.vercel.app preview; comment out if you want strict */
function isAllowedVercelPreview(origin: string): boolean {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
}

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (ALLOWED_EXACT.has(origin)) return true;
  if (isAllowedLocalhost(origin)) return true;
  if (isAllowedVercelPreview(origin)) return true; // optional
  return false;
}

/** Build CORS headers; when not allowed, do NOT echo a mismatched origin */
function corsHeaders(origin: string | null, allowed: boolean) {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (allowed && origin) {
    h['Access-Control-Allow-Origin'] = origin;
  }
  return h;
}

function preflight(origin: string | null, allowed: boolean): Response {
  // If not allowed, return 204 with no ACAO (browser will block)
  return new Response(null, { status: 204, headers: corsHeaders(origin, allowed) });
}

/* -------------------- Worker handler -------------------- */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowed = isAllowedOrigin(origin);

    // Handle CORS preflight for any path
    if (request.method === 'OPTIONS') {
      return preflight(origin, allowed);
    }

    // Small public GETs (with CORS)
    if (url.pathname === '/message' && request.method === 'GET') {
      return new Response('Hello, World!', { headers: corsHeaders(origin, allowed) });
    }
    if (url.pathname === '/random' && request.method === 'GET') {
      return new Response(crypto.randomUUID(), { headers: corsHeaders(origin, allowed) });
    }

    // Main endpoint
    if (url.pathname === '/api/plan' && request.method === 'POST') {
      // Enforce CORS for non-OPTIONS as well
      if (!allowed) {
        return json({ ok: false, error: 'CORS: Origin not allowed' }, 403, origin, allowed);
      }

      try {
        if (!env.OPENAI_API_KEY) {
          return json({ ok: false, error: 'Missing OPENAI_API_KEY secret' }, 500, origin, allowed);
        }

        const { messages, model }: { messages: ChatMessage[]; model?: string } = await request.json();
        if (!Array.isArray(messages) || messages.length === 0) {
          return json({ ok: false, error: 'Body must include non-empty `messages` array' }, 400, origin, allowed);
        }

        const usedModel = model || env.OPENAI_MODEL || 'gpt-4o-mini';

        // Trace (visible in Workers logs)
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
          return json({ ok: false, error: `OpenAI error ${r.status}: ${errTxt}` }, 502, origin, allowed);
        }

        const data = (await r.json()) as {
          choices?: { message?: { content?: string } }[];
        };

        const content = data.choices?.[0]?.message?.content ?? '{}';
        return json({ ok: true, content }, 200, origin, allowed);
      } catch (e: any) {
        console.error('plan error', e?.stack || e);
        return json({ ok: false, error: String(e?.message || e) }, 500, origin, allowed);
      }
    }

    return json({ ok: false, error: 'Not Found' }, 404, origin, allowed);
  },
} satisfies ExportedHandler<Env>;

/* -------------------- JSON helper (with CORS) -------------------- */

function json(
  data: unknown,
  status = 200,
  origin: string | null = null,
  allowed = false
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowed),
    },
  });
}
