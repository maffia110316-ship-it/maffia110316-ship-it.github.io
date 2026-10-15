import { Server, Friend, Connection, NewsItem, User } from '../types';

export const STARTER_SERVERS: Server[] = [
  {
    id: 's_default_1',
    name: 'Chunkz Official SMP',
    icon: '⛏️',
    channels: [
      { id: 'c_1', name: 'algemeen' },
      { id: 'c_2', name: 'mc-builds' },
      { id: 'c_3', name: 'server-events' }
    ],
    messages: {
      'c_1': [
        {
          id: 'm1',
          sender: 'ChunkzAdmin#9999',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
          text: 'Welkom op de officiële Chunkz SMP community server! Regels: respectvol blijven en geen griefing.',
          time: '12:00'
        },
        {
          id: 'm2',
          sender: 'PixelCrafter#4040',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel',
          text: 'Wie helpt er vanavond mee aan het megakasteel in Sector 4?',
          time: '12:05'
        }
      ],
      'c_2': [
        {
          id: 'm3',
          sender: 'PixelCrafter#4040',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel',
          text: 'Mijn nieuwe Netherite boerderij is eindelijk operationeel! Check coördinaten ~120, 64, -300.',
          time: '13:15'
        }
      ],
      'c_3': [
        {
          id: 'm4',
          sender: 'ChunkzAdmin#9999',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
          text: 'Zondag om 20:00 uur organiseren we een Ender Dragon speedrun toernooi! Schrijf je in via de chat.',
          time: '14:00'
        }
      ]
    }
  },
  {
    id: 's_default_2',
    name: 'Palworld Guild NL',
    icon: '🐾',
    channels: [
      { id: 'c_p1', name: 'algemeen' },
      { id: 'c_p2', name: 'pals-ruilen' },
      { id: 'c_p3', name: 'raid-bosses' }
    ],
    messages: {
      'c_p1': [
        {
          id: 'm5',
          sender: 'PalMaster#1010',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pal',
          text: 'Wie doet er vanavond mee met de volgende Bellanoir raid?',
          time: '14:30'
        },
        {
          id: 'm6',
          sender: 'ShadowHunter#7721',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow',
          text: 'Ik ben erbij! Heb net mijn Jetragon tot level 50 geleveld.',
          time: '14:45'
        }
      ]
    }
  },
  {
    id: 's_default_3',
    name: 'PlayStation Squad Benelux',
    icon: '🎮',
    channels: [
      { id: 'c_ps1', name: 'algemeen' },
      { id: 'c_ps2', name: 'helldivers-2' },
      { id: 'c_ps3', name: 'fifa-toernooien' }
    ],
    messages: {
      'c_ps1': [
        {
          id: 'm7',
          sender: 'DutchGamer#2026',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dutch',
          text: 'Welkom PlayStation spelers! Drop je PSN ID om samen te co-oppen.',
          time: '16:00'
        }
      ]
    }
  }
];

export const STARTER_FRIENDS: Friend[] = [
  {
    id: 'f_1',
    name: 'PopeyeSpeirs#1111',
    status: 'online',
    game: 'ARC Raiders',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Popeye',
    isBlocked: false
  },
  {
    id: 'f_2',
    name: 'grimmkiller#5127',
    status: 'offline',
    game: 'Niet Actief',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grimm',
    isBlocked: false
  },
  {
    id: 'f_3',
    name: 'VermeerCraats#2026',
    status: 'online',
    game: 'Elden Ring: Shadow of the Erdtree',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Vermeer',
    isBlocked: false
  },
  {
    id: 'f_4',
    name: 'NovaStrike#8834',
    status: 'online',
    game: 'Valorant',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nova',
    isBlocked: false
  }
];

export const STARTER_CONNECTIONS: Connection[] = [
  {
    id: 'conn_psn',
    platform: 'PlayStation',
    handle: 'Maffia_Games_',
    verified: true,
    details: 'Level 385 • 42 Platina Trophies',
    icon: '🎮',
    color: 'bg-indigo-600'
  },
  {
    id: 'conn_steam',
    platform: 'Steam',
    handle: 'maffia_games',
    verified: true,
    details: '91 Games in bibliotheek',
    icon: '💨',
    color: 'bg-slate-800'
  },
  {
    id: 'conn_twitch',
    platform: 'Twitch',
    handle: 'maffiagames_live',
    verified: true,
    details: 'Partner Streamer',
    icon: '💜',
    color: 'bg-purple-600'
  },
  {
    id: 'conn_discord',
    platform: 'Discord',
    handle: 'Maffia#0001',
    verified: true,
    details: 'Nitro Member',
    icon: '💬',
    color: 'bg-indigo-600'
  },
  {
    id: 'conn_tiktok',
    platform: 'TikTok',
    handle: '@maffiagames',
    verified: true,
    details: '113K Volgers',
    icon: '📱',
    color: 'bg-pink-600'
  }
];

export const DEMO_USER: User = {
  username: 'MaffiaGamer#1337',
  email: 'demo@gamerhub.nl',
  password: 'demo',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MaffiaGamer',
  bio: 'Pro gaming enthusiast, FPS & RPG veteraan. Altijd in voor een goede raid of competitieve lobby!',
  totalHours: '1,420h',
  gamesCount: '138',
  achievementsCount: '842',
  servers: STARTER_SERVERS,
  friends: STARTER_FRIENDS,
  connections: STARTER_CONNECTIONS
};

export const FALLBACK_NEWS: NewsItem[] = [
  {
    title: 'Grand Theft Auto VI breekt nu al records met nieuwe trailers en gameplay details',
    pubDate: 'Vandaag, 18:30',
    link: 'https://www.gamer.nl',
    description: 'Rockstar Games deelt meer inzichten over de levendige open wereld van Vice City en de dynamische weersystemen en AI.',
    author: 'Redactie Gamer.nl'
  },
  {
    title: 'PlayStation 5 Pro krijgt speciale optimalisaties voor meer dan 50 toptitels',
    pubDate: 'Vandaag, 16:15',
    link: 'https://www.gamer.nl',
    description: 'Sony bevestigt 60fps met raytracing voor topgames dankzij PlayStation Spectral Super Resolution (PSSR).',
    author: 'Redactie Gamer.nl'
  },
  {
    title: 'Nintendo Switch opvolger officieel onthuld met volledige backwards compatibility',
    pubDate: 'Gisteren, 21:00',
    link: 'https://www.gamer.nl',
    description: 'Spelers kunnen al hun favoriete digitale en fysieke Switch-games meenemen naar het nieuwe platform met hogere resoluties.',
    author: 'Redactie Gamer.nl'
  },
  {
    title: 'Nieuwe grote update voor Helldivers 2 brengt nieuwe vijanden en mechs naar het strijdveld',
    pubDate: 'Gisteren, 14:45',
    link: 'https://www.gamer.nl',
    description: 'Arrowhead Game Studios lanceert Escalation of Freedom met gloednieuwe missies, planeten en zware bepantsering.',
    author: 'Redactie Gamer.nl'
  },
  {
    title: 'Steam Spring Sale van start: honderden pc-games met kortingen tot wel 90%',
    pubDate: 'Eergisteren, 19:00',
    link: 'https://www.gamer.nl',
    description: 'Valve trapt het seizoen af met gigantische prijsverlagingen op indie hits en AAA-blockbusters voor de PC en Steam Deck.',
    author: 'Redactie Gamer.nl'
  },
  {
    title: 'The Witcher 4 Polaris bereikt volledige productie: Unreal Engine 5 details onthuld',
    pubDate: 'Eergisteren, 11:20',
    link: 'https://www.gamer.nl',
    description: 'CD Projekt RED bevestigt dat meer dan 400 ontwikkelaars nu volop werken aan de volgende grote RPG-saga.',
    author: 'Redactie Gamer.nl'
  }
];
