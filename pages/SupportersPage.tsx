import React, { useEffect, useState } from "react";

type Supporter = {
  id: number;
  name: string;
  company?: string | null;
  role?: string | null;
};

type ApiResponse = {
  updatedAt: string;
  count: number;
  supporters: Supporter[];
};

const SupportersPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // cache: "no-store" avoids edge/browser caching during rollout
        const res = await fetch("/api/supporters", {
          headers: { accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ApiResponse;

        if (!cancelled) {
          setData(json);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const supporters = data?.supporters ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-10">
        <div className="inline-flex items-center justify-center rounded-full bg-brand/10 px-4 py-2 text-sm text-brand-dark">
          Acknowledgements
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Supporters of displayLocation
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          During the proposal phase, individuals and organizations helped validate the need for a standard way to express
          where an item is physically on display. Now that <strong>displayLocation</strong> is published in schema.org
          (v29.4, Dec 2025), this page remains as a permanent acknowledgement.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-accent text-white font-semibold hover:bg-accent-dark"
          >
            View schema.org property
          </a>

          <a
            href="/proposal"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-white text-brand-dark font-semibold border border-black/10 hover:bg-gray-50"
          >
            Implementation guide
          </a>
        </div>

        <hr className="my-10" />

        <h2 className="text-2xl font-bold text-gray-900">Supporters</h2>

        {status === "loading" && (
          <div className="mt-4 rounded-xl border border-black/5 bg-background p-5 text-gray-700">
            Loading supporters…
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-xl border border-black/5 bg-background p-5 text-gray-700">
            Supporters could not be loaded right now.
            <div className="mt-2 text-sm text-gray-600">
              The endpoint <code className="px-1 py-0.5 rounded bg-black/5 font-mono">/api/supporters</code> should return JSON.
            </div>
          </div>
        )}

        {status === "ok" && supporters.length === 0 && (
          <div className="mt-4 rounded-xl border border-black/5 bg-background p-5 text-gray-700">
            No supporters found.
          </div>
        )}

        {status === "ok" && supporters.length > 0 && (
          <>
            <div className="mt-4 text-sm text-gray-600">
              {data?.count} supporter{data?.count === 1 ? "" : "s"} acknowledged.
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {supporters.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl bg-white p-5 shadow-sm border border-black/5"
                >
                  <div className="text-base font-semibold text-gray-900">
                    {s.name}
                  </div>

                  {(s.role || s.company) && (
                    <div className="mt-2 text-sm text-gray-700">
                      {s.role ? (
                        <span className="font-medium">{s.role}</span>
                      ) : null}
                      {s.role && s.company ? (
                        <span className="text-gray-400"> • </span>
                      ) : null}
                      {s.company ? <span>{s.company}</span> : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <hr className="my-10" />

        <h2 className="text-2xl font-bold text-gray-900">Thanks</h2>
        <p className="mt-3 text-gray-700">
          Thank you to everyone who supported the proposal and took the time to contribute feedback.
          Special thanks to the schema.org community and reviewers who helped bring displayLocation into the standard.
        </p>

        <p className="mt-4 text-sm text-gray-600">
          Privacy note: this page intentionally publishes only acknowledgement fields (name, role, company).
          Emails and internal tokens are never exposed.
        </p>
      </div>
    </div>
  );
};

export default SupportersPage;
