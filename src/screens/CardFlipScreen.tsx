import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CARD_INFO } from '../types/game';

interface CardFlipScreenProps {
  gameState: GameState;
  judgment: 'believe' | 'doubt';
  onNext: () => void;
}

export const CardFlipScreen: React.FC<CardFlipScreenProps> = ({
  gameState,
  judgment,
  onNext,
}) => {
  const [phase, setPhase] = useState<'declaration' | 'flipping' | 'result'>('declaration');
  const flipAnim = React.useRef(new Animated.Value(0)).current;

  if (!gameState.currentTurn || !gameState.currentTurn.card || !gameState.currentTurn.declaredAs) {
    return null;
  }

  const answerer = gameState.players[gameState.currentTurn.answerer];
  const actualCard = CARD_INFO[gameState.currentTurn.card];
  const declaredCard = CARD_INFO[gameState.currentTurn.declaredAs];
  const isClaimTrue = gameState.currentTurn.card === gameState.currentTurn.declaredAs;
  const challengeSucceeds = (judgment === 'believe' && isClaimTrue) || 
                            (judgment === 'doubt' && !isClaimTrue);
  const cardRecipient = challengeSucceeds 
    ? gameState.players[gameState.currentTurn.questioner]
    : answerer;

  useEffect(() => {
    // 判定宣言表示（1秒）
    const timer1 = setTimeout(() => {
      setPhase('flipping');
      // カードめくりアニメーション
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPhase('result');
      });
    }, 1000);

    return () => clearTimeout(timer1);
  }, [flipAnim]);


  if (phase === 'declaration') {
    return (
      <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.declarationText}>
              {answerer.name}さんの判定:
            </Text>
            <Text style={styles.judgmentText}>
              「{judgment === 'believe' ? '本当だと思う' : '嘘だと思う'}」
            </Text>
            <View style={styles.cardPlaceholder}>
              <Text style={styles.cardPlaceholderEmoji}>🃏</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (phase === 'flipping') {
    return (
      <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.cardContainer}>
              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { opacity: flipAnim.interpolate({
                    inputRange: [0, 0.5],
                    outputRange: [1, 0],
                  }) },
                ]}
              >
                <Text style={styles.cardBackEmoji}>🃏</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.card,
                  styles.cardFront,
                  { opacity: flipAnim.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0, 1],
                  }) },
                ]}
              >
                <Text style={styles.cardEmoji}>{actualCard.emoji}</Text>
                <Text style={styles.cardName}>{actualCard.name}</Text>
              </Animated.View>
            </View>
            <Text style={styles.flippingText}>めくり中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // 結果表示
  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.resultContainer}>
            <Text style={[styles.resultIcon, challengeSucceeds ? styles.success : styles.failure]}>
              {challengeSucceeds ? '✓' : '❌'}
            </Text>
            <Text style={[styles.resultText, challengeSucceeds ? styles.success : styles.failure]}>
              {challengeSucceeds ? '判定成功！' : '判定失敗！'}
            </Text>
          </View>

          <View style={styles.cardInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>宣言:</Text>
              <Text style={styles.infoValue}>{declaredCard.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>実際:</Text>
              <Text style={styles.infoValue}>{actualCard.name}</Text>
            </View>
          </View>

          <View style={styles.recipientContainer}>
            <Text style={styles.recipientText}>
              カードは{cardRecipient.name}さんへ
            </Text>
          </View>

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  declarationText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  judgmentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  cardPlaceholder: {
    width: 200,
    height: 280,
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholderEmoji: {
    fontSize: 80,
  },
  cardContainer: {
    width: 200,
    height: 280,
    marginBottom: 32,
  },
  card: {
    width: 200,
    height: 280,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#2D2D2D',
  },
  cardFront: {
    backgroundColor: '#1E1E1E',
    transform: [{ rotateY: '180deg' }],
  },
  cardBackEmoji: {
    fontSize: 80,
  },
  cardEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  flippingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  success: {
    color: '#66BB6A',
  },
  failure: {
    color: '#EF5350',
  },
  cardInfoContainer: {
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    maxWidth: 300,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recipientContainer: {
    marginBottom: 32,
  },
  recipientText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    maxWidth: 300,
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

