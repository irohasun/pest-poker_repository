# Bluff Card Game (ゴキブリポーカー風ゲーム)

React Native + Expoで作成されたiOS/Androidネイティブアプリです。

## 🎮 ゲーム概要

ダークな世界観の中で、ポップな害虫カードを使った心理戦ゲームです。
「ゴキブリポーカー」のルールに基づいた、嘘と真実を見抜くカードゲームです。

## 🚀 開発環境のセットアップ

### 必要なもの
- Node.js (v18以上)
- npm または yarn
- Expo Go アプリ (iOS/Android実機テスト用)

### インストール

```bash
npm install
```

## 📱 実行方法

### 開発サーバーの起動

```bash
npm start
```

### iOS実機でテスト

1. iPhoneに「Expo Go」アプリをインストール
2. `npm start` を実行
3. 表示されたQRコードをiPhoneのカメラで読み取る
4. Expo Goで開く

### iOSシミュレータで実行 (Macのみ)

```bash
npm run ios
```

### Androidで実行

```bash
npm run android
```

### Webブラウザで実行

```bash
npm run web
```

## 📂 プロジェクト構造

```
bluff-card-game/
├── App.tsx                 # メインエントリーポイント
├── src/
│   ├── types/
│   │   └── game.ts        # 型定義
│   ├── utils/
│   │   └── gameLogic.ts   # ゲームロジック
│   ├── components/
│   │   ├── CardStack.tsx  # カード表示コンポーネント
│   │   └── PlayerStatus.tsx # プレイヤー状態表示
│   └── screens/
│       ├── TitleScreen.tsx  # タイトル画面
│       └── GameScreen.tsx   # ゲームメイン画面
└── package.json
```

## 🎨 デザイン

### コンセプト
- **ダークな世界観**: 人狼ゲーム「牢獄の悪夢」のような重厚な雰囲気
- **ポップな害虫**: かわいくデフォルメされた害虫キャラクター
- **緊迫した心理戦**: カードの重なりや危険状態の視覚的な表現

### カラーパレット
- 背景: ダークグレー (#121212, #1E1E1E)
- アクセント: 深紅 (#C62828)
- ゴールド: #FFA726

## 🎯 実装済み機能

- ✅ タイトル画面
- ✅ ゲームメイン画面
- ✅ プレイヤー状態表示（カードスタック）
- ✅ カードドロー
- ✅ カード宣言
- ✅ 判定システム
- ✅ 脱落判定
- ✅ ダークテーマのUI

## 📝 今後の実装予定

- [ ] AIプレイヤーの思考ロジック
- [ ] ゲーム終了画面
- [ ] ルール説明画面
- [ ] 設定画面（プレイヤー数、BGM等）
- [ ] サウンドエフェクト
- [ ] アニメーション強化
- [ ] オンライン対戦機能

## 🛠️ ビルド（実機配布用）

### iOS (App Store配布)
1. Apple Developer アカウントが必要
2. EAS Build を使用

```bash
npm install -g eas-cli
eas build --platform ios
```

### Android (Google Play配布)
```bash
eas build --platform android
```

## 📄 ライセンス

このプロジェクトは個人的な学習・開発目的で作成されています。

## 🤝 貢献

バグ報告や機能提案は歓迎します。

## 📞 サポート

問題が発生した場合は、Issueを作成してください。
