import React from 'react';

const ProposalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-10">
        <div className="inline-flex items-center justify-center rounded-full bg-brand/10 px-4 py-2 text-sm text-brand-dark">
          Implementation guide
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          How to implement displayLocation
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          displayLocation links a <strong>Product</strong> or <strong>CreativeWork</strong> to the <strong>Place</strong>{' '}
          where it is currently on display — so search engines and AI assistants can answer “Where can I experience this
          in person?”
        </p>

        <div className="mt-8 rounded-xl border border-black/5 bg-background p-5">
          <h2 className="text-lg font-semibold text-gray-900">Canonical reference</h2>
          <p className="mt-2 text-gray-700">
            Always treat schema.org as the source of truth:
          </p>
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex underline underline-offset-4 text-brand-dark hover:text-brand"
          >
            https://schema.org/displayLocation
          </a>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Recommended pattern</h2>
        <p className="mt-3 text-gray-700">
          Use <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> to point to a{' '}
          <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">Place</code> (or a more specific subtype like{' '}
          <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">LocalBusiness</code>).
        </p>

        <h3 className="mt-8 text-xl font-semibold text-gray-900">Example A — Product on display in a showroom</h3>
        <div className="mt-3 rounded-xl bg-black text-white p-4 overflow-x-auto text-sm">
          <pre className="whitespace-pre">{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Example Chair",
  "displayLocation": {
    "@type": "FurnitureStore",
    "name": "Design Showroom Berlin",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Example Street 1",
      "addressLocality": "Berlin",
      "postalCode": "10115",
      "addressCountry": "DE"
    }
  }
}`}</pre>
        </div>

        <h3 className="mt-8 text-xl font-semibold text-gray-900">Example B — Artwork on display in a museum</h3>
        <div className="mt-3 rounded-xl bg-black text-white p-4 overflow-x-auto text-sm">
          <pre className="whitespace-pre">{`{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Example Painting",
  "creator": { "@type": "Person", "name": "Example Artist" },
  "displayLocation": {
    "@type": "Museum",
    "name": "Example Museum",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Amsterdam",
      "addressCountry": "NL"
    }
  }
}`}</pre>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">Practical tips</h2>
        <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
          <li>
            Prefer a stable identifier for the place (e.g., a canonical URL as <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">@id</code>).
          </li>
          <li>
            Keep the place data accurate: name + address + country are the basics.
          </li>
          <li>
            If the item moves between locations, update the markup promptly (or publish time-bounded info on your site/API).
          </li>
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-accent text-white font-semibold hover:bg-accent-dark"
          >
            Open schema.org displayLocation
          </a>
          <a
            href="/faq"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-white text-brand-dark font-semibold border border-black/10 hover:bg-gray-50"
          >
            FAQ
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
