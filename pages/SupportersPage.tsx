import React from 'react';
import { useSupporters } from '../context/SupportersContext';
import SupporterCard from '../components/SupporterCard';

const SupportersPage: React.FC = () => {
  const { supporters } = useSupporters();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Supporters</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          We are proud to be supported by a growing community of businesses and institutions who believe in better representing physical display locations on the web.
        </p>
      </div>

      {supporters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supporters.map((supporter, index) => (
            <SupporterCard key={`${supporter.company}-${supporter.name}-${index}`} supporter={supporter} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No supporters yet. Be the first to sign the petition!</p>
        </div>
      )}
    </div>
  );
};

export default SupportersPage;
