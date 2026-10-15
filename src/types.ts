export interface ChannelMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Channel {
  id: string;
  name: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
  messages: Record<string, ChannelMessage[]>;
}

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'afk';
  game: string;
  avatar: string;
  isBlocked: boolean;
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

export interface User {
  username: string;
  email: string;
  password?: string;
  avatar: string;
  bio: string;
  totalHours: string;
  gamesCount: string;
  achievementsCount: string;
  servers: Server[];
  friends: Friend[];
  connections: Connection[];
}

export interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  guid?: string;
  author?: string;
  thumbnail?: string;
  description: string;
  content?: string;
  categories?: string[];
}
