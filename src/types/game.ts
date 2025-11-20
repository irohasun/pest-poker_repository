export type CardType = 'bat' | 'spider' | 'scorpion' | 'mouse' | 'frog' | 'fly' | 'stinkbug' | 'centipede';

export interface CardInfo {
  type: CardType;
  name: string;
  emoji: string;
}

export interface Player {
  id: string;
  name: string;
  handCount: number;
  openCards: Record<CardType, number>;
  isEliminated: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: CardType[];
  currentCard: CardType | null;
  currentClaim: CardType | null;
  phase: 'title' | 'setup' | 'playing' | 'judging' | 'gameOver';
  winner: string | null;
}

export const CARD_INFO: Record<CardType, CardInfo> = {
  bat: { type: 'bat', name: 'コウモリ', emoji: '🦇' },
  spider: { type: 'spider', name: 'クモ', emoji: '🕷️' },
  scorpion: { type: 'scorpion', name: 'サソリ', emoji: '🦂' },
  mouse: { type: 'mouse', name: 'ネズミ', emoji: '🐭' },
  frog: { type: 'frog', name: 'カエル', emoji: '🐸' },
  fly: { type: 'fly', name: 'ハエ', emoji: '🪰' },
  stinkbug: { type: 'stinkbug', name: 'カメムシ', emoji: '🪲' },
  centipede: { type: 'centipede', name: 'ムカデ', emoji: '🦟' },
};
