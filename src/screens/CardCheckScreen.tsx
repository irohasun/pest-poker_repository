import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CARD_INFO } from '../types/game';

interface CardCheckScreenProps {
  gameState: GameState;
  onNext: () => void;
  onBack: () => void;
}

export const CardCheckScreen: React.FC<CardCheckScreenProps> = ({
  gameState,
  onNext,
  onBack,
}) => {
  const [showWarning, setShowWarning] = useState(true);
  const [showCard, setShowCard] = useState(false);

  if (!gameState.currentTurn || !gameState.currentTurn.card || !gameState.currentTurn.declaredAs) {
    return null;
  }

  const actualCard = CARD_INFO[gameState.currentTurn.card];
  const declaredCard = CARD_INFO[gameState.currentTurn.declaredAs];
  const isTruth = gameState.currentTurn.card === gameState.currentTurn.declaredAs;

  useEffect(() => {
    // 警告表示後、2秒待機してからカードを表示
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
        setShowCard(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  if (showWarning) {
    return (
      <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>⚠️ 重要な注意</Text>
            <Text style={styles.warningText}>
              これから実際のカードを{'\n'}
              確認します{'\n'}
              {'\n'}
              他のプレイヤーには{'\n'}
              見えないように{'\n'}
              注意してください
            </Text>
            <Text style={styles.warningSubtext}>
              🤫 ポーカーフェイスを保ちましょう
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚠️ 他の人は見ないで！</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.cardLabel}>実際のカードは...</Text>

          <View style={styles.cardContainer}>
            <Image source={actualCard.image} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardName}>「{actualCard.name}」でした</Text>
          </View>

          <View style={styles.comparisonSection}>
            <Text style={styles.comparisonLabel}>前の宣言: 「{declaredCard.name}」</Text>
            <Text style={[styles.comparisonResult, isTruth ? styles.truth : styles.lie]}>
              → {isTruth ? '本当でした ✓' : '嘘でした ✗'}
            </Text>
          </View>

          <Text style={styles.nextStepText}>
            これから次の人に{'\n'}
            何を宣言するか決めます
          </Text>
        </View>

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
              <Text style={styles.nextButtonText}>次へ</Text>
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
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  warningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 24,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  warningSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginTop: 24,
  },
  header: {
    padding: 16,
    paddingTop: 0, // SafeAreaView が適用されるため、上部パディングは削除
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA726',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  cardLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FFA726',
  },
  cardImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  comparisonSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  comparisonResult: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  truth: {
    color: '#66BB6A',
  },
  lie: {
    color: '#EF5350',
  },
  nextStepText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 24,
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

