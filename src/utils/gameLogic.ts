import { CardType, Player, GameState } from '../types/game';

export const createDeck = (): CardType[] => {
  const cards: CardType[] = [];
  const cardTypes: CardType[] = ['bat', 'spider', 'scorpion', 'mouse', 'frog', 'fly', 'stinkbug', 'centipede'];

  cardTypes.forEach(type => {
    for (let i = 0; i < 8; i++) {
      cards.push(type);
    }
  });

  return shuffleDeck(cards);
};

export const shuffleDeck = (deck: CardType[]): CardType[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const dealCards = (deck: CardType[], playerCount: number): {
  playerHands: number[],
  remainingDeck: CardType[]
} => {
  const cardsPerPlayer = Math.floor(deck.length / playerCount);
  const playerHands = Array(playerCount).fill(cardsPerPlayer);
  const remainingDeck = deck.slice(playerCount * cardsPerPlayer);

  return { playerHands, remainingDeck };
};

export const createInitialPlayers = (playerCount: number): Player[] => {
  const players: Player[] = [];
  const names = ['あなた', '花子', '次郎', '三郎', '四郎', '五郎'];

  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: `player-${i}`,
      name: names[i] || `プレイヤー${i + 1}`,
      handCount: 0,
      openCards: {},
      isEliminated: false,
    });
  }

  return players;
};

export const initializeGame = (playerCount: number): GameState => {
  const deck = createDeck();
  const players = createInitialPlayers(playerCount);
  const { playerHands, remainingDeck } = dealCards(deck, playerCount);

  players.forEach((player, index) => {
    player.handCount = playerHands[index];
  });

  return {
    players,
    currentPlayerIndex: 0,
    deck: remainingDeck,
    currentCard: null,
    currentClaim: null,
    phase: 'playing',
    winner: null,
  };
};

export const checkGameOver = (players: Player[]): boolean => {
  const activePlayers = players.filter(p => !p.isEliminated);
  return activePlayers.length === 1;
};

export const checkPlayerElimination = (player: Player): boolean => {
  const sameCardCount = Object.values(player.openCards).some(count => count >= 4);
  const totalTypes = Object.keys(player.openCards).length;

  return sameCardCount || totalTypes >= 8;
};
