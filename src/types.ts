export interface MessageAttachment {
  id: string;
  type: 'image' | 'clip';
  url: string;
  name?: string;
}

export interface ChannelMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  };
  attachments?: MessageAttachment[];
  reactions?: Record<string, string[]>;
}

export interface Channel {
  id: string;
  name: string;
  type?: 'text' | 'voice';
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  owner?: string;
  inviteCode?: string;
  members?: string[];
  channels: Channel[];
  voiceChannels?: Channel[];
  messages: Record<string, ChannelMessage[]>;
}

export interface Friend {
  id: string;
  name: string;
  email?: string;
  status: 'online' | 'offline' | 'afk' | 'dnd';
  game: string;
  avatar: string;
  isBlocked: boolean;
  lastSeen?: string;
  lastActiveTimestamp?: number;
  customStatusText?: string;
}

export interface Connection {
  id: string;
  platform: 'Twitch' | 'YouTube' | 'Discord' | 'Spotify' | 'TikTok' | 'PlayStation' | 'Steam' | 'Xbox' | 'Nintendo';
  handle: string;
  verified: boolean;
  icon: string;
  color: string;
  details?: string;
}

export interface GameAchievement {
  id: string;
  platform: 'PlayStation' | 'Xbox' | 'Steam';
  gameTitle: string;
  gameIcon: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Gewoon' | 'Zeldzaam' | 'Ultra Zeldzaam' | 'Legendarisch';
  unlocked: boolean;
  unlockedAt?: string;
  pointsOrType: string;
}

export interface PlayedGame {
  id: string;
  title: string;
  platform: 'PlayStation' | 'Steam' | 'Xbox' | 'Epic Games';
  hours: number;
  formattedHours: string;
  image: string;
  lastPlayed?: string;
  completion?: string;
}

export interface PlatformStat {
  platform: 'PlayStation' | 'Steam' | 'Xbox' | 'Epic Games';
  hours: number;
  formattedHours: string;
  percentage: number;
  color: string;
  barColor: string;
  dotColor: string;
}

export interface LinkedPlatformData {
  playstation?: {
    handle: string;
    linkedAt: string;
    hours: number;
    gamesCount: number;
    achievementsCount: number;
    bestSession: string;
    thisWeek: string;
    level: number;
    totalTrophies: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    games: PlayedGame[];
  };
  xbox?: {
    handle: string;
    linkedAt: string;
    hours: number;
    gamesCount: number;
    achievementsCount: number;
    bestSession: string;
    thisWeek: string;
    gamerscore: number;
    totalAchievements: number;
    tier: string;
    games: PlayedGame[];
  };
  steam?: {
    handle: string;
    linkedAt: string;
    hours: number;
    gamesCount: number;
    achievementsCount: number;
    bestSession: string;
    thisWeek: string;
    steamLevel: number;
    perfectGames: number;
    totalAchievements: number;
    games: PlayedGame[];
  };
}

export interface UserAppNotification {
  id: string;
  type: 'message' | 'call' | 'friend_request' | 'system';
  title: string;
  body: string;
  fromUser?: {
    username: string;
    avatar: string;
  };
  timestamp: number;
  timeString: string;
  read: boolean;
  actionData?: {
    friendId?: string;
    serverId?: string;
    callType?: 'voice' | 'video';
  };
}

export interface User {
  username: string;
  email: string;
  password?: string;
  avatar: string;
  banner?: string;
  bio: string;
  totalHours: string;
  gamesCount: string;
  achievementsCount: string;
  inviteCode?: string;
  twoFactorEnabled?: boolean;
  isBetaTester?: boolean;
  googleEmail?: string;
  googleLinked?: boolean;
  servers: Server[];
  friends: Friend[];
  connections: Connection[];
  linkedGamingAccounts?: LinkedPlatformData;
  dmHistory?: Record<string, ChannelMessage[]>;
  notifications?: UserAppNotification[];
}

export interface NewsItem {
  id?: string;
  title: string;
  pubDate: string;
  link: string;
  guid?: string;
  author?: string;
  thumbnail?: string;
  description: string;
  content?: string;
  categories?: string[];
  isNew?: boolean;
}

export type AppTab = 'dashboard' | 'news' | 'servers' | 'friends' | 'achievements' | 'connections' | 'settings';
