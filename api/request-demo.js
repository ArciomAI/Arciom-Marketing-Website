// This tells browsers which website is allowed to use this form.
const ALLOWED_WEBSITE = "https://www.arciom.com";

// This address uses your verified Resend domain.
const FROM_EMAIL = "Arciom Website <website@arciom.com>";

// Demo requests will be delivered here.
const TO_EMAIL = "ryan@arciom.com";

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function corsHeaders(request) {
  const origin = request.headers.get("origin");

  return {
    "Access-Control-Allow-Origin":
      origin === ALLOWED_WEBSITE ? origin : ALLOWED_WEBSITE,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request) {
  const headers = corsHeaders(request);

  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== ALLOWED_WEBSITE) {
      return Response.json(
        { error: "This website is not allowed to use the form." },
        { status: 403, headers }
      );
    }

    const form = await request.json();

    const name = clean(form.name);
    const email = clean(form.email);
    const company = clean(form.company);
    const phone = clean(form.phone);
    const message = clean(form.message);

    if (!name || !email) {
      return Response.json(
        { error: "Name and email are required." },
        { status: 400, headers }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New demo request from ${name}`,
        html: `
          <h2>New Website Demo Request</h2>

          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>

          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message || "No message provided").replaceAll("\n", "<br>")}</p>
        `,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendResult);

      return Response.json(
        { error: "The email could not be sent." },
        { status: 500, headers }
      );
    }

    return Response.json(
      { success: true, message: "Your demo request was sent." },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Request error:", error);

    return Response.json(
      { error: "Something went wrong while sending the request." },
      { status: 500, headers }
    );
  }
}
