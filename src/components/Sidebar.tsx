import React from 'react';
import { Newspaper, Server as ServerIcon, MessageSquare, Link2, Settings } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: 'news' | 'servers' | 'friends' | 'connections' | 'settings';
  setActiveTab: (tab: 'news' | 'servers' | 'friends' | 'connections' | 'settings') => void;
  currentUser: User;
  unreadDmCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadDmCount = 0,
}) => {
  const tabs = [
    { id: 'news' as const, label: 'Nieuws', icon: Newspaper, tooltip: 'Live Gaming Nieuws' },
    { id: 'servers' as const, label: 'Servers', icon: ServerIcon, tooltip: 'Gaming Servers' },
    { id: 'friends' as const, label: 'Vrienden', icon: MessageSquare, tooltip: "Vrienden & DM's", badge: unreadDmCount },
    { id: 'connections' as const, label: 'Links', icon: Link2, tooltip: 'Gekoppelde Accounts' },
    { id: 'settings' as const, label: 'Account', icon: Settings, tooltip: 'Account Instellingen' },
  ];

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 space-x-1 md:space-x-0 md:space-y-6 z-30 shrink-0"
    >
      {/* Desktop Brand Logo */}
      <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/20">
        GH
      </div>
      <hr className="hidden md:block w-10 border-slate-800" />

      {/* Tabs */}
      <div className="flex flex-row md:flex-col items-center justify-around md:justify-start w-full md:w-auto space-x-1 md:space-x-0 md:space-y-4">
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-slate-900">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Bottom User Mini Profile */}
      <div className="hidden md:flex mt-auto flex-col items-center pt-4">
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
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </button>
      </div>
    </nav>
  );
};
