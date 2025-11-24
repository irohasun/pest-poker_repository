import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, CardType, CARD_INFO } from '../types/game';
import { passCard } from '../utils/gameLogic';
import { PlayerStatus } from '../components/PlayerStatus';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, LAYOUT } from '../constants/theme';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface PassCardSelectionScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onNext: () => void;
  onBack: () => void;
  onPause?: () => void;
  onReturnToTitle?: () => void;
  onEndGame?: () => void;
}

type SelectionStep = 'opponent' | 'declaration' | null;

export const PassCardSelectionScreen: React.FC<PassCardSelectionScreenProps> = ({
  gameState,
  onUpdateGameState,
  onNext,
  onBack,
  onPause,
  onReturnToTitle,
  onEndGame,
}) => {
  const [activeStep, setActiveStep] = useState<SelectionStep>('opponent');
  const [selectedOpponentIndex, setSelectedOpponentIndex] = useState<number | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState<CardType | null>(null);

  if (!gameState.currentTurn || !gameState.currentTurn.card) return null;

  const answerer = gameState.players[gameState.currentTurn.answerer];
  if (!answerer) return null;

  // 渡せる相手のリスト（既にターンに参加しているプレイヤーは除外）
  const availablePlayers = gameState.players.filter(
    (p, index) =>
      !p.isEliminated &&
      index !== gameState.currentTurn!.answerer &&
      !gameState.currentTurn!.playersInTurn.includes(index)
  );

  const toggleStep = (step: SelectionStep) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeStep === step) return;
    setActiveStep(step);
  };

  const handleOpponentSelect = (index: number) => {
    setSelectedOpponentIndex(index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // 次のステップが未完了の場合のみ次へ進む
    if (!selectedDeclaration) {
      setActiveStep('declaration');
    } else {
      setActiveStep(null);
    }
  };

  const handleDeclarationSelect = (cardType: CardType) => {
    setSelectedDeclaration(cardType);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveStep(null);
  };

  const handleConfirm = () => {
    if (selectedOpponentIndex === null || !selectedDeclaration) return;

    // passCard関数を使用してゲーム状態を更新
    const newState = passCard(gameState, selectedOpponentIndex, selectedDeclaration);
    onUpdateGameState(newState);
    onNext();
  };

  const isStepComplete = (step: SelectionStep) => {
    switch (step) {
      case 'opponent': return selectedOpponentIndex !== null;
      case 'declaration': return selectedDeclaration !== null;
      default: return false;
    }
  };

  const renderOpponentSelection = () => (
    <View style={styles.stepContent}>
      {availablePlayers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            渡せる相手がいません{'\n'}
            判定してください
          </Text>
        </View>
      ) : (
        <View style={styles.opponentGrid}>
          {availablePlayers.map((player) => {
            const playerIndex = gameState.players.findIndex(p => p.id === player.id);
            const isSelected = selectedOpponentIndex === playerIndex;
            return (
              <TouchableOpacity
                key={player.id}
                style={[styles.opponentCard, isSelected && styles.opponentCardSelected]}
                onPress={() => handleOpponentSelect(playerIndex)}
                activeOpacity={0.8}
              >
                <PlayerStatus player={player} isCurrentPlayer={isSelected} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderDeclarationSelection = () => (
    <ScrollView style={styles.stepScrollContent} nestedScrollEnabled>
      <View style={styles.cardGrid}>
        {Object.values(CARD_INFO).map((cardInfo) => {
          const isSelected = selectedDeclaration === cardInfo.type;
          return (
            <TouchableOpacity
              key={cardInfo.type}
              style={[styles.declarationButton, isSelected && styles.declarationButtonSelected]}
              onPress={() => handleDeclarationSelect(cardInfo.type)}
              activeOpacity={0.7}
            >
              <Image source={cardInfo.image} style={styles.declarationImage} resizeMode="contain" />
              <Text style={styles.cardName}>{cardInfo.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderSelectedOpponentPreview = () => {
    if (selectedOpponentIndex === null) return null;
    const player = gameState.players[selectedOpponentIndex];
    return (
      <TouchableOpacity 
        style={styles.previewContainer}
        onPress={() => toggleStep('opponent')}
        activeOpacity={0.8}
      >
        <View style={[styles.opponentCard, styles.opponentCardSelectedPreview]}>
          <PlayerStatus player={player} isCurrentPlayer={true} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedDeclarationPreview = () => {
    if (!selectedDeclaration) return null;
    const cardInfo = CARD_INFO[selectedDeclaration];
    return (
      <TouchableOpacity 
        style={styles.previewContainer}
        onPress={() => toggleStep('declaration')}
        activeOpacity={0.8}
      >
        <View style={[styles.declarationButton, styles.declarationButtonSelected]}>
          <Image source={cardInfo.image} style={styles.declarationImage} resizeMode="contain" />
          <Text style={styles.cardName}>{cardInfo.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout
      title="他の人に渡す"
      onBack={onBack}
      style={{ paddingBottom: 0 }}
      onPause={onPause}
      onReturnToTitle={onReturnToTitle}
      onEndGame={onEndGame}
    >
      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        nestedScrollEnabled={true}
      >
        <View style={styles.accordionContainer}>
          {/* Step 1: Opponent Selection */}
          <TouchableOpacity
            style={[styles.stepHeader, activeStep === 'opponent' && styles.stepHeaderActive]}
            onPress={() => toggleStep('opponent')}
            activeOpacity={0.8}
          >
            <Text style={styles.stepTitle}>1. 誰に渡しますか？</Text>
          </TouchableOpacity>
          {activeStep === 'opponent' ? renderOpponentSelection() : renderSelectedOpponentPreview()}

          {/* Step 2: Declaration Selection */}
          <TouchableOpacity
            style={[styles.stepHeader, activeStep === 'declaration' && styles.stepHeaderActive]}
            onPress={() => toggleStep('declaration')}
            activeOpacity={0.8}
            disabled={!isStepComplete('opponent') && activeStep !== 'declaration'}
          >
            <Text style={[styles.stepTitle, !isStepComplete('opponent') && styles.stepTitleDisabled]}>2. 何だと宣言しますか？</Text>
          </TouchableOpacity>
          {activeStep === 'declaration' ? renderDeclarationSelection() : renderSelectedDeclarationPreview()}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (selectedOpponentIndex === null || !selectedDeclaration) && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={selectedOpponentIndex === null || !selectedDeclaration}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedOpponentIndex !== null && selectedDeclaration ? COLORS.gradientOrange : COLORS.gradientGray}
            style={styles.confirmButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.confirmButtonText}>決定して渡す</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 16,
  },
  accordionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: LAYOUT.spacing,
    backgroundColor: '#2D2D2D',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepHeaderActive: {
    backgroundColor: '#3D3D3D',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stepTitleDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  stepContent: {
    padding: LAYOUT.spacing,
  },
  stepScrollContent: {
    padding: LAYOUT.spacing,
    maxHeight: 400,
  },
  opponentGrid: {
    gap: 12,
  },
  opponentCard: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opponentCardSelected: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  opponentCardSelectedPreview: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  declarationButton: {
    width: '23%',
    aspectRatio: 0.8,
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  declarationButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 167, 38, 0.3)',
    transform: [{ scale: 1.05 }],
  },
  declarationImage: {
    width: '80%',
    height: '60%',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  bottomBar: {
    padding: LAYOUT.spacing,
    backgroundColor: COLORS.overlayDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  previewContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 28,
  },
});

