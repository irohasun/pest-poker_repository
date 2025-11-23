import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, Player } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS } from '../constants/theme';

interface QuestionerSelectionScreenProps {
  gameState: GameState;
  onSelectQuestioner: (playerIndex: number) => void;
}

export const QuestionerSelectionScreen: React.FC<QuestionerSelectionScreenProps> = ({
  gameState,
  onSelectQuestioner,
}) => {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleConfirm = () => {
    if (selectedPlayerIndex !== null) {
      setShowWarning(true);
    }
  };

  const handleStartGame = () => {
    if (selectedPlayerIndex !== null) {
      onSelectQuestioner(selectedPlayerIndex);
    }
  };

  if (showWarning && selectedPlayerIndex !== null) {
    const selectedPlayer = gameState.players[selectedPlayerIndex];
    return (
      <ScreenLayout hideHeader>
        <TouchableOpacity 
          style={styles.warningContainer} 
          onPress={handleStartGame} 
          activeOpacity={0.9}
        >
          <Text style={styles.warningTitle}>{selectedPlayer.name}さんに渡してください</Text>
          <Text style={styles.warningText}>
            これからゲームを開始します{'\n'}
            {selectedPlayer.name}さんは{'\n'}
            準備ができたら画面をタップしてください
          </Text>
          <Text style={styles.tapToRevealText}>
            タップしてゲーム開始
          </Text>
        </TouchableOpacity>
      </ScreenLayout>
    );
  }

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>最初の出題者を決定</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.instructionText}>
            手札配りが完了しました。{'\n'}
            最初の出題者を選択してください。
          </Text>

          <View style={styles.statusPreview}>
            <Text style={styles.statusTitle}>プレイヤー一覧</Text>
            {gameState.players.map((player, index) => (
              <TouchableOpacity
                key={`select-${player.id}`}
                onPress={() => setSelectedPlayerIndex(index)}
                activeOpacity={0.8}
              >
                <PlayerStatus
                  player={player}
                  isCurrentPlayer={selectedPlayerIndex === index}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedPlayerIndex === null && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={selectedPlayerIndex === null}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedPlayerIndex !== null ? ['#C62828', '#D32F2F'] : ['#666666', '#555555']}
              style={styles.confirmButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.confirmButtonText}>
                {selectedPlayerIndex !== null 
                  ? `${gameState.players[selectedPlayerIndex].name}から開始` 
                  : '出題者を選択してください'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  statusPreview: {
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  warningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  tapToRevealText: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 32,
    fontWeight: 'bold',
  },
});

