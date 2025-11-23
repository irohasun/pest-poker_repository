import { CardType, Player, GameState, CurrentTurn } from '../types/game';

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

// カード配布（実際の手札を配布）
export const dealCards = (
  deck: CardType[],
  playerCount: number
): {
  playerHands: CardType[][];
  remainingDeck: CardType[];
} => {
  const cardsPerPlayer = Math.floor(deck.length / playerCount);
  const playerHands: CardType[][] = [];
  const remainingDeck: CardType[] = [];

  for (let i = 0; i < playerCount; i++) {
    const hand = deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer);
    playerHands.push(hand);
  }

  // 配り切れなかったカード
  const dealtCount = playerCount * cardsPerPlayer;
  if (dealtCount < deck.length) {
    remainingDeck.push(...deck.slice(dealtCount));
  }

  return { playerHands, remainingDeck };
};

export const createInitialPlayers = (playerCount: number, playerNames: string[]): Player[] => {
  const players: Player[] = [];

  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: `player-${i}`,
      name: playerNames[i] || `プレイヤー${i + 1}`,
      handCount: 0,
      hand: [],
      openCards: {} as Record<CardType, number>,
      isEliminated: false,
    });
  }

  return players;
};

// 2人プレイ時の除外カード処理
export const excludeCardsForTwoPlayers = (deck: CardType[]): {
  excludedCards: CardType[];
  remainingDeck: CardType[];
} => {
  const shuffled = shuffleDeck([...deck]);
  const excludedCards = shuffled.slice(0, 10);
  const remainingDeck = shuffled.slice(10);
  
  // デバッグ用（本番では非表示）
  console.log('2-player mode: 10 cards excluded');
  console.log('Excluded cards:', excludedCards);
  
  return { excludedCards, remainingDeck };
};

// ゲーム初期化
export const initializeGame = (playerCount: number, playerNames: string[]): GameState => {
  let deck = createDeck();
  let excludedCards: CardType[] = [];

  // 2人プレイ時の特殊ルール：10枚をランダムに除外
  if (playerCount === 2) {
    const { excludedCards: excluded, remainingDeck } = excludeCardsForTwoPlayers(deck);
    excludedCards = excluded;
    deck = remainingDeck;
  }

  const players = createInitialPlayers(playerCount, playerNames);
  const { playerHands, remainingDeck } = dealCards(deck, playerCount);

  players.forEach((player, index) => {
    player.hand = playerHands[index];
    player.handCount = playerHands[index].length;
  });

  // 最初の出題者は初期手札確認後に決定するため、ここでは仮の値（0）を設定
  // 実際にはQuestionerSelectionScreenでユーザーが選択する
  const initialQuestionerIndex = 0;

  return {
    players,
    currentPlayerIndex: initialQuestionerIndex,
    deck: remainingDeck,
    currentCard: null,
    currentClaim: null,
    phase: 'initialHand',
    winner: null,
    turnNumber: 0,
    playerCount,
    currentTurn: null,
    excludedCards,
    remainingCards: remainingDeck,
  };
};

export const checkGameOver = (players: Player[]): boolean => {
  const activePlayers = players.filter(p => !p.isEliminated);
  return activePlayers.length === 1;
};

// ターン開始（出題者がカードを選ぶ）
export const startTurn = (gameState: GameState, questionerIndex: number): GameState => {
  const questioner = gameState.players[questionerIndex];
  
  // 手札0枚で出題できない場合の敗北判定
  if (questioner.handCount === 0) {
    questioner.isEliminated = true;
    return {
      ...gameState,
      phase: 'gameOver',
      winner: null, // 敗者が決まった
    };
  }

  const currentTurn: CurrentTurn = {
    questioner: questionerIndex,
    card: null,
    declaredAs: null,
    answerer: questionerIndex, // 初期値は出題者
    playersInTurn: [questionerIndex],
    history: [],
  };

  return {
    ...gameState,
    currentTurn,
    phase: 'playing',
  };
};

// カード選択
export const selectCard = (gameState: GameState, card: CardType): GameState => {
  if (!gameState.currentTurn) return gameState;

  const questioner = gameState.players[gameState.currentTurn.questioner];
  
  // 手札からカードを削除
  const cardIndex = questioner.hand.indexOf(card);
  if (cardIndex === -1) return gameState; // カードが見つからない

  questioner.hand.splice(cardIndex, 1);
  questioner.handCount = questioner.hand.length;

  return {
    ...gameState,
    currentTurn: {
      ...gameState.currentTurn,
      card,
    },
  };
};

// 相手選択
export const selectOpponent = (gameState: GameState, opponentIndex: number): GameState => {
  if (!gameState.currentTurn) return gameState;
  if (opponentIndex === gameState.currentTurn.questioner) return gameState; // 自分自身は選択不可

  return {
    ...gameState,
    currentTurn: {
      ...gameState.currentTurn,
      answerer: opponentIndex,
    },
  };
};

// 宣言選択
export const selectDeclaration = (gameState: GameState, declaredAs: CardType): GameState => {
  if (!gameState.currentTurn) return gameState;

  const currentTurn = gameState.currentTurn;
  
  // 履歴に追加
  const historyEntry = {
    player: currentTurn.questioner,
    action: 'question' as const,
    to: currentTurn.answerer,
    declared: declaredAs,
    timestamp: new Date().toISOString(),
  };

  return {
    ...gameState,
    currentTurn: {
      ...currentTurn,
      declaredAs,
      history: [...currentTurn.history, historyEntry],
    },
    phase: 'judging',
  };
};

// 判定処理（本当/嘘）
export const makeJudgment = (
  gameState: GameState,
  believesClaim: boolean
): GameState => {
  if (!gameState.currentTurn || !gameState.currentTurn.card || !gameState.currentTurn.declaredAs) {
    return gameState;
  }

  const { card, declaredAs, questioner, answerer } = gameState.currentTurn;
  const isClaimTrue = card === declaredAs;
  const challengeSucceeds = believesClaim === isClaimTrue;

  // 判定結果に応じてカードの行き先を決定
  let targetPlayerIndex: number;
  if (challengeSucceeds) {
    // 判定成功：カードは出題者に戻る
    targetPlayerIndex = questioner;
  } else {
    // 判定失敗：カードは回答者に残る
    targetPlayerIndex = answerer;
  }

  const targetPlayer = gameState.players[targetPlayerIndex];
  
  // 公開カードに追加
  if (!targetPlayer.openCards[card]) {
    targetPlayer.openCards[card] = 0;
  }
  targetPlayer.openCards[card]++;

  // 敗北判定
  const eliminationResult = checkPlayerElimination(targetPlayer);
  if (eliminationResult.isEliminated) {
    targetPlayer.isEliminated = true;
    return {
      ...gameState,
      players: [...gameState.players],
      phase: 'gameOver',
      winner: null,
    };
  }

  // 🎯 重要ルール：次の出題者は必ずカードを引き取った人
  // カードを引き取った人が次の出題者になる
  const nextQuestioner = targetPlayerIndex;
  
  return {
    ...gameState,
    players: [...gameState.players],
    turnNumber: gameState.turnNumber + 1,
    currentPlayerIndex: nextQuestioner,
    currentTurn: null,
    phase: 'playing',
  };
};

// 「他の人に渡す」処理
export const passCard = (
  gameState: GameState,
  nextOpponentIndex: number,
  newDeclaration: CardType
): GameState => {
  if (!gameState.currentTurn || !gameState.currentTurn.card) {
    return gameState;
  }

  const currentTurn = gameState.currentTurn;
  
  // 出題済みプレイヤーは除外
  if (currentTurn.playersInTurn.includes(nextOpponentIndex)) {
    return gameState; // 無効な選択
  }

  // 履歴に追加
  const historyEntry = {
    player: currentTurn.answerer,
    action: 'pass' as const,
    to: nextOpponentIndex,
    declared: newDeclaration,
    timestamp: new Date().toISOString(),
  };

  return {
    ...gameState,
    currentTurn: {
      ...currentTurn,
      answerer: nextOpponentIndex,
      declaredAs: newDeclaration,
      playersInTurn: [...currentTurn.playersInTurn, currentTurn.answerer],
      history: [...currentTurn.history, historyEntry],
    },
    phase: 'judging',
  };
};

// 次のアクティブなプレイヤーを取得
export const getNextActivePlayer = (gameState: GameState, startIndex: number): number => {
  let nextIndex = (startIndex + 1) % gameState.playerCount;
  let attempts = 0;
  
  while (gameState.players[nextIndex].isEliminated && attempts < gameState.playerCount) {
    nextIndex = (nextIndex + 1) % gameState.playerCount;
    attempts++;
  }
  
  return nextIndex;
};

// 渡せる相手がいるかチェック
export const canPassToOthers = (gameState: GameState): boolean => {
  if (!gameState.currentTurn) return false;

  const { playersInTurn, answerer } = gameState.currentTurn;
  const availablePlayers = gameState.players.filter(
    (p, index) => 
      !p.isEliminated && 
      index !== answerer && 
      !playersInTurn.includes(index)
  );

  return availablePlayers.length > 0;
};

// 敗北判定（完全実装）
export const checkPlayerElimination = (player: Player): {
  isEliminated: boolean;
  reason?: 'same_type' | 'all_types' | 'no_cards';
  type?: CardType;
} => {
  // 条件1: 同じ種類が4枚
  for (const [type, count] of Object.entries(player.openCards)) {
    if (count >= 4) {
      return {
        isEliminated: true,
        reason: 'same_type',
        type: type as CardType,
      };
    }
  }

  // 条件2: 8種類全て
  const totalTypes = Object.keys(player.openCards).length;
  if (totalTypes >= 8) {
    return {
      isEliminated: true,
      reason: 'all_types',
    };
  }

  // 条件3: 手札0枚（この関数を呼ぶ前にチェック）
  // 注意: 手札0枚の判定は別の関数で行う

  return { isEliminated: false };
};

// 手札0枚で出題できない場合の敗北判定
export const checkNoHandDefeat = (player: Player, isQuestioner: boolean): boolean => {
  // 出題者のターンで手札が0枚の場合
  if (isQuestioner && player.handCount === 0) {
    // 例外: 最後の1枚を出して、相手に押し付けた場合は敗北しない
    // この判定は、カードが戻ってきた場合（判定失敗）にのみ敗北
    return true;
  }
  return false;
};
