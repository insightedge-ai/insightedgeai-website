// app/about/page.tsx
export const metadata = {
  title: "About – InsightEdge AI",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">About</h1>
      </header>

      <section className="space-y-3 text-sm text-slate-300">
        <p>
          InsightEdge AI was founded by <strong>Amin Merati</strong>, a senior
          software engineer and computer vision specialist with extensive
          experience deploying AI systems at scale in production environments.
        </p>
        <p>
          The agency focuses on real-world constraints: limited compute at the
          edge, noisy data, and the need for reliable, observable systems that
          can evolve safely over time.
        </p>
        <p>
          We sit at the intersection of <span className="text-cyan-300">
            deep technical expertise
          </span>{" "}
          (C++, ONNX, CUDA, Kubernetes, SNPE, TFLite) and{" "}
          <span className="text-cyan-300">pragmatic business outcomes</span> –
          shipping solutions that your teams can operate and trust.
        </p>
      </section>
    </div>
  );
}

