import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import FaqPage from './pages/FaqPage';
import ImprintPage from './pages/ImprintPage';
import PetitionPage from './pages/PetitionPage';
import ProposalPage from './pages/ProposalPage';
import SupportersPage from './pages/SupportersPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* HEADER */}
        <header className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="font-extrabold text-brand-dark tracking-tight"
            >
              displaylocation.org
            </a>

            <nav className="text-sm flex gap-5">
              <a
                href="/proposal"
                className="text-brand-dark hover:text-brand underline-offset-4 hover:underline"
              >
                Implementation
              </a>
              <a
                href="/supporters"
                className="text-brand-dark hover:text-brand underline-offset-4 hover:underline"
              >
                Supporters
              </a>
              <a
                href="/faq"
                className="text-brand-dark hover:text-brand underline-offset-4 hover:underline"
              >
                FAQ
              </a>
              <a
                href="/imprint"
                className="text-brand-dark hover:text-brand underline-offset-4 hover:underline"
              >
                Imprint
              </a>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Repurposed: former petition page → milestone/status page */}
            <Route path="/petition" element={<PetitionPage />} />

            {/* Repurposed: proposal → implementation guide */}
            <Route path="/proposal" element={<ProposalPage />} />

            <Route path="/supporters" element={<SupportersPage />} />
            <Route path="/faq" element={<FaqPage />}
