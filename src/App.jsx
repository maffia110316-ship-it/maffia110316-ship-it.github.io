 import React, { useState } from 'react';

// --- ICONEN ---
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
);
const IconChat = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
);
const IconLink = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
);
const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
);

// --- PLATFORM VERBINDINGEN DATA ---
const CONNECTIONS_DATA = [
  { id: 'fb', name: 'Facebook', account: 'Mike Vanderwaeren', verified: true, icon: '🌐', color: 'bg-blue-600' },
  { id: 'psn', name: 'PlayStation', account: 'Maffia_Games_', verified: true, icon: '🎮', color: 'bg-indigo-600' },
  { id: 'roblox', name: 'Roblox', account: 'maffia_games', verified: true, icon: '🧱', color: 'bg-slate-700' },
  { id: 'spotify', name: 'Spotify', account: 'Mike Vanderwaeren', verified: true, icon: '🎵', color: 'bg-emerald-600' },
  { id: 'steam', name: 'Steam', account: 'maffia_games', verified: true, details: 'Lid sinds 28 aug 2016 • 91 games', icon: '💨', color: 'bg-slate-800' },
  { id: 'tiktok', name: 'TikTok', account: 'maffiagames', verified: true, details: '113 volgers • 336 volgend • 297 likes', icon: '📱', color: 'bg-pink-600' },
  { id: 'twitch', name: 'Twitch', account: 'maffia_games_', verified: true, icon: '💜', color: 'bg-purple-600' },
  { id: 'xbox', name: 'Xbox', account: 'maffiagames', verified: true, icon: '🟢', color: 'bg-green-600' },
  { id: 'youtube', name: 'YouTube', account: 'maffia_games_', verified: true, icon: '▶️', color: 'bg-red-600' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [smsBackup, setSmsBackup] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      
      {/* MOBIELE HEADER */}
      <div className="md:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            GH
          </div>
          <span className="font-bold text-sm tracking-wide text-white">GamerHub Ultra</span>
        </div>
      </div>

      {/* NAVIGATIEBALK LINKS */}
      <div className="order-last md:order-first w-full md:w-20 h-16 md:h-full bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-0 md:py-6 space-x-1 md:space-x-0 md:space-y-6 z-30 shrink-0">
        <div className="hidden md:flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30">
          GH
        </div>
        <hr className="hidden md:block w-10 border-slate-800" />

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Dashboard & Stats"
        >
          <IconDashboard />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center relative ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Discord Berichten"
        >
          <IconChat />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Chat</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[9px] px-1.5 rounded-full">9+</span>
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'connections' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Verbindingen"
        >
          <IconLink />
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Links</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`p-3 rounded-2xl transition flex flex-col md:flex-row items-center ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Account Instellingen"
        >
          <IconSettings />
          <span className="text-[9px] md:hidden mt-0.5 font-bold
