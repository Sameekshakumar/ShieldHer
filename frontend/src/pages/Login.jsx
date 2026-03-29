import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND = 'http://localhost:5000';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('register'); // 'register' or 'login'
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!pseudonym.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudonym: pseudonym.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      // Save to localStorage
      localStorage.setItem('shieldher_token', data.token);
      localStorage.setItem('shieldher_pseudonym', data.pseudonym);

      navigate('/feed');
    } catch (err) {
      setError('Could not connect to server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🛡️</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ShieldHer</h1>
          <p className="text-purple-300 mt-2 text-sm">
            No real name. No email. Just a pseudonym.
            <br />Your identity stays yours.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161829] border border-purple-900/40 rounded-2xl p-8">

          {/* Tabs */}
          <div className="flex rounded-lg bg-[#0d0f1e] p-1 mb-8">
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-purple-400 hover:text-white'
              }`}
            >
              Join Anonymously
            </button>
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-purple-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-purple-400 mb-1 uppercase tracking-wider">
                Pseudonym
              </label>
              <input
                type="text"
                placeholder="e.g. CometAurora429"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-[#0d0f1e] border border-purple-800/50 rounded-lg px-4 py-3 text-white placeholder-purple-900 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-[#0d0f1e] border border-purple-800/50 rounded-lg px-4 py-3 text-white placeholder-purple-900 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm"
          >
            {loading
              ? 'Please wait...'
              : tab === 'register'
              ? 'Create Anonymous Identity'
              : 'Enter ShieldHer'}
          </button>

          {/* Trust signal */}
          <p className="text-center text-xs text-purple-700 mt-5">
            🔒 We never store your real name or email address.
          </p>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-purple-900 mt-6">
          {tab === 'register'
            ? 'Already have an identity? Switch to Sign In above.'
            : 'New here? Switch to Join Anonymously above.'}
        </p>
      </div>
    </div>
  );
}
