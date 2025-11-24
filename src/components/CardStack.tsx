import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CardType, CARD_INFO } from '../types/game';

interface CardStackProps {
  cardType: CardType;
  count: number;
  isDanger?: boolean;
  isHighlighted?: boolean;
}

export const CardStack: React.FC<CardStackProps> = ({
  cardType,
  count,
  isDanger = false,
  isHighlighted = false
}) => {
  const cardInfo = CARD_INFO[cardType];

  const borderStyle = isHighlighted
    ? styles.highlightedBorder
    : isDanger
      ? styles.dangerBorder
      : styles.normalBorder;

  const shadowStyle = isHighlighted
    ? styles.highlightedShadow
    : isDanger
      ? styles.dangerShadow
      : {};

  return (
    <View style={styles.container}>
      <View style={styles.cardStackWrapper}>
        {count > 3 && (
          <View style={[
            styles.card,
            styles.stackedCard3,
            borderStyle
          ]}>
            <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
          </View>
        )}
        {count > 2 && (
          <View style={[
            styles.card,
            styles.stackedCard2,
            borderStyle
          ]}>
            <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
          </View>
        )}
        {count > 1 && (
          <View style={[
            styles.card,
            styles.stackedCard1,
            borderStyle
          ]}>
            <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
          </View>
        )}

        <View style={[
          styles.card,
          styles.mainCard,
          borderStyle,
          shadowStyle
        ]}>
          <Image source={cardInfo.image} style={styles.cardImage} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  cardStackWrapper: {
    position: 'relative',
    width: 80,
    height: 100,
    marginRight: 8,
  },
  card: {
    width: 80,
    height: 100,
    borderRadius: 8,
    // backgroundColor: '#2D2D2D', // 背景色を削除
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // 画像がはみ出ないようにする
  },
  mainCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  stackedCard1: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    opacity: 0.9,
  },
  stackedCard2: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 0,
    opacity: 0.85,
  },
  stackedCard3: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: -1,
    opacity: 0.8,
  },
  normalBorder: {
    // borderWidth: 2,
    // borderColor: '#FFA726',
    borderWidth: 0,
  },
  dangerBorder: {
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  dangerShadow: {
    shadowColor: '#EF5350',
    shadowOpacity: 0.8,
  },
  highlightedBorder: {
    borderWidth: 3,
    borderColor: '#FF0000', // 真っ赤な赤枠に変更
  },
  highlightedShadow: {
    shadowColor: '#FF0000',
    shadowOpacity: 1.0,
    shadowRadius: 12,
    elevation: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 24,
    textAlign: 'center',
  },
  dangerText: {
    color: '#EF5350',
  },
  warningIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
});
