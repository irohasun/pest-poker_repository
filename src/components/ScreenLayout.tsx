import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, LAYOUT } from '../constants/theme';
import { SettingsMenu } from './SettingsMenu';

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edges;
  hideHeader?: boolean;
  onPause?: () => void; // 一時停止コールバック
  onReturnToTitle?: () => void; // タイトルに戻るコールバック
  onEndGame?: () => void; // ゲーム終了コールバック
  showSettings?: boolean; // 設定アイコンを表示するかどうか（デフォルト: true）
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  title,
  onBack,
  headerRight,
  style,
  edges = ['left', 'right', 'bottom'],
  hideHeader = false,
  onPause,
  onReturnToTitle,
  onEndGame,
  showSettings = true, // デフォルトで設定アイコンを表示
}) => {
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleSettingsPress = () => {
    setSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setSettingsVisible(false);
  };

  return (
    <>
      <LinearGradient colors={COLORS.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={edges}>
          {!hideHeader && (
            <View style={styles.header}>
              <View style={styles.leftContainer}>
                {onBack ? (
                  <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.headerButtonText}>◀ 戻る</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.placeholder} />
                )}
              </View>
              
              <View style={styles.titleContainer}>
                {title && <Text style={styles.headerTitle}>{title}</Text>}
              </View>

              <View style={styles.rightContainer}>
                {showSettings && (
                  <TouchableOpacity
                    onPress={handleSettingsPress}
                    style={styles.settingsButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                  </TouchableOpacity>
                )}
                {headerRight || (!showSettings && <View style={styles.placeholder} />)}
              </View>
            </View>
          )}
          <View style={[styles.content, style]}>
            {children}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* 設定メニュー */}
      {showSettings && (
        <SettingsMenu
          visible={settingsVisible}
          onClose={handleCloseSettings}
          onPause={onPause}
          onReturnToTitle={onReturnToTitle}
          onEndGame={onEndGame}
        />
      )}
    </>
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
    paddingHorizontal: LAYOUT.spacing,
    paddingBottom: LAYOUT.spacing,
    paddingTop: LAYOUT.headerPaddingTop,
    backgroundColor: COLORS.overlay,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2, // Give title more space
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 16, // Consistent with QuestionerCardSelectionScreen
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // Align visually with edge
  },
  headerButtonText: {
    color: COLORS.textDim,
    fontSize: 16,
  },
  placeholder: {
    width: 40,
  },
  settingsButton: {
    padding: 8,
    marginRight: -8, // 視覚的に右端に揃える
  },
  settingsIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
});

