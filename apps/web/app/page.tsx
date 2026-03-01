const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getHealth() {
  try {
    const res = await fetch(`${apiBase}/health`, { cache: "no-store" });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main>
      <section className="card">
        <h1>Project Pwner</h1>
        <p>W3 integration is in progress. This preview is now live (no more 404).</p>
        <p>
          API health: <strong>{health.ok ? "online" : "offline"}</strong>
        </p>
        <small>
          NEXT_PUBLIC_API_BASE_URL: {apiBase} • status: {health.status}
        </small>
      </section>
    </main>
  );
}
