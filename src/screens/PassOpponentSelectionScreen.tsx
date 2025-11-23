import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState } from '../types/game';
import { passCard } from '../utils/gameLogic';
import { PlayerStatus } from '../components/PlayerStatus';
import { CardType, CARD_INFO } from '../types/game';

interface PassOpponentSelectionScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onNext: (opponentIndex: number) => void;
  onBack: () => void;
}

export const PassOpponentSelectionScreen: React.FC<PassOpponentSelectionScreenProps> = ({
  gameState,
  onUpdateGameState,
  onNext,
  onBack,
}) => {
  if (!gameState.currentTurn) return null;

  const answerer = gameState.players[gameState.currentTurn.answerer];
  const availablePlayers = gameState.players.filter(
    (p, index) =>
      !p.isEliminated &&
      index !== gameState.currentTurn!.answerer &&
      !gameState.currentTurn!.playersInTurn.includes(index)
  );

  const handleOpponentSelect = (opponentIndex: number) => {
    onNext(opponentIndex);
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.headerButtonText}>◀ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>誰に渡しますか？</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {availablePlayers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                渡せる相手がいません{'\n'}
                判定してください
              </Text>
            </View>
          ) : (
            availablePlayers.map((player, index) => {
              const playerIndex = gameState.players.findIndex(p => p.id === player.id);
              return (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerCard}
                  onPress={() => handleOpponentSelect(playerIndex)}
                  activeOpacity={0.7}
                >
                  <PlayerStatus
                    player={player}
                    isCurrentPlayer={false}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerButtonText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  playerCard: {
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 28,
  },
});

