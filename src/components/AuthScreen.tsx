import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Mail,
  KeyRound,
  Lock,
  User as UserIcon,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
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
  onGoogleSignIn?: () => Promise<boolean>;
  onRequestPasswordReset?: (
    identifier: string
  ) => Promise<{ success: boolean; userEmail?: string; tempCode?: string; error?: string }>;
  onConfirmPasswordReset?: (userEmail: string, newPass: string) => Promise<boolean>;
  savedAccounts: User[];
  authError: string;
  setAuthError: (err: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onVerify2FA,
  onRegister,
  onGoogleSignIn,
  onRequestPasswordReset,
  onConfirmPasswordReset,
  savedAccounts,
  authError,
  setAuthError,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Registration state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // 2FA state
  const [is2FAPending, setIs2FAPending] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorNotice, setTwoFactorNotice] = useState('');

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotTargetEmail, setForgotTargetEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotInputCode, setForgotInputCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleGoogleClick = async () => {
    if (!onGoogleSignIn) return;
    setAuthError('');
    setIsGoogleLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      setIsGoogleLoading(false);
    }
  };

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

  // Forgot Password: Step 1 (Request code)
  const handleRequestResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!forgotIdentifier.trim()) {
      setAuthError('Vul je gebruikersnaam of e-mailadres in.');
      return;
    }

    setIsForgotLoading(true);
    try {
      if (onRequestPasswordReset) {
        const res = await onRequestPasswordReset(forgotIdentifier.trim());
        if (!res.success) {
          setAuthError(res.error || 'Account niet gevonden. Controleer je invoer.');
          return;
        }
        setForgotTargetEmail(res.userEmail || forgotIdentifier.trim());
        setForgotCode(res.tempCode || '729401');
        setForgotNotice(
          `📧 Herstelcode klaargezet voor ${res.userEmail || forgotIdentifier.trim()}`
        );
        setForgotStep(2);
      } else {
        // Fallback local code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setForgotTargetEmail(forgotIdentifier.trim());
        setForgotCode(code);
        setForgotNotice(`📧 Herstelcode klaargezet voor ${forgotIdentifier.trim()}`);
        setForgotStep(2);
      }
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Forgot Password: Step 2 (Verify code and save new password)
  const handleConfirmResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (forgotInputCode.trim() !== forgotCode.trim()) {
      setAuthError('Ongeldige herstelcode! Controleer de 6-cijferige code.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setAuthError('Kies een nieuw wachtwoord van minimaal 6 tekens.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setAuthError('Wachtwoorden komen niet overeen.');
      return;
    }

    setIsForgotLoading(true);
    try {
      if (onConfirmPasswordReset) {
        const ok = await onConfirmPasswordReset(forgotTargetEmail, forgotNewPassword);
        if (!ok) {
          setAuthError('Wachtwoord wijzigen mislukt. Probeer het opnieuw.');
          return;
        }
      }
      // Update form password and switch to success step
      setPassword(forgotNewPassword);
      setIdentifier(forgotTargetEmail);
      setForgotStep(3);
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    setIsForgotPasswordMode(false);
    setIsRegisterMode(false);
    setForgotStep(1);
    setForgotInputCode('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setAuthError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 font-black text-2xl text-white mb-3 shadow-xl shadow-indigo-600/30 ring-2 ring-indigo-400/20">
            {isForgotPasswordMode ? <KeyRound className="w-8 h-8" /> : 'GH'}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {isForgotPasswordMode ? 'Wachtwoord Herstellen' : 'GamerHub Ultra'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {is2FAPending
              ? '2-Staps Verificatie via E-mail'
              : isForgotPasswordMode
              ? forgotStep === 1
                ? 'Stap 1: Vraag een veilige herstelcode aan'
                : forgotStep === 2
                ? 'Stap 2: Voer code in en kies een nieuw wachtwoord'
                : 'Stap 3: Wachtwoord succesvol gewijzigd'
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

        {/* 1. 2FA Pending Screen */}
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

            <a
              href="https://mail.google.com/mail/u/0/#search/GamerHub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#EA4335]/15 hover:bg-[#EA4335]/25 text-[#EA4335] border border-[#EA4335]/30 rounded-xl text-xs font-bold transition"
            >
              <Mail className="w-4 h-4" />
              <span>📬 Open direct Gmail Inbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
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
        ) : isForgotPasswordMode ? (
          /* 2. FORGOT PASSWORD FLOW */
          <div className="space-y-4">
            {forgotStep === 1 && (
              <form onSubmit={handleRequestResetSubmit} className="space-y-4">
                <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl text-xs text-slate-300 leading-relaxed">
                  Vul het e-mailadres of de gebruikersnaam van je GamerHub account in. We zoeken je account op in de database en sturen je direct een veilige 6-cijferige herstelcode.
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    E-mailadres of GamerTag
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="naam@voorbeeld.nl of GamerTag"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isForgotLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Herstelcode Aanvragen</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="w-full flex items-center justify-center space-x-1.5 text-xs text-slate-400 hover:text-white pt-1 text-center transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Terug naar inloggen</span>
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleConfirmResetSubmit} className="space-y-4">
                {/* Code banner */}
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-xs space-y-2">
                  <div className="text-indigo-300 font-medium leading-relaxed">
                    {forgotNotice}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-indigo-500/20 text-[11px] text-slate-300">
                    <span>Herstelcode:</span>
                    <span className="font-mono font-bold text-sm tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-500/40">
                      {forgotCode}
                    </span>
                  </div>
                  <a
                    href="https://mail.google.com/mail/u/0/#search/GamerHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#EA4335]/20 hover:bg-[#EA4335]/30 text-[#EA4335] border border-[#EA4335]/40 rounded-xl text-[11px] font-bold transition text-center"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open je Gmail Inbox (Zoek GamerHub)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    6-Cijferige Herstelcode
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={forgotInputCode}
                    onChange={(e) => setForgotInputCode(e.target.value)}
                    placeholder={forgotCode}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Nieuw Wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Minimaal 6 tekens"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Bevestig Nieuw Wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Herhaal nieuw wachtwoord"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isForgotLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Wachtwoord Opslaan & Bevestigen</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="w-full flex items-center justify-center space-x-1.5 text-xs text-slate-400 hover:text-white pt-1 text-center transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ander e-mailadres kiezen</span>
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Wachtwoord Gewijzigd!</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Je nieuwe wachtwoord is veilig opgeslagen in Cloud Firestore en lokaal opgeslagen. Je kunt nu direct inloggen.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
                >
                  Nu Direct Inloggen
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 3. NORMAL LOGIN & REGISTER SCREEN */
          <div>
            {/* Google / Gmail OAuth Sign-In */}
            {onGoogleSignIn && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={isGoogleLoading || isSubmitting}
                  className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl text-sm transition shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                  )}
                  <span>{isGoogleLoading ? 'Verbinden met Google...' : 'Inloggen met Google / Gmail'}</span>
                </button>

                <div className="flex items-center my-3.5">
                  <div className="flex-1 border-t border-slate-800"></div>
                  <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    of met {isRegisterMode ? 'nieuw account' : 'e-mail & wachtwoord'}
                  </span>
                  <div className="flex-1 border-t border-slate-800"></div>
                </div>
              </div>
            )}

            {!isRegisterMode ? (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">
                      Wachtwoord
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(identifier);
                        setIsForgotPasswordMode(true);
                        setForgotStep(1);
                        setAuthError('');
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition"
                    >
                      Wachtwoord vergeten?
                    </button>
                  </div>
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
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(identifier);
                      setIsForgotPasswordMode(true);
                      setForgotStep(1);
                      setAuthError('');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                  >
                    Wachtwoord vergeten?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? 'Inloggen controleren...' : 'Inloggen'}
                </button>

                <div className="text-center mt-4 pt-2 border-t border-slate-800/60 flex flex-col space-y-2">
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
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 mt-2 active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmitting ? 'Account aanmaken...' : 'Account Aanmaken & Starten'}
                </button>

                <div className="text-center mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(false);
                      setAuthError('');
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2"
                  >
                    Al een account? Inloggen
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(regEmail || regUsername);
                      setIsForgotPasswordMode(true);
                      setForgotStep(1);
                      setAuthError('');
                    }}
                    className="text-slate-400 hover:text-indigo-300 underline underline-offset-2"
                  >
                    Wachtwoord vergeten?
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
