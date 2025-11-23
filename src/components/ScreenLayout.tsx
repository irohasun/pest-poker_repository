import React from 'react';
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

interface ScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edges;
  hideHeader?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  title,
  onBack,
  headerRight,
  style,
  edges = ['left', 'right', 'bottom'],
  hideHeader = false,
}) => {
  return (
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
              {headerRight || <View style={styles.placeholder} />}
            </View>
          </View>
        )}
        <View style={[styles.content, style]}>
          {children}
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
  content: {
    flex: 1,
  },
});

