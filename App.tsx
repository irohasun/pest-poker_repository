import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { CARD_INFO } from './src/types/game';
import { ScreenWrapper } from './src/components/ScreenWrapper';
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
import { GameEndScreen } from './src/screens/GameEndScreen';
import { useGameFlow } from './src/hooks/useGameFlow';
import { COLORS } from './src/constants/theme';
import { initializeInterstitialAd } from './src/utils/adManager';
import { LanguageProvider } from './src/contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const {
    gameState,
    currentScreen,
    initialHandPlayerIndex,
    passSelectedOpponent,
    cardRecipientIndex,
    receivedCardType,
    gameCount,
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
    restartGame,
  } = useGameFlow();

  const [isReady, setIsReady] = useState(false);

  // GoogleAdMobの初期化
  useEffect(() => {
    const initializeAds = async () => {
      try {
        await mobileAds().initialize();
        console.log('GoogleAdMob initialized');
        // インタースティシャル広告の初期化
        initializeInterstitialAd();
      } catch (e) {
        console.warn('Failed to initialize GoogleAdMob:', e);
      }
    };

    initializeAds();
  }, []);

  // 画像プリロード処理
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        const imageAssets = Object.values(CARD_INFO).map(info => {
          // Asset.fromModuleの型定義の互換性のため、型アサーションを使用
          return Asset.fromModule(info.image as unknown as number).downloadAsync();
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
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  // タイトル画面
  if (currentScreen === 'title') {
    return (
      <ScreenWrapper>
        <TitleScreen onStartGame={startGame} />
      </ScreenWrapper>
    );
  }

  if (!gameState) return null;

  const handlePause = () => {
    // 一時停止機能は未実装
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
      <ScreenWrapper>
        <PlayerSetupScreen
          onComplete={completePlayerSetup}
          onBack={() => navigateTo('title')}
        />
      </ScreenWrapper>
    );
  }

  // 初期手札確認画面
  if (currentScreen === 'initialHand') {
    return (
      <ScreenWrapper>
        <InitialHandScreen
          players={gameState.players}
          currentPlayerIndex={initialHandPlayerIndex}
          onComplete={completeInitialHand}
          onNextPlayer={handleInitialHandNext}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </ScreenWrapper>
    );
  }

  // 出題者決定画面
  if (currentScreen === 'questionerSelection') {
    return (
      <ScreenWrapper>
        <QuestionerSelectionScreen
          gameState={gameState}
          onSelectQuestioner={selectQuestioner}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </ScreenWrapper>
    );
  }

  // 出題者：カード選択画面（統合版）
  if (currentScreen === 'questionerCardSelection') {
    return (
      <ScreenWrapper>
        <QuestionerCardSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={completeQuestionerCardSelection}
          onBack={() => navigateTo('gameMain')}
          onPause={handlePause}
          onReturnToTitle={handleReturnToTitle}
          onEndGame={handleEndGame}
        />
      </ScreenWrapper>
    );
  }

  // 回答者：判定画面
  if (currentScreen === 'answererJudgment') {
    return (
      <ScreenWrapper>
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
      </ScreenWrapper>
    );
  }

  // カード確認画面
  if (currentScreen === 'cardCheck') {
    return (
      <ScreenWrapper>
        <CardCheckScreen
          gameState={gameState}
          onNext={completeCardCheck}
          onBack={() => navigateTo('answererJudgment')}
        />
      </ScreenWrapper>
    );
  }

  // 渡す：統合選択画面（最新実装）
  if (currentScreen === 'passCardSelection') {
    return (
      <ScreenWrapper>
        <PassCardSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={completePassCardSelection}
          onBack={() => navigateTo('cardCheck')}
        />
      </ScreenWrapper>
    );
  }

  // 渡す：相手選択画面（古い実装、後方互換性のため残す）
  if (currentScreen === 'passOpponentSelection') {
    return (
      <ScreenWrapper>
        <PassOpponentSelectionScreen
          gameState={gameState}
          onUpdateGameState={updateGameState}
          onNext={selectPassOpponent}
          onBack={() => navigateTo('cardCheck')}
        />
      </ScreenWrapper>
    );
  }

  // 渡す：宣言選択画面（古い実装、後方互換性のため残す）
  if (currentScreen === 'passDeclaration' && passSelectedOpponent !== null) {
    return (
      <ScreenWrapper>
        <PassDeclarationScreen
          gameState={gameState}
          selectedOpponentIndex={passSelectedOpponent}
          onUpdateGameState={updateGameState}
          onNext={completePassDeclaration}
          onBack={() => navigateTo('passOpponentSelection')}
        />
      </ScreenWrapper>
    );
  }

  // 結果確認画面
  if (currentScreen === 'result') {
    if (cardRecipientIndex === null) {
      // cardRecipientIndexが未設定の場合はローディングを表示
        return (
        <ScreenWrapper>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
        </ScreenWrapper>
        );
    }
    return (
      <ScreenWrapper>
        <ResultScreen
          gameState={gameState}
          cardRecipientIndex={cardRecipientIndex}
          receivedCardType={receivedCardType}
          onNext={completeResult}
        />
      </ScreenWrapper>
    );
  }

  // ゲーム終了画面
  if (currentScreen === 'gameEnd') {
    return (
      <ScreenWrapper>
        <GameEndScreen
          gameState={gameState}
          gameCount={gameCount}
          onPlayAgain={restartGame}
          onChangePlayerCount={startGame}
          onReturnToTitle={handleReturnToTitle}
        />
      </ScreenWrapper>
    );
  }

  // ゲームメイン画面
  return (
    <ScreenWrapper>
      <GameMainScreen
        gameState={gameState}
        onUpdateGameState={updateGameState}
        onSelectOpponent={startTurn}
        onJudgment={() => navigateTo('answererJudgment')}
        onPause={handlePause}
        onReturnToTitle={handleReturnToTitle}
        onEndGame={handleEndGame}
      />
    </ScreenWrapper>
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
