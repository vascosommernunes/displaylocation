import React from 'react';

const PetitionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-10">
        <div className="inline-flex items-center justify-center rounded-full bg-brand/10 px-4 py-2 text-sm text-brand-dark">
          Status update
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          The petition phase is over — displayLocation is published
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          displayLocation is now part of schema.org (v29.4, December 2025). This page remains online to preserve older
          links and document the milestone.
        </p>

        <div className="mt-8 rounded-xl bg-background p-5 border border-black/5">
          <h2 className="text-lg font-semibold text-gray-900">What you should do now</h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>
              Use the official property page on schema.org as the canonical reference.
            </li>
            <li>
              Implement <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-sm">displayLocation</code> in your
              JSON-LD where it makes sense (products, artworks, artifacts).
            </li>
            <li>
              Share implementation examples with your ecosystem (retailers, museums, agencies, platforms).
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-accent text-white font-semibold hover:bg-accent-dark"
          >
            View schema.org displayLocation
          </a>

          <a
            href="/proposal"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-white text-brand-dark font-semibold border border-black/10 hover:bg-gray-50"
          >
            Read implementation guide
          </a>
        </div>

        <hr className="my-10" />

        <h2 className="text-2xl font-bold text-gray-900">Why this matters</h2>
        <p className="mt-3 text-gray-700">
          Many buying decisions and cultural experiences happen in physical spaces. When structured data can’t express
          “this is on display here”, people lose time, institutions lose foot traffic, and AI systems can’t answer the
          most human question: where can I see it in real life?
        </p>

        <p className="mt-4 text-gray-700">
          displayLocation was proposed by <a
            href="https://www.showroom.fm"
            target="_blank"
            rel="noreferrer"
                      >
            showroom.fm
          </a> in October 2025, reviewed and iterated by the community and published in December 2025. It is a small addition with big consequences: it allows the open web to point to reality in a
          consistent, machine-readable way.
        </p>


        
      </div>
    </div>
  );
};

export default PetitionPage;
