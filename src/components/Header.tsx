import React from 'react';
import { Bell } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onOpenSettings: () => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
  onOpenBetaTester?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenSettings,
  unreadNotifCount = 0,
  onOpenNotifications,
  onOpenBetaTester,
}) => {
  return (
    <header className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xs shadow-md">
          GH
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xs text-white tracking-tight">GamerHub</span>
          <span className="text-[9px] text-slate-400 font-medium">Ultra Gaming</span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        {onOpenBetaTester && (
          <button
            onClick={onOpenBetaTester}
            className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md shadow-indigo-600/30 transition animate-pulse"
            title="Beta Tester Uitnodigen"
          >
            <span>🚀</span>
            <span>Beta</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
          title="Meldingen"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5865f2] text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {unreadNotifCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-800 transition"
          title="Profiel openen"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500 object-cover"
          />
        </button>
      </div>
    </header>
  );
};
