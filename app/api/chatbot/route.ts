export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = (body?.question ?? "").toString().trim();
  const top_k = body?.top_k;

  if (!question) {
    return Response.json({ error: "missing_question" }, { status: 400 });
  }

  const backend = process.env.RAG_BACKEND_URL;
  const key = process.env.RAG_WIDGET_KEY;

  if (!backend || !key) {
    return Response.json({ error: "server_misconfigured" }, { status: 500 });
  }

  const r = await fetch(`${backend.replace(/\/$/, "")}/widget/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Widget-Key": key,
      // forward origin optionally
    },
    body: JSON.stringify({ question, top_k }),
  });

  const text = await r.text();
  return new Response(text, {
    status: r.status,
    headers: { "Content-Type": r.headers.get("content-type") ?? "application/json" },
  });
}

