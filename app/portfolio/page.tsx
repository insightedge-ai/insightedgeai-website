// app/portfolio/page.tsx
type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

async function getRepos(): Promise<Repo[]> {
  const org = process.env.GITHUB_ORG ?? "InsightEdgeAI";
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/orgs/${org}/repos?per_page=20&sort=updated`,
    {
      headers,
      // revalidate every 10 minutes
      next: { revalidate: 600 },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch GitHub repos", await res.text());
    return [];
  }
  return res.json();
}

export const metadata = {
  title: "Portfolio – InsightEdge AI",
};

export default async function PortfolioPage() {
  const repos = await getRepos();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold md:text-3xl">Portfolio</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Selected demos and projects that showcase how InsightEdge AI approaches
          RAG, intelligent agents, and edge computer vision deployments.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-cyan-300">Highlighted demo</h2>
        <div className="rounded-2xl border border-slate-800 p-4">
          <h3 className="text-sm font-semibold">
            RAG Demo – PDF QA with FAISS + OpenAI
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            A Python/Flask retrieval-augmented generation pipeline that:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Loads and indexes PDFs</li>
            <li>Embeds documents into a FAISS vector store</li>
            <li>Retrieves top-k matches for each question</li>
            <li>Uses an LLM to answer questions grounded in the retrieved context</li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Built as a public showcase of InsightEdge AI&apos;s RAG and evaluation
            capabilities.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-cyan-300">
          GitHub projects ({repos.length})
        </h2>
        {repos.length === 0 && (
          <p className="text-sm text-slate-400">
            No repositories found yet, or the GitHub API rate limit was hit.
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-800 p-4 hover:border-cyan-400"
            >
              <h3 className="text-sm font-semibold group-hover:text-cyan-300">
                {repo.name}
              </h3>
              {repo.description && (
                <p className="mt-1 text-xs text-slate-300 line-clamp-3">
                  {repo.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{repo.language ?? "Various"}</span>
                <span>★ {repo.stargazers_count}</span>
                <span>
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

