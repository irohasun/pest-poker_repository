import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CardType } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { checkPlayerElimination } from '../utils/gameLogic';

interface ResultScreenProps {
  gameState: GameState;
  cardRecipientIndex: number;
  receivedCardType: CardType | null; // 引き取られたカードの種類
  onNext: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameState,
  cardRecipientIndex,
  receivedCardType,
  onNext,
}) => {
  const insets = useSafeAreaInsets();
  const cardRecipient = gameState.players[cardRecipientIndex];
  const nextQuestioner = cardRecipient; // カードを引き取った人が次の出題者

  // 敗北判定チェック
  const eliminationResult = checkPlayerElimination(cardRecipient);
  if (eliminationResult.isEliminated) {
    // ゲーム終了画面へ遷移（後で実装）
    onNext();
    return null;
  }

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top / 8, 4) }]}>
          <Text style={styles.headerTitle}>ターン{gameState.turnNumber}の結果</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.summarySection}
          >
            <Text style={styles.summaryText}>
              <Text style={styles.recipientName}>{cardRecipient.name}</Text>さんが{'\n'}
              カードを引き取りました
            </Text>
          </LinearGradient>

          <View style={styles.situationSection}>
            <Text style={styles.sectionTitle}>現在の状況</Text>
            {gameState.players.map((player, index) => {
              // カードを引き取ったプレイヤーの場合、引き取られたカードの種類を赤枠で強調表示
              let highlightCardType: CardType | undefined;
              if (index === cardRecipientIndex && receivedCardType) {
                // 引き取られたカードの種類を設定（useGameFlowで保持された値を使用）
                highlightCardType = receivedCardType;
              }

              return (
              <PlayerStatus
                key={player.id}
                player={player}
                  isCurrentPlayer={false}
                  highlightCardType={highlightCardType}
              />
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#C62828', '#D32F2F']}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextButtonText}>
                次のターンへ ({nextQuestioner.name}さんの番)
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
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  summarySection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryIcon: {
    fontSize: 30,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '500',
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD54F', // 黄色で強調
  },
  nextQuestionerSection: {
    backgroundColor: 'rgba(198, 40, 40, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C62828',
  },
  nextQuestionerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  nextQuestionerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  situationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
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
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

