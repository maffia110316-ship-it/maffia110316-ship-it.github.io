import React, { useState } from 'react';
import { Gamepad2, ShieldAlert, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (identifier: string, pass: string) => boolean;
  onRegister: (username: string, email: string, pass: string) => boolean;
  onDemoLogin: () => void;
  authError: string;
  setAuthError: (err: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onRegister,
  onDemoLogin,
  authError,
  setAuthError,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    onLogin(identifier.trim(), password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    onRegister(regUsername.trim(), regEmail.trim(), password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 font-black text-2xl text-white mb-3 shadow-xl shadow-indigo-600/30 ring-2 ring-indigo-400/20">
            GH
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">GamerHub Ultra</h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegisterMode ? 'Maak direct een uniek gaming profiel aan' : 'Meld je aan bij jouw account'}
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center font-semibold flex items-center justify-center space-x-2 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Login Form */}
        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                E-mail of Gebruikersnaam
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="GamerTag of E-mailadres"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Wachtwoord
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
            >
              Inloggen
            </button>

            {/* Quick Demo Login Shortcut */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onDemoLogin}
                className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 text-indigo-300 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Direct Inloggen als Demo Gamer</span>
              </button>
            </div>

            <div className="text-center mt-4 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setAuthError('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
              >
                Nog geen account? Registreer hier
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Gebruikersnaam
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="bijv. MaffiaGamer#1337"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                E-mailadres
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Wachtwoord
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kies een sterk wachtwoord"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 mt-2 active:scale-[0.98]"
            >
              Account Aanmaken & Starten
            </button>

            <div className="text-center mt-3 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setAuthError('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
              >
                Al een account? Inloggen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
