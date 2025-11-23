import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CardType, CARD_INFO } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { checkPlayerElimination } from '../utils/gameLogic';

interface GameScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ gameState, onUpdateGameState }) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [claimedCard, setClaimedCard] = useState<CardType | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isPlayerTurn = currentPlayer.id === 'player-0';

  const handleDrawCard = () => {
    if (gameState.deck.length === 0) return;

    const newDeck = [...gameState.deck];
    const drawnCard = newDeck.pop()!;

    setSelectedCard(drawnCard);
    setShowCardModal(true);

    onUpdateGameState({
      ...gameState,
      deck: newDeck,
      currentCard: drawnCard,
    });
  };

  const handleClaimCard = (cardType: CardType) => {
    setClaimedCard(cardType);
    setShowCardModal(false);
  };

  const handleChallenge = (believesClaim: boolean) => {
    if (!selectedCard || !claimedCard) return;

    const newPlayers = [...gameState.players];
    const isClaimTrue = selectedCard === claimedCard;
    const challengeSucceeds = believesClaim === isClaimTrue;

    let targetPlayerIndex: number;

    if (challengeSucceeds) {
      targetPlayerIndex = gameState.currentPlayerIndex;
    } else {
      targetPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }

    const targetPlayer = newPlayers[targetPlayerIndex];
    if (!targetPlayer.openCards[selectedCard]) {
      targetPlayer.openCards[selectedCard] = 0;
    }
    targetPlayer.openCards[selectedCard]++;

    if (checkPlayerElimination(targetPlayer)) {
      targetPlayer.isEliminated = true;
    }

    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    setSelectedCard(null);
    setClaimedCard(null);

    onUpdateGameState({
      ...gameState,
      players: newPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentCard: null,
      currentClaim: null,
      phase: 'playing',
    });
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.headerButtonText}>◀ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentPlayer.name}のターン</Text>
          <TouchableOpacity style={styles.pauseButton}>
            <Text style={styles.headerButtonText}>⏸</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>📊 プレイヤー状態</Text>

          {gameState.players.map((player, index) => (
            <PlayerStatus
              key={player.id}
              player={player}
              isCurrentPlayer={index === gameState.currentPlayerIndex}
            />
          ))}
        </ScrollView>

        {isPlayerTurn && !selectedCard && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.drawButton}
              onPress={handleDrawCard}
              disabled={gameState.deck.length === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#C62828', '#D32F2F']}
                style={styles.drawButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.drawButtonText}>
                  カードを引く (残り: {gameState.deck.length}枚)
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={showCardModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>引いたカード</Text>
              {selectedCard && (
                <>
                  <Text style={styles.modalEmoji}>{CARD_INFO[selectedCard].emoji}</Text>
                  <Text style={styles.modalCardName}>{CARD_INFO[selectedCard].name}</Text>
                </>
              )}
              <Text style={styles.modalQuestion}>何のカードだと宣言しますか？</Text>

              <View style={styles.cardGrid}>
                {Object.values(CARD_INFO).map((card) => (
                  <TouchableOpacity
                    key={card.type}
                    style={[
                      styles.cardButton,
                      selectedCard === card.type && styles.cardButtonHighlight,
                    ]}
                    onPress={() => handleClaimCard(card.type)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cardButtonEmoji}>{card.emoji}</Text>
                    <Text style={styles.cardButtonName}>{card.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {claimedCard && (
          <View style={styles.bottomBar}>
            <Text style={styles.claimText}>
              宣言: {CARD_INFO[claimedCard].name}
            </Text>
            <TouchableOpacity
              style={styles.challengeButton}
              onPress={() => handleChallenge(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.challengeButtonInner, styles.believeButton]}>
                <Text style={styles.challengeButtonText}>本当だと思う</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.challengeButton}
              onPress={() => handleChallenge(false)}
              activeOpacity={0.8}
            >
              <View style={[styles.challengeButtonInner, styles.bluffButton]}>
                <Text style={styles.challengeButtonText}>嘘だと思う</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  pauseButton: {
    padding: 8,
  },
  headerButtonText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
  drawButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  drawButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(198, 40, 40, 0.4)',
  },
  modalTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalCardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalQuestion: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  cardButton: {
    width: 70,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  cardButtonHighlight: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  cardButtonEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  cardButtonName: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  claimText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginBottom: 12,
  },
  challengeButton: {
    marginVertical: 6,
  },
  challengeButtonInner: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  believeButton: {
    backgroundColor: '#42A5F5',
  },
  bluffButton: {
    backgroundColor: '#EF5350',
  },
  challengeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
