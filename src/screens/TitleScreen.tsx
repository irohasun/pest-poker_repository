import React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TitleScreenProps {
  onStartGame: () => void;
  onShowRules?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, onShowRules }) => {

  return (
    <ImageBackground
      source={require('../../assets/title.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* STARTボタンの位置に透明なボタンを配置 */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartGame}
          activeOpacity={0.8}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  // STARTボタンの位置に透明なボタンを配置
  // 画像内のSTARTボタン（新聞紙）の位置に合わせて調整
  startButton: {
    position: 'absolute',
    // 画面下部中央に配置（画像に合わせて調整が必要な場合があります）
    bottom: SCREEN_HEIGHT * 0.12 + 60, // 画面高さの12%上からさらに60px分だけ上に移動
    alignSelf: 'center', // 中央揃え
    width: SCREEN_WIDTH * 0.6, // 画面幅の60%（新聞紙の幅に合わせて調整）
    height: 150, // STARTボタンの高さ（100px × 1.5倍 = 150px）
    backgroundColor: 'transparent',
  },
});
