import React from 'react';

type Supporter = {
  name: string;
  note?: string; // optional short descriptor (e.g., "Retailer", "Museum", "Agency", "Individual")
  url?: string;  // optional link
};

const supporters: Supporter[] = [
  // Add your supporters here. Examples:
  // { name: 'Example Museum', note: 'Museum', url: 'https://example.org' },
  // { name: 'Jane Doe', note: 'Individual' },
];

const SupportersPage: React.FC = () => {
  const hasSupporters = supporters.length > 0;

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

        {!hasSupporters ? (
          <div className="mt-4 rounded-xl border border-black/5 bg-background p-5">
            <p className="text-gray-700">
              This list is being curated. If you supported the initiative during the proposal phase and want to be
              included, please contact the project owner.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              (Tip: add supporters in <code className="px-1 py-0.5 rounded bg-black/5 font-mono">pages/SupportersPage.tsx</code>{' '}
              by editing the <code className="px-1 py-0.5 rounded bg-black/5 font-mono">supporters</code> array.)
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {supporters.map((s) => {
              const CardInner = (
                <div className="rounded-2xl bg-white p-5 shadow-sm border border-black/5 hover:border-black/10 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-gray-900">{s.name}</div>
                      {s.note ? (
                        <div className="mt-1 text-sm text-gray-600">{s.note}</div>
                      ) : null}
                    </div>
                    {s.url ? (
                      <span className="text-sm text-brand-dark underline underline-offset-4">
                        ↗
                      </span>
                    ) : null}
                  </div>
                </div>
              );

              return s.url ? (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                  aria-label={`Open ${s.name}`}
                >
                  {CardInner}
                </a>
              ) : (
                <div key={s.name}>{CardInner}</div>
              );
            })}
          </div>
        )}

        <hr className="my-10" />

        <h2 className="text-2xl font-bold text-gray-900">Thanks</h2>
        <p className="mt-3 text-gray-700">
          Special thanks to the schema.org community and everyone who contributed feedback and review during the
          public discussion process.
        </p>
      </div>
    </div>
  );
};

export default SupportersPage;
