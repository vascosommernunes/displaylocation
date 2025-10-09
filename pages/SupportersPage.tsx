
import React from 'react';
import { useSupporters } from '../context/SupportersContext';
import SupporterCard from '../components/SupporterCard';
import { Link } from 'react-router-dom';

const SupportersPage: React.FC = () => {
  const { supporters, loading, error } = useSupporters();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Our Supporters</h1>
        <p className="mt-4 text-xl text-gray-600">
          A growing list of businesses, institutions, and individuals who see the need for a <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-base font-mono">displaylocation</code> property.
        </p>
        <p className="mt-4">
            <Link to="/petition" className="text-brand font-medium hover:underline">
              Want to see your name here? Sign the petition.
            </Link>
        </p>
      </div>

      {loading && (
        <div className="text-center">
          <p className="text-gray-600">Loading supporters...</p>
        </div>
      )}

      {error && (
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {supporters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supporters.map((supporter, index) => (
                <SupporterCard key={index} supporter={supporter} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No supporters have been verified yet. Be the first!</p>
              <p className="mt-2">
                <Link to="/petition" className="text-brand font-medium hover:underline">
                    Sign the petition now.
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupportersPage;
