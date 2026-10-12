import React, { useState, useEffect, useRef } from 'react';

// --- INLINE SVG ICONEN ---
const IconNews = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
);
const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
);
const IconServer = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
);
const IconMic = ({ muted }) => (
  <svg className={`w-5 h-5 ${muted ? 'text-red-500' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {muted ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18"/>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
    )}
  </svg>
);
const IconPhoneOff = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/></svg>
);
const IconPhoneCall = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
);

// --- DATA ---
const INITIAL_SERVERS = [
  {
    id: 's1',
    name: 'Chunkz SMP',
    icon: '⛏️',
    channels: [
      { id: 'c1', name: 'algemeen', type: 'text' },
      { id: 'c2', name: 'mc-builds', type: 'text' },
      { id: 'v1', name: '🔊 Spraak Kanaal 1', type: 'voice' }
    ]
  },
  {
    id: 's2',
    name: 'Palworld Guild',
    icon: '🐾',
    channels: [
      { id: 'c3', name: 'chat', type: 'text' },
      { id: 'c4', name: 'pals-ruilen', type: 'text' },
      { id: 'v2', name: '🔊 Raids Spraak', type: 'voice' }
    ]
  }
];

const MOCK_ACHIEVEMENTS = [
  { id: '1', game: 'Elden Ring', title: 'Elden Lord', platform: 'PLAYSTATION', rarity: '8.4%', unlocked: true, icon: '🏆' },
  { id: '2', game: 'Palworld', title: 'Pal Master', platform: 'STEAM', rarity: '14.2%', unlocked: true, icon: '🐾' },
  { id: '3', game: 'Halo Infinite', title: 'Legendary', platform: 'XBOX', rarity: '3.1%', unlocked: false, icon: '🎯' },
  { id: '4', game: 'Minecraft', title: 'Diamonds!', platform: 'STEAM', rarity: '65.0%', unlocked: true, icon: '💎' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [activeTab, setActiveTab] = useState('servers');

  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [selectedServer, setSelectedServer] = useState(INITIAL_SERVERS[0]);
  const [selectedChannel, setSelectedChannel] = useState(INITIAL_SERVERS[0].channels[0]);
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Alex#1337', text: 'Welkom op GamerHub! Wie is er in voor Palworld?', time: '14:20' },
    { id: 'm2', sender: 'VermeerCraats#2026', text: 'Ik ben online op de Chunkz SMP server!', time: '14:22' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const [activeVoiceChannel, setActiveVoiceChannel] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const [friends, setFriends] = useState([
    { id: 'f1', name: 'MaffiaGamer#1337', status: 'online', game: 'Palworld (PC)' },
    { id: 'f2', name: 'VermeerCraats#2026', status: 'online', game: 'Elden Ring (PS5)' },
    { id: 'f3', name: 'ChunkzAdmin#9999', status: 'offline', game: 'Geen' }
  ]);
  const [activeDmFriend, setActiveDmFriend] = useState(null);
  const [dmMessages, setDmMessages] = useState({});
  const [dmInput, setDmInput] = useState('');
  const [active1on1Call, setActive1on1Call] = useState(null);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, dmMessages]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login' || authMode === 'register') {
      setAuthMode('2fa');
    } else if (authMode === '2fa') {
      if (otp.length === 6) {
        setUser({ name: username || 'GamerPro#1337', email, phone });
      } else {
        alert('Vul de 6-cijferige SMS-code in (bijv. 123456)');
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: user ? user.name : 'Jij#0001',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  const handleSendDm = () => {
    if (!dmInput.trim() || !activeDmFriend) return;
    const friendId = activeDmFriend.id;
    const existing = dmMessages[friendId] || [];
    const newMsg = {
      id: Date.now().toString(),
      sender: user ? user.name : 'Jij#0001',
      text: dmInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDmMessages({ ...dmMessages, [friendId]: [...existing, newMsg] });
    setDmInput('');
  };

  const handleChannelClick = (channel) => {
    if (channel.type === 'voice') {
      if (activeVoiceChannel?.id === channel.id) {
        setActiveVoiceChannel(null);
      } else {
        setActiveVoiceChannel(channel);
      }
    } else {
      setSelectedChannel(channel);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl mb-3 shadow-lg shadow-indigo-500/30">
              GH
            </div>
            <h1 className="text-2xl font-bold text-white">GamerHub Ultra</h1>
            <p className="text-slate-400 text-sm mt-1">Inloggen met 2-Staps Verificatie</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode !== '2fa' ? (
              <>
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Gebruikersnaam</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="bijv. GamerTag#1337"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">E-mailadres</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">GSM Nummer (voor SMS 2FA)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 12345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
                >
                  {authMode === 'login' ? 'Verder naar SMS Verificatie' : 'Account Aanmaken'}
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    {authMode === 'login' ? 'Nog geen account? Registreer hier' : 'Al een account? Log in'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-indigo-200">SMS-code verzonden naar <span className="font-semibold">{phone}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Vul de 6-cijferige code in om in te loggen (vul 123456 in voor test).</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">SMS Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-600/30"
                >
                  Verifieer & Inloggen
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 space-y-4 z-20">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-600/30">
          GH
        </div>
        <hr className="w-8 border-slate-800" />
        <button
          onClick={() => setActiveTab('news')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${activeTab === 'news' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Gamenieuws"
        >
          <IconNews />
        </button>
        <button
          onClick={() => setActiveTab('trophies')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${activeTab === 'trophies' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Pyroblast Trophies"
        >
          <IconTrophy />
        </button>
        <button
          onClick={() => setActiveTab('servers')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${activeTab === 'servers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Discord Servers"
        >
          <IconServer />
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${activeTab === 'friends' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Vrienden & DM's"
        >
          <IconUsers />
        </button>

        <div className="mt-auto pt-4 border-t border-slate-800 w-full flex justify-center">
          <button
            onClick={() => setUser(null)}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 flex items-center justify-center text-xs font-bold transition"
            title="Uitloggen"
          >
            Uit
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'news' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Gamenieuws & Releases</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="h-40 bg-slate-800 rounded-xl mb-3 flex items-center justify-center text-4xl">🎮</div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Gamer.nl • 10m geleden</span>
                <h2 className="text-lg font-bold mt-1">Palworld Update Brengt Crossplay Tussen PC & PS5</h2>
                <p className="text-sm text-slate-400 mt-2">Spelers kunnen nu naadloos samenwerken op dedicated servers tussen PlayStation 5 en PC.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="h-40 bg-slate-800 rounded-xl mb-3 flex items-center justify-center text-4xl">🏆</div>
                <span className="text-xs font-bold text-emerald-400 uppercase">IGN • 1u geleden</span>
                <h2 className="text-lg font-bold mt-1">Elden Ring DLC Trophies Bekendgemaakt</h2>
                <p className="text-sm text-slate-400 mt-2">Ontdek alle nieuwe platina trophies en geheime achievements voor de aankomende uitbreiding.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Pyroblast Trophy Hub</h1>
                <p className="text-sm text-slate-400">Gekoppelde accounts: Steam, PlayStation Network, Xbox Live</p>
              </div>
              <div className="flex space-x-2">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-lg font-semibold">PSN Online</span>
                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg font-semibold">Xbox Live</span>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold">Steam Connected</span>
              </div>
            </div>

            <div className="space-y-3">
              {MOCK_ACHIEVEMENTS.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl bg-slate-800 p-3 rounded-xl">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-slate-100">{item.title}</h3>
                      <p className="text-xs text-slate-400">{item.game} • {item.platform}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${item.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {item.unlocked ? 'Ontgrendeld' : 'Vergrendeld'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Zeldzaamheid: {item.rarity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'servers' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                <h2 className="font-bold text-slate-200">{selectedServer.name}</h2>
              </div>
              <div className="flex-1 p-2 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Kanalen</div>
                {selectedServer.channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelClick(chan)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center space-x-2 transition ${
                      selectedChannel.id === chan.id ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{chan.type === 'voice' ? '🔊' : '#'}</span>
                    <span>{chan.name}</span>
                  </button>
                ))}
              </div>

              {activeVoiceChannel && (
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{activeVoiceChannel.name}</p>
                      <p className="text-[10px] text-emerald-400">Verbonden</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700">
                      <IconMic muted={isMuted} />
                    </button>
                    <button onClick={() => setActiveVoiceChannel(null)} className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500">
                      <IconPhoneOff />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col bg-slate-950">
              <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
                <h3 className="font-bold text-slate-200">#{selectedChannel.name}</h3>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-3.5 max-w-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400">{m.sender}</span>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <p className="text-sm text-slate-200">{m.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Bericht sturen in #${selectedChannel.name}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
                  >
                    Stuur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                <h2 className="font-bold text-slate-200">Vrienden & DM's</h2>
              </div>
              <div className="flex-1 p-2 space-y-1">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setActiveDmFriend(friend)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                      activeDmFriend?.id === friend.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-200">{friend.name}</p>
                      <p className="text-xs text-slate-400">{friend.game}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${friend.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-950">
              {activeDmFriend ? (
                <>
                  <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-200">{activeDmFriend.name}</h3>
                      <p className="text-xs text-emerald-400">{activeDmFriend.game}</p>
                    </div>
                    <button
                      onClick={() => setActive1on1Call(active1on1Call ? null : activeDmFriend)}
                      className={`p-2 rounded-xl border transition ${
                        active1on1Call ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-emerald-400'
                      }`}
                    >
                      <IconPhoneCall />
                    </button>
                  </div>

                  {active1on1Call && (
                    <div className="bg-emerald-950/40 border-b border-emerald-800/50 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center animate-pulse">
                          📞
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-200">Spraakoproep met {active1on1Call.name}</p>
                          <p className="text-xs text-emerald-400">Verbonden • 00:42</p>
                        </div>
                      </div>
                      <button onClick={() => setActive1on1Call(null)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl">
                        Ophangen
                      </button>
                    </div>
                  )}

                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {(dmMessages[activeDmFriend.id] || []).map((m) => (
                      <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 max-w-xl">
                        <span className="text-xs font-bold text-indigo-400 mr-2">{m.sender}</span>
                        <span className="text-[10px] text-slate-500">{m.time}</span>
                        <p className="text-sm text-slate-200 mt-1">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={dmInput}
                        onChange={(e) => setDmInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}
                        placeholder={`Privébericht naar ${activeDmFriend.name}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <button onClick={handleSendDm} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                        Stuur
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  Kies een vriend uit de lijst om een privégesprek te starten.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
