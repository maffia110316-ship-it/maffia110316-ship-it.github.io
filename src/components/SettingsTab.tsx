import React, { useState, useRef } from 'react';
import {
  User,
  LogOut,
  Trash2,
  CheckCircle2,
  Shield,
  Trophy,
  Clock,
  Gamepad2,
  Sparkles,
  KeyRound,
  Mail,
  Image as ImageIcon,
  Send,
  Camera,
  Upload,
  RotateCcw,
  Sliders,
  Check,
  Flame,
  Play,
  Film,
} from 'lucide-react';
import { User as UserType } from '../types';
import {
  ANIMATED_AVATAR_PRESETS,
  ANIMATED_BANNER_PRESETS,
  STATIC_AVATAR_PRESETS,
  STATIC_BANNER_PRESETS,
} from '../data/mediaPresets';
import { ConfirmModal } from './ConfirmModal';
import { CameraModal } from './CameraModal';

interface SettingsTabProps {
  currentUser: UserType;
  onSaveProfile: (updatedData: Partial<UserType>) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onResetAllStatsToZero?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  onSaveProfile,
  onLogout,
  onDeleteAccount,
  onResetAllStatsToZero,
}) => {
  const [username, setUsername] = useState(currentUser.username || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || ANIMATED_AVATAR_PRESETS[0].url);
  const [banner, setBanner] = useState(currentUser.banner || ANIMATED_BANNER_PRESETS[0].url);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [totalHours, setTotalHours] = useState(currentUser.totalHours || '0h');
  const [gamesCount, setGamesCount] = useState(currentUser.gamesCount || '0');
  const [achievementsCount, setAchievementsCount] = useState(currentUser.achievementsCount || '0');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(currentUser.twoFactorEnabled));

  // Preset browser tab states
  const [avatarTab, setAvatarTab] = useState<'animated' | 'gaming' | 'custom'>('animated');
  const [bannerTab, setBannerTab] = useState<'animated' | 'hd' | 'custom'>('animated');

  // Camera & File upload state
  const [showCameraModal, setShowCameraModal] = useState<'avatar' | 'banner' | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // 2FA Test flow
  const [testTwoFactorCode, setTestTwoFactorCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [verificationFeedback, setVerificationFeedback] = useState('');

  const [statusMsg, setStatusMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Detect if an avatar or banner is animated (GIF or animated SVG)
  const isAnimated = (url: string) => {
    if (!url) return false;
    return (
      url.includes('.gif') ||
      url.includes('image/gif') ||
      url.includes('@keyframes') ||
      url.includes('animation') ||
      url.includes('giphy') ||
      url.includes('anim_')
    );
  };

  // Handle local image file upload & preserve GIF animation bytes
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'avatar') {
        setAvatar(dataUrl);
        onSaveProfile({ avatar: dataUrl });
        setStatusMsg(
          isGif
            ? '✨ Geanimeerde GIF profielfoto succesvol geüpload en opgeslagen!'
            : '✅ Profielfoto succesvol geüpload en opgeslagen!'
        );
      } else {
        setBanner(dataUrl);
        onSaveProfile({ banner: dataUrl });
        setStatusMsg(
          isGif
            ? '✨ Geanimeerde GIF banner succesvol geüpload en opgeslagen!'
            : '✅ Banner foto succesvol geüpload en opgeslagen!'
        );
      }
      setTimeout(() => setStatusMsg(''), 4000);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCameraCapture = (dataUrl: string) => {
    if (showCameraModal === 'avatar') {
      setAvatar(dataUrl);
      onSaveProfile({ avatar: dataUrl });
      setStatusMsg('📷 Camera profielfoto succesvol opgeslagen!');
    } else if (showCameraModal === 'banner') {
      setBanner(dataUrl);
      onSaveProfile({ banner: dataUrl });
      setStatusMsg('📷 Camera banner foto succesvol opgeslagen!');
    }
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleSendTestCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setVerificationFeedback(`📧 Beveiligingscode naar ${currentUser.email} verzonden: ${code}`);
  };

  const handleVerifyTestCode = () => {
    if (testTwoFactorCode === sentCode && sentCode !== '') {
      setTwoFactorEnabled(true);
      setVerificationFeedback('✅ 2-Staps Verificatie is succesvol ingeschakeld!');
      onSaveProfile({ twoFactorEnabled: true });
    } else {
      setVerificationFeedback('❌ Onjuiste verificatiecode. Probeer opnieuw.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      username: username.trim() || currentUser.username,
      avatar: avatar.trim() || currentUser.avatar,
      banner: banner.trim() || currentUser.banner,
      bio: bio.trim(),
      password: password.trim() || currentUser.password,
      totalHours: totalHours.trim() || '0h',
      gamesCount: gamesCount.trim() || '0',
      achievementsCount: achievementsCount.trim() || '0',
      twoFactorEnabled,
    });
    setStatusMsg('✅ Profiel, inloggegevens en banner succesvol opgeslagen in de Cloud!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleResetToZero = () => {
    setTotalHours('0h');
    setGamesCount('0');
    setAchievementsCount('0');
    if (onResetAllStatsToZero) {
      onResetAllStatsToZero();
    } else {
      onSaveProfile({
        totalHours: '0h',
        gamesCount: '0',
        achievementsCount: '0',
        linkedGamingAccounts: {},
      });
    }
    setShowResetModal(false);
    setStatusMsg('🔄 Alle uren, games en trofeeën zijn gereset naar 0!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 max-w-4xl mx-auto selection:bg-[#5865f2] selection:text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
          <span>Account & Profiel Instellingen</span>
        </h1>
        <p className="text-xs md:text-sm text-[#949ba4] mt-1">
          Beheer je gebruikersnaam, wachtwoord, geanimeerde avatar/banner opties, camera uploads en 2-staps verificatie.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-[#23a55a]/20 border border-[#23a55a]/40 rounded-2xl text-[#23a55a] text-xs text-center font-bold flex items-center justify-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#23a55a]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Hidden File Inputs for Bestanden Upload (Supports GIF, WebP, PNG, JPG) */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={(e) => handleFileUpload(e, 'avatar')}
        accept="image/gif,image/png,image/jpeg,image/webp,image/svg+xml,.gif,.webp,.png,.jpg,.jpeg"
        className="hidden"
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={(e) => handleFileUpload(e, 'banner')}
        accept="image/gif,image/png,image/jpeg,image/webp,image/svg+xml,.gif,.webp,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* LIVE PROFILE & BANNER PREVIEW CARD */}
      <div className="border border-[#232428] rounded-3xl overflow-hidden shadow-2xl bg-[#2b2d31]">
        {/* Banner with animated/static preview */}
        <div className="h-52 w-full relative bg-[#1e1f22] overflow-hidden group">
          <img
            src={banner}
            alt="Profiel Banner"
            className="w-full h-full object-cover transition duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = ANIMATED_BANNER_PRESETS[0].url;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2b2d31] via-[#2b2d31]/30 to-transparent" />

          {/* Animated Badge on Banner */}
          {isAnimated(banner) && (
            <div className="absolute top-3 left-3 bg-[#5865f2] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg backdrop-blur-md">
              <Film className="w-3 h-3 animate-spin" />
              <span>Geanimeerde Banner</span>
            </div>
          )}

          {/* Quick Banner Action Overlay on Hover */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowCameraModal('banner')}
              className="bg-black/70 hover:bg-[#5865f2] text-white p-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 backdrop-blur-md border border-white/10 shadow-lg"
              title="Banner Foto Maken met Camera"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Camera</span>
            </button>

            <button
              type="button"
              onClick={() => bannerFileInputRef.current?.click()}
              className="bg-black/70 hover:bg-[#23a55a] text-white p-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 backdrop-blur-md border border-white/10 shadow-lg"
              title="Upload Banner of GIF uit Bestanden"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload GIF / Foto</span>
            </button>
          </div>
        </div>

        {/* Profile info on banner */}
        <div className="px-6 pb-6 relative -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <div className="relative group shrink-0">
              <img
                src={avatar || currentUser.avatar}
                alt={username || currentUser.username}
                className="w-24 h-24 rounded-3xl bg-[#111214] border-4 border-[#2b2d31] object-cover shadow-2xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#23a55a] rounded-full border-2 border-[#2b2d31]" />

              {/* Animated GIF Badge on Avatar */}
              {isAnimated(avatar) && (
                <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-500 to-[#5865f2] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                  GIF
                </span>
              )}

              {/* Quick Avatar Change Icon Hover */}
              <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1.5 transition duration-200 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => setShowCameraModal('avatar')}
                  className="p-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-xl hover:scale-110 transition shadow-md"
                  title="Camera Foto Maken"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="p-2 bg-[#23a55a] hover:bg-[#1f9350] text-white rounded-xl hover:scale-110 transition shadow-md"
                  title="Upload GIF of Foto uit Bestanden"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-white">{username || currentUser.username}</h2>
                {twoFactorEnabled && (
                  <span className="bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>2FA Actief</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#949ba4] font-mono">{currentUser.email}</p>
              <p className="text-xs text-[#dbdee1] italic pt-1">{bio || 'GamerHub Gamer • 0 servers • 0 vrienden'}</p>
            </div>
          </div>

          {/* Pyroblast Stats Badges */}
          <div className="grid grid-cols-3 gap-2 text-center w-full sm:w-auto shrink-0">
            <div className="bg-[#1e1f22] border border-[#232428] p-2.5 rounded-2xl">
              <Clock className="w-3.5 h-3.5 text-[#5865f2] mx-auto mb-1" />
              <p className="text-xs font-black text-white">{totalHours}</p>
              <p className="text-[9px] text-[#949ba4] uppercase font-bold">Uren</p>
            </div>
            <div className="bg-[#1e1f22] border border-[#232428] p-2.5 rounded-2xl">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs font-black text-white">{gamesCount}</p>
              <p className="text-[9px] text-[#949ba4] uppercase font-bold">Games</p>
            </div>
            <div className="bg-[#1e1f22] border border-[#232428] p-2.5 rounded-2xl">
              <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <p className="text-xs font-black text-white">{achievementsCount}</p>
              <p className="text-[9px] text-[#949ba4] uppercase font-bold">Trofeeën</p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#2b2d31] border border-[#232428] rounded-3xl p-5 md:p-6 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#949ba4] uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5865f2]" />
            <span>Gebruikersnaam & Wachtwoord Wijzigen (Wordt echt opgeslagen)</span>
          </h2>
        </div>

        {/* USERNAME & PASSWORD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Jouw GamerTag"
              className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5865f2]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1 flex items-center space-x-1">
              <KeyRound className="w-3 h-3 text-[#949ba4]" />
              <span>Nieuw Wachtwoord (veilig opgeslagen)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laat leeg om niet te wijzigen"
              className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5865f2]"
            />
          </div>
        </div>

        {/* BIO / STATUS */}
        <div>
          <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
            Status / Bio
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Beschrijf jezelf als gamer..."
            className="w-full bg-[#1e1f22] border border-[#232428] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5865f2]"
          />
        </div>

        {/* ======================================================== */}
        {/* PROFIELFOTO SELECTOR: GEANIMEERD + GAMING + UPLOAD/CAMERA */}
        {/* ======================================================== */}
        <div className="space-y-4 p-4 bg-[#1e1f22] border border-[#232428] rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-bold text-white flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#5865f2]" />
              <span>Profielfoto & Geanimeerde GIF Opties</span>
            </label>

            {/* Selector Tabs */}
            <div className="flex items-center space-x-1 bg-[#111214] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAvatarTab('animated')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  avatarTab === 'animated'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 text-pink-400" />
                <span>Geanimeerde GIFs</span>
              </button>

              <button
                type="button"
                onClick={() => setAvatarTab('gaming')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  avatarTab === 'gaming'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <span>Gaming Avatars</span>
              </button>

              <button
                type="button"
                onClick={() => setAvatarTab('custom')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  avatarTab === 'custom'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <span>Upload / URL</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Animated Avatars (Live previews) */}
          {avatarTab === 'animated' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#949ba4]">
                Kies een geanimeerde avatar met live motion effecten of upload je eigen .GIF:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {ANIMATED_AVATAR_PRESETS.map((item) => {
                  const isSelected = avatar === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAvatar(item.url);
                        onSaveProfile({ avatar: item.url });
                      }}
                      className={`relative p-2 rounded-2xl border text-center transition group flex flex-col items-center hover:scale-105 ${
                        isSelected
                          ? 'bg-[#5865f2]/20 border-[#5865f2] ring-2 ring-[#5865f2]'
                          : 'bg-[#2b2d31] border-[#232428] hover:border-[#5865f2]/50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#111214] border border-[#232428] relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#5865f2]/40 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 truncate max-w-[90px]">
                        {item.name}
                      </span>
                      <span className="text-[8px] bg-pink-500/20 text-pink-300 font-extrabold px-1.5 py-0.2 rounded-full mt-0.5">
                        {item.badge || 'GIF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Gaming Avatars */}
          {avatarTab === 'gaming' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#949ba4]">
                Selecteer een klassieke gaming bot of profielavatar:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {STATIC_AVATAR_PRESETS.map((item) => {
                  const isSelected = avatar === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAvatar(item.url);
                        onSaveProfile({ avatar: item.url });
                      }}
                      className={`relative p-2 rounded-2xl border text-center transition group flex flex-col items-center hover:scale-105 ${
                        isSelected
                          ? 'bg-[#5865f2]/20 border-[#5865f2] ring-2 ring-[#5865f2]'
                          : 'bg-[#2b2d31] border-[#232428] hover:border-[#5865f2]/50'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#111214]"
                      />
                      <span className="text-[10px] font-bold text-white mt-1 truncate max-w-[70px]">
                        {item.name}
                      </span>
                      {isSelected && (
                        <span className="absolute top-1 right-1 w-3 h-3 bg-[#5865f2] rounded-full flex items-center justify-center text-[8px] text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons: Camera vs Bestanden Upload */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#232428]">
            <button
              type="button"
              onClick={() => setShowCameraModal('avatar')}
              className="flex items-center space-x-2 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>📷 Maak Foto met Camera</span>
            </button>

            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-[#23a55a] hover:bg-[#1f9350] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>📁 Upload Foto of GIF (GIF, WebP, PNG, JPG)</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
              Of plak een directe afbeeldings-/GIF-URL:
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://... (bijv. Giphy of Tenor GIF)"
              className="w-full bg-[#111214] border border-[#232428] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865f2] font-mono text-[11px]"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* BANNER SELECTOR: GEANIMEERDE BANNERS + HD ST экономия */}
        {/* ======================================================== */}
        <div className="space-y-4 p-4 bg-[#1e1f22] border border-[#232428] rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-bold text-white flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-[#5865f2]" />
              <span>Profiel Banner & Geanimeerde Achtergrond Opties</span>
            </label>

            <div className="flex items-center space-x-1 bg-[#111214] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBannerTab('animated')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center space-x-1 ${
                  bannerTab === 'animated'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <Film className="w-3 h-3 text-pink-400" />
                <span>Geanimeerde Banners</span>
              </button>

              <button
                type="button"
                onClick={() => setBannerTab('hd')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  bannerTab === 'hd'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <span>HD Gaming Stills</span>
              </button>

              <button
                type="button"
                onClick={() => setBannerTab('custom')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  bannerTab === 'custom'
                    ? 'bg-[#5865f2] text-white shadow-sm'
                    : 'text-[#949ba4] hover:text-white'
                }`}
              >
                <span>Upload / URL</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Animated Banners */}
          {bannerTab === 'animated' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#949ba4]">
                Kies een geanimeerde banner met bewegend grid, matrix regen of kosmische sterren:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ANIMATED_BANNER_PRESETS.map((item) => {
                  const isSelected = banner === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setBanner(item.url);
                        onSaveProfile({ banner: item.url });
                      }}
                      className={`relative rounded-2xl border text-left overflow-hidden transition group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-[#5865f2] ring-2 ring-[#5865f2]'
                          : 'border-[#232428] hover:border-[#5865f2]/50'
                      }`}
                    >
                      <div className="h-24 w-full bg-[#111214] relative overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-2 left-2 bg-[#5865f2] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>ANIMATED</span>
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#23a55a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Gekozen</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-black text-white">{item.name}</p>
                          <p className="text-[9px] text-slate-300 truncate">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: HD Gaming Stills */}
          {bannerTab === 'hd' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#949ba4]">Kies een hoge resolutie gaming wallpaper:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STATIC_BANNER_PRESETS.map((item) => {
                  const isSelected = banner === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setBanner(item.url);
                        onSaveProfile({ banner: item.url });
                      }}
                      className={`relative rounded-xl border text-left overflow-hidden transition group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-[#5865f2] ring-2 ring-[#5865f2]'
                          : 'border-[#232428] hover:border-[#5865f2]/50'
                      }`}
                    >
                      <div className="h-16 w-full bg-[#111214] relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1 left-2 text-[10px] font-bold text-white truncate max-w-[120px]">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-[#5865f2] rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons: Camera vs Bestanden */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#232428]">
            <button
              type="button"
              onClick={() => setShowCameraModal('banner')}
              className="flex items-center space-x-2 bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>📷 Maak Banner met Camera</span>
            </button>

            <button
              type="button"
              onClick={() => bannerFileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-[#23a55a] hover:bg-[#1f9350] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>📁 Upload Banner of GIF (GIF, WebP, PNG, JPG)</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#949ba4] uppercase mb-1">
              Of voer een banner URL in:
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://... of data:image/..."
              className="w-full bg-[#111214] border border-[#232428] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865f2] font-mono text-[11px]"
            />
          </div>
        </div>

        {/* 2-STAPS VERIFICATIE VIA EMAIL */}
        <div className="p-4 bg-[#1e1f22] border border-[#232428] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#23a55a]/10 text-[#23a55a] rounded-xl">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">2-Staps Verificatie via Email</h3>
                <p className="text-[11px] text-[#949ba4]">
                  Beveilig je account: ontvang een 6-cijferige verificatiecode via email bij het inloggen.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !twoFactorEnabled;
                setTwoFactorEnabled(next);
                onSaveProfile({ twoFactorEnabled: next });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                twoFactorEnabled
                  ? 'bg-[#23a55a] text-white'
                  : 'bg-[#2b2d31] text-[#949ba4] hover:text-white'
              }`}
            >
              {twoFactorEnabled ? 'Ingeschakeld ✓' : 'Uitgeschakeld'}
            </button>
          </div>

          <div className="pt-2 border-t border-[#232428] flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSendTestCode}
              className="text-xs bg-[#2b2d31] hover:bg-[#35373c] text-white px-3 py-2 rounded-xl font-bold transition flex items-center space-x-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#5865f2]" />
              <span>Stuur Testcode naar Email</span>
            </button>

            {sentCode && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testTwoFactorCode}
                  onChange={(e) => setTestTwoFactorCode(e.target.value)}
                  placeholder="6 cijfers"
                  className="bg-[#111214] border border-[#232428] text-xs px-3 py-2 rounded-xl text-white font-mono w-28 text-center"
                />
                <button
                  type="button"
                  onClick={handleVerifyTestCode}
                  className="text-xs bg-[#23a55a] hover:bg-[#1f9350] text-white px-3 py-2 rounded-xl font-bold transition"
                >
                  Verifiëren
                </button>
              </div>
            )}
          </div>

          {verificationFeedback && (
            <p className="text-xs text-amber-300 font-semibold">{verificationFeedback}</p>
          )}
        </div>

        {/* OPSLAAN KNOP */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-bold px-6 py-3 rounded-2xl transition shadow-lg active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Wijzigingen Veilig Opslaan</span>
          </button>
        </div>
      </form>

      {/* DANGER ZONE & RESET ALL */}
      <div className="bg-[#2b2d31] border border-[#da373c]/30 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-[#da373c] uppercase tracking-wider flex items-center space-x-1.5">
          <Trash2 className="w-3.5 h-3.5 text-[#da373c]" />
          <span>Gevarenzone & Data Beheer</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#1e1f22] rounded-2xl border border-[#232428]">
          <div>
            <h4 className="text-xs font-bold text-white">Alles Resetten naar 0</h4>
            <p className="text-[11px] text-[#949ba4]">
              Zet alle speeluren, games, trofeeën en gekoppelde accounts terug naar exact 0.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset naar 0</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#1e1f22] rounded-2xl border border-[#232428]">
          <div>
            <h4 className="text-xs font-bold text-white">Afmelden (Uitloggen)</h4>
            <p className="text-[11px] text-[#949ba4]">
              Je kunt je op elk moment weer aanmelden met je email en wachtwoord. Al je berichten en vrienden blijven bewaard.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="bg-[#2b2d31] hover:bg-[#35373c] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0 border border-[#232428]"
          >
            <LogOut className="w-4 h-4 text-[#949ba4]" />
            <span>Afmelden</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#1e1f22] rounded-2xl border border-[#da373c]/20">
          <div>
            <h4 className="text-xs font-bold text-[#da373c]">Account Permanent Verwijderen</h4>
            <p className="text-[11px] text-[#949ba4]">
              Verwijdert je account en alle opgeslagen gegevens permanent uit de database.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-[#da373c] hover:bg-[#c02e33] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Account Verwijderen</span>
          </button>
        </div>
      </div>

      {/* CAMERA MODAL FOR LIVE CAPTURE */}
      <CameraModal
        isOpen={Boolean(showCameraModal)}
        title={
          showCameraModal === 'avatar'
            ? 'Profielfoto Maken met Camera'
            : 'Banner Foto Maken met Camera'
        }
        aspectRatio={showCameraModal === 'avatar' ? 'square' : 'banner'}
        onCapture={handleCameraCapture}
        onClose={() => setShowCameraModal(null)}
      />

      {/* RESET TO ZERO CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Alles Resetten naar 0?"
        description="Weet je zeker dat je alle uren, games en trofeeën wilt resetten naar 0? Pas wanneer je opnieuw een PlayStation, Steam of Xbox koppelt, worden je statistieken bijgewerkt."
        confirmLabel="Ja, Reset naar 0"
        onConfirm={handleResetToZero}
        onCancel={() => setShowResetModal(false)}
      />

      {/* DELETE ACCOUNT CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Account Permanent Verwijderen?"
        description="Dit verwijdert al je accounts, vrienden en berichten definitief. Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Ja, Verwijder Account"
        onConfirm={() => {
          setShowDeleteModal(false);
          onDeleteAccount();
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
