import React, { useState } from 'react';
import { Trophy, Gamepad2, Search, CheckCircle2, Link2, Unlink, Sparkles, Filter, Award, Shield } from 'lucide-react';
import { User, GameAchievement, LinkedPlatformData } from '../types';
import { PLATFORM_ACHIEVEMENTS } from '../data/starterData';

interface AchievementsTabProps {
  currentUser: User;
  onLinkPlatform: (platform: 'playstation' | 'xbox' | 'steam', handle: string) => void;
  onUnlinkPlatform: (platform: 'playstation' | 'xbox' | 'steam') => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  currentUser,
  onLinkPlatform,
  onUnlinkPlatform,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'PlayStation' | 'Xbox' | 'Steam'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  // Modal / Inputs state for linking
  const [linkingPlatform, setLinkingPlatform] = useState<'playstation' | 'xbox' | 'steam' | null>(null);
  const [handleInput, setHandleInput] = useState('');

  const linked = currentUser.linkedGamingAccounts || {};

  const isPsLinked = Boolean(linked.playstation?.handle);
  const isXbLinked = Boolean(linked.xbox?.handle);
  const isStmLinked = Boolean(linked.steam?.handle);

  const anyLinked = isPsLinked || isXbLinked || isStmLinked;

  // Gather achievements based on linked platforms
  const visibleAchievements: GameAchievement[] = [];
  if (isPsLinked) visibleAchievements.push(...PLATFORM_ACHIEVEMENTS.PlayStation);
  if (isXbLinked) visibleAchievements.push(...PLATFORM_ACHIEVEMENTS.Xbox);
  if (isStmLinked) visibleAchievements.push(...PLATFORM_ACHIEVEMENTS.Steam);

  const filteredAchievements = visibleAchievements.filter((ach) => {
    if (selectedPlatform !== 'all' && ach.platform !== selectedPlatform) return false;
    if (rarityFilter !== 'all' && ach.rarity !== rarityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ach.name.toLowerCase().includes(q) ||
        ach.gameTitle.toLowerCase().includes(q) ||
        ach.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartLink = (plat: 'playstation' | 'xbox' | 'steam') => {
    setLinkingPlatform(plat);
    setHandleInput('');
  };

  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingPlatform || !handleInput.trim()) return;
    onLinkPlatform(linkingPlatform, handleInput.trim());
    setLinkingPlatform(null);
    setHandleInput('');
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Gaming Achievements & Trofeeën
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Koppel je PlayStation, Xbox en Steam accounts om al je prestaties en zeldzame trofeeën te bekijken.
          </p>
        </div>
      </div>

      {/* Platform Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PLAYSTATION CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-600/30">
                  🎮
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">PlayStation Network</h3>
                  <span className="text-[10px] text-blue-400 font-semibold">Trophy Level & Platina</span>
                </div>
              </div>
              {isPsLinked && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Gekoppeld</span>
                </span>
              )}
            </div>

            {isPsLinked && linked.playstation ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white truncate">{linked.playstation.handle}</span>
                  <span className="text-xs font-extrabold text-blue-400">Level {linked.playstation.level}</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-sm">🏆</span>
                    <p className="text-xs font-black text-white">{linked.playstation.platinum}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Plat</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-sm">🥇</span>
                    <p className="text-xs font-black text-amber-300">{linked.playstation.gold}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Goud</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-sm">🥈</span>
                    <p className="text-xs font-black text-slate-300">{linked.playstation.silver}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Zilver</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                    <span className="text-sm">🥉</span>
                    <p className="text-xs font-black text-amber-600">{linked.playstation.bronze}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Brons</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                Koppel je PSN account om al je Platina en gouden trofeeën van PS4 en PS5 games in te laden.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            {isPsLinked ? (
              <button
                onClick={() => onUnlinkPlatform('playstation')}
                className="w-full text-center text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-red-500/10 transition"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Ontkoppelen</span>
              </button>
            ) : (
              <button
                onClick={() => handleStartLink('playstation')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>PlayStation Koppelen</span>
              </button>
            )}
          </div>
        </div>

        {/* XBOX CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-xl shadow-lg shadow-emerald-700/30">
                  🟩
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Xbox Network</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold">Gamerscore & Tier</span>
                </div>
              </div>
              {isXbLinked && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Gekoppeld</span>
                </span>
              )}
            </div>

            {isXbLinked && linked.xbox ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white truncate">{linked.xbox.handle}</span>
                  <span className="text-xs font-extrabold text-emerald-400">{linked.xbox.tier}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Gamerscore</span>
                    <p className="text-base font-black text-white mt-0.5">
                      {linked.xbox.gamerscore.toLocaleString()} G
                    </p>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-bold text-slate-400 uppercase">Achievements</span>
                    <p className="text-base font-black text-white mt-0.5">
                      {linked.xbox.totalAchievements}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                Koppel je Xbox Gamertag om je Gamerscore en zeldzame prestaties van Xbox Series X|S en PC Games in te laden.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            {isXbLinked ? (
              <button
                onClick={() => onUnlinkPlatform('xbox')}
                className="w-full text-center text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-red-500/10 transition"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Ontkoppelen</span>
              </button>
            ) : (
              <button
                onClick={() => handleStartLink('xbox')}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-700/30"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Xbox Koppelen</span>
              </button>
            )}
          </div>
        </div>

        {/* STEAM CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xl shadow-lg">
                  💨
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Steam Community</h3>
                  <span className="text-[10px] text-indigo-400 font-semibold">Steam Level & Perfect Games</span>
                </div>
              </div>
              {isStmLinked && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Gekoppeld</span>
                </span>
              )}
            </div>

            {isStmLinked && linked.steam ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-white truncate">{linked.steam.handle}</span>
                  <span className="text-xs font-extrabold text-indigo-400">Level {linked.steam.steamLevel}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-bold text-amber-400 uppercase">100% Games</span>
                    <p className="text-base font-black text-white mt-0.5">
                      {linked.steam.perfectGames} Titels
                    </p>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-xs font-bold text-slate-400 uppercase">Achievements</span>
                    <p className="text-base font-black text-white mt-0.5">
                      {linked.steam.totalAchievements}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                Koppel je Steam ID om al je PC achievements, badges en 100% uitgespeelde games direct te synchroniseren.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60">
            {isStmLinked ? (
              <button
                onClick={() => onUnlinkPlatform('steam')}
                className="w-full text-center text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-red-500/10 transition"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Ontkoppelen</span>
              </button>
            ) : (
              <button
                onClick={() => handleStartLink('steam')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Steam Koppelen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Achievements */}
      {anyLinked ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Zoek achievement of game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedPlatform === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Alle ({visibleAchievements.length})
              </button>
              {isPsLinked && (
                <button
                  onClick={() => setSelectedPlatform('PlayStation')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedPlatform === 'PlayStation'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  PlayStation ({PLATFORM_ACHIEVEMENTS.PlayStation.length})
                </button>
              )}
              {isXbLinked && (
                <button
                  onClick={() => setSelectedPlatform('Xbox')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedPlatform === 'Xbox'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Xbox ({PLATFORM_ACHIEVEMENTS.Xbox.length})
                </button>
              )}
              {isStmLinked && (
                <button
                  onClick={() => setSelectedPlatform('Steam')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedPlatform === 'Steam'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Steam ({PLATFORM_ACHIEVEMENTS.Steam.length})
                </button>
              )}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{ach.gameIcon}</span>
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[160px]">
                        {ach.gameTitle}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        ach.rarity === 'Legendarisch'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : ach.rarity === 'Ultra Zeldzaam'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {ach.rarity}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {ach.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-200 transition">
                        {ach.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-indigo-400 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{ach.pointsOrType}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {ach.unlockedAt ? `Ontgrendeld: ${ach.unlockedAt}` : 'Voltooid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State when no platform is linked */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-3xl border border-indigo-500/30">
            🏆
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Geen Gaming Accounts Gekoppeld</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Koppel hierboven je <strong>PlayStation Network</strong>, <strong>Xbox</strong> of{' '}
              <strong>Steam</strong> profiel om al je ontgrendelde trofeeën, gamerscore punten en
              prestaties automatisch te synchroniseren!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleStartLink('playstation')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              + Koppel PlayStation
            </button>
            <button
              onClick={() => handleStartLink('xbox')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              + Koppel Xbox
            </button>
            <button
              onClick={() => handleStartLink('steam')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              + Koppel Steam
            </button>
          </div>
        </div>
      )}

      {/* Link Account Modal */}
      {linkingPlatform && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${
                  linkingPlatform === 'playstation'
                    ? 'bg-blue-600'
                    : linkingPlatform === 'xbox'
                    ? 'bg-emerald-700'
                    : 'bg-slate-800'
                }`}
              >
                {linkingPlatform === 'playstation' ? '🎮' : linkingPlatform === 'xbox' ? '🟩' : '💨'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white capitalize">
                  {linkingPlatform} Account Koppelen
                </h3>
                <p className="text-xs text-slate-400">
                  {linkingPlatform === 'playstation'
                    ? 'Vul je PlayStation Network (PSN) Online ID in.'
                    : linkingPlatform === 'xbox'
                    ? 'Vul je Xbox Gamertag in.'
                    : 'Vul je Steam Community profiel of Steam ID in.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmLink} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {linkingPlatform === 'playstation'
                    ? 'PSN Online ID'
                    : linkingPlatform === 'xbox'
                    ? 'Xbox Gamertag'
                    : 'Steam ID / URL'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder={
                    linkingPlatform === 'playstation'
                      ? 'bijv. Maffia_Games_NL'
                      : linkingPlatform === 'xbox'
                      ? 'bijv. MaffiaChief#4521'
                      : 'bijv. maffia_steam'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLinkingPlatform(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Koppelen & Achievements Laden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
