import React, { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

/**
 * 画面をラップする共通コンポーネント
 * GestureHandlerRootView、SafeAreaProvider、StatusBarを統合して提供
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  statusBarStyle = 'light',
}) => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={statusBarStyle} />
        {children}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

