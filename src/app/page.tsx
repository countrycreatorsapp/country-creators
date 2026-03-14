"use client";
import React, { useState } from 'react';
import { loginWithPasscode } from '../lib/supabase';

export default function StudentLogin() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate with Supabase
      const cleanPasscode = passcode.trim().toLowerCase();
      const nation = await loginWithPasscode(cleanPasscode);
      
      if (nation) {
        // Securely pass to dashboard
        sessionStorage.setItem('cc_passcode', cleanPasscode);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Passcode not recognized. Check for typos.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans relative overflow-hidden">
      {/* Decorative Grid & Glowing Orbs (Premium Gaming Vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
      
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4 ring-1 ring-emerald-500/30">
            <span className="text-4xl">🌍</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Country Creators
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-medium">
            Enter your secure passcode to govern your nation.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <input
                id="passcode"
                name="passcode"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-4 border border-slate-700 bg-slate-950/50 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 rounded-xl sm:text-lg text-center font-mono tracking-widest transition-all shadow-inner"
                placeholder="e.g. silver-eagle-50"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-rose-400 text-xs font-bold text-center animate-pulse">{error}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !passcode}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-950 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Zero PII Privacy Secured
          </p>
        </div>
      </div>
    </div>
  );
}