import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../types/game';
import { CardStack } from './CardStack';

interface PlayerStatusProps {
  player: Player;
  isCurrentPlayer: boolean;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({ player, isCurrentPlayer }) => {
  const openCardEntries = Object.entries(player.openCards);
  const hasOpenCards = openCardEntries.length > 0;

  const isDangerZone = openCardEntries.some(([, count]) => count >= 3) || openCardEntries.length >= 6;

  return (
    <View style={[
      styles.container,
      player.isEliminated && styles.eliminated,
      isCurrentPlayer && styles.currentPlayer
    ]}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={[styles.playerName, isCurrentPlayer && styles.currentPlayerName]}>
            {player.name}
            {player.id === 'player-0' && ' (あなた)'}
          </Text>
          {player.isEliminated && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>脱落</Text>
            </View>
          )}
          {isDangerZone && !player.isEliminated && (
            <View style={[styles.badge, styles.dangerBadge]}>
              <Text style={styles.badgeText}>危険</Text>
            </View>
          )}
        </View>
        <Text style={styles.handCount}>手札: {player.handCount}枚</Text>
      </View>

      <View style={styles.cardsContainer}>
        {hasOpenCards ? (
          <View style={styles.cardsGrid}>
            {openCardEntries.map(([cardType, count]) => {
              const isDanger = count >= 4 || openCardEntries.length >= 8;
              return (
                <CardStack
                  key={cardType}
                  cardType={cardType as any}
                  count={count}
                  isDanger={isDanger}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>引き取ったカードなし</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentPlayer: {
    backgroundColor: 'rgba(198, 40, 40, 0.4)',
    borderWidth: 2,
    borderColor: '#C62828',
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  eliminated: {
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  currentPlayerName: {
    color: '#FFFFFF',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EF5350',
    borderRadius: 12,
  },
  dangerBadge: {
    backgroundColor: '#FFA726',
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  handCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  cardsContainer: {
    minHeight: 100,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
