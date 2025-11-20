import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardType, CARD_INFO } from '../types/game';

interface CardStackProps {
  cardType: CardType;
  count: number;
  isDanger?: boolean;
}

export const CardStack: React.FC<CardStackProps> = ({
  cardType,
  count,
  isDanger = false
}) => {
  const cardInfo = CARD_INFO[cardType];

  return (
    <View style={styles.container}>
      <View style={styles.cardStackWrapper}>
        {count > 3 && (
          <View style={[
            styles.card,
            styles.stackedCard3,
            isDanger ? styles.dangerBorder : styles.normalBorder
          ]} />
        )}
        {count > 2 && (
          <View style={[
            styles.card,
            styles.stackedCard2,
            isDanger ? styles.dangerBorder : styles.normalBorder
          ]} />
        )}
        {count > 1 && (
          <View style={[
            styles.card,
            styles.stackedCard1,
            isDanger ? styles.dangerBorder : styles.normalBorder
          ]} />
        )}

        <View style={[
          styles.card,
          styles.mainCard,
          isDanger ? styles.dangerBorder : styles.normalBorder,
          isDanger && styles.dangerShadow
        ]}>
          <Text style={styles.emoji}>{cardInfo.emoji}</Text>
          <Text style={styles.cardName}>{cardInfo.name}</Text>
        </View>
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.count, isDanger && styles.dangerText]}>
          {count}
        </Text>
        {isDanger && <Text style={styles.warningIcon}>⚠️</Text>}
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
    width: 60,
    height: 80,
    marginRight: 8,
  },
  card: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
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
    top: 4,
    left: 4,
    zIndex: 1,
    opacity: 0.9,
  },
  stackedCard2: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 0,
    opacity: 0.85,
  },
  stackedCard3: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: -1,
    opacity: 0.8,
  },
  normalBorder: {
    borderWidth: 2,
    borderColor: '#FFA726',
  },
  dangerBorder: {
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  dangerShadow: {
    shadowColor: '#EF5350',
    shadowOpacity: 0.8,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
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
