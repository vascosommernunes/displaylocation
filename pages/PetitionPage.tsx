import React, { useState } from 'react';

// This interface is for form state, not the global Supporter type
interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
}

const PetitionPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
  });
  const [subscribe, setSubscribe] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.role) {
      setError('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Grab Turnstile response token
    const tokenInput = document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
    const cfTurnstileResponse = tokenInput?.value;
    if (!cfTurnstileResponse) {
      setError('Please verify you are human before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/api/supporters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subscribe, cfTurnstileResponse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-brand p-8 sm:p-12 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Support the Proposal</h1>
        <p className="mt-4 text-gray-200">
          If your business, museum, or gallery has a location dedicated to displaying items, your support is crucial.
          By signing, you help us demonstrate the real-world need for this property to the schema.org community.
        </p>

        {submitted ? (
          <div className="mt-8 p-4 bg-green-100 text-green-800 border border-green-200 rounded-md">
            <h3 className="font-semibold">Thank you! One last step...</h3>
            <p>
              Please check your email to confirm your support. Your entry will be publicly listed after you click the
              confirmation link in the email we've just sent you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-brand-dark text-white border border-gray-500 rounded-md
                           placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-brand-dark text-white border border-gray-500 rounded-md
                           placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-200">
                Company / Organization
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-brand-dark text-white border border-gray-500 rounded-md
                           placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-200">
                Role{' '}
                <span className="text-gray-400 font-normal">
                  (Consumer, business owner, director of cultural institution, etc.)
                </span>
              </label>
              <input
                type="text"
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-brand-dark text-white border border-gray-500 rounded-md
                           placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                required
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="subscribe"
                  name="subscribe"
                  type="checkbox"
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                  className="focus:ring-accent h-4 w-4 text-accent border-gray-500 rounded bg-brand-dark"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="subscribe" className="text-gray-200">
                  Subscribe to displayLocation updates (sent by showroom.fm).
                </label>
              </div>
            </div>

            {/* 🔒 Turnstile CAPTCHA widget */}
            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAAB7nD-ArS5nkd4Ol"
              data-theme="auto"
            ></div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Add My Support'}
              </button>
            </div>
            <p className="text-xs text-gray-300 text-center">
              By signing this petition, you agree that your name, role, and company name may be published on the list of
              supporters after email verification.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PetitionPage;
