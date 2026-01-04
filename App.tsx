import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import FaqPage from './pages/FaqPage';
import ImprintPage from './pages/ImprintPage';
import PetitionPage from './pages/PetitionPage';
import ProposalPage from './pages/ProposalPage';
import SupportersPage from './pages/SupportersPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Former petition page → now milestone / status page */}
            <Route path="/petition" element={<PetitionPage />} />

            {/* Proposal page → implementation guide */}
            <Route path="/proposal" element={<ProposalPage />} />

            <Route path="/supporters" element={<SupportersPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/imprint" element={<ImprintPage />} />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-10">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Page not found
                  </h1>
                  <p className="mt-2 text-gray-700">
                    The page you’re looking for doesn’t exist.
                  </p>
                  <a
                    href="/"
                    className="mt-6 inline-flex items-center justify-center px-6 min-h-12 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark"
                  >
                    Back to homepage
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        {/* FOOTER */}
<footer className="border-t border-black/5">
  <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
    <div>
      © {new Date().getFullYear()} displaylocation.org
      <span className="mx-2 text-gray-400">•</span>
      <span>
        an initiative by{" "}
        <a
          href="https://www.showroom.fm"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-dark hover:underline"
        >
          showroom.fm
        </a>
      </span>
    </div>

    <div className="flex gap-4">
      <a
        href="https://schema.org/displayLocation"
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
      >
        schema.org
      </a>
      <a href="/supporters" className="hover:underline">
        Supporters
      </a>
      <a href="/imprint" className="hover:underline">
        Imprint
      </a>
    </div>
  </div>
</footer>

      </div>
    </Router>
  );
};

export default App;
