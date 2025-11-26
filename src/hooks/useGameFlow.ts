import { useState, useCallback } from 'react';
import { GameState, CardType } from '../types/game';
import { initializeGame, makeJudgment, startTurn as startTurnLogic } from '../utils/gameLogic';

export type Screen = 
  | 'title'
  | 'setup'
  | 'initialHand'
  | 'questionerSelection'
  | 'gameMain'
  | 'questionerCardSelection'
  | 'answererJudgment'
  | 'cardCheck'
  | 'passCardSelection'
  | 'passOpponentSelection'
  | 'passDeclaration'
  | 'result'
  | 'gameEnd';

export const useGameFlow = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [initialHandPlayerIndex, setInitialHandPlayerIndex] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [passSelectedOpponent, setPassSelectedOpponent] = useState<number | null>(null);
  const [lastJudgment, setLastJudgment] = useState<'believe' | 'doubt' | null>(null);
  const [cardRecipientIndex, setCardRecipientIndex] = useState<number | null>(null);
  const [receivedCardType, setReceivedCardType] = useState<CardType | null>(null); // 引き取られたカードの種類を保持
  const [gameCount, setGameCount] = useState(0); // 試合回数のカウント（1試合目判定用）
  const [lastPlayerCount, setLastPlayerCount] = useState<number | null>(null); // 前回のプレイヤー人数
  const [lastPlayerNames, setLastPlayerNames] = useState<string[]>([]); // 前回のプレイヤー名リスト

  const startGame = useCallback(() => {
    setCurrentScreen('setup');
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      deck: [],
      currentCard: null,
      currentClaim: null,
      phase: 'setup',
      winner: null,
      turnNumber: 0,
      playerCount: 0,
      currentTurn: null,
      excludedCards: [],
      remainingCards: [],
    });
  }, []);

  const completePlayerSetup = useCallback((playerCount: number, playerNames: string[]) => {
    const newGame = initializeGame(playerCount, playerNames);
    setGameState(newGame);
    setInitialHandPlayerIndex(0);
    setCurrentScreen('initialHand');
    // 前回のプレイヤー情報を保存（ゲーム再開用）
    setLastPlayerCount(playerCount);
    setLastPlayerNames(playerNames);
    // 新しいゲーム開始時に試合回数をインクリメント
    setGameCount(prev => prev + 1);
  }, []);

  const handleInitialHandNext = useCallback((selectedCard: CardType) => {
    setGameState(prevState => {
      if (!prevState) return null;
      
      const newState = { ...prevState, players: [...prevState.players] };
      const currentPlayer = newState.players[initialHandPlayerIndex];
      
      if (!currentPlayer) return newState;

      const cardIndex = currentPlayer.hand.indexOf(selectedCard);
      if (cardIndex !== -1) {
        currentPlayer.hand.splice(cardIndex, 1);
        currentPlayer.handCount = currentPlayer.hand.length;
        
        if (!currentPlayer.openCards[selectedCard]) {
          currentPlayer.openCards[selectedCard] = 0;
        }
        currentPlayer.openCards[selectedCard]++;
      }
      return newState;
    });

    setInitialHandPlayerIndex(prev => prev + 1);
  }, [initialHandPlayerIndex]);

  const completeInitialHand = useCallback(() => {
    setCurrentScreen('questionerSelection');
  }, []);

  const selectQuestioner = useCallback((playerIndex: number) => {
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentPlayerIndex: playerIndex,
        phase: 'playing',
      };
    });
    setCurrentScreen('gameMain');
  }, []);

  const updateGameState = useCallback((newState: GameState) => {
    setGameState(newState);
    if (newState.phase === 'gameOver') {
      setCurrentScreen('gameEnd');
    }
  }, []);

  const startTurn = useCallback(() => {
    setCurrentScreen('questionerCardSelection');
  }, []);

  const completeQuestionerCardSelection = useCallback(() => {
    setCurrentScreen('answererJudgment');
  }, []);

  const makeJudgmentCall = useCallback((judgment: 'believe' | 'doubt') => {
    if (!gameState || !gameState.currentTurn) return;
    
    setLastJudgment(judgment);
    const { card, declaredAs, questioner, answerer } = gameState.currentTurn;
    const isClaimTrue = card === declaredAs;
    const challengeSucceeds = (judgment === 'believe') === isClaimTrue;
    const recipientIndex = challengeSucceeds ? questioner : answerer;
    
    // 引き取られたカードの種類を保存（makeJudgment後はcurrentTurnがnullになるため）
    setReceivedCardType(card);
    
    // 直接ゲーム状態を更新してResultScreenへ遷移
    const newState = makeJudgment(gameState, judgment === 'believe');
    updateGameState(newState);
    
    if (newState.phase !== 'gameOver') {
      setCardRecipientIndex(recipientIndex);
      setCurrentScreen('result');
    }
  }, [gameState, updateGameState]);


  const completeResult = useCallback(() => {
    if (!gameState || cardRecipientIndex === null) return;
    
    // 次の出題者（cardRecipientIndex）でターンを開始
    // makeJudgmentで既にcurrentPlayerIndexが更新されているはずだが、念のため確認
    const nextQuestionerIndex = gameState.currentPlayerIndex;
    const newState = startTurnLogic(gameState, nextQuestionerIndex);
    
    // ゲーム状態を更新
    setGameState(newState);
    
    // 状態をクリア
    setLastJudgment(null);
    setCardRecipientIndex(null);
    setReceivedCardType(null); // 引き取られたカードの種類もクリア
    
    // gameMainを経由せず、直接questionerCardSelectionに遷移
    if (newState.phase !== 'gameOver') {
      setCurrentScreen('questionerCardSelection');
    }
  }, [gameState, cardRecipientIndex]);

  const handlePass = useCallback(() => {
    setCurrentScreen('cardCheck');
  }, []);

  const completeCardCheck = useCallback(() => {
    // カード確認後、統合された「他の人に渡す」選択画面へ遷移
    setCurrentScreen('passCardSelection');
  }, []);

  const completePassCardSelection = useCallback(() => {
    // 統合画面で相手選択と宣言選択が完了したら、判定画面へ遷移
    setCurrentScreen('answererJudgment');
  }, []);

  // 後方互換性のため残す（古い実装用）
  const selectPassOpponent = useCallback((opponentIndex: number) => {
    setPassSelectedOpponent(opponentIndex);
    setCurrentScreen('passDeclaration');
  }, []);

  // 後方互換性のため残す（古い実装用）
  const completePassDeclaration = useCallback(() => {
    setCurrentScreen('answererJudgment');
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  // ゲームを再開する（もう一度プレイ）
  const restartGame = useCallback(() => {
    // 前回のプレイヤー情報が保存されている場合のみ再開
    if (lastPlayerCount === null || lastPlayerNames.length === 0) {
      console.warn('Cannot restart game: player information not found');
      return;
    }

    const newGame = initializeGame(lastPlayerCount, lastPlayerNames);
    setGameState(newGame);
    setInitialHandPlayerIndex(0);
    setCurrentScreen('initialHand');
    // 状態をクリア
    setLastJudgment(null);
    setCardRecipientIndex(null);
    setReceivedCardType(null);
    setPassSelectedOpponent(null);
    // 新しいゲーム開始時に試合回数をインクリメント
    setGameCount(prev => prev + 1);
  }, [lastPlayerCount, lastPlayerNames]);

  return {
    gameState,
    currentScreen,
    initialHandPlayerIndex,
    passSelectedOpponent,
    lastJudgment,
    cardRecipientIndex,
    receivedCardType, // 引き取られたカードの種類を返す
    gameCount, // 試合回数（1試合目判定用）
    startGame,
    completePlayerSetup,
    handleInitialHandNext,
    completeInitialHand,
    selectQuestioner,
    updateGameState,
    startTurn,
    completeQuestionerCardSelection,
    makeJudgmentCall,
    completeResult,
    handlePass,
    completeCardCheck,
    completePassCardSelection,
    selectPassOpponent, // 後方互換性のため残す（古い実装用）
    completePassDeclaration, // 後方互換性のため残す（古い実装用）
    navigateTo,
    restartGame, // ゲーム再開用
  };
};

