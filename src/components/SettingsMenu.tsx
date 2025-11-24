import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, LAYOUT } from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75; // 画面幅の75%をメニューの幅とする

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  onPause?: () => void; // 一時停止コールバック
  onReturnToTitle?: () => void; // タイトルに戻るコールバック
  onEndGame: () => void; // ゲーム終了コールバック
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

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  visible,
  onClose,
  onPause,
  onReturnToTitle,
  onEndGame,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    if (visible) {
      // メニューを開く
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // メニューを閉じる
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -MENU_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handlePause = () => {
    if (onPause) {
      onPause();
      onClose();
    }
  };

  const handleReturnToTitle = () => {
    setConfirmTitle('タイトルに戻る');
    setConfirmMessage('タイトル画面に戻りますか？\nゲームの進行状況は保存されません。');
    setConfirmAction(() => {
      return () => {
        if (onReturnToTitle) {
          onReturnToTitle();
        }
        onClose();
      };
    });
    setConfirmDialogVisible(true);
  };

  const handleEndGame = () => {
    setConfirmTitle('ゲームを終了する');
    setConfirmMessage('ゲームを終了しますか？\n本当によろしいですか？');
    setConfirmAction(() => {
      return () => {
        onEndGame();
        onClose();
      };
    });
    setConfirmDialogVisible(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setConfirmDialogVisible(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmDialogVisible(false);
    setConfirmAction(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* オーバーレイ（背景をタップして閉じる） */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* スライダーメニュー */}
        <Animated.View
          style={[
            styles.menu,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2D2D2D', '#1E1E1E', '#121212']}
            style={styles.menuGradient}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>設定</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuContent}>
              {/* 一時停止メニュー */}
              {onPause && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handlePause}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#FFA726', '#FB8C00']}
                    style={styles.menuItemGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.menuItemText}>⏸ 一時停止</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* タイトルに戻るメニュー */}
              {onReturnToTitle && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleReturnToTitle}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#42A5F5', '#1E88E5']}
                    style={styles.menuItemGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.menuItemText}>🏠 タイトルに戻る</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* ゲームを終了するメニュー */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEndGame}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#C62828', '#D32F2F']}
                  style={styles.menuItemGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.menuItemText}>❌ ゲームを終了する</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* 確認ダイアログ */}
      <ConfirmDialog
        visible={confirmDialogVisible}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: MENU_WIDTH,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  menuGradient: {
    flex: 1,
    paddingTop: 60, // SafeArea分の余白
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.spacing,
    paddingBottom: LAYOUT.spacing,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  menuContent: {
    padding: LAYOUT.spacing,
  },
  menuItem: {
    borderRadius: LAYOUT.borderRadius,
    overflow: 'hidden',
    marginBottom: 12,
  },
  menuItemGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
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

