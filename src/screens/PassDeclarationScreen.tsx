import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CardType, CARD_INFO } from '../types/game';
import { passCard } from '../utils/gameLogic';

interface PassDeclarationScreenProps {
  gameState: GameState;
  selectedOpponentIndex: number;
  onUpdateGameState: (newState: GameState) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PassDeclarationScreen: React.FC<PassDeclarationScreenProps> = ({
  gameState,
  selectedOpponentIndex,
  onUpdateGameState,
  onNext,
  onBack,
}) => {
  if (!gameState.currentTurn) return null;

  const opponent = gameState.players[selectedOpponentIndex];
  if (!opponent) return null;

  const handleDeclaration = (declaredAs: CardType) => {
    const newState = passCard(gameState, selectedOpponentIndex, declaredAs);
    onUpdateGameState(newState);
    onNext();
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.headerButtonText}>◀ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>何だと宣言しますか？</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.opponentInfo}>
            {opponent.name}さんに渡します
          </Text>

          <View style={styles.cardGrid}>
            {Object.values(CARD_INFO).map((cardInfo) => (
              <TouchableOpacity
                key={cardInfo.type}
                style={styles.cardButton}
                onPress={() => handleDeclaration(cardInfo.type)}
                activeOpacity={0.7}
              >
                <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
                <Text style={styles.cardName}>{cardInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingTop: 50, // ノッチで隠れないように50pxの余白を追加
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
  opponentInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  cardButton: {
    width: 100,
    height: 120, // 固定高さを設定
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

