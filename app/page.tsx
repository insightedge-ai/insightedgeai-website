// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="mt-4 flex flex-col gap-8 md:mt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            InsightEdge AI
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Automate high-value workflows with
            <span className="block text-cyan-300">
              Computer Vision, Edge AI & LLM Agents.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base text-slate-300">
            InsightEdge AI helps you design, deploy and maintain robust AI systems –
            from edge-optimized computer vision pipelines to LLM-powered assistants
            that understand your documents and automate your business workflows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore services
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Book a discovery call
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-sm text-slate-200 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Where we’re strongest
          </p>
          <ul className="mt-3 space-y-2">
            <li>• Edge computer vision on constrained devices</li>
            <li>• RAG copilots grounded in your private docs</li>
            <li>• High-performance inference on GPU/DSP/NPU</li>
            <li>• Evaluation, observability & continuous improvement</li>
          </ul>
        </div>
      </section>

      {/* Pillars */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">
          Three pillars of InsightEdge AI
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-cyan-300">
              AI Automation Agents
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Email triage, document extraction, knowledge Q/A, and workflow bots
              that plug into your existing tools and processes.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-cyan-300">
              Computer Vision & Edge AI
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Barcode/localizer pipelines, product recognition, and edge inference
              tuned for Jetson, SNPE, TFLite and ONNX Runtime.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-cyan-300">
              Strategy & Architecture
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Robust system design, model conversion pipelines, evaluation frameworks,
              and cloud+edge integration that scales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

