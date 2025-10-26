import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-brand p-8 sm:p-12 rounded-lg shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A schema.org property for showrooms, galleries, and display locations.
        </h1>

        <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
          For businesses with showrooms and museums with galleries, current schema.org options are inadequate. We propose{' '}
          <code className="bg-brand-dark text-gray-100 px-2 py-1 rounded-md text-base font-mono">displaylocation</code>{' '}
          to clearly articulate where an item can be experienced.
        </p>

        {/* CTA stack: mobile-first spacing + large tap targets (iOS-safe) */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-center sm:gap-4">
          <Link
            to="/petition"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 min-h-12 rounded-xl border border-transparent text-base font-semibold text-white bg-accent hover:bg-accent-dark transition-colors"
          >
            Sign the Petition
          </Link>

          <Link
            to="/proposal"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 min-h-12 rounded-xl border border-transparent text-base font-semibold text-brand-dark bg-white hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900">Answering the Customer's Core Question</h2>
        <blockquote className="mt-4 text-3xl font-medium text-gray-700 italic">
          "Where can I try this today?"
        </blockquote>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          In today's digital-first world, this is the final step in many customer journeys. They've researched online; now
          they want to experience your products or art in person. Our proposal helps you provide a clear, immediate answer
          right where they're looking: on the search results page.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900">What is schema?</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Schema was introduced by Google, Microsoft, Yahoo and Yandex in order for search engines to understand webpages
          better. By adding small schemas to your website code, a search engine and AI can easier understand that a page is
          an article or a product or event page. Website owners can already tell search engines that a product is{' '}
          <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">instock</code> or{' '}
          <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">containedInPlace</code> but
          this does not mean that an item can be experienced. We propose to expand schema by a small extension, so that
          search engines can understand that an item can actually be experienced at a certain place.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900">Why this matters</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Whether you run a furniture showroom or curate a museum exhibit, it’s crucial that search engines understand the
          purpose of your locations. Clear data means better search results, managed customer expectations, and a more
          accurate representation of your physical presence on the web.
        </p>
      </div>

      <div className="mt-16">
        <p className="text-xl font-semibold text-gray-800">
          <Link to="/petition" className="text-brand hover:underline">
            Please sign the petition today.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
