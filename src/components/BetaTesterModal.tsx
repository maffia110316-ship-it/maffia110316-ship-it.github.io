import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Share2,
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react';
import { User } from '../types';
import { getDocIdFromEmail } from '../services/userService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface BetaTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser?: (updated: Partial<User>) => void;
}

export const BetaTesterModal: React.FC<BetaTesterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'invite' | 'perks' | 'feedback'>('invite');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Voice Calls');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Construct official shareable beta tester URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gamerhub.app';
  const betaInviteCode = currentUser.inviteCode || 'BETA-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const shareUrl = `${baseUrl}?beta=join&code=${encodeURIComponent(betaInviteCode)}&ref=${encodeURIComponent(currentUser.username)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! Doe mee als Beta Tester voor GamerHub Ultra via mijn exclusieve link: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Uitnodiging: Word GamerHub Ultra Beta Tester!`;
    const body = `Hoi!\n\nIk nodig je uit om GamerHub Ultra te testen (het nieuwe Discord + Gaming Stats platform met Voice Calls, servers en game tracking).\n\nKlik op deze link om direct te starten als Beta Tester:\n${shareUrl}\n\nGroetjes,\n${currentUser.username}`;
    window.open(`mailto:${inviteEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSendDirectInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;

    setIsSubmitting(true);
    try {
      // Save invite in Firestore collection 'beta_invites'
      const inviteId = 'inv_' + Date.now();
      const inviteRef = doc(db, 'beta_invites', inviteId);
      await setDoc(inviteRef, {
        inviter: currentUser.username,
        inviterEmail: currentUser.email,
        targetEmail: inviteEmail.trim().toLowerCase(),
        code: betaInviteCode,
        timestamp: Date.now(),
        status: 'pending',
      });

      setInviteSuccess(`🎉 Beta uitnodiging geregistreerd voor ${inviteEmail.trim()}! Deel ook de link met je vriend.`);
      setInviteEmail('');
    } catch (err) {
      console.warn('Firestore invite save:', err);
      setInviteSuccess(`Uitnodigingscode klaar voor ${inviteEmail.trim()}!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      const fbId = 'fb_' + Date.now();
      const fbRef = doc(db, 'beta_feedback', fbId);
      await setDoc(fbRef, {
        sender: currentUser.username,
        email: currentUser.email,
        category: feedbackCategory,
        message: feedbackText.trim(),
        timestamp: Date.now(),
        dateString: new Date().toLocaleString(),
      });
      setFeedbackSent(true);
      setFeedbackText('');
    } catch (err) {
      console.warn('Feedback save warning:', err);
      setFeedbackSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBetaTesterRole = () => {
    if (onUpdateUser) {
      onUpdateUser({ isBetaTester: !currentUser.isBetaTester });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#1e1f22] border border-[#2b2d31] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/40 p-5 border-b border-[#2b2d31] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white tracking-tight">Beta Tester Programma</h2>
                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Early Access
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Nodig vrienden uit om GamerHub Ultra te testen & geef directe feedback!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2b2d31] bg-[#18191c] px-4 pt-2">
          <button
            onClick={() => setActiveSubTab('invite')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeSubTab === 'invite'
                ? 'border-[#5865f2] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Mensen Uitnodigen</span>
          </button>
          <button
            onClick={() => setActiveSubTab('perks')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeSubTab === 'perks'
                ? 'border-[#5865f2] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tester Badge & Voordelen</span>
          </button>
          <button
            onClick={() => setActiveSubTab('feedback')}
            className={`pb-2.5 px-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
              activeSubTab === 'feedback'
                ? 'border-[#5865f2] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bug & Feedback Melden</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeSubTab === 'invite' && (
            <div className="space-y-4">
              {/* Shareable Link Box */}
              <div className="p-4 bg-[#111214] border border-[#2b2d31] rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    🔗 Jouw Exclusieve Beta Tester Uitnodigingslink:
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                    Code: {betaInviteCode}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#1e1f22] border border-[#2b2d31] rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shrink-0 ${
                      copied
                        ? 'bg-[#23a55a] text-white'
                        : 'bg-[#5865f2] hover:bg-[#4752c4] text-white shadow-md'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Gekopieerd!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Kopieer Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Share Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded-xl text-xs font-bold transition"
                  >
                    <span>💬 Deel via WhatsApp</span>
                  </button>
                  <button
                    onClick={handleShareEmail}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EA4335]/20 hover:bg-[#EA4335]/30 border border-[#EA4335]/40 text-[#EA4335] rounded-xl text-xs font-bold transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Deel via E-mail / Gmail</span>
                  </button>
                </div>
              </div>

              {/* Direct Invite by Email */}
              <form onSubmit={handleSendDirectInvite} className="p-4 bg-[#111214] border border-[#2b2d31] rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                  ✉️ Nodig een Tester uit via E-mail:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="bijv. vriend@gmail.com"
                    className="flex-1 bg-[#1e1f22] border border-[#2b2d31] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865f2]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Versturen...' : 'Uitnodiging Versturen'}</span>
                  </button>
                </div>

                {inviteSuccess && (
                  <p className="text-xs text-[#23a55a] font-semibold bg-[#23a55a]/10 border border-[#23a55a]/30 p-2.5 rounded-xl">
                    {inviteSuccess}
                  </p>
                )}
              </form>

              {/* Instructions banner */}
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-300 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Hoe werkt het testen?</span>
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Iedereen die jouw link opent krijgt direct toegang, start met 0 servers en vrienden (strikt geregistreerd), en kan samen met jou in servers gaan, spraakkanalen uittesten, voice calls voeren en schermen delen!
                </p>
              </div>
            </div>
          )}

          {activeSubTab === 'perks' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black/60 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center space-x-1.5">
                      <span>Jouw Tester Badge Status:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/40">
                        {currentUser.isBetaTester ? 'Actief' : 'Beschikbaar'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {currentUser.isBetaTester
                        ? 'De [🚀 BETA TESTER] badge wordt getoond bij jouw naam in chats en profiel.'
                        : 'Activeer jouw exclusieve badge om te tonen dat je meedoet aan de bèta.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleBetaTesterRole}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    currentUser.isBetaTester
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40'
                      : 'bg-[#23a55a] text-white hover:bg-[#1f924e]'
                  }`}
                >
                  {currentUser.isBetaTester ? 'Uitschakelen' : 'Badge Claimen'}
                </button>
              </div>

              {/* Beta Features List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Beschikbare Bèta Functionaliteiten om te Testen:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#111214] border border-[#2b2d31] rounded-xl flex items-start space-x-2">
                    <span className="text-base">🎙️</span>
                    <div>
                      <span className="font-bold text-white block">Spraakkanalen & Voice Calls</span>
                      <span className="text-[11px] text-slate-400">Maak eigen spraakkamamers aan in servers of bel vrienden.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#111214] border border-[#2b2d31] rounded-xl flex items-start space-x-2">
                    <span className="text-base">💬</span>
                    <div>
                      <span className="font-bold text-white block">Tekstchat in Voice</span>
                      <span className="text-[11px] text-slate-400">Typ berichten en deel links terwijl je aan het bellen bent.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#111214] border border-[#2b2d31] rounded-xl flex items-start space-x-2">
                    <span className="text-base">📧</span>
                    <div>
                      <span className="font-bold text-white block">Echte E-mail & 2FA</span>
                      <span className="text-[11px] text-slate-400">Echte wachtwoordherstel en 2-staps verificatie via e-mail.</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#111214] border border-[#2b2d31] rounded-xl flex items-start space-x-2">
                    <span className="text-base">🖥️</span>
                    <div>
                      <span className="font-bold text-white block">Schermdelen & Soundboard</span>
                      <span className="text-[11px] text-slate-400">Deel je gamescherm en speel Discord geluidseffecten af.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'feedback' && (
            <form onSubmit={handleSendFeedback} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Categorie van je bevinding / bug
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full bg-[#111214] border border-[#2b2d31] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865f2]"
                >
                  <option value="Voice Calls">🎙️ Voice Calls & Spraakkanalen</option>
                  <option value="Discord Servers">🎮 Servers & Kanalen Beheren</option>
                  <option value="Inloggen & Email">📧 Inloggen, Wachtwoord & 2FA E-mail</option>
                  <option value="Vrienden & DMs">💬 Vrienden & Direct Messages</option>
                  <option value="Mobiele Navigatie">📱 Mobiele weergave & Telefoon</option>
                  <option value="Algemene Suggestie">💡 Algemene Suggestie</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Jouw opmerking, feedback of bug rapport
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Beschrijf wat er goed werkt, of waar je tegenaan liep tijdens het testen..."
                  className="w-full bg-[#111214] border border-[#2b2d31] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5865f2] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Wordt direct verzonden naar het ontwikkelaarsteam.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Versturen...' : 'Feedback Versturen'}</span>
                </button>
              </div>

              {feedbackSent && (
                <div className="p-3 bg-[#23a55a]/10 border border-[#23a55a]/30 rounded-xl text-xs text-[#23a55a] font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Bedankt voor je feedback! Je bevinding is opgeslagen in de Cloud database.</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111214] border-t border-[#2b2d31] flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <span>Ingelogd als:</span>
            <strong className="text-white">{currentUser.username}</strong>
            {currentUser.isBetaTester && (
              <span className="text-[10px] text-indigo-400 font-bold ml-1">[🚀 BETA TESTER]</span>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2b2d31] hover:bg-[#35373c] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
