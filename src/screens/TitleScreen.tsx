import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';

interface TitleScreenProps {
  onStartGame: () => void;
  onShowRules?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 画像内のSTARTボタンの位置とサイズ（元の画像サイズに対する比率で定義）
// これらの値は画像を確認して調整してください
const START_BUTTON_CONFIG = {
  // 元の画像サイズに対する比率（0.0 ~ 1.0）
  x: 0.2, // 左から20%の位置
  y: 0.25, // 下から25%の位置（さらに上に移動）
  width: 0.6, // 画像幅の60%
  height: 0.1, // 画像高さの10%
};

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, onShowRules }) => {
  const { language, setLanguage } = useLanguage();
  const [buttonStyle, setButtonStyle] = useState({
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // 画像の元のサイズを取得
    const imageSource = require('../../assets/title.png');
    const resolvedSource = Image.resolveAssetSource(imageSource);
    
    if (resolvedSource && resolvedSource.uri) {
      Image.getSize(
        resolvedSource.uri,
        (originalWidth, originalHeight) => {
        // resizeMode="cover"の場合の実際の表示サイズを計算
        const imageAspectRatio = originalWidth / originalHeight;
        const screenAspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;

        let displayWidth: number;
        let displayHeight: number;
        let offsetX = 0;
        let offsetY = 0;

        if (imageAspectRatio > screenAspectRatio) {
          // 画像の方が横長：高さ基準で拡大
          displayHeight = SCREEN_HEIGHT;
          displayWidth = SCREEN_HEIGHT * imageAspectRatio;
          offsetX = (displayWidth - SCREEN_WIDTH) / 2; // 左右のオフセット
        } else {
          // 画面の方が横長：幅基準で拡大
          displayWidth = SCREEN_WIDTH;
          displayHeight = SCREEN_WIDTH / imageAspectRatio;
          offsetY = (displayHeight - SCREEN_HEIGHT) / 2; // 上下のオフセット
        }

        // STARTボタンの位置とサイズを計算
        const buttonWidth = displayWidth * START_BUTTON_CONFIG.width;
        const buttonHeight = displayHeight * START_BUTTON_CONFIG.height;
        const buttonLeft = displayWidth * START_BUTTON_CONFIG.x - offsetX;
        const buttonBottom = displayHeight * START_BUTTON_CONFIG.y - offsetY;

        setButtonStyle({
          bottom: buttonBottom,
          left: buttonLeft,
          width: buttonWidth,
          height: buttonHeight,
        });
        },
        (error) => {
          console.warn('Failed to get image size:', error);
          // エラー時はフォールバック値を使用
          setButtonStyle({
            bottom: SCREEN_HEIGHT * 0.12 + 90,
            left: SCREEN_WIDTH * 0.2,
            width: SCREEN_WIDTH * 0.6,
            height: 100,
          });
        }
      );
    } else {
      // URIが取得できない場合のフォールバック
      console.warn('Could not resolve image source');
      setButtonStyle({
        bottom: SCREEN_HEIGHT * 0.12 + 90,
        left: SCREEN_WIDTH * 0.2,
        width: SCREEN_WIDTH * 0.6,
        height: 100,
      });
    }
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/title.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* STARTボタンの位置に透明なボタンを配置 */}
        <TouchableOpacity
          style={[styles.startButton, buttonStyle]}
          onPress={onStartGame}
          activeOpacity={0.8}
        />

        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={[styles.langButton, language === 'ja' && styles.activeLangButton]}
            onPress={() => setLanguage('ja')}
          >
            <Text style={[styles.langText, language === 'ja' && styles.activeLangText]}>日本語</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === 'en' && styles.activeLangButton]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.activeLangText]}>English</Text>
          </TouchableOpacity>
        </View>
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
  // 位置とサイズは動的に計算される（buttonStyleで上書きされる）
  startButton: {
    position: 'absolute',
    backgroundColor: 'transparent', // 透明
  },
  languageContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 40,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  langButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  activeLangButton: {
    backgroundColor: '#FFFFFF',
  },
  langText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  activeLangText: {
    color: '#000000',
  },
});
