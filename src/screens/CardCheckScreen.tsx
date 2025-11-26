import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CARD_INFO } from '../types/game';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, LAYOUT } from '../constants/theme';

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

  const handleWarningTap = () => {
        setShowWarning(false);
        setShowCard(true);
  };

  if (showWarning) {
    return (
      <ScreenLayout hideHeader>
        <TouchableOpacity 
          style={styles.warningContainer} 
          onPress={handleWarningTap}
          activeOpacity={0.9}
        >
          <Text style={styles.warningTitle}>⚠️</Text>
            <Text style={styles.warningText}>
              これから実際のカードを{'\n'}
              確認します{'\n'}
              {'\n'}
              他のプレイヤーには{'\n'}
              見えないように{'\n'}
              注意してください
            </Text>
          <Text style={styles.tapToRevealText}>
            タップしてカードを確認
            </Text>
        </TouchableOpacity>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="⚠️ 他の人は見ないで！"
      onBack={onBack}
      style={{ paddingBottom: 0 }}
    >
      <TouchableOpacity 
        style={styles.content} 
        onPress={onNext}
        activeOpacity={0.9}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={false}
        >
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
          <Text style={styles.tapToRevealText}>
            タップして次へ
          </Text>
        </ScrollView>
          </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  warningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
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
  warningSubtext: {
    fontSize: 16,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 24,
  },
  tapToRevealText: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: LAYOUT.spacing,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  cardLabel: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: COLORS.overlay,
    borderRadius: LAYOUT.borderRadius,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 0,
  },
  cardImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  comparisonSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 16,
    color: COLORS.text,
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
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 24,
  },
});

