import React, { useState } from 'react';

// --- ICONEN ---
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconChat = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const IconLink = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
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
          <span className="text-[9px] md:hidden mt-0.5 font-bold">Account</span>
        </button>
      </div>

      {/* HOOFDINHOUD */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* TAB 1: DASHBOARD & STATS */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">Welcome back, maffia_games</h1>
                <p className="text-xs md:text-sm text-slate-400">Jouw gaming statistieken over alle platformen</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {['All Platforms', 'Steam', 'PlayStation', 'Xbox', 'Other'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedPlatform === p ? 'bg-slate-800 text-white border border-slate-700 shadow-md' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-white">1.071</p>
                  <p className="text-xs text-slate-400">Games played</p>
                </div>
                <span className="text-3xl">🎮</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-amber-400">6.895</p>
                  <p className="text-xs text-slate-400">Achievements</p>
                </div>
                <span className="text-3xl">🏆</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-white">17h 1m</p>
                  <p className="text-xs text-slate-400">Best session</p>
                </div>
                <span className="text-3xl">📅</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xl md:text-2xl font-black text-emerald-400">31h 55m</p>
                  <p className="text-xs text-slate-400">This week</p>
                </div>
                <span className="text-3xl">⚡</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-white">14.466h</h2>
                  <p className="text-xs text-slate-400">across 1071 games</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">MOST PLAYED</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Fortnite</span>
                      </span>
                      <span className="text-slate-400 font-mono">1.986h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Call of Duty</span>
                      </span>
                      <span className="text-slate-400 font-mono">1.607h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200">Tom Clancy Rainbow Six Siege</span>
                      </span>
                      <span className="text-slate-400 font-mono">860h</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">PLATFORM BREAKDOWN</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-indigo-400">PlayStation</span>
                        <span className="text-slate-400">12.199h</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[84%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-cyan-400">Steam</span>
                        <span className="text-slate-400">1.723h</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-[12%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-blue-400">Epic Games</span>
                        <span className="text-slate-400">287h</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[3%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-400">Xbox</span>
                        <span className="text-slate-400">256h</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[2%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">Your week</h2>
                  <p className="text-xs text-slate-400 mb-4">Down 52h on last week. Firefighting Simulator took half of it</p>

                  <div className="flex items-end justify-between h-36 pt-4 pb-2 px-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-2">
                        <div
                          className={`w-8 rounded-t-lg transition-all ${idx === 4 ? 'bg-amber-400 h-24 shadow-lg shadow-amber-400/20' : idx === 3 ? 'bg-slate-700 h-16' : 'bg-slate-800 h-4'}`}
                        ></div>
                        <span className="text-[10px] font-bold text-slate-500">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-lg">
                    🎧
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">maffia_games @maffiagames</p>
                    <p className="text-[11px] text-slate-400">News • 6h ago • Bus Simulator 21 Next S...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex overflow-hidden w-full">
            <div className="w-16 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-4 space-y-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                💬
              </div>
              <hr className="w-8 border-slate-800" />
              <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-lg">🐉</div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-lg relative">
                🐺
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] px-1 rounded-full">23</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-lg relative">
                👑
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] px-1 rounded-full">62</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-900">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h1 className="text-lg font-black text-white">Berichten</h1>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
                  + Vrienden toevoegen
                </button>
              </div>

              <div className="p-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs font-bold">P</div>
                      <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center text-xs font-bold">B</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">PopeyeSpeirs en BBP dragon90</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">Chilling in spraakkanaal</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400">🔊</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-2">
                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm">P</div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">PopeyeSpeirs</span>
                        <span className="text-[9px] font-black bg-red-600/30 text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded">ARC</span>
                      </div>
                      <p className="text-[11px] text-slate-400">ARC Raiders</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">8 u</span>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm">G</div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">grimmkiller#5127</span>
                        <span className="text-[9px] font-black bg-blue-600/30 text-blue-400 border border-blue-500/40 px-1.5 py-0.5 rounded">Anii</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Jij: 1 afbeelding</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">1d</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                      MG
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black text-white">MaffiaGames</span>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1 rounded">//WD</span>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-semibold">Online</p>
                  </div>
                </div>
                <button className="p-2 bg-slate-800 rounded-xl text-slate-300">🔔</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VERBINDINGEN */}
        {activeTab === 'connections' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Verbindingen</h1>
              <p className="text-xs md:text-sm text-slate-400">Gekoppelde accounts die zichtbaar zijn op je profiel</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-3">
              {CONNECTIONS_DATA.map((conn) => (
                <div key={conn.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/40 transition">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl ${conn.color} flex items-center justify-center text-lg shadow-md`}>
                      {conn.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{conn.account}</span>
                        {conn.verified && <span className="text-xs text-blue-400">✓</span>}
                      </div>
                      <p className="text-xs text-slate-400">{conn.name} {conn.details ? `• ${conn.details}` : ''}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-sm">↗</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INSTELLINGEN */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-black text-white">Account Instellingen</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <button className="w-full flex items-center justify-between py-2 text-left">
                <span className="text-sm font-bold text-slate-200">Wachtwoord</span>
                <IconChevronRight />
              </button>
              <hr className="border-slate-800/80" />

              <button className="w-full flex items-center justify-between py-2 text-left">
                <div>
                  <span className="text-sm font-bold text-slate-200 block">Beveiligingscodes</span>
                  <span className="text-xs text-slate-500">2 toegevoegd</span>
                </div>
                <IconChevronRight />
              </button>
              <hr className="border-slate-800/80" />

              <button className="w-full flex items-center justify-between py-2 text-left">
                <span className="text-sm font-bold text-slate-200">Backupcodes bekijken</span>
                <IconChevronRight />
              </button>
              <hr className="border-slate-800/80" />

              <button className="w-full flex items-center justify-between py-2 text-left">
                <span className="text-sm font-bold text-slate-200">Authenticator-app verwijderen</span>
                <IconChevronRight />
              </button>
              <hr className="border-slate-800/80" />

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-bold text-slate-200">SMS-backup authenticatie</span>
                <button
                  onClick={() => setSmsBackup(!smsBackup)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 ${smsBackup ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${smsBackup ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Accountstatus</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-slate-200">Leeftijdsgroep</span>
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded">NIEUW</span>
                    <span className="text-xs font-bold text-slate-300">Volwassen</span>
                    <IconChevronRight />
                  </div>
                </div>
                <hr className="border-slate-800/80" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-slate-200">Accountstatus</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-400">Alles in orde!</span>
                    <IconChevronRight />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Accountmanagement</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <button className="w-full text-left py-2 text-sm font-bold text-slate-200">
                  Account uitschakelen
                </button>
                <hr className="border-slate-800/80" />

                <button className="w-full text-left py-2 text-sm font-bold text-red-500">
                  Verwijder account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
