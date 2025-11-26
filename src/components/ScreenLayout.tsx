import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { SafeAreaView, Edges, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, LAYOUT } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

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

// 確認ダイアログコンポーネント
interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View
          style={[
            styles.dialogOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>{title}</Text>
              <Text style={styles.dialogMessage}>{message}</Text>
              <View style={styles.dialogButtons}>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.dialogButtonCancel]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dialogButtonTextCancel}>いいえ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dialogButton, styles.dialogButtonConfirm]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#C62828', '#D32F2F']}
                    style={styles.dialogButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.dialogButtonTextConfirm}>はい</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  title,
  onBack,
  headerRight,
  style,
  edges = ['top', 'left', 'right', 'bottom'],
  hideHeader = false,
  onPause,
  onReturnToTitle,
  onEndGame,
  showSettings = true, // デフォルトで設定アイコンを表示
}) => {
  const insets = useSafeAreaInsets();
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  // 家マークボタンを押したときの処理：タイトルに戻る確認ダイアログを表示
  const handleHomePress = () => {
    if (onReturnToTitle) {
      setConfirmDialogVisible(true);
    }
  };

  // 確認ダイアログで「はい」を押したときの処理
  const handleConfirmReturnToTitle = () => {
    setConfirmDialogVisible(false);
    if (onReturnToTitle) {
      onReturnToTitle();
    }
  };

  // 確認ダイアログで「いいえ」を押したときの処理
  const handleCancelReturnToTitle = () => {
    setConfirmDialogVisible(false);
  };

  return (
    <>
      <LinearGradient colors={COLORS.background} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={edges}>
          {!hideHeader && (
            <View style={[styles.header, { paddingTop: Math.max(insets.top / 8, 4) }]}>
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
                {showSettings && onReturnToTitle && (
                  <TouchableOpacity
                    onPress={handleHomePress}
                    style={styles.settingsButton}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={require('../../assets/home.png')}
                      style={styles.homeIcon}
                      resizeMode="contain"
                    />
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

      {/* タイトルに戻る確認ダイアログ */}
      {showSettings && onReturnToTitle && (
        <ConfirmDialog
          visible={confirmDialogVisible}
          title="タイトルに戻る"
          message="ゲームの進行状況は保存されません"
          onConfirm={handleConfirmReturnToTitle}
          onCancel={handleCancelReturnToTitle}
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
    paddingBottom: 8,
    minHeight: 44,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF', // 白色で明度を高く表示
    opacity: 1.0, // 不透明度を最大にして鮮明に表示
  },
  content: {
    flex: 1,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: COLORS.overlayDark,
    borderRadius: LAYOUT.borderRadius,
    padding: 24,
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  dialogMessage: {
    fontSize: 16,
    color: COLORS.textDim,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
  },
  dialogButtonCancel: {
    backgroundColor: COLORS.overlay,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  dialogButtonConfirm: {
    overflow: 'hidden',
  },
  dialogButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  dialogButtonTextCancel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    paddingVertical: 14,
  },
  dialogButtonTextConfirm: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

