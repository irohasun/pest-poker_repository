import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface PlayerSetupScreenProps {
  onComplete: (playerCount: number, playerNames: string[]) => void;
  onBack: () => void;
}

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '', '', '']);

  // デバッグ: ノッチの高さを確認（開発時のみ）
  React.useEffect(() => {
    console.log('SafeArea insets.top:', insets.top);
    console.log('Calculated paddingTop:', Math.max(insets.top / 8, 4));
  }, [insets.top]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    // 人数が減った場合、余分な名前をクリア
    const newNames = [...playerNames];
    for (let i = count; i < 6; i++) {
      newNames[i] = '';
    }
    setPlayerNames(newNames);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    // バリデーション
    const namesToUse = playerNames.slice(0, playerCount);
    
    // 全員の名前が入力されているか
    if (namesToUse.some(name => name.trim() === '')) {
      Alert.alert('エラー', 'すべてのプレイヤーの名前を入力してください');
      return;
    }

    // 名前の重複チェック
    const uniqueNames = new Set(namesToUse.map(name => name.trim().toLowerCase()));
    if (uniqueNames.size !== namesToUse.length) {
      Alert.alert('エラー', '同じ名前は使用できません');
      return;
    }

    onComplete(playerCount, namesToUse.map(name => name.trim()));
  };

  return (
    <LinearGradient colors={['#1E1E1E', '#121212', '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top / 8, 4) }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.headerButtonText}>◀ 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>プレイヤー登録</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.sectionTitle}>人数を選択</Text>
          <View style={styles.playerCountContainer}>
            {[2, 3, 4, 5, 6].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.playerCountButton,
                  playerCount === count && styles.playerCountButtonActive,
                ]}
                onPress={() => handlePlayerCountChange(count)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.playerCountButtonText,
                    playerCount === count && styles.playerCountButtonTextActive,
                  ]}
                >
                  {count}人
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>プレイヤー名を入力</Text>
          {Array.from({ length: playerCount }).map((_, index) => (
            <View key={index} style={styles.nameInputContainer}>
              <Text style={styles.nameLabel}>プレイヤー{index + 1}</Text>
              <TextInput
                style={styles.nameInput}
                value={playerNames[index]}
                onChangeText={(text) => handleNameChange(index, text)}
                placeholder={`プレイヤー${index + 1}の名前`}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                maxLength={20}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#C62828', '#D32F2F']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.startButtonText}>ゲーム開始</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 44,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerButtonText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  playerCountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  playerCountButton: {
    flex: 1,
    minWidth: 60,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
  },
  playerCountButtonActive: {
    backgroundColor: 'rgba(198, 40, 40, 0.3)',
    borderColor: '#C62828',
  },
  playerCountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  playerCountButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nameInputContainer: {
    marginBottom: 16,
  },
  nameLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

