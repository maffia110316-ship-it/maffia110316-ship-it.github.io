import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Search, Flame, Clock, Radio, Sparkles, Newspaper, Globe } from 'lucide-react';
import { NewsItem } from '../types';
import { formatNewsDate } from '../services/newsService';

interface NewsTabProps {
  news: NewsItem[];
  loading: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
  hasNewIncoming?: boolean;
}

export const NewsTab: React.FC<NewsTabProps> = ({
  news,
  loading,
  onRefresh,
  lastUpdated,
  hasNewIncoming,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('alle');

  const filteredNews = news.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedTag === 'alle') return true;

    const tagLower = selectedTag.toLowerCase();
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const catsLower = (item.categories || []).map((c) => c.toLowerCase());
    const authorLower = (item.author || '').toLowerCase();

    return (
      titleLower.includes(tagLower) ||
      descLower.includes(tagLower) ||
      catsLower.some((c) => c.includes(tagLower)) ||
      authorLower.includes(tagLower)
    );
  });

  const tags = ['alle', 'Nederlands', 'PlayStation', 'Xbox', 'PC', 'Nintendo', 'GTA'];

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Live Gaming Nieuws Feed
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Rechtstreeks gekoppeld aan live feeds van IGN Benelux 🇳🇱, PC Gamer en GameSpot.</span>
            <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Real-Time Live</span>
            </span>
            {lastUpdated && <span className="text-slate-500">• Laatste sync: {lastUpdated}</span>}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Nieuws Vernieuwen...' : 'Nu Vernieuwen'}</span>
        </button>
      </div>

      {/* Real-time incoming notice */}
      {hasNewIncoming && (
        <div className="p-3 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 rounded-2xl flex items-center justify-between text-xs text-indigo-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Gloednieuwe gaming artikelen zojuist automatisch live toegevoegd!</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Live Auto-Sync</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek in artikelen of games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading && news.length === 0 ? (
        <div className="p-16 text-center space-y-3">
          <div className="inline-block animate-spin text-indigo-400">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Live artikelen ophalen van IGN Benelux, PC Gamer en GameSpot...
          </p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          Geen artikelen gevonden voor &apos;{searchQuery}&apos;. Probeer een andere zoekterm of tag.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => {
            const cleanDescription = item.description
              ? item.description.replace(/<[^>]*>?/gm, '').trim()
              : '';

            const relativeTime = formatNewsDate(item.pubDate);
            const isDutch = item.author?.includes('Benelux') || item.categories?.includes('Nederlands');

            return (
              <a
                key={item.id || item.link || index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-3xl overflow-hidden transition flex flex-col justify-between shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 duration-200 relative"
              >
                {/* Article Image Header */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={
                      item.thumbnail ||
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Source and Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md border backdrop-blur-md ${
                        isDutch
                          ? 'bg-orange-600/80 border-orange-500/60 text-white'
                          : 'bg-indigo-900/80 border-indigo-500/60 text-indigo-200'
                      }`}
                    >
                      {item.author || 'Gaming Nieuws'}
                    </span>
                  </div>

                  {item.isNew && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                      Nieuw
                    </span>
                  )}

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center space-x-1 font-semibold text-slate-200 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>{relativeTime}</span>
                    </span>
                    <span className="text-slate-400 group-hover:text-white transition">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h2 className="text-sm md:text-base font-bold text-white group-hover:text-indigo-200 transition leading-snug line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {cleanDescription || 'Klik om het volledige artikel en details te bekijken.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lees nu</span>
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
