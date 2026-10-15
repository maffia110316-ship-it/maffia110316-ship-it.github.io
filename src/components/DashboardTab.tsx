import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Calendar,
  Zap,
  Search,
  ExternalLink,
  ChevronDown,
  Plus,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Link2,
} from 'lucide-react';
import { User, PlayedGame, LinkedPlatformData } from '../types';

interface DashboardTabProps {
  currentUser: User;
  onLinkPlatform: (platform: 'playstation' | 'xbox' | 'steam', handle: string) => void;
  onNavigateToAchievements: () => void;
  onOpenSettings: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentUser,
  onLinkPlatform,
  onNavigateToAchievements,
  onOpenSettings,
}) => {
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<
    'all' | 'PlayStation' | 'Steam' | 'Xbox'
  >('all');

  const [searchGameQuery, setSearchGameQuery] = useState('');
  const [showLinkModal, setShowLinkModal] = useState<
    'playstation' | 'steam' | 'xbox' | null
  >(null);
  const [inputHandle, setInputHandle] = useState('');

  const linked = currentUser.linkedGamingAccounts || {};
  const isPsLinked = Boolean(linked.playstation?.handle);
  const isStmLinked = Boolean(linked.steam?.handle);
  const isXbLinked = Boolean(linked.xbox?.handle);

  const anyLinked = isPsLinked || isStmLinked || isXbLinked;

  // Calculate dynamic totals strictly based on what is linked (0 if nothing linked)
  let totalHoursNum = 0;
  let totalGamesCount = 0;
  let totalAchievementsCount = 0;
  let allGames: PlayedGame[] = [];

  const platformBreakdownData: {
    name: string;
    hours: number;
    formattedHours: string;
    color: string;
    dotColor: string;
    barClass: string;
  }[] = [];

  if (isPsLinked && linked.playstation) {
    totalHoursNum += linked.playstation.hours;
    totalGamesCount += linked.playstation.gamesCount;
    totalAchievementsCount += linked.playstation.totalTrophies;
    allGames.push(...linked.playstation.games);
    platformBreakdownData.push({
      name: 'PlayStation',
      hours: linked.playstation.hours,
      formattedHours: `${linked.playstation.hours.toLocaleString('nl-NL')}h`,
      color: '#4f46e5',
      dotColor: 'bg-indigo-500',
      barClass: 'bg-indigo-600',
    });
  }

  if (isStmLinked && linked.steam) {
    totalHoursNum += linked.steam.hours;
    totalGamesCount += linked.steam.gamesCount;
    totalAchievementsCount += linked.steam.totalAchievements;
    allGames.push(...linked.steam.games);
    platformBreakdownData.push({
      name: 'Steam',
      hours: linked.steam.hours,
      formattedHours: `${linked.steam.hours.toLocaleString('nl-NL')}h`,
      color: '#38bdf8',
      dotColor: 'bg-sky-400',
      barClass: 'bg-sky-400',
    });
  }

  if (isXbLinked && linked.xbox) {
    totalHoursNum += linked.xbox.hours;
    totalGamesCount += linked.xbox.gamesCount;
    totalAchievementsCount += linked.xbox.totalAchievements;
    allGames.push(...linked.xbox.games);
    platformBreakdownData.push({
      name: 'Xbox',
      hours: linked.xbox.hours,
      formattedHours: `${linked.xbox.hours.toLocaleString('nl-NL')}h`,
      color: '#10b981',
      dotColor: 'bg-emerald-500',
      barClass: 'bg-emerald-500',
    });
  }

  // Filtered games based on selected platform pill
  const displayedGames = allGames.filter((g) => {
    if (selectedPlatformFilter === 'all') return true;
    return g.platform === selectedPlatformFilter;
  });

  // Sort most played games
  const mostPlayedGames = [...displayedGames]
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3);

  // Best session and this week stats
  const bestSessionDisplay = anyLinked ? '17h 1m' : '0h';
  const thisWeekDisplay = anyLinked ? '1h 36m' : '0h';

  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLinkModal || !inputHandle.trim()) return;
    onLinkPlatform(showLinkModal, inputHandle.trim());
    setShowLinkModal(null);
    setInputHandle('');
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto selection:bg-indigo-500 selection:text-white">
      {/* TOP HEADER: SEARCH & WELCOME BACK */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xl md:text-2xl text-slate-300 font-medium block">
            Welcome back,
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight -mt-1">
            {currentUser.username}
          </h1>
        </div>

        <button
          onClick={() => {}}
          className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shadow-md"
          title="Zoeken"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* VIEWING FILTER PILLS (EXACT AS SCREENSHOT 2) */}
      <div className="space-y-2">
        <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase">
          VIEWING
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* All Platforms */}
          <button
            onClick={() => setSelectedPlatformFilter('all')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center space-x-2 ${
              selectedPlatformFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-600'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <span className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <span className="bg-current rounded-sm" />
              <span className="bg-current rounded-sm" />
              <span className="bg-current rounded-sm" />
              <span className="bg-current rounded-sm" />
            </span>
            <span>All Platforms</span>
          </button>

          {/* Steam */}
          <button
            onClick={() => {
              if (isStmLinked) {
                setSelectedPlatformFilter('Steam');
              } else {
                setShowLinkModal('steam');
              }
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center space-x-2 ${
              selectedPlatformFilter === 'Steam'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-600'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">💨</span>
            <span>Steam</span>
            {!isStmLinked && (
              <span className="text-[10px] bg-slate-800 text-indigo-400 px-1.5 py-0.2 rounded-md">
                + link
              </span>
            )}
          </button>

          {/* PlayStation */}
          <button
            onClick={() => {
              if (isPsLinked) {
                setSelectedPlatformFilter('PlayStation');
              } else {
                setShowLinkModal('playstation');
              }
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center space-x-2 ${
              selectedPlatformFilter === 'PlayStation'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-600'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">🎮</span>
            <span>PlayStation</span>
            {!isPsLinked && (
              <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.2 rounded-md">
                + link
              </span>
            )}
          </button>

          {/* Xbox */}
          <button
            onClick={() => {
              if (isXbLinked) {
                setSelectedPlatformFilter('Xbox');
              } else {
                setShowLinkModal('xbox');
              }
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center space-x-2 ${
              selectedPlatformFilter === 'Xbox'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-slate-600'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">🟩</span>
            <span>Xbox</span>
            {!isXbLinked && (
              <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded-md">
                + link
              </span>
            )}
          </button>

          {/* Other platforms dropdown */}
          <button
            onClick={onNavigateToAchievements}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition flex items-center space-x-1.5"
          >
            <span>Other platforms</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 4 ROUNDED STAT CARDS (EXACT AS SCREENSHOT 2) */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Card 1: Games played */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {totalGamesCount > 0 ? totalGamesCount.toLocaleString('nl-NL') : '0'}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Games played</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl shadow-inner">
            🎮
          </div>
        </div>

        {/* Card 2: Achievements */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {totalAchievementsCount > 0
                ? totalAchievementsCount.toLocaleString('nl-NL')
                : '0'}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Achievements</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl shadow-inner">
            🏆
          </div>
        </div>

        {/* Card 3: Best session */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {bestSessionDisplay}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Best session</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl shadow-inner">
            🗓️
          </div>
        </div>

        {/* Card 4: This week */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {thisWeekDisplay}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-xs text-slate-400 font-semibold">This week</span>
              {anyLinked && (
                <span className="text-[11px] font-bold text-red-500 flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  95%
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl shadow-inner">
            ⚡
          </div>
        </div>
      </div>

      {/* BIG TOTAL HOURS CARD & PLATFORM BREAKDOWN (EXACT AS SCREENSHOT 1) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {totalHoursNum > 0 ? `${totalHoursNum.toLocaleString('nl-NL')}h` : '0h'}
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            across {totalGamesCount > 0 ? totalGamesCount : 0} games
          </p>
        </div>

        {/* MOST PLAYED SECTION */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase block">
            MOST PLAYED
          </span>

          {mostPlayedGames.length > 0 ? (
            <div className="space-y-3">
              {mostPlayedGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center space-x-2.5 truncate pr-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-bold text-slate-200 group-hover:text-white transition truncate">
                      {game.title}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition shrink-0 font-mono">
                    {game.formattedHours}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-400 leading-relaxed">
              Geen speeluren geregistreerd. Koppel je PlayStation, Steam of Xbox
              account om je meest gespeelde games en speeluren direct in te laden.
            </div>
          )}
        </div>

        {/* PLATFORM BREAKDOWN SECTION */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase block">
            PLATFORM BREAKDOWN
          </span>

          {platformBreakdownData.length > 0 ? (
            <div className="space-y-3.5">
              {platformBreakdownData.map((plat) => {
                const percentage =
                  totalHoursNum > 0
                    ? Math.round((plat.hours / totalHoursNum) * 100)
                    : 0;

                return (
                  <div key={plat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${plat.dotColor} shrink-0`}
                        />
                        <span className="font-bold text-slate-300">
                          {plat.name}
                        </span>
                      </div>

                      {/* Colored Progress Bar */}
                      <div className="flex-1 max-w-[200px] sm:max-w-[320px] mx-4 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${plat.barClass}`}
                          style={{ width: `${Math.max(percentage, 6)}%` }}
                        />
                      </div>

                      <span className="font-mono font-bold text-slate-400 shrink-0">
                        {plat.formattedHours}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-300">
                  0 Platforms Gekoppeld
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Koppel PlayStation, Steam of Xbox om je platform breakdown te zien.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLinkModal('playstation')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  + PlayStation
                </button>
                <button
                  onClick={() => setShowLinkModal('steam')}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                >
                  + Steam
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEATURED GAME CARD (LIKE FORTNITE BANNER IN SCREENSHOT 2) */}
      {mostPlayedGames.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
          <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-950">
            <img
              src={mostPlayedGames[0].image}
              alt={mostPlayedGames[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md">
                Meest Gespeeld
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {mostPlayedGames[0].title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {mostPlayedGames[0].formattedHours} gespeeld op{' '}
                  {mostPlayedGames[0].platform}
                </p>
              </div>

              <button
                onClick={onNavigateToAchievements}
                className="bg-slate-800/90 hover:bg-white hover:text-slate-950 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition flex items-center space-x-2 shadow-lg backdrop-blur-md w-max"
              >
                <span>View game</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIME PLAYED THIS WEEK CARD (EXACT AS SCREENSHOT 1) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-2">
        <span className="text-[11px] font-black tracking-widest text-slate-500 uppercase block">
          TIME PLAYED THIS WEEK
        </span>
        <h3 className="text-3xl font-black text-white tracking-tight">
          {thisWeekDisplay}
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          {anyLinked
            ? '20m avg / day • peak: Tue 1h 10m'
            : '0m avg / day • Koppel accounts om sessies bij te houden'}
        </p>
      </div>

      {/* MODAL LINK PLATFORM */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${
                  showLinkModal === 'playstation'
                    ? 'bg-blue-600'
                    : showLinkModal === 'xbox'
                    ? 'bg-emerald-700'
                    : 'bg-slate-800'
                }`}
              >
                {showLinkModal === 'playstation'
                  ? '🎮'
                  : showLinkModal === 'xbox'
                  ? '🟩'
                  : '💨'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white capitalize">
                  {showLinkModal} Account Koppelen
                </h3>
                <p className="text-xs text-slate-400">
                  {showLinkModal === 'playstation'
                    ? 'Vul je PSN Online ID in om 12.201h speeluren en trophies in te laden.'
                    : showLinkModal === 'xbox'
                    ? 'Vul je Xbox Gamertag in om 256h en Gamerscore in te laden.'
                    : 'Vul je Steam ID in om 1.723h en Steam badges in te laden.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmLink} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {showLinkModal === 'playstation'
                    ? 'PSN Online ID'
                    : showLinkModal === 'xbox'
                    ? 'Xbox Gamertag'
                    : 'Steam ID / Gebruikersnaam'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputHandle}
                  onChange={(e) => setInputHandle(e.target.value)}
                  placeholder={
                    showLinkModal === 'playstation'
                      ? 'bijv. Maffia_Games_'
                      : showLinkModal === 'xbox'
                      ? 'bijv. MaffiaChief#4521'
                      : 'bijv. maffia_games'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Koppelen & Uren Inladen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
