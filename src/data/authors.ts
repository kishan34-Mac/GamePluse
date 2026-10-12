import { Author } from '../types';

export const AUTHORS: Author[] = [
  {
    id: 'author-marcus-vance',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
    bio: 'Editor-in-Chief at GAMEPULSE. Over 14 years covering interactive entertainment, hardware architecture, and the intersection of technology and game design.',
    role: 'Editor-in-Chief',
    socialLinks: {
      twitter: 'https://twitter.com',
      email: 'marcus@gamepulse.media',
    },
  },
  {
    id: 'author-elena-rostova',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80',
    bio: 'Senior Hardware & PC Specialist. Former system builder and competitive FPS enthusiast obsessed with thermals, frame pacings, and silicon architectures.',
    role: 'Senior Hardware Editor',
    socialLinks: {
      twitter: 'https://twitter.com',
      email: 'elena@gamepulse.media',
    },
  },
  {
    id: 'author-kai-nakamura',
    name: 'Kai Nakamura',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    bio: 'Lead Esports Analyst & Competitive Gaming Correspondent. Tracking Valorant Champions Tour, CS2 Majors, and League of Legends international circuits.',
    role: 'Esports Director',
    socialLinks: {
      twitter: 'https://twitter.com',
      email: 'kai@gamepulse.media',
    },
  },
  {
    id: 'author-sarah-jenkins',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80',
    bio: 'Senior Reviews & Guides Writer. Passionate RPG completionist and indie advocate with an eye for ludonarrative harmony and combat mechanics.',
    role: 'Senior Reviews Editor',
    socialLinks: {
      twitter: 'https://twitter.com',
      email: 'sarah@gamepulse.media',
    },
  },
  {
    id: 'author-arjun-mehta',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    bio: 'Mobile Gaming & Handheld Editor. Tracking the rise of AAA mobile ports, Snapdragon gaming performance, and mobile esports tournaments worldwide.',
    role: 'Mobile Gaming Editor',
    socialLinks: {
      twitter: 'https://twitter.com',
      email: 'arjun@gamepulse.media',
    },
  },
];

export const getAuthorById = (id: string): Author | undefined => {
  return AUTHORS.find(a => a.id === id);
};
