// functions/api/[[route]].ts

// --- Minimal Cloudflare type shims for TS ---
interface D1Database {
  prepare(query: string): any;
}
interface PagesFunction<Env = unknown> {
  (context: {
    request: Request;
    env: Env;
    params: Record<string, string | string[]>;
    waitUntil: (promise: Promise<any>) => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    data: Record<string, unknown>;
  }): Promise<Response>;
}

// -----------------------------
// Environment
// -----------------------------
export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET: string;
  ASSETS: { fetch: typeof fetch };
}

// -----------------------------
// Main entry
// -----------------------------
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  // Simple router for /api/* paths
  if (url.pathname.startsWith("/api/")) {
    if (url.pathname === "/api/supporters" && request.method === "POST") {
      return await handleAddSupporter(request, env, waitUntil);
    }
    if (url.pathname === "/api/supporters" && request.method === "GET") {
      return await handleGetSupporters(env);
    }
    if (url.pathname === "/api/verify" && request.method === "GET") {
      return await handleVerifySupporter(request, env);
    }
    if (url.pathname === "/api/unsubscribe" && request.method === "GET") {
      return await handleUnsubscribe(request, env);
    }
    return new Response("Not found", { status: 404 });
  }

  // Serve static assets for everything else
  return env.ASSETS.fetch(request);
};

// -----------------------------
// Handler: Add supporter (POST)
// -----------------------------
async function handleAddSupporter(
  request: Request,
  env: Env,
  waitUntil: (promise: Promise<any>) => void
) {
  try {
    // Accept JSON or FormData
    const payload = await parseSupporterPayload(request);

    const name = (payload.name || "").trim();
    const email = (payload.email || "").trim();
    const company = (payload.company || "").trim();
    const role = (payload.role || "").trim();
    const subscribe = !!payload.subscribe;
    const turnstileToken =
      payload["cf-turnstile-response"] ||
      payload["turnstileToken"] ||
      payload["turnstile_token"] ||
      "";

    if (!name || !email || !company || !role) {
      return json({ error: "All fields are required" }, 400);
    }
    if (!turnstileToken) {
      return json({ error: "Missing Turnstile token" }, 400);
    }

    // Server-side Turnstile verification
    const remoteIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      undefined;

    const verify = await verifyTurnstile({
      secret: env.TURNSTILE_SECRET,
      response: turnstileToken,
      remoteip: remoteIp,
    });

    if (!verify.success) {
      return json(
        {
          error: "Turnstile verification failed",
          details: verify["error-codes"] || [],
        },
        400
      );
    }

    // Optional: hostname check
    const reqHost = new URL(request.url).hostname;
    if (verify.hostname && verify.hostname !== reqHost) {
      return json(
        {
          error: "Turnstile hostname mismatch",
          details: { expected: reqHost, got: verify.hostname },
        },
        400
      );
    }

    // Persist and email
    const token = crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO supporters (name, email, company, role, token, verified, subscribed)
       VALUES (?, ?, ?, ?, ?, 0, ?)`
    )
      .bind(name, email, company, role, token, subscribe ? 1 : 0)
      .run();

    // Fire-and-forget emails
    const origin = new URL(request.url).origin;
    const verificationLink = `${origin}/api/verify?token=${token}`;
    const unsubscribeLink = `${origin}/api/unsubscribe?token=${token}`;

    waitUntil(
      sendVerificationEmail(
        env.RESEND_API_KEY,
        email,
        name,
        verificationLink,
        unsubscribeLink
      )
    );
    waitUntil(
      sendAdminNotificationEmail(env.RESEND_API_KEY, {
        name,
        email,
        company,
        role,
      })
    );

    return json({ success: true }, 200);
  } catch (e: any) {
    console.error("Error adding supporter:", e?.message || e);
    if (e?.message?.includes("UNIQUE constraint failed")) {
      return json(
        {
          error:
            "This email address has already been used to sign the petition.",
        },
        409
      );
    }
    return json({ error: "Internal Server Error" }, 500);
  }
}

// -----------------------------
// Handler: Verify supporter (GET)
// -----------------------------
async function handleVerifySupporter(request: Request, env: Env) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) return new Response("Missing verification token.", { status: 400 });

  const result = await env.DB.prepare(
    `UPDATE supporters SET verified = 1 WHERE token = ? AND verified = 0`
  )
    .bind(token)
    .run();

  // Redirect to HashRouter route
  const successPageUrl = `${url.origin}/#/supporters`;

  if (result.success && result.meta.changes > 0) {
    return Response.redirect(successPageUrl, 302);
  } else {
    return Response.redirect(successPageUrl, 302);
  }
}

// -----------------------------
// Handler: Unsubscribe (GET)
// -----------------------------
async function handleUnsubscribe(request: Request, env: Env) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) return new Response("Missing token.", { status: 400 });

  await env.DB.prepare(`UPDATE supporters SET subscribed = 0 WHERE token = ?`)
    .bind(token)
    .run();

  return new Response(
    "You have been successfully unsubscribed from future updates.",
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}

// -----------------------------
// Handler: Get supporters (GET)
// -----------------------------
async function handleGetSupporters(env: Env) {
  try {
    const { results } = await env.DB.prepare(
      `SELECT name, company, role
       FROM supporters
       WHERE verified = 1
       ORDER BY id DESC`
    ).all();

    return json(results, 200);
  } catch (e: any) {
    console.error("Error fetching supporters:", e);
    return json({ error: "Internal Server Error" }, 500);
  }
}

// -----------------------------
// Turnstile verification helper
// -----------------------------
type TurnstileVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
};

async function verifyTurnstile(args: {
  secret: string;
  response: string;
  remoteip?: string;
}): Promise<TurnstileVerifyResponse> {
  const { secret, response, remoteip } = args;

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", response);
  if (remoteip) form.set("remoteip", remoteip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form }
  );

  if (!res.ok) {
    return { success: false, "error-codes": ["turnstile_http_" + res.status] };
  }

  const data = (await res.json()) as TurnstileVerifyResponse;
  return data;
}

// -----------------------------
// Payload parsing helper
// -----------------------------
async function parseSupporterPayload(
  request: Request
): Promise<Record<string, any>> {
  const ct = (request.headers.get("content-type") || "").toLowerCase();

  // JSON
  if (ct.includes("application/json")) {
    const body = (await request.json()) as Record<string, any>;
    return body || {};
  }

  // FormData (urlencoded or multipart)
  if (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    const entries = Object.fromEntries(form.entries());
    if (typeof entries.subscribe !== "undefined") {
      const v = String(entries.subscribe).toLowerCase();
      entries.subscribe = v === "true" || v === "1" || v === "on" || v === "yes";
    }
    return entries;
  }

  // Fallback: try JSON, else empty
  try {
    const body = (await request.json()) as Record<string, any>;
    return body || {};
  } catch {
    return {};
  }
}

// -----------------------------
// Email helpers (Resend)
// -----------------------------
async function sendVerificationEmail(
  apiKey: string,
  toEmail: string,
  toName: string,
  verificationLink: string,
  unsubscribeLink: string
) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #345d62; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h2 { margin: 0; }
        .content { padding: 30px 20px; }
        .footer { font-size: 0.8em; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Confirm your support</h2>
        </div>
        <div class="content">
          <p>Hi ${escapeHtml(toName)},</p>
          <p>Thank you for supporting the proposal to add the 'displaylocation' property to schema.org. Please click the button below to confirm your support and be publicly listed on the supporters page.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #ec4899; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to confirm your support</a>
          </p>
          <p>If you did not sign this petition, you can safely ignore this email.</p>
          <p>Thanks,<br/>The displaylocation.org Team</p>
        </div>
        <div class="footer">
          <p style="color: #999; line-height: 1.4; margin-bottom: 15px;">
            displaylocation.org is an initiative by the team of showroom.fm.<br>
            Showroom.fm is a service by Innsides Interiors UG (haftungsbeschränkt/limited liability company)<br>
            Lübecker Straße 26, 10559 Berlin, Germany, Entry in Commercial Register:<br>
            Register Number HRB 155994 B, Register Court District Court, Charlottenburg<br>
            Represented by Vasco Sommer-Nunes and Anne-Marie den Hertog.<br>
            Contact: <a href="mailto:hello@displaylocation.org" style="color: #999;">hello@displaylocation.org</a>
          </p>
          <p style="color: #999;">
            If you wish to unsubscribe from future updates, you can <a href="${unsubscribeLink}" style="color: #999;">do so here</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "hello@displaylocation.org", // ✅ use verified domain
      to: [toEmail],
      subject: "Confirm Your Support for displaylocation.org",
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    console.error("Failed to send email:", errorBody);
  }
}

async function sendAdminNotificationEmail(
  apiKey: string,
  supporter: { name: string; email: string; company: string; role: string }
) {
  const { name, email, company, role } = supporter;

  const emailHtml = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h3>New Supporter for displaylocation.org!</h3>
      <p>A new user has just signed the petition. Their submission has been saved to the database and a verification email has been sent to them.</p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Company:</strong> ${escapeHtml(company)}</li>
        <li><strong>Role:</strong> ${escapeHtml(role)}</li>
      </ul>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "hello@displaylocation.org", // ✅ use verified domain
      to: ["vasco@displaylocation.org"],
      subject: `New supporter: ${email}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    console.error("Failed to send admin notification email:", errorBody);
  }
}

// -----------------------------
// Small utilities
// -----------------------------
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return { status: res.status, text: await res.text().catch(() => "") };
  }
}
