import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* HERO */}
      <div className="bg-brand p-8 sm:p-12 rounded-lg shadow-lg">
        <div className="inline-flex items-center justify-center rounded-full bg-white/15 px-4 py-2 text-sm text-white">
          Published in schema.org v29.4 (Dec 2025)
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          displayLocation is now live in schema.org
        </h1>

        <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
          A simple, universal way to link a product, artwork, or artifact to the real-world place where it’s
          currently on display — so people and AI can answer: “Where can I experience this in person?”
        </p>

        {/* CTA STACK */}
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:items-center sm:space-y-0 sm:space-x-4">
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 min-h-12 rounded-xl border border-transparent text-base font-semibold text-white bg-accent hover:bg-accent-dark"
          >
            View schema.org property
          </a>

          <Link
            to="/proposal"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 min-h-12 rounded-xl border border-transparent text-base font-semibold text-brand-dark bg-white hover:bg-gray-50"
          >
            Implementation guide
          </Link>
        </div>

        {/* SMALL LINKS */}
        <div className="mt-6 text-sm text-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <Link to="/petition" className="underline underline-offset-4 hover:text-white">
            What changed?
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link to="/faq" className="underline underline-offset-4 hover:text-white">
            FAQ
          </Link>
        </div>
      </div>

      {/* BODY SECTIONS */}
      <div className="mt-16 text-left">
        <h2 className="text-3xl font-bold text-gray-900">What problem does this solve?</h2>
        <p className="mt-4 text-lg text-gray-700">
          The web could describe what things are (Product, CreativeWork) and where they’re sold — but not where they’re
          physically on display to view and experience. displayLocation fills that gap.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
            <h3 className="text-lg font-semibold text-gray-900">For consumers</h3>
            <p className="mt-2 text-gray-700">
              Find where you can see a specific item in person before making a decision — showrooms, galleries,
              museums, exhibitions.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
            <h3 className="text-lg font-semibold text-gray-900">For businesses & institutions</h3>
            <p className="mt-2 text-gray-700">
              Publish verifiable, location-specific “on display” information in a machine-readable format that AI
              systems can reference.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
            <h3 className="text-lg font-semibold text-gray-900">For search engines & AI</h3>
            <p className="mt-2 text-gray-700">
              A consistent way to connect items to real places — enabling better answers to “where can I experience
              this now?”
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
            <h3 className="text-lg font-semibold text-gray-900">For the open web</h3>
            <p className="mt-2 text-gray-700">
              A small standard addition that makes the physical world more discoverable — across industries, globally.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <a
            href="https://schema.org/displayLocation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark"
          >
            Open the schema definition
          </a>
          <Link
            to="/proposal"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-white text-brand-dark font-semibold border border-black/10 hover:bg-gray-50"
          >
            See implementation examples
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
