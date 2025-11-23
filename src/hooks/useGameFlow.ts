import { useState, useCallback } from 'react';
import { GameState, CardType } from '../types/game';
import { initializeGame, makeJudgment } from '../utils/gameLogic';

export type Screen = 
  | 'title'
  | 'setup'
  | 'initialHand'
  | 'questionerSelection'
  | 'gameMain'
  | 'questionerCardSelection'
  | 'answererJudgment'
  | 'cardCheck'
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

    setInitialHandPlayerIndex(prev => {
      // Note: we can't easily access gameState here if it's stale, but 
      // since we update it locally or check bounds in render, it's safer to use functional update or check before calling
      // However, we rely on the component to check `if (!isLastPlayer)` before calling this.
      // But for safety, we should pass the total count or handle it in the component.
      // Refactoring note: The component handles the index increment logic mostly.
      // Let's assume the component decides when to call complete vs next.
      return prev + 1;
    });
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
    
    setCardRecipientIndex(recipientIndex);
    
    // CardFlipScreenをスキップして、直接ゲーム状態を更新してResultScreenへ
    const newState = makeJudgment(gameState, judgment === 'believe');
    updateGameState(newState);
    
    if (newState.phase !== 'gameOver') {
      setCurrentScreen('result');
    }
  }, [gameState, updateGameState]);

  const completeCardFlip = useCallback(() => {
    if (!gameState || !lastJudgment || cardRecipientIndex === null) return;
    
    const newState = makeJudgment(gameState, lastJudgment === 'believe');
    updateGameState(newState);
    
    if (newState.phase !== 'gameOver') {
      setCurrentScreen('result');
    }
  }, [gameState, lastJudgment, cardRecipientIndex, updateGameState]);

  const completeResult = useCallback(() => {
    setLastJudgment(null);
    setCardRecipientIndex(null);
    setCurrentScreen('gameMain');
  }, []);

  const handlePass = useCallback(() => {
    setCurrentScreen('cardCheck');
  }, []);

  const completeCardCheck = useCallback(() => {
    setCurrentScreen('passOpponentSelection');
  }, []);

  const selectPassOpponent = useCallback((opponentIndex: number) => {
    setPassSelectedOpponent(opponentIndex);
    setCurrentScreen('passDeclaration');
  }, []);

  const completePassDeclaration = useCallback(() => {
    setCurrentScreen('answererJudgment');
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  return {
    gameState,
    currentScreen,
    initialHandPlayerIndex,
    passSelectedOpponent,
    lastJudgment,
    cardRecipientIndex,
    startGame,
    completePlayerSetup,
    handleInitialHandNext,
    completeInitialHand,
    selectQuestioner,
    updateGameState,
    startTurn,
    completeQuestionerCardSelection,
    makeJudgmentCall,
    completeCardFlip,
    completeResult,
    handlePass,
    completeCardCheck,
    selectPassOpponent,
    completePassDeclaration,
    navigateTo,
  };
};

