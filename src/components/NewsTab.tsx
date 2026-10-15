import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Search, Flame, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsTabProps {
  news: NewsItem[];
  loading: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
}

export const NewsTab: React.FC<NewsTabProps> = ({ news, loading, onRefresh, lastUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('alle');

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedTag === 'alle') return matchesSearch;
    return matchesSearch && item.title.toLowerCase().includes(selectedTag.toLowerCase());
  });

  const tags = ['alle', 'PlayStation', 'Xbox', 'Nintendo', 'PC', 'GTA'];

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Live Gaming Nieuws Feed
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Rechtstreeks opgehaald van Nederlandse gaming RSS-servers (Gamer.nl)
            {lastUpdated && <span className="ml-2 text-slate-500">• Bijgewerkt: {lastUpdated}</span>}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Laden...' : 'Vernieuwen'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek in gaming artikelen..."
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="inline-block animate-spin text-indigo-400">
            <RefreshCw className="w-8 h-8" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Live gaming artikelen aan het ophalen van de servers...
          </p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          Geen artikelen gevonden voor "{searchQuery}". Probeer een andere zoekterm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item, index) => {
            // Strip HTML tags for clean preview
            const cleanDescription = item.description
              ? item.description.replace(/<[^>]*>?/gm, '').trim()
              : '';

            return (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/60 rounded-3xl p-5 transition flex flex-col justify-between shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      <Clock className="w-3 h-3" />
                      <span>{item.pubDate}</span>
                    </span>
                    <span className="text-slate-500 text-xs group-hover:text-indigo-400 transition">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-indigo-200 transition leading-snug line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {cleanDescription || 'Klik om het volledige nieuwsbericht op Gamer.nl te lezen.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.author || 'Gamer.nl Nieuws'}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span>Lees artikel</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
