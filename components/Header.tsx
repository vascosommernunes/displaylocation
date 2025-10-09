import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand font-semibold'
        : 'text-gray-600 hover:text-brand'
    }`;

  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-gray-900 transition-colors">
              displaylocation.org
            </NavLink>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClasses}>Home</NavLink>
              <NavLink to="/proposal" className={navLinkClasses}>The Proposal</NavLink>
              <NavLink to="/petition" className={navLinkClasses}>Petition</NavLink>
              <NavLink to="/supporters" className={navLinkClasses}>Supporters</NavLink>
              <NavLink to="/faq" className={navLinkClasses}>FAQ</NavLink>
              <NavLink to="/imprint" className={navLinkClasses}>Imprint</NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
