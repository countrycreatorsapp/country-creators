"use client";
import React, { useState } from 'react';

export default function StudentLogin() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API Call to Supabase goes here
    // const { data, error } = await supabase.from('nations').select('*').eq('passcode', passcode);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-400">
            Country Creators
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your secret nation passcode to govern your people.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="passcode" className="sr-only">Passcode</label>
              <input
                id="passcode"
                name="passcode"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-lg text-center font-mono tracking-widest"
                placeholder="e.g. purple-dragon-72"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Nation Dashboard'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Zero PII Privacy Secured. No real names required.
          </p>
        </div>
      </div>
    </div>
  );
}