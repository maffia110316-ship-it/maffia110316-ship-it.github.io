import React, { useState } from 'react';
import { User, LogOut, Trash2, CheckCircle2, Shield, Trophy, Clock, Gamepad2, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface SettingsTabProps {
  currentUser: UserType;
  onSaveProfile: (updatedData: Partial<UserType>) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  onSaveProfile,
  onLogout,
  onDeleteAccount,
}) => {
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [totalHours, setTotalHours] = useState(currentUser.totalHours || '0h');
  const [gamesCount, setGamesCount] = useState(currentUser.gamesCount || '0');
  const [achievementsCount, setAchievementsCount] = useState(currentUser.achievementsCount || '0');
  const [statusMsg, setStatusMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const avatarPresets = ['Maffia', 'Apex', 'Cyber', 'Viper', 'Shadow', 'Knight', 'Wizard'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      avatar: avatar.trim() || currentUser.avatar,
      bio: bio.trim(),
      password: password.trim() || currentUser.password,
      totalHours: totalHours.trim() || '0h',
      gamesCount: gamesCount.trim() || '0',
      achievementsCount: achievementsCount.trim() || '0',
    });
    setStatusMsg('✅ Profiel succesvol bijgewerkt!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Account Instellingen</h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Beheer je persoonlijke GamerHub profiel, statistieken en beveiliging.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs text-center font-bold flex items-center justify-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group shrink-0">
          <img
            src={avatar || currentUser.avatar}
            alt={currentUser.username}
            className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-indigo-500 object-cover shadow-lg"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-black text-white">{currentUser.username}</h2>
            <span className="inline-block bg-indigo-600/30 text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 w-max mx-auto sm:mx-0">
              GamerHub Lid
            </span>
          </div>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
          <p className="text-xs text-slate-300 italic pt-1">{bio || 'Geen bio ingesteld'}</p>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center shrink-0">
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
            <p className="text-xs font-black text-white">{totalHours}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Uren</p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
            <p className="text-xs font-black text-white">{gamesCount}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Games</p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
            <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <p className="text-xs font-black text-white">{achievementsCount}</p>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Trophies</p>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-5"
      >
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Profiel Gegevens Bewerken</span>
        </h2>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
            Profielfoto URL
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://api.dicebear.com/7.x/..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[10px] text-slate-500 font-semibold">Snelle avatars:</span>
            <div className="flex flex-wrap gap-1.5">
              {avatarPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${preset}`)}
                  className="text-[10px] bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 px-2 py-0.5 rounded-lg transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status / Bio</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Beschrijf jezelf als gamer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Totaal Uren</label>
            <input
              type="text"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="bijv. 520h"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Games in bezit</label>
            <input
              type="text"
              value={gamesCount}
              onChange={(e) => setGamesCount(e.target.value)}
              placeholder="bijv. 42"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trophies / Badges</label>
            <input
              type="text"
              value={achievementsCount}
              onChange={(e) => setAchievementsCount(e.target.value)}
              placeholder="bijv. 185"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center space-x-1">
            <Shield className="w-3 h-3 text-slate-400" />
            <span>Wachtwoord Wijzigen</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nieuw wachtwoord"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95"
        >
          Wijzigingen Opslaan
        </button>
      </form>

      {/* Account Options & Danger Zone */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Opties</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Uitloggen</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center space-x-2 bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Verwijder Account Definitief</span>
          </button>
        </div>
      </div>

      {/* Delete Account In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Account Definitief Verwijderen"
        message="Weet je zeker dat je jouw account definitief wilt verwijderen? Al je persoonlijke gegevens, serverlidmaatschappen en connecties worden gewist."
        confirmLabel="Definitief Verwijderen"
        cancelLabel="Behouden"
        isDestructive={true}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDeleteAccount();
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
