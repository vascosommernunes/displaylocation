import React from 'react';
import { Supporter } from '../types';

interface SupporterCardProps {
  supporter: Supporter;
}

const SupporterCard: React.FC<SupporterCardProps> = ({ supporter }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* New Order: Person's Name */}
      <h3 className="text-lg font-semibold text-gray-900">{supporter.name}</h3>

      {/* New Order: Role (with some top margin for spacing) */}
      <p className="text-sm text-gray-500 mt-1">{supporter.role}</p>

      {/* New Order: Organization Name (with some top margin for spacing) */}
      <p className="text-gray-700 mt-2">{supporter.company}</p>
    </div>
  );
};

export default SupporterCard;