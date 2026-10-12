import { Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-elden-ring-erdtree',
    gameId: 'game-elden-ring-erdtree',
    slug: 'elden-ring-shadow-of-the-erdtree',
    title: 'Elden Ring: Shadow of the Erdtree Review — A Monumental Triumph',
    score: 9.6,
    verdict: 'Shadow of the Erdtree is an unparalleled triumph in expansion design, elevating FromSoftware’s magnum opus with labyrinthine world design, jaw-dropping boss encounters, and an exhilarating sense of mystery.',
    pros: [
      'Unbelievably dense, vertical open world that rivals base game intrigue',
      'Memorable, visually staggering boss battles with deep lore implications',
      'Extensive new weapon classes and ashes of war that refresh build diversity',
      'Haunting, orchestral musical compositions that intensify every encounter',
    ],
    cons: [
      'Steep Scadutree fragment leveling requirement may frustrate casual explorers',
      'Occasional camera clipping on oversized humanoid and draconic bosses',
    ],
    gameplay: {
      score: 9.8,
      details: 'Combat remains the gold standard of action RPGs. Eight new weapon types including Martial Arts and Light Greatswords introduce intoxicating combat flow.',
    },
    graphics: {
      score: 9.4,
      details: 'Art direction carries graphical fidelity to breathtaking heights. The Scadutree looming over golden plains of Gravesite Plain is an indelible sight.',
    },
    performance: {
      score: 8.9,
      details: 'Generally rock-solid 60 FPS on high-end hardware, though minor frame drops still occur during particle-heavy spell barrages on PC.',
    },
    audio: {
      score: 9.9,
      details: 'Tsukasa Saitoh and the sound design team deliver an emotionally devastating, pulse-pounding sonic experience that punctuates every climax.',
    },
    replayability: {
      score: 9.8,
      details: 'Multiple optional subterranean dungeons, branching NPC questlines, and vast build combinations offer dozens of hours beyond credits.',
    },
    finalVerdict: 'Shadow of the Erdtree does not merely supplement Elden Ring; it redefines expectations for video game expansions. With peerless level geometry, ruthless boss combat, and a somber narrative tapestry, it cements FromSoftware’s status as master craftspeople of digital worlds.',
    authorId: 'author-sarah-jenkins',
    publishedAt: '2024-06-21T09:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    id: 'rev-black-myth-wukong',
    gameId: 'game-black-myth-wukong',
    slug: 'black-myth-wukong',
    title: 'Black Myth: Wukong Review — Ferocious, Mythic Chinese Action',
    score: 9.2,
    verdict: 'Game Science delivers a breathtaking visual masterclass and exhilarating staff combat experience that brings Chinese folklore alive with cinematic grandeur.',
    pros: [
      'Spectacular boss variety boasting over 80 uniquely choreographed adversaries',
      'Fluid staff stance mechanics and versatile transformation spells',
      'Unmatched graphical fidelity powered by Unreal Engine 5 Nanite & Lumen',
      'Rich, reverent adaptation of Journey to the West folklore',
    ],
    cons: [
      'Invisible walls occasionally disrupt exploration and immersion',
      'Linear level structure lacks interconnected shortcuts of top-tier Souls games',
    ],
    gameplay: {
      score: 9.1,
      details: 'Fast-paced rhythmic combat prioritizing precise dodges, stamina preservation, and tactical immobilization spells.',
    },
    graphics: {
      score: 9.8,
      details: 'One of the best-looking titles ever produced. Photorealistic temple textures, flowing fur shaders, and stunning volumetric atmospheric mist.',
    },
    performance: {
      score: 8.7,
      details: 'Unreal Engine 5 requires careful DLSS/FSR upscaling tuning; frame generation is recommended for stable 90+ FPS at 1440p and 4K.',
    },
    audio: {
      score: 9.3,
      details: 'Authentic traditional Chinese instruments paired with cinematic orchestral scoring creates an electrifying mythological mood.',
    },
    replayability: {
      score: 9.0,
      details: 'A dense New Game Plus mode with secret transformation spells and alternate vessel quests incentivizes a second play session.',
    },
    finalVerdict: 'Black Myth: Wukong is a triumphant debut for Game Science on the global stage. It is an adrenaline-fueled mythical journey packed with unforgettable duels that easily ranks among the year’s most satisfying action adventures.',
    authorId: 'author-marcus-vance',
    publishedAt: '2024-08-20T12:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    id: 'rev-cyberpunk-phantom-liberty',
    gameId: 'game-cyberpunk-phantom-liberty',
    slug: 'cyberpunk-2077-phantom-liberty',
    title: 'Cyberpunk 2077: Phantom Liberty Review — The Ultimate Redemption',
    score: 9.5,
    verdict: 'CD Projekt RED completes one of gaming’s most celebrated redemption arcs with a gripping espionage thriller driven by stellar acting and transformed RPG systems.',
    pros: [
      'Spellbinding spy story featuring powerhouse performances by Idris Elba & Keanu Reeves',
      'Dogtown is a dense, dystopian playground with exceptional verticality',
      'Overhauled perk trees and vehicular combat redefine gameplay dynamism',
      'Cutting-edge Ray Tracing Overdrive and DLSS 3.5 showcase technical excellence',
    ],
    cons: [
      'Relic perk tree feels slightly brief compared to core skill overhauls',
      'Demanding path-tracing hardware requirements alienate mid-tier rigs',
    ],
    gameplay: {
      score: 9.4,
      details: 'The 2.0 mechanical overhaul turns V into an agile, lethal cybernetic operative with dashing, bullet deflecting, and vehicular shootouts.',
    },
    graphics: {
      score: 9.9,
      details: 'Dogtown’s decayed brutalist architecture illuminated by ray reconstruction sets the benchmark for real-time lighting in 2024.',
    },
    performance: {
      score: 9.1,
      details: 'Smooth frame delivery on modern architectures with DLSS / Frame Generation; standard rasterization runs smoothly on modern consoles.',
    },
    audio: {
      score: 9.6,
      details: 'P.T. Adamczyk delivers a dark synth-industrial score that ramps up tension during tactical infiltrations and desperate fire fights.',
    },
    replayability: {
      score: 9.4,
      details: 'Multiple profoundly emotional endings that introduce a brand new conclusion to V’s overarching campaign in Night City.',
    },
    finalVerdict: 'Phantom Liberty is a masterclass in interactive storytelling. By combining world-class character writing with vastly improved gameplay and state-of-the-art visuals, CDPR has turned Cyberpunk 2077 into the masterpiece it always deserved to be.',
    authorId: 'author-elena-rostova',
    publishedAt: '2023-09-26T14:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    id: 'rev-helldivers-2',
    gameId: 'game-helldivers-2',
    slug: 'helldivers-2',
    title: 'Helldivers 2 Review — Glorious Galactic Co-Op Chaos',
    score: 9.0,
    verdict: 'An outrageously fun, satirical live-service shooter where tactical stratagems, hilarious friendly fire, and relentless insect swarms produce pure emergent joy.',
    pros: [
      'Electrifying co-op firefights that demand real tactical teamwork',
      'Hilarious satire of managed democracy and military jingoism',
      'Sensational sound effects and bombastic orbital bombardment visual flair',
      'Fair, player-friendly battle pass and monetization progression',
    ],
    cons: [
      'Occasional server matchmaking disconnects during peak global events',
      'Solo play can be brutally punishing without dependable squadmates',
    ],
    gameplay: {
      score: 9.3,
      details: 'Calling in 500kg bombs, eagle strikes, and sentry turrets with D-pad code sequences under fire creates unmatched cooperative tension.',
    },
    graphics: {
      score: 8.9,
      details: 'Stunning environmental weather hazards including fire tornadoes, blizzards, and ionic storms that alter combat dynamics.',
    },
    performance: {
      score: 8.8,
      details: 'Stable 60 FPS performance mode on PS5, with good PC scaling across diverse GPU configurations.',
    },
    audio: {
      score: 9.4,
      details: 'Wilbert Roget II’s triumphant brass score makes every extraction feel like the climatic scene of a cinematic war movie.',
    },
    replayability: {
      score: 9.0,
      details: 'The Galactic War meta-narrative steered by Game Master Joel keeps the community rallying across new battlefronts weekly.',
    },
    finalVerdict: 'Helldivers 2 is lightning in a bottle. It cuts through the modern live-service cynicism with pure, unfiltered multiplayer fun, giving players the most memorable squad moments of the decade.',
    authorId: 'author-kai-nakamura',
    publishedAt: '2024-02-14T10:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=700&q=80',
  },
  {
    id: 'rev-ff7-rebirth',
    gameId: 'game-ff7-rebirth',
    slug: 'final-fantasy-vii-rebirth',
    title: 'Final Fantasy VII Rebirth Review — Sprawling, Heartfelt Grandeur',
    score: 9.4,
    verdict: 'A magnificent open-world adventure that fleshes out beloved characters, expands iconic regions, and refines the ATB combat hybrid into near perfection.',
    pros: [
      'Synergy abilities make the hybrid action-ATB combat system a joy to execute',
      'Phenomenal character interactions, humor, and heartfelt emotional beats',
      'Queen’s Blood mini-game is an addictive card game masterpiece',
      'Massive, diverse regions brimming with distinctive music and side quests',
    ],
    cons: [
      'Open-world checklist objectives can occasionally feel standard',
      'Performance mode soft resolution on PS5 requires display compromise',
    ],
    gameplay: {
      score: 9.6,
      details: 'Switching between Cloud, Tifa, Barret, and Aerith feels effortless; team synergy skills reward deep tactical party synergy.',
    },
    graphics: {
      score: 9.0,
      details: 'Gorgeous character models and vibrant landscapes, offset slightly by lower rendering resolution in 60 FPS performance mode.',
    },
    performance: {
      score: 8.6,
      details: 'Solid framerate, but Graphics Mode at 30 FPS offers notably sharper image fidelity on 4K displays.',
    },
    audio: {
      score: 9.9,
      details: 'Over 400 musical tracks reimagined with live orchestral arrangements, synth-rock vigor, and infectious melodies.',
    },
    replayability: {
      score: 9.3,
      details: 'Over 80 hours of campaign and side activities, plus Hard Mode boss challenges that truly test Materia optimization.',
    },
    finalVerdict: 'Final Fantasy VII Rebirth is a triumph of nostalgic reverence and modern game design. It captures the wonder and spirit of adventure that defined RPG golden eras.',
    authorId: 'author-sarah-jenkins',
    publishedAt: '2024-03-01T15:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&h=700&q=80',
  },
];

export const getReviewBySlug = (slug: string): Review | undefined => {
  return REVIEWS.find(r => r.slug === slug);
};
