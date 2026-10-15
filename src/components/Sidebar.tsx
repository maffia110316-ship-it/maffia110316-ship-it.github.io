import React from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Server as ServerIcon,
  MessageSquare,
  Trophy,
  Link2,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-react';
import { User, AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  currentUser: User;
  unreadDmCount?: number;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
  onOpenBetaTester?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadDmCount = 0,
  unreadNotifCount = 0,
  onOpenNotifications,
  onOpenBetaTester,
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Stats',
      icon: LayoutDashboard,
      tooltip: 'Pyroblast Stats Dashboard (0 uren/games tot koppeling)',
    },
    {
      id: 'servers' as const,
      label: 'Discord',
      icon: ServerIcon,
      tooltip: 'Discord.gg Servers & Spraakkanalen',
    },
    {
      id: 'friends' as const,
      label: 'Vrienden',
      icon: MessageSquare,
      tooltip: 'Vrienden & Voice Calls',
      badge: unreadDmCount,
    },
    {
      id: 'achievements' as const,
      label: 'Trofeeën',
      icon: Trophy,
      tooltip: 'PlayStation, Xbox & Steam Achievements',
    },
    {
      id: 'news' as const,
      label: 'Nieuws',
      icon: Newspaper,
      tooltip: 'Live Gaming Nieuws Feed',
    },
    {
      id: 'settings' as const,
      label: 'Account',
      icon: Settings,
      tooltip: 'Account, Banner & 2FA',
    },
  ];

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-5 space-x-1 md:space-x-0 md:space-y-4 z-30 shrink-0"
    >
      {/* Desktop Brand Logo */}
      <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/20">
        GH
      </div>
      <hr className="hidden md:block w-10 border-slate-800" />

      {/* Tabs */}
      <div className="flex flex-row md:flex-col items-center justify-around md:justify-start w-full md:w-auto space-x-1 md:space-x-0 md:space-y-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative p-3 rounded-2xl transition flex flex-col md:flex-row items-center group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
              title={tab.tooltip}
              aria-label={tab.tooltip}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] md:hidden mt-0.5 font-bold tracking-tight">
                {tab.label}
              </span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Bottom Notification Bell & User Mini Profile */}
      <div className="hidden md:flex mt-auto flex-col items-center space-y-2.5 pt-2">
        {/* Beta Tester Button */}
        {onOpenBetaTester && (
          <button
            type="button"
            onClick={onOpenBetaTester}
            className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 hover:from-purple-600 hover:to-indigo-600 text-indigo-300 hover:text-white transition shadow-sm border border-indigo-500/40 group relative"
            title="Beta Tester Programma (Mensen Uitnodigen)"
          >
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping" />
          </button>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition shadow-sm border border-slate-700/60"
          title="Meldingen bekijken (Oproepen, Berichten & Vrienden)"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5865f2] text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-slate-900 animate-bounce">
              {unreadNotifCount}
            </span>
          )}
        </button>

        {/* User Avatar with Discord dot */}
        <button
          onClick={() => setActiveTab('settings')}
          className="relative group p-1 rounded-2xl hover:bg-slate-800 transition"
          title={`${currentUser.username} (Account Instellingen)`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-indigo-500 object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 ring-1 ring-emerald-400/50" />
        </button>
      </div>
    </nav>
  );
};
