import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameState } from './src/types/game';
import { initializeGame } from './src/utils/gameLogic';
import { TitleScreen } from './src/screens/TitleScreen';
import { GameScreen } from './src/screens/GameScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStartGame = () => {
    const newGame = initializeGame(3);
    setGameState(newGame);
  };

  const handleUpdateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  if (!gameState || gameState.phase === 'title') {
    return (
      <>
        <StatusBar style="light" />
        <TitleScreen onStartGame={handleStartGame} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <GameScreen gameState={gameState} onUpdateGameState={handleUpdateGameState} />
    </>
  );
}
