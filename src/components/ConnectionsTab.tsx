import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Connection } from '../types';

interface ConnectionsTabProps {
  connections: Connection[];
  onAddConnection: (platform: Connection['platform'], handle: string) => void;
  onDeleteConnection: (id: string) => void;
  onLoadStarterConnections?: () => void;
}

export const ConnectionsTab: React.FC<ConnectionsTabProps> = ({
  connections,
  onAddConnection,
  onDeleteConnection,
  onLoadStarterConnections,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [platform, setPlatform] = useState<Connection['platform']>('Twitch');
  const [handle, setHandle] = useState('');

  const platformMeta: Record<
    Connection['platform'],
    { icon: string; color: string; label: string; placeholder: string; prefix?: string }
  > = {
    Twitch: { icon: '💜', color: 'bg-purple-600', label: 'Twitch', placeholder: 'twitch_naam' },
    YouTube: { icon: '▶️', color: 'bg-red-600', label: 'YouTube Gaming', placeholder: '@kanaalnaam' },
    Discord: { icon: '💬', color: 'bg-indigo-600', label: 'Discord', placeholder: 'Gebruikersnaam#0000' },
    Spotify: { icon: '🎵', color: 'bg-emerald-600', label: 'Spotify', placeholder: 'spotify_gebruiker' },
    TikTok: { icon: '📱', color: 'bg-pink-600', label: 'TikTok', placeholder: '@tiktok_tag' },
    PlayStation: { icon: '🎮', color: 'bg-blue-600', label: 'PlayStation Network', placeholder: 'PSN Online ID' },
    Steam: { icon: '💨', color: 'bg-slate-800', label: 'Steam', placeholder: 'Steam Community ID' },
    Xbox: { icon: '🟩', color: 'bg-emerald-700', label: 'Xbox Network', placeholder: 'Xbox Gamertag' },
    Nintendo: { icon: '🔴', color: 'bg-rose-600', label: 'Nintendo Switch', placeholder: 'SW-0000-0000-0000' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    onAddConnection(platform, handle.trim());
    setHandle('');
    setShowModal(false);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gekoppelde Accounts & Verbindingen
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Toon je gaming platforms, streams en sociale profielen op je GamerHub paspoort.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Verbinding Koppelen</span>
        </button>
      </div>

      {/* Connections List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-3">
        {connections.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-xl">
              🔗
            </div>
            <div>
              <p className="text-sm font-bold text-white">Nog geen gekoppelde accounts</p>
              <p className="text-xs text-slate-400 mt-1">
                Koppel je PlayStation, Steam, Discord of Twitch account om je gaming profiel compleet te maken.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Koppel Jouw Eerste Account</span>
            </button>
          </div>
        ) : (
          connections.map((c) => {
            const meta = platformMeta[c.platform] || {
              icon: c.icon || '🌐',
              color: c.color || 'bg-slate-800',
              label: c.platform,
            };

            return (
              <div
                key={c.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl ${c.color || meta.color} flex items-center justify-center text-xl shrink-0 shadow-md`}
                  >
                    {c.icon || meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white truncate">{c.handle}</span>
                      {c.verified && (
                        <span
                          className="inline-flex items-center text-[11px] text-blue-400 font-bold"
                          title="Geverifieerd account"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-medium">{c.platform}</span>
                      {c.details && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 truncate">{c.details}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteConnection(c.id)}
                  className="text-slate-500 hover:text-red-400 hover:bg-slate-800 p-2 rounded-xl transition"
                  title="Verbinding ontkoppelen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Security note */}
      <div className="flex items-start space-x-3 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          Verificatie status wordt automatisch toegekend aan actieve gaming accounts. Je inloggegevens worden
          nooit gedeeld met derden.
        </p>
      </div>

      {/* Modal Add Connection */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-black text-white">+ Verbinding Koppelen</h2>
              <p className="text-xs text-slate-400 mt-1">
                Kies een netwerk en vul je gebruikersnaam of tag in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Connection['platform'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {Object.keys(platformMeta).map((key) => (
                    <option key={key} value={key}>
                      {platformMeta[key as Connection['platform']].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Gebruikersnaam / Handle
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder={platformMeta[platform].placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Koppelen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
