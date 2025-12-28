// functions/api/[[route]].ts
//
// Cloudflare Pages Function (catch-all) for /api/*
// - POST /api/supporters   -> stores a supporter submission in D1 (petition-db)
// - GET  /api/supporters   -> returns PUBLIC supporter list (NO email, NO token)
// - everything else        -> falls back to static asset serving
//
// IMPORTANT PRIVACY:
// The GET endpoint intentionally NEVER returns email or token.

///////////////////////////////
// Minimal Cloudflare TS shims
///////////////////////////////

interface D1Result<T = unknown> {
  results?: T[];
  success?: boolean;
  error?: string;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<{ success?: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface Env {
  // D1 binding (Cloudflare Pages -> Settings -> Functions -> D1 bindings)
  // Variable name must be "DB" and point to your "petition-db"
  DB: D1Database;

  // Optional: used only if you still accept submissions or want confirmation email
  RESEND_API_KEY?: string;

  // Optional: used if you still protect POST with Turnstile
  TURNSTILE_SECRET?: string;

  // Pages asset handler (provided by Pages runtime)
  ASSETS: { fetch: typeof fetch };
}

type PagesFunction<EnvT = unknown> = (context: {
  request: Request;
  env: EnvT;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}) => Promise<Response>;

///////////////////////////////
// Helpers
///////////////////////////////

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // keep responses cacheable only when explicitly set by caller
      ...((init?.headers as Record<string, string>) || {}),
    },
    ...init,
  });
}

function badRequest(message: string) {
  return json({ ok: false, error: message }, { status: 400 });
}

function methodNotAllowed() {
  return json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
}

function normalizeString(value: unknown, maxLen: number) {
  const s = (typeof value === "string" ? value : "").trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

async function verifyTurnstileIfConfigured(request: Request, env: Env) {
  // If no secret is configured, skip verification.
  if (!env.TURNSTILE_SECRET) return { ok: true as const };

  // token can come from form field "cf-turnstile-response" (standard) or "turnstileToken"
  const contentType = request.headers.get("content-type") || "";
  let token = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as any;
    token =
      normalizeString(body["cf-turnstile-response"], 5000) ||
      normalizeString(body["turnstileToken"], 5000);
  } else {
    const form = await request.formData().catch(() => null);
    token =
      normalizeString(form?.get("cf-turnstile-response"), 5000) ||
      normalizeString(form?.get("turnstileToken"), 5000);
  }

  if (!token) return { ok: false as const, error: "Missing Turnstile token" };

  // Cloudflare Turnstile siteverify
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });

  const data = (await resp.json().catch(() => ({}))) as any;
  if (data?.success) return { ok: true as const };
  return { ok: false as const, error: "Turnstile verification failed" };
}

async function sendEmailIfConfigured(env: Env, toEmail: string, subject: string, html: string) {
  // Optional – only if you kept RESEND integration.
  if (!env.RESEND_API_KEY) return;

  // Keep it minimal and resilient. If Resend fails, we don't fail the whole request.
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // If you have a verified sender domain, set it here.
        // This is a safe default pattern; change to your actual sender when needed.
        from: "displaylocation.org <no-reply@displaylocation.org>",
        to: [toEmail],
        subject,
        html,
      }),
    });
  } catch {
    // intentionally ignore
  }
}

///////////////////////////////
// Handlers
///////////////////////////////

async function handleGetSupporters(env: Env): Promise<Response> {
  // PUBLIC LIST (privacy-safe): name/company/role only.
  const stmt = env.DB.prepare(`
    SELECT id, name, company, role
    FROM supporters
    WHERE name IS NOT NULL AND TRIM(name) <> ''
    ORDER BY id ASC
  `);

  const result = await stmt.all<{ id: number; name: string; company?: string | null; role?: string | null }>();

  return json(
    {
      updatedAt: new Date().toISOString(),
      count: result?.results?.length ?? 0,
      supporters: result?.results ?? [],
    },
    {
      status: 200,
      headers: {
        "cache-control": "public, max-age=300",
      },
    }
  );
}

async function handleAddSupporter(request: Request, env: Env, waitUntil: (p: Promise<any>) => void): Promise<Response> {
  // If Turnstile is configured, enforce it for POST
  const ts = await verifyTurnstileIfConfigured(request, env);
  if (!ts.ok) return badRequest(ts.error);

  const contentType = request.headers.get("content-type") || "";
  let payload: any = {};

  if (contentType.includes("application/json")) {
    payload = await request.json().catch(() => ({}));
  } else {
    const form = await request.formData().catch(() => null);
    payload = {
      name: form?.get("name"),
      email: form?.get("email"),
      company: form?.get("company"),
      role: form?.get("role"),
    };
  }

  const name = normalizeString(payload.name, 120);
  const email = normalizeString(payload.email, 254);
  const company = normalizeString(payload.company, 180);
  const role = normalizeString(payload.role, 120);

  if (!name) return badRequest("Name is required.");
  if (!email) return badRequest("Email is required."); // stored privately; never exposed publicly

  const token = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).toString();

  // Insert into D1 (table columns based on your screenshot: id, name, email, company, role, token)
  await env.DB.prepare(
    `
    INSERT INTO supporters (name, email, company, role, token)
    VALUES (?, ?, ?, ?, ?)
  `
  )
    .bind(name, email, company || null, role || null, token)
    .run();

  // Optional confirmation email
  waitUntil(
    sendEmailIfConfigured(
      env,
      email,
      "Thank you for supporting displayLocation",
      `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.4">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for supporting <strong>displayLocation</strong>.</p>
          <p>Your acknowledgement will appear on displaylocation.org (emails are never published).</p>
          <p>— displaylocation.org</p>
        </div>
      `
    )
  );

  return json({ ok: true }, { status: 200 });
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

///////////////////////////////
// Main entry
///////////////////////////////

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  // Only handle /api/* here. Otherwise serve your static site assets.
  if (!url.pathname.startsWith("/api/")) {
    return env.ASSETS.fetch(request);
  }

  // Route: /api/supporters
  if (url.pathname === "/api/supporters") {
    if (request.method === "GET") return await handleGetSupporters(env);
    if (request.method === "POST") return await handleAddSupporter(request, env, waitUntil);
    return methodNotAllowed();
  }

  // Unknown API route
  return json({ ok: false, error: "Not found" }, { status: 404 });
};
