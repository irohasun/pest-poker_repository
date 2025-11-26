import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CARD_INFO } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { startTurn } from '../utils/gameLogic';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, LAYOUT, TIMING } from '../constants/theme';

interface GameMainScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onSelectOpponent: () => void;
  onJudgment: () => void;
  onPause?: () => void;
  onReturnToTitle?: () => void;
  onEndGame?: () => void;
}

export const GameMainScreen: React.FC<GameMainScreenProps> = ({
  gameState,
  onUpdateGameState,
  onSelectOpponent,
  onJudgment,
  onPause,
  onReturnToTitle,
  onEndGame,
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (!currentPlayer) {
    return null; // 安全のため
  }

  const isQuestioner = gameState.currentTurn === null || 
                       (gameState.currentTurn.questioner === gameState.currentPlayerIndex && 
                        gameState.currentTurn.card === null);
  const isAnswerer = gameState.currentTurn !== null && 
                     gameState.currentTurn.answerer === gameState.currentPlayerIndex &&
                     gameState.currentTurn.card !== null &&
                     gameState.currentTurn.declaredAs !== null;

  // ターンが開始されていない場合、自動的に開始
  useEffect(() => {
    if (isQuestioner && gameState.phase === 'playing') {
      // 既にターンが開始されている場合は、自動的に相手選択画面に遷移
      if (gameState.currentTurn && gameState.currentTurn.questioner === gameState.currentPlayerIndex && gameState.currentTurn.card === null) {
        // 少し遅延させてから遷移（画面がレンダリングされるのを待つ）
        const timer = setTimeout(() => {
          onSelectOpponent();
        }, TIMING.screenTransitionDelay);
        return () => clearTimeout(timer);
      } else {
        // ターンが開始されていない場合、ターンを開始
        const newState = startTurn(gameState, gameState.currentPlayerIndex);
        if (newState.phase === 'gameOver') {
          onUpdateGameState(newState);
        } else {
          onUpdateGameState(newState);
        }
      }
    }
  }, [gameState.currentPlayerIndex, gameState.phase, gameState.currentTurn, isQuestioner, onSelectOpponent, onUpdateGameState]);

  // ゲーム終了チェック
  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  if (activePlayers.length === 1) {
    // ゲーム終了画面へ遷移（後で実装）
    return null;
  }

  return (
    <ScreenLayout
      title={`ターン: ${gameState.turnNumber + 1}`}
      style={{ paddingBottom: 0 }}
      onBack={undefined} // No back button on main screen usually
      onPause={onPause}
      onReturnToTitle={onReturnToTitle}
      onEndGame={onEndGame}
    >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>📊 現在の状況</Text>

          {gameState.players.map((player, index) => (
            <PlayerStatus
              key={player.id}
              player={player}
              isCurrentPlayer={index === gameState.currentPlayerIndex}
            />
          ))}
        </ScrollView>


        {isAnswerer && gameState.currentTurn && (
          <View style={styles.bottomBar}>
            <Text style={styles.turnInfo}>
              【{currentPlayer.name}さんの番です】
            </Text>
            <Text style={styles.declarationText}>
              {gameState.currentTurn.declaredAs && gameState.players[gameState.currentTurn.questioner]
                ? `${gameState.players[gameState.currentTurn.questioner].name}さん\n「これは${CARD_INFO[gameState.currentTurn.declaredAs].name}です」`
                : ''}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onJudgment}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gradientRed}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionButtonText}>判定する</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: LAYOUT.spacing,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  bottomBar: {
    padding: LAYOUT.spacing,
    backgroundColor: COLORS.overlayDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  turnInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  declarationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
