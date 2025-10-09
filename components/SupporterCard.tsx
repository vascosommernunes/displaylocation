import React from 'react';
import { Supporter } from '../types';

interface SupporterCardProps {
  supporter: Supporter;
}

const SupporterCard: React.FC<SupporterCardProps> = ({ supporter }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900">{supporter.company}</h3>
      <p className="text-gray-700 mt-2">{supporter.name}</p>
      <p className="text-sm text-gray-500">{supporter.role}</p>
    </div>
  );
};

export default SupporterCard;
