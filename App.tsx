import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CARD_INFO } from './src/types/game';
import { TitleScreen } from './src/screens/TitleScreen';
import { PlayerSetupScreen } from './src/screens/PlayerSetupScreen';
import { InitialHandScreen } from './src/screens/InitialHandScreen';
import { QuestionerSelectionScreen } from './src/screens/QuestionerSelectionScreen';
import { GameMainScreen } from './src/screens/GameMainScreen';
import { QuestionerCardSelectionScreen } from './src/screens/QuestionerCardSelectionScreen';
import { AnswererJudgmentScreen } from './src/screens/AnswererJudgmentScreen';
import { CardCheckScreen } from './src/screens/CardCheckScreen';
import { PassOpponentSelectionScreen } from './src/screens/PassOpponentSelectionScreen';
import { PassDeclarationScreen } from './src/screens/PassDeclarationScreen';
import { PassCardSelectionScreen } from './src/screens/PassCardSelectionScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useGameFlow } from './src/hooks/useGameFlow';
import { COLORS } from './src/constants/theme';

export default function App() {
  const {
    gameState,
    currentScreen,
    initialHandPlayerIndex,
    passSelectedOpponent,
    lastJudgment,
    cardRecipientIndex,
    receivedCardType,
    startGame,
    completePlayerSetup,
    handleInitialHandNext,
    completeInitialHand,
    selectQuestioner,
    updateGameState,
    startTurn,
    completeQuestionerCardSelection,
    makeJudgmentCall,
    completeResult,
    handlePass,
    completeCardCheck,
    completePassCardSelection,
    selectPassOpponent,
    completePassDeclaration,
    navigateTo,
  } = useGameFlow();

  const [isReady, setIsReady] = useState(false);

  // 画像プリロード処理
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const imageAssets = Object.values(CARD_INFO).map(info => {
          // Asset.fromModuleはImageSourcePropTypeの厳密な型定義と一致しない場合があるため、キャストして対応
          return Asset.fromModule(info.image as any).downloadAsync();
        });

        // 裏面画像のプリロードを追加
        const backsideImage = require('./assets/cards/backside.png');
        imageAssets.push(Asset.fromModule(backsideImage).downloadAsync());

        await Promise.all(imageAssets);
      } catch (e) {
        console.warn('Failed to load assets:', e);
      } finally {
        setIsReady(true);
      }
    };

    preloadAssets();
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <StatusBar style="light" />
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </GestureHandlerRootView>
    );
  }

  // タイトル画面
  if (currentScreen === 'title') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <TitleScreen onStartGame={startGame} />
      </GestureHandlerRootView>
    );
  }

  if (!gameState) return null;

  // 一時停止処理（今後実装予定）
  const handlePause = () => {
    // TODO: 一時停止機能を実装
    console.log('一時停止');
  };

  // タイトルに戻る処理
  const handleReturnToTitle = () => {
    navigateTo('title');
  };

  // ゲーム終了処理（タイトル画面に戻る）
  const handleEndGame = () => {
    navigateTo('title');
  };

  // プレイヤー登録画面
  if (currentScreen === 'setup') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <PlayerSetupScreen
          onComplete={completePlayerSetup}
          onBack={() => navigateTo('title')}
        />
      </GestureHandlerRootView>
    );
  }

  // 初期手札確認画面
  if (currentScreen === 'initialHand') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <InitialHandScreen
          players={gameState.players}
          currentPlayerIndex={initialHandPlayerIndex}
          onComplete={completeInitialHand}
          onNextPlayer={handleInitialHandNext}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </GestureHandlerRootView>
    );
  }

  // 出題者決定画面
  if (currentScreen === 'questionerSelection') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <QuestionerSelectionScreen
          gameState={gameState}
          onSelectQuestioner={selectQuestioner}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </GestureHandlerRootView>
    );
  }

  // 出題者：カード選択画面（統合版）
  if (currentScreen === 'questionerCardSelection') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <QuestionerCardSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={completeQuestionerCardSelection}
          onBack={() => navigateTo('gameMain')}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </GestureHandlerRootView>
    );
  }

  // 回答者：判定画面
  if (currentScreen === 'answererJudgment') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <AnswererJudgmentScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onBelieve={() => makeJudgmentCall('believe')}
          onDoubt={() => makeJudgmentCall('doubt')}
          onPass={handlePass}
          onBack={() => navigateTo('gameMain')}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </GestureHandlerRootView>
    );
  }

  // カード確認画面
  if (currentScreen === 'cardCheck') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <CardCheckScreen
          gameState={gameState}
          onNext={completeCardCheck}
          onBack={() => navigateTo('answererJudgment')}
        />
      </GestureHandlerRootView>
    );
  }

  // 渡す：統合選択画面（最新実装）
  if (currentScreen === 'passCardSelection') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <PassCardSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={completePassCardSelection}
          onBack={() => navigateTo('cardCheck')}
        />
      </GestureHandlerRootView>
    );
  }

  // 渡す：相手選択画面（古い実装、後方互換性のため残す）
  if (currentScreen === 'passOpponentSelection') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <PassOpponentSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={selectPassOpponent}
          onBack={() => navigateTo('cardCheck')}
        />
      </GestureHandlerRootView>
    );
  }

  // 渡す：宣言選択画面（古い実装、後方互換性のため残す）
  if (currentScreen === 'passDeclaration' && passSelectedOpponent !== null) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <PassDeclarationScreen
          gameState={gameState}
          selectedOpponentIndex={passSelectedOpponent}
          onUpdateGameState={updateGameState}
          onNext={completePassDeclaration}
          onBack={() => navigateTo('passOpponentSelection')}
        />
      </GestureHandlerRootView>
    );
  }

  // 結果確認画面
  // cardRecipientIndexがnullでも、ResultScreen内で適切にハンドリングするか、
  // useGameFlow側で同期をとる必要がありますが、ここでは最低限のnullチェックを行います。
  // 注意: useGameFlowでsetCardRecipientIndexとsetCurrentScreenを同時に呼んでいるため、
  // バッチ更新が効く場合は問題ありませんが、非同期のタイミングずれを防ぐため
  // nullチェックは残しつつ、ブランクスクリーン回避のためにローディングなどを検討する余地があります。
  if (currentScreen === 'result') {
    if (cardRecipientIndex === null) {
        // cardRecipientIndexが未設定の場合はローディングまたはnullを返す
        // (通常は発生しないはずだが、念のため)
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </GestureHandlerRootView>
        );
    }
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <ResultScreen
          gameState={gameState}
          cardRecipientIndex={cardRecipientIndex}
          receivedCardType={receivedCardType}
          onNext={completeResult}
        />
      </GestureHandlerRootView>
    );
  }

  // ゲームメイン画面
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <GameMainScreen
        gameState={gameState}
        onUpdateGameState={updateGameState}
        onSelectOpponent={startTurn}
        onJudgment={() => navigateTo('answererJudgment')}
        onPause={handlePause}
        onReturnToTitle={handleReturnToTitle}
        onEndGame={handleEndGame}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background[0],
  },
});
