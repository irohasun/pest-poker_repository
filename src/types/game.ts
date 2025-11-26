import { ImageSourcePropType } from 'react-native';

export type CardType = 'bat' | 'spider' | 'scorpion' | 'mouse' | 'frog' | 'fly' | 'stinkbug' | 'centipede';

export interface CardInfo {
  type: CardType;
  name: string;
  emoji: string;
  image: ImageSourcePropType;
}

export interface Player {
  id: string;
  name: string;
  handCount: number;
  hand: CardType[]; // 実際の手札
  openCards: Record<CardType, number>;
  isEliminated: boolean;
}

// 現在のターン情報
export interface CurrentTurn {
  questioner: number; // 出題者のプレイヤーID（インデックス）
  card: CardType | null; // 選択されたカード
  declaredAs: CardType | null; // 宣言内容
  answerer: number; // 現在の回答者のプレイヤーID（インデックス）
  playersInTurn: number[]; // このターンで出題した人のリスト
  history: TurnHistory[]; // このターン内の履歴
}

// ターン内の履歴
export interface TurnHistory {
  player: number; // プレイヤーID（インデックス）
  action: 'question' | 'pass'; // 出題 or 渡す
  to: number; // 渡した相手のプレイヤーID（インデックス）
  declared: CardType; // 宣言内容
  timestamp?: string; // タイムスタンプ（オプション）
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: CardType[];
  currentCard: CardType | null;
  currentClaim: CardType | null;
  phase: 'title' | 'setup' | 'initialHand' | 'playing' | 'judging' | 'gameOver';
  winner: string | null;
  // 追加フィールド
  turnNumber: number; // ターン数
  playerCount: number; // プレイヤー人数
  currentTurn: CurrentTurn | null; // 現在のターン情報
  excludedCards: CardType[]; // 2人プレイ時の除外カード
  remainingCards: CardType[]; // 配り切れなかったカード
}

export const CARD_INFO: Record<CardType, CardInfo> = {
  bat: { type: 'bat', name: 'コウモリ', emoji: '🦇', image: require('../../assets/cards/pests/bat.png') },
  spider: { type: 'spider', name: 'クモ', emoji: '🕷️', image: require('../../assets/cards/pests/spider.png') },
  scorpion: { type: 'scorpion', name: 'サソリ', emoji: '🦂', image: require('../../assets/cards/pests/scorpion.png') },
  mouse: { type: 'mouse', name: 'ネズミ', emoji: '🐭', image: require('../../assets/cards/pests/mouse.png') },
  frog: { type: 'frog', name: 'カエル', emoji: '🐸', image: require('../../assets/cards/pests/flog.png') },
  fly: { type: 'fly', name: 'ハエ', emoji: '🪰', image: require('../../assets/cards/pests/bug.png') },
  stinkbug: { type: 'stinkbug', name: 'カメムシ', emoji: '🪲', image: require('../../assets/cards/pests/stinkbug.png') },
  centipede: { type: 'centipede', name: 'ムカデ', emoji: '🦂', image: require('../../assets/cards/pests/centipede.png') },
};
