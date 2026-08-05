import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: ContactPayload = await req.json();

    // Basic spam protection: reject if message is too short or looks like spam
    if (!payload.message || payload.message.length < 5) {
      return new Response(JSON.stringify({ error: "Message too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build email content
    const subject = `New Contact Form Submission from ${payload.name}`;
    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.company ? `Company: ${payload.company}` : null,
      payload.service ? `Service: ${payload.service}` : null,
      payload.budget ? `Budget: ${payload.budget}` : null,
      payload.timeline ? `Timeline: ${payload.timeline}` : null,
      "",
      "Message:",
      payload.message,
    ].filter(Boolean).join("\n");

    // Send email via Resend (if RESEND_API_KEY is configured)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL") ?? "lafazy@lafazystudio.com";

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Lafazy Studio <noreply@lafazystudio.com>",
          to: [notifyEmail],
          subject,
          text: body,
          reply_to: payload.email,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Resend error:", errText);
      }
    } else {
      console.log("Email notification (no RESEND_API_KEY configured):", subject);
      console.log(body);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
