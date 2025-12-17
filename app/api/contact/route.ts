import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const form = await req.formData();

  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const company = String(form.get("company") ?? "");
  const message = String(form.get("message") ?? "");
  const createdAt = new Date().toISOString();

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is missing");
    return NextResponse.redirect(new URL("/contact?sent=0", req.url), 303);
  }
  if (!process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    console.error("[contact] CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL is missing");
    return NextResponse.redirect(new URL("/contact?sent=0", req.url), 303);
  }

  console.log("[contact] submission:", { name, email, company, message, createdAt });

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1) Notify you
    const notify = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      subject: `[InsightEdge AI] New inquiry from ${name}`,
      replyTo: email,
      text:
        `New contact form submission\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company}\n` +
        `Time: ${createdAt}\n\n` +
        `Message:\n${message}\n`,
    });

    if (notify.error) {
      console.error("[contact] notify failed:", notify.error);
      return NextResponse.redirect(new URL("/contact?sent=0", req.url), 303);
    }
    console.log("[contact] notify ok:", notify.data?.id);

    // 2) Auto-reply to client
    const autoreply = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [email],
      subject: "Thanks — we received your message (InsightEdge AI)",
      text:
        `Hi ${name},\n\n` +
        `Thanks for reaching out — I’ve received your message and will respond within 24 hours.\n\n` +
        `Best,\nAmin\nInsightEdge AI\n`,
    });

    if (autoreply.error) {
      // This is expected in Resend testing mode until you verify a domain
      console.warn("[contact] autoreply failed:", autoreply.error);
      return NextResponse.redirect(new URL("/contact?sent=1&reply=0", req.url), 303);
    }
    console.log("[contact] autoreply ok:", autoreply.data?.id);

    return NextResponse.redirect(new URL("/contact?sent=1&reply=1", req.url), 303);
  } catch (err: any) {
    console.error("[contact] resend exception:", err?.message ?? err, err);
    return NextResponse.redirect(new URL("/contact?sent=0", req.url), 303);
  }
}