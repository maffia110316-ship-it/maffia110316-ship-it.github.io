import React from 'react';
import { Bell } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onOpenSettings: () => void;
  unreadNotifCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenSettings,
  unreadNotifCount = 0,
  onOpenNotifications,
}) => {
  return (
    <header className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xs shadow-md">
          GH
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm text-white tracking-tight">GamerHub Ultra</span>
          <span className="text-[10px] text-slate-400 font-medium">Gaming Platform</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
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
