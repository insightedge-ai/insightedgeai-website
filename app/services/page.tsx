// app/services/page.tsx
export const metadata = {
  title: "Services – InsightEdge AI",
};

export default function ServicesPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">Services</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          We help you design and deploy AI systems that survive the real world:
          noisy data, constrained devices and evolving requirements.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cyan-300">
          AI Automation Agents
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            title="Document & PDF extraction"
            items={[
              "Turn PDFs into structured data",
              "Entity extraction tuned to your domain",
              "RAG-ready document stores",
            ]}
          />
          <ServiceCard
            title="Email & inbox agents"
            items={[
              "Triage & auto-draft replies",
              "Summaries for busy teams",
              "Integrations with Gmail/Outlook/Helpdesk",
            ]}
          />
          <ServiceCard
            title="Business workflow bots"
            items={[
              "Multi-step agents with guardrails",
              "Integrations via APIs, webhooks & Zapier/Make",
              "Monitoring & human-in-the-loop flows",
            ]}
          />
          <ServiceCard
            title="RAG Q/A systems"
            items={[
              "Architecture & retrieval strategy",
              "Evaluation and hallucination reduction",
              "Deployment and observability",
            ]}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cyan-300">
          Computer Vision & Edge AI
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            title="Object detection & tracking"
            items={[
              "Custom detectors for your products or assets",
              "Model optimization and pruning",
              "Evaluation pipelines with real-world metrics",
            ]}
          />
          <ServiceCard
            title="Edge inference pipelines"
            items={[
              "ONNX Runtime, TensorRT, TFLite, SNPE",
              "Jetson, Qualcomm, ARM SoCs",
              "Robust image pre/post-processing",
            ]}
          />
          <ServiceCard
            title="DSP/NPU/GPU deployment"
            items={[
              "Quantization-aware training and conversion",
              "Hardware-specific optimization",
              "CI/CD for models across devices",
            ]}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cyan-300">
          AI Strategy & Consulting
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ServiceCard
            title="Architecture reviews"
            items={[
              "Design reviews for AI systems",
              "Scalability and reliability assessments",
              "Security and privacy considerations",
            ]}
          />
          <ServiceCard
            title="Model conversion pipelines"
            items={[
              "PyTorch/TF to ONNX/TFLite/SNPE",
              "Repeatable conversion scripts",
              "Automated checks and regression tests",
            ]}
          />
          <ServiceCard
            title="Evaluation frameworks"
            items={[
              "Metric definitions aligned to business goals",
              "Dataset curation and versioning",
              "Continuous evaluation in CI",
            ]}
          />
          <ServiceCard
            title="Cloud + Edge integration"
            items={[
              "Hybrid architectures",
              "Data flows from devices to cloud",
              "Monitoring & feedback loops",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

