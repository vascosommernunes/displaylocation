import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SupportersProvider } from './context/SupportersContext';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import ProposalPage from './pages/ProposalPage';
import PetitionPage from './pages/PetitionPage';
import SupportersPage from './pages/SupportersPage';
import FaqPage from './pages/FaqPage';
import ImprintPage from './pages/ImprintPage';

function App() {
  return (
    <SupportersProvider>
      <HashRouter>
        <div className="bg-background min-h-screen flex flex-col font-sans text-gray-800">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/proposal" element={<ProposalPage />} />
              <Route path="/petition" element={<PetitionPage />} />
              <Route path="/supporters" element={<SupportersPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/imprint" element={<ImprintPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </SupportersProvider>
  );
}

export default App;
