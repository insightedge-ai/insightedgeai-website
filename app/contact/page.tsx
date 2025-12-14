// app/contact/page.tsx
export const metadata = {
  title: "Contact – InsightEdge AI",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const sent = sp.sent === "1";

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">Contact</h1>
        <p className="mt-2 text-sm text-slate-300">
          Interested in a potential project, or want a technical deep dive on
          your current AI stack? Send a quick note and we&apos;ll get back to
          you.
        </p>

        {sent && (
          <p className="mt-4 rounded-xl border border-emerald-800 bg-emerald-900/30 p-3 text-sm text-emerald-200">
            Thanks — your message has been received. I usually respond within 24 hours.
          </p>
        )}
      </header>

      <form
        className="space-y-4 rounded-2xl border border-slate-800 p-4"
        //action="https://formspree.io/f/your-form-id" // replace later, or wire API route
        action="/api/contact"
        method="POST"
      >
        <div>
          <label className="block text-xs text-slate-300">
            Name
            <input
              type="text"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs text-slate-300">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs text-slate-300">
            Company / context
            <input
              type="text"
              name="company"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs text-slate-300">
            What would you like to explore?
            <textarea
              name="message"
              rows={4}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Send message
        </button>
      </form>
    </div>
  );
}

