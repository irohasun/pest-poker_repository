import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { GameState } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { canPassToOthers } from '../utils/gameLogic';
import { CARD_INFO } from '../types/game';
import { ScreenLayout } from '../components/ScreenLayout';
import { COLORS, LAYOUT } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

const BACKSIDE_IMAGE = require('../../assets/cards/backside.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface AnswererJudgmentScreenProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onBelieve: () => void;
  onDoubt: () => void;
  onPass: () => void;
  onBack: () => void;
  onPause?: () => void;
  onReturnToTitle?: () => void;
  onEndGame?: () => void;
}

export const AnswererJudgmentScreen: React.FC<AnswererJudgmentScreenProps> = ({
  gameState,
  onBelieve,
  onDoubt,
  onPass,
  onBack,
  onPause,
  onReturnToTitle,
  onEndGame,
}) => {
  const { t, getCardName } = useLanguage();
  const [showResult, setShowResult] = useState(false);
  const [judgment, setJudgment] = useState<'believe' | 'doubt' | null>(null);
  const flipAnim = useSharedValue(0);

  if (!gameState.currentTurn || !gameState.currentTurn.declaredAs) return null;

  const questioner = gameState.players[gameState.currentTurn.questioner];
  const answerer = gameState.players[gameState.currentTurn.answerer];
  
  if (!questioner || !answerer) return null;

  const declaredCard = CARD_INFO[gameState.currentTurn.declaredAs];
  const actualCard = gameState.currentTurn.card ? CARD_INFO[gameState.currentTurn.card] : null;
  const canPass = canPassToOthers(gameState);

  // 判定結果を計算
  const isClaimTrue = gameState.currentTurn.card === gameState.currentTurn.declaredAs;
  const isCorrectJudgment = judgment 
    ? (judgment === 'believe' && isClaimTrue) || (judgment === 'doubt' && !isClaimTrue)
    : false;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(1);

  const handleFlipAnimation = (selectedJudgment: 'believe' | 'doubt') => {
    setShowResult(true);
    setJudgment(selectedJudgment);
    
    // カードめくりアニメーション（完了後は自動遷移せず、タップ待ち）
        flipAnim.value = withSequence(
            withTiming(90, { duration: 400 }),
        withTiming(180, { duration: 400 })
        );
  };

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // True (Believe) -> 右スワイプ
      handleFlipAnimation('believe');
    } else {
      // False (Doubt) -> 左スワイプ
      handleFlipAnimation('doubt');
    }
  };

  const handleNextScreen = () => {
    if (judgment === 'believe') {
      onBelieve();
    } else if (judgment === 'doubt') {
      onDoubt();
    }
  };

  const gesture = Gesture.Pan()
    .enabled(!showResult) // 結果表示中は無効化
    .onStart(() => {
      'worklet';
      cardScale.value = withSpring(1.05);
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      cardScale.value = withSpring(1);
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        // 画面外へ飛ばすのではなく、元の位置に戻してからフリップ演出へ移行するデザインに変更
        // もしくは、スワイプした方向に少し移動させた状態で止めてフリップするなど
        // ここでは、ユーザーの操作感を優先し、一度元の位置に戻してからフリップさせる（またはスワイプ完了＝判定確定としてフリップへ）
        
        translateX.value = withSpring(0, {}, () => {
             runOnJS(handleSwipeComplete)(direction);
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    'worklet';
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: cardScale.value },
      ],
      zIndex: 10,
    };
  });

  const animatedFlipBackStyle = useAnimatedStyle(() => {
      'worklet';
      const rotateY = interpolate(flipAnim.value, [0, 180], [0, 180]);
      return {
          transform: [
              { perspective: 1000 },
              { rotateY: `${rotateY}deg` }
          ],
          opacity: interpolate(flipAnim.value, [0, 90], [1, 0]),
          backfaceVisibility: 'hidden' as const,
          position: 'absolute' as const,
          zIndex: 2,
      };
  });

  const animatedFlipFrontStyle = useAnimatedStyle(() => {
      'worklet';
      const rotateY = interpolate(flipAnim.value, [0, 180], [180, 360]);
      return {
          transform: [
              { perspective: 1000 },
              { rotateY: `${rotateY}deg` }
          ],
          opacity: interpolate(flipAnim.value, [90, 180], [0, 1]),
          backfaceVisibility: 'hidden' as const,
          position: 'absolute' as const,
          zIndex: 1,
      };
  });


  const leftActionOpacity = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, 0],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const rightActionOpacity = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <ScreenLayout
      title={t('gameMain.turn', { name: answerer.name })}
      onBack={onBack}
      style={{ paddingBottom: 0 }}
      onPause={onPause}
      onReturnToTitle={onReturnToTitle}
      onEndGame={onEndGame}
    >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} scrollEnabled={!showResult}>
          <View style={styles.swipeContainer}>
            <View style={styles.actionLabelsContainer}>
               <Animated.View style={[styles.actionLabel, styles.doubtLabel, leftActionOpacity]}>
                 <Text style={styles.actionLabelText}>{t('judgment.doubt')}</Text>
               </Animated.View>
               <Animated.View style={[styles.actionLabel, styles.believeLabel, rightActionOpacity]}>
                 <Text style={styles.actionLabelText}>{t('judgment.believe')}</Text>
               </Animated.View>
            </View>

            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.declarationCardWrapper, animatedCardStyle]}>
                  {/* 裏面 (フリップ前) */}
                  <Animated.View style={[styles.cardFace, animatedFlipBackStyle]}>
                    <Image source={BACKSIDE_IMAGE} style={styles.declarationImage} resizeMode="contain" />
                    <Text style={styles.declarationText}>
                        {t('judgment.description', { card: getCardName(declaredCard.type) })}
                    </Text>
                    <Text style={styles.swipeHintText}>
                        ← {t('judgment.doubt')}　　{t('judgment.believe')} →
                    </Text>
                  </Animated.View>

                  {/* 表面 (フリップ後) - 実際のカードと判定結果を表示 */}
                  {actualCard && (
                      <Animated.View style={[styles.cardFace, styles.cardFaceFront, animatedFlipFrontStyle]}>
                          <Image source={actualCard.image} style={styles.declarationImage} resizeMode="contain" />
                          <Text style={styles.declarationText}>
                              {t('judgment.actually')}{'\n'}
                              「{getCardName(actualCard.type)}」
                          </Text>
                          {judgment && (
                              <View style={[
                                  styles.judgmentResultBadge,
                                  isCorrectJudgment ? styles.correctBadge : styles.incorrectBadge
                              ]}>
                                  <Text style={styles.judgmentResultText}>
                                      {isCorrectJudgment ? t('judgment.correct') : t('judgment.incorrect')}
                                  </Text>
                                  <Text style={styles.judgmentDetailText}>
                                      {isClaimTrue ? t('judgment.wasTrue') : t('judgment.wasLie')}
                                  </Text>
                              </View>
                          )}
                      </Animated.View>
                  )}
              </Animated.View>
            </GestureDetector>
          </View>

          <View style={styles.situationSection}>
            <Text style={styles.sectionTitle}>{t('gameMain.othersHand')}</Text>
            {gameState.players.map((player, index) => {
              let role = undefined;
              if (index === gameState.currentTurn?.questioner) {
                role = t('role.questioner');
              } else if (index === gameState.currentTurn?.answerer) {
                role = t('role.answerer');
              }
              
              return (
                <PlayerStatus
                  key={player.id}
                  player={player}
                  isCurrentPlayer={false}
                  role={role}
                />
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {showResult && judgment ? (
            // 判定結果表示後：次へボタン
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextScreen}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gradientGreen}
                style={styles.nextButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.nextButtonText}>{t('common.next')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            // スワイプ前：渡すボタン
          <TouchableOpacity
            style={[styles.judgmentButton, !canPass && styles.judgmentButtonDisabled]}
            onPress={onPass}
            disabled={!canPass || showResult}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={canPass ? COLORS.gradientOrange : COLORS.gradientGray}
              style={styles.judgmentButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.judgmentButtonText}>{t('judgment.pass')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          )}
        </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: LAYOUT.spacing,
  },
  swipeContainer: {
    height: 400, // スワイプエリアの高さ確保
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    zIndex: 100,
  },
  actionLabelsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 0,
  },
  actionLabel: {
    padding: 20,
    borderRadius: 100,
    borderWidth: 4,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }], // 少し傾ける
  },
  doubtLabel: {
    borderColor: '#EF5350',
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
  },
  believeLabel: {
    borderColor: '#42A5F5',
    backgroundColor: 'rgba(66, 165, 245, 0.1)',
    transform: [{ rotate: '15deg' }],
  },
  actionLabelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  declarationCardWrapper: {
      width: SCREEN_WIDTH * 0.85,
      maxWidth: 350,
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
  },
  cardFace: {
    backgroundColor: COLORS.overlay,
    borderRadius: LAYOUT.borderRadius,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardFaceFront: {
      backgroundColor: '#2D2D2D', // 表面は少し明るく
      justifyContent: 'flex-start',
      paddingTop: 30, // 上部のpaddingを増やして、生物の画像と正解BOXを全体的に下に下げる
      paddingBottom: 0, // 下部のpaddingを0に設定（不正解BOXの下の余白を削減）
      paddingHorizontal: 16,
  },
  declarationImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  declarationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 10,
  },
  swipeHintText: {
    fontSize: 14,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 8,
  },
  judgmentResultBadge: {
    marginTop: 8,
    marginBottom: 0,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    width: '100%',
  },
  correctBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 0,
  },
  incorrectBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  judgmentResultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  judgmentDetailText: {
    fontSize: 14,
    color: COLORS.textDim,
    marginBottom: 0,
  },
  situationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  bottomBar: {
    padding: LAYOUT.spacing,
    backgroundColor: COLORS.overlayDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  judgmentButton: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  judgmentButtonDisabled: {
    opacity: 0.5,
  },
  judgmentButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  judgmentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  nextButton: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.borderHighlight,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
