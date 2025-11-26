import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// テスト広告ID（開発用）
// 本番環境では実際の広告ユニットIDに置き換える必要があります
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3940256099942544/1033173712'; // 本番用の広告ユニットIDに置き換え

// インタースティシャル広告のインスタンス
let interstitialAd: InterstitialAd | null = null;

// 広告の読み込み状態
let isAdLoaded = false;
let isAdLoading = false;

// 広告が閉じられた時のコールバック
let onAdClosedCallback: (() => void) | null = null;

/**
 * インタースティシャル広告を初期化し、読み込みを開始します
 */
export const initializeInterstitialAd = (): void => {
  try {
    // 既に初期化済みの場合は何もしない
    if (interstitialAd !== null) {
      return;
    }

    // インタースティシャル広告のインスタンスを作成
    interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    // 広告の読み込み完了イベント
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded');
      isAdLoaded = true;
      isAdLoading = false;
    });

    // 広告の読み込み失敗イベント
    interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('Interstitial ad error:', error);
      isAdLoaded = false;
      isAdLoading = false;
    });

    // 広告が閉じられたイベント
    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      isAdLoaded = false;
      // コールバックが設定されている場合は実行
      if (onAdClosedCallback) {
        onAdClosedCallback();
        onAdClosedCallback = null; // コールバックをクリア
      }
      // 広告が閉じられたら、次の広告を事前に読み込んでおく
      loadInterstitialAd();
    });

    // 初期読み込み
    loadInterstitialAd();
  } catch (error) {
    console.warn('Failed to initialize interstitial ad:', error);
  }
};

/**
 * インタースティシャル広告を読み込みます
 */
export const loadInterstitialAd = (): void => {
  try {
    // 既に読み込み済み、または読み込み中の場合は何もしない
    if (isAdLoaded || isAdLoading || interstitialAd === null) {
      return;
    }

    isAdLoading = true;
    interstitialAd.load();
  } catch (error) {
    console.warn('Failed to load interstitial ad:', error);
    isAdLoading = false;
  }
};

/**
 * インタースティシャル広告を表示します
 * @param onClosed 広告が閉じられた時に呼ばれるコールバック（オプション）
 * @returns 広告が表示されたかどうか（読み込み済みの場合のみ表示される）
 */
export const showInterstitialAd = (onClosed?: () => void): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (interstitialAd === null) {
        console.warn('Interstitial ad is not initialized');
        resolve(false);
        return;
      }

      if (!isAdLoaded) {
        console.warn('Interstitial ad is not loaded yet');
        resolve(false);
        return;
      }

      // コールバックを設定
      if (onClosed) {
        onAdClosedCallback = onClosed;
      }

      // 広告を表示
      interstitialAd.show();
      isAdLoaded = false; // 表示後は読み込み済みフラグをリセット
      resolve(true);
    } catch (error) {
      console.warn('Failed to show interstitial ad:', error);
      // エラー時はコールバックをクリア
      onAdClosedCallback = null;
      resolve(false);
    }
  });
};

/**
 * 広告が読み込み済みかどうかを確認します
 * @returns 広告が読み込み済みの場合true
 */
export const isInterstitialAdReady = (): boolean => {
  return isAdLoaded;
};

/**
 * 広告管理をリセットします（テスト用）
 */
export const resetAdManager = (): void => {
  interstitialAd = null;
  isAdLoaded = false;
  isAdLoading = false;
};

