// functions/api/[[route]].ts

// This is a workaround for TypeScript environments that don't have Cloudflare's
// specific types available globally. We define them here to ensure the code type-checks.
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


// Define the environment variables that our worker will need
export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  // This variable is auto-injected by Pages Functions and used to serve static assets
  ASSETS: { fetch: typeof fetch };
}

// Main function to handle all incoming requests
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  // Use a simple router to handle different API paths
  // If the path starts with /api/, handle it with our API logic
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/supporters' && request.method === 'POST') {
      return await handleAddSupporter(request, env, waitUntil);
    }
    if (url.pathname === '/api/supporters' && request.method === 'GET') {
      return await handleGetSupporters(env);
    }
    if (url.pathname === '/api/verify' && request.method === 'GET') {
      return await handleVerifySupporter(request, env);
    }
    if (url.pathname === '/api/unsubscribe' && request.method === 'GET') {
      return await handleUnsubscribe(request, env);
    }
    // If it's an unknown API route, return 404
    return new Response('Not found', { status: 404 });
  }

  // For any other path that is not an API call, serve the static assets of your website
  return env.ASSETS.fetch(request);
};

// --- Handler Functions ---

/**
 * Handles adding a new supporter from the petition form.
 */
async function handleAddSupporter(request: Request, env: Env, waitUntil: (promise: Promise<any>) => void) {
  try {
    // The standard `request.json()` method does not accept a generic type argument.
    // The correct approach is to await the result and then cast it to the desired type.
    const { name, email, company, role, subscribe } = (await request.json()) as {
      name: string;
      email: string;
      company: string;
      role: string;
      subscribe: boolean;
    };

    if (!name || !email || !company || !role) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const token = crypto.randomUUID();

    // Insert the new supporter into the D1 database as "unverified"
    await env.DB.prepare(
      `INSERT INTO supporters (name, email, company, role, token, verified, subscribed) VALUES (?, ?, ?, ?, ?, 0, ?)`
    ).bind(name, email, company, role, token, subscribe ? 1 : 0).run();
    
    // Send the verification email using Resend
    const origin = new URL(request.url).origin;
    const verificationLink = `${origin}/api/verify?token=${token}`;
    const unsubscribeLink = `${origin}/api/unsubscribe?token=${token}`;
    
    // Use waitUntil to send emails in the background without blocking the response to the user
    waitUntil(sendVerificationEmail(env.RESEND_API_KEY, email, name, verificationLink, unsubscribeLink));
    waitUntil(sendAdminNotificationEmail(env.RESEND_API_KEY, { name, email, company, role }));

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e: any) {
    console.error("Error adding supporter:", e.message);
    // In case of a UNIQUE constraint error (email already exists)
    if (e.message?.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'This email address has already been used to sign the petition.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

/**
 * Handles verifying a supporter's email via the link they click.
 */
async function handleVerifySupporter(request: Request, env: Env) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Missing verification token.', { status: 400 });
  }

  // Find the supporter by their token and update their status to "verified"
  const result = await env.DB.prepare(
    `UPDATE supporters SET verified = 1 WHERE token = ? AND verified = 0`
  ).bind(token).run();

  // Redirect to the supporters page in the HashRouter format
  const successPageUrl = `${url.origin}/#/supporters`; 

  if (result.success && result.meta.changes > 0) {
    // Successful verification, redirect to the supporters page
    return Response.redirect(successPageUrl, 302);
  } else {
    // Token was invalid, already used, or something went wrong. Redirecting is still better UX.
    return Response.redirect(successPageUrl, 302);
  }
}

/**
 * Handles a user's request to unsubscribe from the mailing list.
 */
async function handleUnsubscribe(request: Request, env: Env) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Missing token.', { status: 400 });
  }

  // Update the supporter's status to not be subscribed
  await env.DB.prepare(
    `UPDATE supporters SET subscribed = 0 WHERE token = ?`
  ).bind(token).run();

  // Return a simple confirmation message to the user
  return new Response('You have been successfully unsubscribed from future updates.', {
    headers: { 'Content-Type': 'text/html' },
  });
}


/**
 * Handles fetching the list of verified supporters for the public page.
 */
async function handleGetSupporters(env: Env) {
  try {
    const { results } = await env.DB.prepare(
      // Only select verified supporters and don't return sensitive info
      `SELECT name, company, role FROM supporters WHERE verified = 1 ORDER BY id DESC`
    ).all();

    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error("Error fetching supporters:", e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// --- Email Helper ---

/**
 * Sends the verification email using the Resend API.
 */
async function sendVerificationEmail(apiKey: string, toEmail: string, toName: string, verificationLink: string, unsubscribeLink: string) {
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
        .footer { font-size: 0.8em; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Confirm your support</h2>
        </div>
        <div class="content">
          <p>Hi ${toName},</p>
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

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'hello@displaylocation.org',
      to: [toEmail],
      subject: 'Confirm Your Support for displaylocation.org',
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('Failed to send email:', errorBody);
    // Even if email fails, we don't want to block the user. The submission is saved.
    // In a production app, you might add retry logic or monitoring here.
  }
}

/**
 * Sends a notification email to the admin for a new supporter.
 */
async function sendAdminNotificationEmail(apiKey: string, supporter: {name: string, email: string, company: string, role: string}) {
  const { name, email, company, role } = supporter;

  const emailHtml = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h3>New Supporter for displaylocation.org!</h3>
      <p>A new user has just signed the petition. Their submission has been saved to the database and a verification email has been sent to them.</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Company:</strong> ${company}</li>
        <li><strong>Role:</strong> ${role}</li>
      </ul>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'hello@displaylocation.org',
      to: ['vasco@displaylocation.org'],
      subject: `New supporter: ${email}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('Failed to send admin notification email:', errorBody);
    // This is a non-critical email, so we just log the error and move on.
  }
}