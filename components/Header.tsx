import React from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';

const NAV_V2 = String(import.meta.env.VITE_NAV_V2 ?? '') === '1';

type NavItem = { to: string; label: string; primary?: boolean };

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/proposal', label: 'The Proposal' },
  { to: '/petition', label: 'Petition', primary: true },
  { to: '/supporters', label: 'Supporters' },
  { to: '/faq', label: 'FAQ' },
  { to: '/imprint', label: 'Imprint' },
];

// Keep legacy look for desktop links
const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand font-semibold' : 'text-gray-600 hover:text-brand'
  }`;

// Simple focusable finder (no deps)
function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function Header(): JSX.Element {
  // -----------------------------
  // V1 (current header) fallback
  // -----------------------------
  if (!NAV_V2) {
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
  }

  // -----------------------------
  // V2 (mobile-first with drawer)
  // -----------------------------
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const prevFocusRef = React.useRef<Element | null>(null);

  // Scroll lock + focus mgmt
  React.useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const p = panelRef.current;
    if (p) {
      const f = getFocusable(p);
      (f[0] ?? p).focus();
    }
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      if (prevFocusRef.current instanceof HTMLElement) prevFocusRef.current.focus();
    };
  }, [open]);

  // Trap focus inside panel
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const f = getFocusable(panelRef.current);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };

  const close = () => setOpen(false);

  return (
    <header
      className="sticky top-0 inset-x-0 z-[1000] border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0rem)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-gray-900">
              displaylocation.org
            </NavLink>
          </div>

          {/* Desktop nav (unchanged) */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer via portal to <body> */}
      {open &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />
            {/* Panel */}
            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              className="fixed right-0 top-0 bottom-0 z-[9999] w-[88vw] max-w-sm bg-white shadow-2xl p-6 flex flex-col"
              ref={panelRef}
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-3 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className={({ isActive }) =>
                      [
                        'min-h-12 rounded-xl px-4 py-3 text-base font-semibold text-left',
                        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
                        item.primary ? 'ring-1 ring-pink-300 bg-pink-500 text-white hover:bg-pink-500' : '',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Safe-area padding for iOS bottom inset */}
              <div style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }} />
            </div>
          </>,
          document.body
        )}
    </header>
  );
}
