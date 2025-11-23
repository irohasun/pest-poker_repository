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
import { selectCard, selectDeclaration } from '../utils/gameLogic';
import { PlayerStatus } from '../components/PlayerStatus';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, LAYOUT } from '../constants/theme';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface QuestionerCardSelectionScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onNext: () => void;
  onBack: () => void;
}

type SelectionStep = 'opponent' | 'card' | 'declaration' | null;

export const QuestionerCardSelectionScreen: React.FC<QuestionerCardSelectionScreenProps> = ({
  gameState,
  onUpdateGameState,
  onNext,
  onBack,
}) => {
  const [activeStep, setActiveStep] = useState<SelectionStep>('opponent');
  const [selectedOpponentIndex, setSelectedOpponentIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState<CardType | null>(null);

  const questioner = gameState.players[gameState.currentPlayerIndex];

  if (!questioner || !questioner.hand) return null;

  const handByType = questioner.hand.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {} as Record<CardType, number>);

  const toggleStep = (step: SelectionStep) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (activeStep === step) return;
    setActiveStep(step);
  };

  const handleOpponentSelect = (index: number) => {
    setSelectedOpponentIndex(index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // 次のステップが未完了の場合のみ次へ進む
    if (!selectedCard) {
      setActiveStep('card');
    } else {
      setActiveStep(null);
    }
  };

  const handleCardSelect = (cardType: CardType) => {
    setSelectedCard(cardType);
    setSelectedCardIndex(0); // 常に最初の1枚として扱う
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
    if (selectedOpponentIndex === null || !selectedCard || !selectedDeclaration) return;

    let newState = { ...gameState };
    
    newState = selectCard(newState, selectedCard);
    
    if (newState.currentTurn) {
      newState.currentTurn.answerer = selectedOpponentIndex;
    }

    newState = selectDeclaration(newState, selectedDeclaration);

    onUpdateGameState(newState);
    onNext();
  };

  const isStepComplete = (step: SelectionStep) => {
    switch (step) {
      case 'opponent': return selectedOpponentIndex !== null;
      case 'card': return selectedCard !== null;
      case 'declaration': return selectedDeclaration !== null;
      default: return false;
    }
  };

  const renderOpponentSelection = () => (
    <View style={styles.stepContent}>
      <View style={styles.opponentGrid}>
        {gameState.players.map((player, index) => {
          if (index === gameState.currentPlayerIndex) return null;
          const isSelected = selectedOpponentIndex === index;
          return (
            <TouchableOpacity
              key={player.id}
              style={[styles.opponentCard, isSelected && styles.opponentCardSelected]}
              onPress={() => handleOpponentSelect(index)}
              activeOpacity={0.8}
            >
              <PlayerStatus player={player} isCurrentPlayer={isSelected} />
              {isSelected && <View style={styles.checkMark}><Text style={styles.checkMarkText}>✓</Text></View>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderCardSelection = () => (
    <ScrollView style={styles.stepScrollContent} nestedScrollEnabled>
      {Object.entries(handByType).map(([cardType, count]) => {
        const cardInfo = CARD_INFO[cardType as CardType];
        const isSelected = selectedCard === cardType;
        
        return (
          <TouchableOpacity 
            key={cardType} 
            style={[
              styles.cardGroup,
              isSelected && styles.cardGroupSelected
            ]}
            onPress={() => handleCardSelect(cardType as CardType)}
            activeOpacity={0.7}
          >
            <View style={styles.cardGroupHeader}>
              <Text style={styles.cardTypeName}>{cardInfo.name}</Text>
              <Text style={styles.cardCount}>×{count}</Text>
              {isSelected && <View style={styles.checkMark}><Text style={styles.checkMarkText}>✓</Text></View>}
            </View>
            <View style={styles.cardRow}>
              {Array.from({ length: count }).map((_, index) => {
                return (
                  <View
                    key={`${cardType}-${index}`}
                    style={styles.card}
                  >
                    <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
              {isSelected && <View style={styles.checkMarkSmall}><Text style={styles.checkMarkTextSmall}>✓</Text></View>}
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

  const renderSelectedCardPreview = () => {
    if (!selectedCard) return null;
    const cardInfo = CARD_INFO[selectedCard];
    return (
      <TouchableOpacity 
        style={styles.previewContainer}
        onPress={() => toggleStep('card')}
        activeOpacity={0.8}
      >
        <View style={[styles.declarationButton, styles.declarationButtonSelected]}>
          <Image source={cardInfo.image} style={styles.declarationImage} resizeMode="contain" />
          <Text style={styles.cardName}>{cardInfo.name}</Text>
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
      title="出題の設定"
      onBack={undefined} // Removed as per previous request
      style={{ paddingBottom: 0 }}
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

          {/* Step 2: Card Selection */}
          <TouchableOpacity
            style={[styles.stepHeader, activeStep === 'card' && styles.stepHeaderActive]}
            onPress={() => toggleStep('card')}
            activeOpacity={0.8}
            disabled={!isStepComplete('opponent') && activeStep !== 'card'}
          >
            <Text style={[styles.stepTitle, !isStepComplete('opponent') && styles.stepTitleDisabled]}>2. どのカードを渡しますか？</Text>
          </TouchableOpacity>
          {activeStep === 'card' ? renderCardSelection() : renderSelectedCardPreview()}

          {/* Step 3: Declaration Selection */}
          <TouchableOpacity
            style={[styles.stepHeader, activeStep === 'declaration' && styles.stepHeaderActive]}
            onPress={() => toggleStep('declaration')}
            activeOpacity={0.8}
            disabled={!isStepComplete('card') && activeStep !== 'declaration'}
          >
            <Text style={[styles.stepTitle, !isStepComplete('card') && styles.stepTitleDisabled]}>3. 何だと宣言しますか？</Text>
          </TouchableOpacity>
          {activeStep === 'declaration' ? renderDeclarationSelection() : renderSelectedDeclarationPreview()}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (selectedOpponentIndex === null || !selectedCard || !selectedDeclaration) && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirm}
            disabled={selectedOpponentIndex === null || !selectedCard || !selectedDeclaration}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedOpponentIndex !== null && selectedCard && selectedDeclaration ? COLORS.gradientRed : COLORS.gradientGray}
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
  accordionContainer: {
    flex: 1,
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
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  opponentCardSelectedPreview: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  cardGroup: {
    marginBottom: 20,
    backgroundColor: COLORS.overlay,
    borderRadius: LAYOUT.borderRadius,
    padding: LAYOUT.spacing,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardGroupSelected: {
    borderColor: COLORS.dangerDark,
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  cardGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardCount: {
    fontSize: 16,
    color: COLORS.textDim,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: 70,
    height: 100,
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardSelected: {
    // 削除：個別のカード選択スタイルは不要になったが、プレビューで使っている可能性があるため残すか、プレビュー用スタイルと分ける
    // プレビュー表示では declarationButton スタイルを使うようになったので、ここは基本的に使われないはずだが、安全のため残す
    borderColor: COLORS.dangerDark,
    borderWidth: 3,
    backgroundColor: 'rgba(198, 40, 40, 0.3)',
    transform: [{ scale: 1.1 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
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
    borderColor: COLORS.dangerDark,
    backgroundColor: 'rgba(198, 40, 40, 0.3)',
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
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.dangerDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkMarkSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.dangerDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkTextSmall: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  previewContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
