import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState } from '../types/game';
import { PlayerStatus } from '../components/PlayerStatus';
import { COLORS } from '../constants/theme';
import {
  initializeInterstitialAd,
  showInterstitialAd,
  isInterstitialAdReady,
} from '../utils/adManager';

interface GameEndScreenProps {
  gameState: GameState;
  gameCount: number; // 試合回数（1試合目判定用）
  onPlayAgain: () => void;
  onChangePlayerCount: () => void; // 人数を変更してプレイする
  onReturnToTitle: () => void;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({
  gameState,
  gameCount,
  onPlayAgain,
  onChangePlayerCount,
  onReturnToTitle,
}) => {
  const insets = useSafeAreaInsets();
  // 敗者を取得（isEliminatedがtrueのプレイヤー）
  const loser = gameState.players.find(player => player.isEliminated);
  
  // 勝者を取得（敗者以外の全プレイヤー）
  const winners = gameState.players.filter(player => !player.isEliminated);

  // 広告の初期化（初回のみ）
  useEffect(() => {
    initializeInterstitialAd();
  }, []);

  // 「もう一度プレイ」ボタンのハンドラー
  const handlePlayAgain = async () => {
    // 広告が読み込み済みか確認
    if (isInterstitialAdReady()) {
      // 広告を表示（広告が閉じられたらコールバックでゲーム再開）
      const adShown = await showInterstitialAd(() => {
        // 広告が閉じられた後にゲーム再開
        onPlayAgain();
      });
      if (adShown) {
        // 広告が表示された場合、広告が閉じられるまで待機
        // 広告が閉じられたらコールバックでonPlayAgainが呼ばれる
        return;
      }
    }
    
    // 広告が読み込まれていない場合はそのままゲーム再開
    onPlayAgain();
  };

  // 「人数を変更してプレイする」ボタンのハンドラー
  const handleChangePlayerCount = async () => {
    // 広告が読み込み済みか確認
    if (isInterstitialAdReady()) {
      // 広告を表示（広告が閉じられたらコールバックで人数変更画面へ）
      const adShown = await showInterstitialAd(() => {
        // 広告が閉じられた後に人数変更画面へ
        onChangePlayerCount();
      });
      if (adShown) {
        // 広告が表示された場合、広告が閉じられるまで待機
        // 広告が閉じられたらコールバックでonChangePlayerCountが呼ばれる
        return;
      }
    }
    
    // 広告が読み込まれていない場合はそのまま人数変更画面へ
    onChangePlayerCount();
  };

  // 「タイトルに戻る」ボタンのハンドラー
  const handleReturnToTitle = async () => {
    // 広告が読み込み済みか確認
    if (isInterstitialAdReady()) {
      // 広告を表示（広告が閉じられたらコールバックでタイトル画面へ）
      const adShown = await showInterstitialAd(() => {
        // 広告が閉じられた後にタイトル画面へ
        onReturnToTitle();
      });
      if (adShown) {
        // 広告が表示された場合、広告が閉じられるまで待機
        // 広告が閉じられたらコールバックでonReturnToTitleが呼ばれる
        return;
      }
    }
    
    // 広告が読み込まれていない場合はそのままタイトル画面へ
    onReturnToTitle();
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top / 8, 4) }]}>
          <Text style={styles.headerTitle}>ゲーム終了</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* 敗者表示 */}
          {loser && (
            <LinearGradient
              colors={['rgba(198, 40, 40, 0.3)', 'rgba(198, 40, 40, 0.1)']}
              style={styles.loserSection}
            >
              <Text style={styles.sectionLabel}>敗者</Text>
              <Text style={styles.loserName}>{loser.name}</Text>
              <PlayerStatus
                player={loser}
                isCurrentPlayer={false}
              />
            </LinearGradient>
          )}

          {/* 勝者表示 */}
          {winners.length > 0 && (
            <View style={styles.winnersSection}>
              <Text style={styles.sectionLabel}>勝者</Text>
              <View style={styles.winnersList}>
                {winners.map((winner) => (
                  <View key={winner.id} style={styles.winnerItem}>
                    <LinearGradient
                      colors={['rgba(76, 175, 80, 0.3)', 'rgba(76, 175, 80, 0.1)']}
                      style={styles.winnerCard}
                    >
                      <Text style={styles.winnerName}>{winner.name}</Text>
                      <PlayerStatus
                        player={winner}
                        isCurrentPlayer={false}
                      />
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ゲーム統計情報 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionLabel}>ゲーム統計</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>総ターン数:</Text>
              <Text style={styles.statsValue}>{gameState.turnNumber}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={COLORS.gradientOrange}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>もう一度プレイ</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changePlayerCountButton}
            onPress={handleChangePlayerCount}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(76, 175, 80, 0.8)', 'rgba(56, 142, 60, 0.8)']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>人数を変更してプレイ</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturnToTitle}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonTextSecondary}>タイトルに戻る</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loserSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dangerDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  winnersSection: {
    marginBottom: 24,
  },
  winnersList: {
    gap: 12,
  },
  winnerItem: {
    marginBottom: 12,
  },
  winnerCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  loserName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 16,
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsLabel: {
    fontSize: 16,
    color: COLORS.textDim,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  playAgainButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  changePlayerCountButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  returnButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

