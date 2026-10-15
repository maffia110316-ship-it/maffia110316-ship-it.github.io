import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Mail, ArrowRight, UserCheck, KeyRound, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (
    identifier: string,
    pass: string
  ) =>
    | { success: boolean; requires2FA?: boolean; user?: User; tempCode?: string }
    | Promise<{ success: boolean; requires2FA?: boolean; user?: User; tempCode?: string }>;
  onVerify2FA: (code: string) => boolean | Promise<boolean>;
  onRegister: (username: string, email: string, pass: string) => boolean | Promise<boolean>;
  savedAccounts: User[];
  authError: string;
  setAuthError: (err: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onVerify2FA,
  onRegister,
  savedAccounts,
  authError,
  setAuthError,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // 2FA state
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorNotice, setTwoFactorNotice] = useState('');

  // Pre-fill remembered credentials if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gh_remembered_creds');
      if (saved) {
        const { identifier: id, password: pw } = JSON.parse(saved);
        if (id) setIdentifier(id);
        if (pw) setPassword(pw);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    if (rememberMe) {
      try {
        localStorage.setItem(
          'gh_remembered_creds',
          JSON.stringify({ identifier: identifier.trim(), password })
        );
      } catch {
        // ignore
      }
    }

    try {
      const result = await Promise.resolve(onLogin(identifier.trim(), password));
      if (result.requires2FA) {
        setIs2FAPending(true);
        setTwoFactorNotice(
          `📧 Beveiligingscode verzonden naar ${result.user?.email || 'je e-mail'}: ${result.tempCode || '482910'}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const success = await Promise.resolve(onVerify2FA(twoFactorCode.trim()));
      if (!success) {
        setAuthError('Onjuiste 2-staps verificatiecode. Controleer je e-mail.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      await Promise.resolve(onRegister(regUsername.trim(), regEmail.trim(), password));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSavedAccount = (acc: User) => {
    setIdentifier(acc.username || acc.email);
    if (acc.password) setPassword(acc.password);
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
            {is2FAPending
              ? '2-Staps Verificatie via E-mail'
              : isRegisterMode
              ? 'Maak een nieuw account aan (Start met 0 servers & 0 vrienden)'
              : 'Meld je aan bij het online gaming netwerk'}
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs text-center font-semibold flex items-center justify-center space-x-2 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* 2FA Pending Screen */}
        {is2FAPending ? (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 font-medium leading-relaxed">
              {twoFactorNotice || 'Er is een 6-cijferige beveiligingscode naar je e-mailadres verzonden.'}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                6-Cijferige Beveiligingscode
              </label>
              <input
                type="text"
                required
                autoFocus
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
            >
              Verifieer & Inloggen
            </button>

            <button
              type="button"
              onClick={() => setIs2FAPending(false)}
              className="w-full text-xs text-slate-400 hover:text-white pt-2 text-center"
            >
              ← Terug naar inloggen
            </button>
          </form>
        ) : !isRegisterMode ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* SAVED ACCOUNTS CHIPS IF AVAILABLE */}
            {savedAccounts.length > 0 && (
              <div className="pb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Opgeslagen Accounts op dit apparaat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {savedAccounts.slice(0, 3).map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectSavedAccount(acc)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border flex items-center space-x-1.5 transition ${
                        identifier.toLowerCase() === acc.username.toLowerCase() ||
                        identifier.toLowerCase() === acc.email.toLowerCase()
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <img src={acc.avatar} alt={acc.username} className="w-3.5 h-3.5 rounded-full" />
                      <span className="truncate max-w-[120px]">{acc.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                E-mail of Gebruikersnaam
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="GamerTag of E-mailadres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>Onthoud mijn inloggegevens</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
            >
              Inloggen
            </button>

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

            <p className="text-[11px] text-slate-500 italic">
              * Elk nieuw account start met exact 0 servers en 0 vrienden en krijgt een persoonlijke uitnodigingslink.
            </p>

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
