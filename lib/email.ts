/**
 * AXIOM server-side email sender (Resend-compatible)
 * The API key is ONLY used server-side — never exposed to the client.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? process.env.EMAIL_API_KEY ?? "";
const FROM_EMAIL = "AXIOM Logic <noreply@axiomlogic.com>";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("[AXIOM Email] No API key set — email not sent:", payload.subject);
    return { ok: false, error: "Email API key not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[AXIOM Email] Send failed:", body);
      return { ok: false, error: body };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[AXIOM Email] Exception:", msg);
    return { ok: false, error: msg };
  }
}

// ── Email templates ──────────────────────────────────────────────────────────

function axiomEmailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AXIOM Logic</title>
</head>
<body style="margin:0;padding:0;background:#0F172A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0F172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;color:#2563EB;font-family:monospace;text-transform:uppercase;">AXIOM LOGIC</div>
              <div style="font-size:10px;color:#475569;font-family:monospace;letter-spacing:0.08em;margin-top:2px;text-transform:uppercase;">Intelligent Automation Infrastructure</div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:11px;color:#475569;font-family:monospace;">
                © ${new Date().getFullYear()} AXIOM Logic Inc. • Secure Private Communication<br/>
                If you did not expect this email, you may safely disregard it.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendInvitationEmail(to: string, name: string, inviteUrl: string) {
  return sendEmail({
    to,
    subject: "Your private AXIOM connection is ready",
    html: axiomEmailWrapper(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F8FAFC;letter-spacing:-0.02em;">Your AXIOM connection is ready.</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6;">Hello ${name},<br/><br/>Your private AXIOM workspace has been created. You can now securely access your 1-to-1 connection with the AXIOM team.</p>
      <a href="${inviteUrl}" style="display:inline-block;background:#2563EB;color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">Access AXIOM →</a>
      <p style="margin:24px 0 0;font-size:12px;color:#475569;font-family:monospace;">Account: ${to}</p>
    `),
    text: `Your private AXIOM connection is ready.\n\nHello ${name},\n\nAccess your AXIOM workspace: ${inviteUrl}\n\nAccount: ${to}`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    subject: "Reset your AXIOM password",
    html: axiomEmailWrapper(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F8FAFC;">Password reset requested.</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6;">We received a request to reset the password for your AXIOM account. Click the link below to set a new password. This link expires in 60 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#2563EB;color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password →</a>
      <p style="margin:24px 0 0;font-size:12px;color:#475569;font-family:monospace;">If you did not request this, your account remains secure.</p>
    `),
    text: `Reset your AXIOM password:\n${resetUrl}\n\nThis link expires in 60 minutes.`,
  });
}

export async function sendBookingConfirmationEmail(to: string, name: string, date: string, time: string) {
  return sendEmail({
    to,
    subject: "AXIOM Architecture Review — Confirmed",
    html: axiomEmailWrapper(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F8FAFC;">Your session is confirmed.</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#94A3B8;line-height:1.6;">Hello ${name},<br/><br/>Your AXIOM Architecture Review has been scheduled.</p>
      <div style="background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:12px;font-family:monospace;color:#2563EB;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">SCHEDULED SESSION</div>
        <div style="font-size:16px;font-weight:600;color:#F8FAFC;">${date} · ${time}</div>
      </div>
      <p style="margin:0;font-size:13px;color:#475569;font-family:monospace;">An AXIOM specialist will reach out shortly with meeting details.</p>
    `),
    text: `Your AXIOM Architecture Review is confirmed.\n\n${date} · ${time}\n\nAn AXIOM specialist will reach out shortly.`,
  });
}
