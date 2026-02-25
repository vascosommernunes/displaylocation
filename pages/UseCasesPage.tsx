import React from 'react';
import { Link } from 'react-router-dom';

const UseCasesPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-10">

        {/* HEADER */}
        <div className="inline-flex items-center justify-center rounded-full bg-brand/10 px-4 py-2 text-sm text-brand-dark">
          Use cases
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Where it helps
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-base">LocalBusiness</code> schema — combined
          with name, address, and opening hours — is the established standard for describing a store or institution's
          existence and location. What it doesn't capture is whether a specific product is physically present and
          available to experience at that location. <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-base">displayLocation</code> adds
          that link. It is specifically relevant for businesses where physical access to a product is part of the
          offering — something e-commerce, by its nature, cannot provide.
        </p>

        {/* DIVIDER */}
        <hr className="mt-10 border-black/5" />

        {/* SECTION 1 — RETAIL */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Brick-and-mortar retail and displayLocation
          </h2>

          <p className="mt-4 text-gray-700">
            Physical retail offers something e-commerce cannot: the ability to experience a product in person before
            purchasing. For furniture, cars, appliances, or luxury goods, this is frequently a factor in the purchasing
            decision. This is not currently represented in standard structured data. A store's website may list
            products, but nothing in the markup signals to search engines or AI assistants:{' '}
            <em>this item is physically here and available to experience.</em>
          </p>

          <p className="mt-4 text-gray-700">
            <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> makes this
            machine-readable. A product page marked up with{' '}
            <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> provides a
            structured, verifiable answer to queries such as:{' '}
            <em>"Where can I experience this in person?"</em>
          </p>

          {/* USE CASE TILES */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Furniture & interior design showrooms' },
              { label: 'Car dealerships — specific models on the floor' },
              { label: 'Appliance & electronics demo floors' },
              { label: 'Luxury goods — watches, jewellery' },
              { label: 'Outdoor & sporting equipment' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-black/5 bg-background px-4 py-3 text-sm text-gray-700"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <hr className="mt-10 border-black/5" />

        {/* SECTION 2 — CULTURAL INSTITUTIONS */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Cultural institutions
          </h2>

          <p className="mt-4 text-gray-700">
            Temporary exhibitions are well covered by{' '}
            <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">ExhibitionEvent</code>, which captures
            the event, its dates, location, and linked works. That schema type covers this case well.
          </p>

          <p className="mt-4 text-gray-700">
            <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> is useful for a
            narrower but distinct situation: permanent collection items — an artwork or object that resides in a
            specific gallery on an ongoing basis, not tied to any particular exhibition. Modelling a permanently
            displayed work as an{' '}
            <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">ExhibitionEvent</code> is semantically
            imprecise. <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> is
            the more accurate model for a stable, ongoing display relationship.
          </p>
        </div>

        {/* DIVIDER */}
        <hr className="mt-10 border-black/5" />

        {/* CLOSING CTA */}
        <div className="mt-10">
          <p className="text-gray-700">
            For markup details and implementation examples, see the{' '}
            <Link to="/proposal" className="font-medium text-brand hover:underline underline-offset-4">
              implementation guide
            </Link>
            {' '}or the canonical reference at{' '}
            <a
              href="https://schema.org/displayLocation"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand hover:underline underline-offset-4"
            >
              schema.org/displayLocation
            </a>
            .
          </p>
        </div>

      </div>
    </div>
  );
};

export default UseCasesPage;
