# ゴキブリポーカー風ゲーム デザインガイドライン

## 🎨 デザインコンセプト

### コアコンセプト
**「ダークな世界観 × ポップな害虫たち」**

- **全体の雰囲気**: 人狼ゲーム「牢獄の悪夢」のようなダークで重厚な世界観
- **カードデザイン**: ポップでキュート、親しみやすい害虫キャラクター
- **心理戦の緊張感**: 暗い背景が生み出す緊迫した雰囲気
- **ギャップの魅力**: ダーク×ポップの対比が生む独特の世界観

---

## 🌙 ダークテーマの設計

### カラーパレット

#### 基本色（ベース）
```css
/* 背景色 - Material Design推奨 */
--bg-primary: #121212;        /* ダークグレー（真っ黒ではない） */
--bg-secondary: #1E1E1E;      /* カード背景など */
--bg-tertiary: #2D2D2D;       /* 浮いた要素 */

/* 表面の高さを表現 */
--surface-1: #1E1E1E;         /* 標準 */
--surface-2: #242424;         /* 少し浮く（+4dp） */
--surface-3: #2A2A2A;         /* さらに浮く（+8dp） */
--surface-4: #303030;         /* 最前面（+16dp） */
```

#### テキストカラー
```css
/* テキスト */
--text-primary: rgba(255, 255, 255, 0.95);    /* 最重要 */
--text-secondary: rgba(255, 255, 255, 0.75);  /* 通常 */
--text-tertiary: rgba(255, 255, 255, 0.55);   /* 補助 */
--text-disabled: rgba(255, 255, 255, 0.35);   /* 無効 */
```

#### アクセントカラー（ブランドカラー）
```css
/* メインカラー - 深みのある赤（血の色、緊迫感） */
--accent-primary: #C62828;      /* 濃い赤 */
--accent-secondary: #D32F2F;    /* 赤 */
--accent-light: #EF5350;        /* 明るい赤 */

/* サブカラー - ゴールド（高級感、勝利） */
--accent-gold: #FFA726;         /* ゴールド */
--accent-gold-light: #FFB74D;   /* 明るいゴールド */
```

#### 機能カラー
```css
/* 状態表示 */
--success: #66BB6A;    /* 成功・安全 */
--warning: #FFA726;    /* 警告 */
--error: #EF5350;      /* エラー・危険 */
--info: #42A5F5;       /* 情報 */
```

#### 境界線・シャドウ
```css
/* ボーダー */
--border-light: rgba(255, 255, 255, 0.12);
--border-medium: rgba(255, 255, 255, 0.24);

/* シャドウ */
--shadow-small: 0 2px 4px rgba(0, 0, 0, 0.5);
--shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.6);
--shadow-large: 0 8px 16px rgba(0, 0, 0, 0.7);
--shadow-glow: 0 0 20px rgba(198, 40, 40, 0.4);  /* 赤い光 */
```

### 光源表現

**牢獄の悪夢のような雰囲気を出すために、微かな光源を配置**

```css
/* 背景グラデーション例 */
background: radial-gradient(
  ellipse at top,
  rgba(198, 40, 40, 0.15) 0%,    /* 上部に赤い光 */
  #121212 50%,
  #0A0A0A 100%                   /* 下部は暗く */
);
```

### Material Design準拠の階層表現

```
最前面（+16dp）: モーダル、ダイアログ
  ↑
浮いた要素（+8dp）: カード表示、重要なボタン
  ↑
中間層（+4dp）: ナビゲーション、ヘッダー
  ↑
ベース（0dp）: 背景
```

---

## 🐛 害虫カードのデザイン

### デザイン方向性

**ポップでキュート、でも害虫感は残す**

#### スタイル指針
1. **丸みのあるフォルム**
   - 柔らかい曲線
   - 親しみやすい輪郭
   - デフォルメされた体型

2. **大きな目**
   - つぶらな瞳
   - 輝きを入れる
   - 表情豊か

3. **ビビッドな配色**
   - 鮮やかで目を引く色
   - グラデーション使用
   - 光沢感

4. **漫画的表現**
   - 太めの輪郭線
   - シンプルな影
   - ハイライト効果

### 各カードのデザイン案

#### 1. コウモリ 🦇
```
カラー: 深紫 → ピンクのグラデーション
特徴:
- 大きな丸い目（キラキラ）
- 小さな牙（かわいい）
- ふわふわの毛
- 広げた翼は紫のグラデーション
- 月光を背に
スタイル: ゴシックロリータ風
```

#### 2. クモ 🕷️
```
カラー: 黒 × 蛍光ピンク
特徴:
- 8つの大きな目（全部キラキラ）
- 丸くてモフモフの体
- カラフルな足（グラデーション）
- 虹色の糸を吐く
- 水玉模様の腹部
スタイル: ポップアート風
```

#### 3. サソリ 🦂
```
カラー: 赤 × オレンジのグラデーション
特徴:
- ハート型の尾
- キラキラのハサミ
- つぶらな瞳
- 炎のエフェクト
- 宝石がちりばめられた甲羅
スタイル: ファンシー＆メタリック
```

#### 4. ネズミ 🐭
```
カラー: ピンク × 白のグラデーション
特徴:
- 大きなピンクの耳
- ふわふわのしっぽ
- 丸い鼻（赤）
- チーズを持っている
- ウィンクしている
スタイル: キュート＆カジュアル
```

#### 5. カエル 🐸
```
カラー: ライムグリーン × 黄色
特徴:
- 飛び出た大きな目
- ニコニコ笑顔
- 水玉模様の体
- 葉っぱの帽子
- 虹色の舌
スタイル: カラフル＆トロピカル
```

#### 6. ハエ 🪰
```
カラー: メタリックブルー × 緑
特徴:
- 巨大な複眼（虹色）
- 透明な羽（キラキラ）
- ストライプ模様の体
- サングラスをかけている
- スター形の輝き
スタイル: クール＆スタイリッシュ
```

#### 7. カメムシ 🪲
```
カラー: エメラルドグリーン × ゴールド
特徴:
- 宝石のような甲羅
- キラキラの羽
- 花冠をかぶっている
- 笑顔
- 周囲にお花
スタイル: ファンタジー＆エレガント
```

#### 8. ムカデ 🦟
```
カラー: 紫 × ピンクのグラデーション
特徴:
- 各節が違う色
- たくさんの足（レインボー）
- 大きな目（2つ）
- ニッコリ笑顔
- 星のアクセサリー
スタイル: サイケデリック＆キュート
```

### カードフレームデザイン

```
┌─────────────────────┐
│  [生物アイコン]        │ ← 小さいアイコン（上部左）
│                        │
│     [害虫キャラ]       │ ← メインイラスト（中央大きく）
│                        │
│  ═══════════════════  │ ← 装飾ライン
│                        │
│     【クモ】           │ ← 名前（中央、太字）
│                        │
└─────────────────────┘
```

**フレームの特徴:**
- ダークな背景に映える明るいフレーム
- メタリックゴールドのフチ
- 細かい装飾（牢獄のような格子模様）
- 微かに光るエフェクト
- カードの種類ごとに色が少し変わる

---

## 🎭 UI要素のデザイン

### ボタンデザイン

#### プライマリボタン（重要なアクション）
```css
.primary-button {
  background: linear-gradient(135deg, #C62828 0%, #D32F2F 100%);
  color: #FFFFFF;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(198, 40, 40, 0.4);  /* 赤い光 */
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  /* ホバー時 */
  &:hover {
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.7),
      0 0 30px rgba(198, 40, 40, 0.6);
    transform: translateY(-2px);
  }
}
```

#### セカンダリボタン
```css
.secondary-button {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 16px 32px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.36);
  }
}
```

### カード表示

#### ゲーム内のカード
```css
.game-card {
  width: 180px;
  height: 260px;
  background: linear-gradient(145deg, #2D2D2D 0%, #1E1E1E 100%);
  border: 3px solid #FFA726;  /* ゴールド */
  border-radius: 16px;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  /* 光沢効果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shine 3s infinite;
  }
}

@keyframes shine {
  to {
    left: 200%;
  }
}
```

### ダイアログ・モーダル

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.85);  /* 暗いオーバーレイ */
  backdrop-filter: blur(4px);       /* ぼかし */
}

.modal-content {
  background: linear-gradient(165deg, #1E1E1E 0%, #121212 100%);
  border: 2px solid rgba(198, 40, 40, 0.4);
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.9),
    0 0 60px rgba(198, 40, 40, 0.3);
  padding: 32px;
}
```

---

## 🎮 カードスタック表示（プレイヤー状態表示）

### デザインコンセプト

**ビジュアルで直感的に枚数を把握**

テキストの「×3」表示ではなく、実際のカードが重なって表示されることで：
- 一目で枚数が分かる
- カードのデザインが見える
- ゲーム性が向上
- UIが美しくなる

### カードスタック仕様

#### 1枚の場合
```
┌────────────┐
│            │
│    🦇     │  ← カードイラスト
│            │
│ コウモリ    │  ← カード名
│            │
└────────────┘  1  ← 枚数（右側）

サイズ: 60×80px（ミニカード）
```

#### 2枚の場合
```
┌────────────┐
│            │┐
│    🦇     │┐  ← 4pxずつずらす
│            │┘
│ コウモリ    │
│            │
└────────────┘  2

重なり: 2枚目が右下に4px
```

#### 3枚の場合
```
┌────────────┐
│            │┐┐
│    🐸     │┐┐  ← 各4pxずつ
│            │┘┘
│  カエル     │
│            │
└────────────┘  3

重なり: 各4pxずつオフセット
```

#### 4枚の場合（危険状態）
```
┌────────────┐
│            │┐┐┐
│    🐸     │┐┐┐  ← 赤く点滅
│            │┘┘┘
│  カエル     │
│            │
└────────────┘  4 ⚠️

特別表示:
- カード全体が赤く光る
- 枚数に⚠️アイコン
- 微妙に震える（tremor）
- 警告音（オプション）
```

### 実装詳細

#### CSS実装

```css
/* カードコンテナ */
.card-stack {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

/* ミニカード */
.mini-card {
  width: 60px;
  height: 80px;
  background: linear-gradient(145deg, #2D2D2D 0%, #1E1E1E 100%);
  border: 2px solid #FFA726;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

/* カードアイコン */
.mini-card-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

/* カード名 */
.mini-card-name {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-align: center;
}

/* 重なり効果 */
.mini-card.stacked-1 {
  position: absolute;
  top: 4px;
  left: 4px;
  opacity: 0.9;
  z-index: 1;
}

.mini-card.stacked-2 {
  position: absolute;
  top: 8px;
  left: 8px;
  opacity: 0.85;
  z-index: 0;
}

.mini-card.stacked-3 {
  position: absolute;
  top: 12px;
  left: 12px;
  opacity: 0.8;
  z-index: -1;
}

/* 枚数表示 */
.card-count {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  min-width: 24px;
  text-align: center;
}

/* 危険状態（4枚） */
.card-stack.danger {
  animation: pulse-danger 1.5s infinite;
}

.card-stack.danger .mini-card {
  border-color: #EF5350;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.6),
    0 0 16px rgba(239, 83, 80, 0.6);
}

.card-stack.danger .card-count {
  color: #EF5350;
}

@keyframes pulse-danger {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 警告アイコン */
.warning-icon {
  color: #FFA726;
  font-size: 16px;
  margin-left: 4px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

/* ホバー効果 */
.mini-card:hover {
  transform: scale(1.1);
  z-index: 100;
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(255, 167, 38, 0.5);
  cursor: pointer;
}
```

#### React実装例

```typescript
interface CardStackProps {
  cardType: CardType;
  count: number;
  isDanger?: boolean;
}

const CardStack: React.FC<CardStackProps> = ({ 
  cardType, 
  count, 
  isDanger = false 
}) => {
  const cardInfo = getCardInfo(cardType);
  
  return (
    <div className={`card-stack ${isDanger ? 'danger' : ''}`}>
      {/* メインカード */}
      <div className="mini-card">
        <div className="mini-card-icon">{cardInfo.emoji}</div>
        <div className="mini-card-name">{cardInfo.name}</div>
      </div>
      
      {/* 重なりカード（最大3枚まで表示） */}
      {count > 1 && (
        <div className="mini-card stacked-1">
          <div className="mini-card-icon">{cardInfo.emoji}</div>
        </div>
      )}
      {count > 2 && (
        <div className="mini-card stacked-2">
          <div className="mini-card-icon">{cardInfo.emoji}</div>
        </div>
      )}
      {count > 3 && (
        <div className="mini-card stacked-3">
          <div className="mini-card-icon">{cardInfo.emoji}</div>
        </div>
      )}
      
      {/* 枚数表示 */}
      <span className="card-count">
        {count}
        {isDanger && <span className="warning-icon">⚠️</span>}
      </span>
    </div>
  );
};

// 使用例
<CardStack cardType="frog" count={3} isDanger={true} />
```

### プレイヤー状態表示の完全例

```typescript
interface PlayerStatusProps {
  player: Player;
  isCurrentPlayer: boolean;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ 
  player, 
  isCurrentPlayer 
}) => {
  return (
    <div className={`player-status ${isCurrentPlayer ? 'current' : ''}`}>
      {/* プレイヤー情報 */}
      <div className="player-info">
        <span className="player-name">{player.name}</span>
        <span className="hand-count">手札: {player.handCount}枚</span>
      </div>
      
      {/* 公開カード */}
      <div className="open-cards">
        {Object.entries(player.openCards).map(([cardType, count]) => {
          const isDanger = count >= 4 || 
            Object.keys(player.openCards).length >= 8;
          
          return (
            <CardStack
              key={cardType}
              cardType={cardType as CardType}
              count={count}
              isDanger={isDanger}
            />
          );
        })}
        
        {Object.keys(player.openCards).length === 0 && (
          <span className="no-cards">引き取ったカードなし</span>
        )}
      </div>
    </div>
  );
};
```

### インタラクション

#### タップ操作
```typescript
// カードをタップで拡大表示
const handleCardTap = (cardType: CardType) => {
  // モーダルで大きく表示
  showCardDetailModal({
    cardType,
    count,
    playerName,
  });
};
```

#### アニメーション
```typescript
// カードが追加された時のアニメーション
const cardAddAnimation = {
  initial: { 
    scale: 0,
    opacity: 0,
    rotate: -180,
  },
  animate: { 
    scale: 1,
    opacity: 1,
    rotate: 0,
  },
  transition: {
    duration: 0.5,
    ease: "backOut",
  },
};

// 危険状態に達した時の警告アニメーション
const dangerAnimation = {
  // 画面全体が赤く点滅
  backgroundColor: ['#121212', '#1A0D0D', '#121212'],
  duration: 500,
  repeat: 3,
  
  // 効果音
  soundEffect: 'warning.mp3',
};
```

### レスポンシブ対応

```css
/* スマホ縦（小） */
@media (max-width: 374px) {
  .mini-card {
    width: 50px;
    height: 66px;
  }
  
  .mini-card-icon {
    font-size: 24px;
  }
  
  .card-count {
    font-size: 16px;
  }
}

/* スマホ縦（標準） */
@media (min-width: 375px) and (max-width: 767px) {
  .mini-card {
    width: 60px;
    height: 80px;
  }
}

/* タブレット・PC */
@media (min-width: 768px) {
  .mini-card {
    width: 70px;
    height: 93px;
  }
  
  .mini-card-icon {
    font-size: 36px;
  }
}
```

### アクセシビリティ

```typescript
// スクリーンリーダー対応
<div 
  className="card-stack"
  role="img"
  aria-label={`${cardInfo.name}が${count}枚${isDanger ? '、危険状態です' : ''}`}
>
  {/* カード表示 */}
</div>

// 触覚フィードバック（危険状態）
if (isDanger) {
  Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning
  );
}
```

---

## 🎨 デザインの利点

### ビジュアル表示のメリット

1. **直感的理解**
   - 枚数が一目で分かる
   - カードデザインが見える
   - ゲーム性が向上

2. **美しいUI**
   - ダークテーマに映える
   - カードの重なりが美しい
   - ポップなカードが際立つ

3. **緊張感の演出**
   - 4枚で赤く光る
   - 危険状態が視覚的に分かる
   - ドキドキ感が増す

4. **ゲーム体験の向上**
   - リアルカードゲーム感
   - タッチ操作で拡大表示
   - アニメーションで盛り上がる

---

## 📱 画面別デザイン例

### タイトル画面

```
┌─────────────────────────────┐
│                              │
│    [微かな赤い光源]           │
│                              │
│   ╔═══════════════════╗     │
│   ║ BLUFF  CARD       ║     │  ← ゴシック体
│   ║    GAME           ║     │
│   ╚═══════════════════╝     │
│                              │
│   [害虫たちがポップに踊る]    │
│   🦇 🕷️ 🦂 🐭 🐸 🪰 🪲 🦟   │
│                              │
│   ┌─────────────────┐      │
│   │ ▶ ゲーム開始     │      │  ← 赤く光る
│   └─────────────────┘      │
│   ┌─────────────────┐      │
│   │   ルール説明      │      │
│   └─────────────────┘      │
│   ┌─────────────────┐      │
│   │   設定           │      │
│   └─────────────────┘      │
│                              │
└─────────────────────────────┘
```

**特徴:**
- 背景: ダークな牢獄のような石壁
- タイトルロゴ: ゴシック体、メタリック加工
- 害虫キャラ: ポップに動くアニメーション
- ボタン: 赤く脈打つように光る
- BGM: 重厚なオーケストラ + 不気味な音

### ゲームメイン画面

```
┌─────────────────────────────────────┐
│ ◀ [戻る]   太郎のターン  [⏸]        │  ← ヘッダー（ダーク）
├─────────────────────────────────────┤
│                                      │
│  📊 プレイヤー状態                   │
│  ┌─ 太郎 (あなた) ──────────────┐  │
│  │ 手札: 12枚                      │  │
│  │                                 │  │
│  │ ┌──┐        ┌──┐             │  │
│  │ │🦇│┐┐ 2   │🕷️│ 1          │  │
│  │ └──┘┘┘      └──┘             │  │
│  │                                 │  │
│  └─────────────────────────────┘  │
│                                      │
│  ┌─ 花子 ───────────────────────┐  │
│  │ 手札: 11枚 ⚠️                   │  │
│  │                                 │  │
│  │ ┌──┐        ┌──┐             │  │
│  │ │🐭│ 1     │🐸│┐┐┐ 3        │  │  ← 危険！
│  │ └──┘        └──┘┘┘┘         │  │
│  │                                 │  │
│  └─────────────────────────────┘  │
│                                      │
│  ┌─ 次郎 ───────────────────────┐  │
│  │ 手札: 9枚                       │  │
│  │ 引き取ったカードなし             │  │
│  └─────────────────────────────┘  │
│                                      │
├─────────────────────────────────────┤
│  [本当だと思う] [嘘だと思う]         │  ← アクションボタン
│  [他の人に渡す]                      │
└─────────────────────────────────────┘
```

**デザインポイント:**
- カードが重なって表示される
- 枚数が一目で分かる
- 危険状態（3枚以上）は赤く光る
- タップで拡大表示

### カード表示（判定後）

```
┌─────────────────────────────┐
│                              │
│        [カードめくり]         │
│                              │
│   ┌──────────────────┐     │
│   │                    │     │
│   │   [🕷️]             │     │
│   │                    │     │
│   │  キラキラ光る       │     │
│   │  クモのイラスト     │     │
│   │                    │     │
│   │   【クモ】          │     │
│   │                    │     │
│   └──────────────────┘     │
│                              │
│   宣言: 「クモ」              │
│   → 本当でした！ ✓           │
│                              │
│   [次へ] ⏵                   │
│                              │
└─────────────────────────────┘
```

---

## 🎬 アニメーション・エフェクト

### カードめくり演出

```javascript
// カードめくりアニメーション
const cardFlipAnimation = {
  duration: 800,
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  steps: [
    // 1. 裏面が見える
    { transform: 'rotateY(0deg)', opacity: 1 },
    
    // 2. 90度回転（横向き）
    { transform: 'rotateY(90deg)', opacity: 0.8 },
    
    // 3. 表面が見える
    { transform: 'rotateY(180deg)', opacity: 1 },
  ],
  
  // エフェクト
  particles: true,        // キラキラ粒子
  glowEffect: true,       // 光る
  soundEffect: 'card-flip.mp3',
};
```

### 緊張感のある演出

```javascript
// 判定前の緊迫アニメーション
const tensionAnimation = {
  // 背景が赤く明滅
  backgroundPulse: {
    duration: 2000,
    colors: ['#121212', '#1A0D0D', '#121212'],
    repeat: true,
  },
  
  // カードが微妙に揺れる
  cardTremor: {
    duration: 100,
    amplitude: 2,
    repeat: true,
  },
  
  // ドラムロール音
  soundEffect: 'drumroll.mp3',
};
```

### ページ遷移

```javascript
// フェードイン・アウト
const pageTransition = {
  fadeOut: {
    duration: 300,
    opacity: [1, 0],
  },
  fadeIn: {
    duration: 300,
    opacity: [0, 1],
    delay: 100,
  },
  
  // カーテンが下りるような演出
  curtainEffect: true,
};
```

---

## 🔤 タイポグラフィ

### フォント選定

#### 日本語フォント
```css
/* ゴシック体（重厚感） */
font-family: 
  'Noto Sans JP',          /* メイン */
  'Hiragino Kaku Gothic ProN',
  'Yu Gothic',
  sans-serif;

/* 明朝体（エレガント、一部使用） */
font-family:
  'Noto Serif JP',
  'Yu Mincho',
  serif;
```

#### 英数字フォント
```css
/* タイトル・見出し用 */
font-family:
  'Cinzel',               /* ゴシック体風 */
  'Crimson Text',
  serif;

/* 数字用 */
font-family:
  'Roboto Mono',          /* 等幅 */
  monospace;
```

### フォントサイズ

```css
/* 見出し */
--font-xxl: 48px;    /* タイトル */
--font-xl: 36px;     /* H1 */
--font-lg: 28px;     /* H2 */
--font-md: 20px;     /* H3 */

/* 本文 */
--font-base: 16px;   /* 通常 */
--font-sm: 14px;     /* 補助 */
--font-xs: 12px;     /* キャプション */
```

### フォントウェイト

```css
--font-weight-bold: 700;
--font-weight-medium: 500;
--font-weight-regular: 400;
--font-weight-light: 300;
```

---

## 🔊 サウンドデザイン

### BGM

#### タイトル画面
- **雰囲気**: ダーク、重厚、オーケストラ
- **楽器**: ストリングス、パイプオルガン、ティンパニ
- **テンポ**: スロー、不穏
- **参考**: 「牢獄の悪夢」のBGM、ゴシックホラー系

#### ゲーム中
- **雰囲気**: 緊張感、心理戦
- **楽器**: ピアノ、チェロ、微かなドラム
- **テンポ**: ミディアム、緊迫
- **ポイント**: 判定時に音が止まる演出

#### 勝利時
- **雰囲気**: 華やか、達成感
- **楽器**: トランペット、弦楽器
- **テンポ**: アップテンポ

#### 敗北時
- **雰囲気**: 悲劇的、重い
- **楽器**: 重低音、不協和音
- **効果音**: ガシャーン

### SE（効果音）

```javascript
const soundEffects = {
  // UI操作
  buttonClick: 'click.wav',         // カチッ
  buttonHover: 'hover.wav',         // シュッ
  
  // カード操作
  cardDraw: 'card-draw.wav',        // シャッ
  cardFlip: 'card-flip.wav',        // パタッ
  cardPlace: 'card-place.wav',      // トン
  
  // 判定
  correct: 'success.wav',           // キラーン
  wrong: 'fail.wav',                // ブブー
  
  // 緊張感
  drumroll: 'drumroll.wav',         // ドコドコドコ...
  heartbeat: 'heartbeat.wav',       // ドクン...ドクン...
  
  // ゲーム進行
  turnStart: 'turn-start.wav',      // ゴーン
  gameOver: 'game-over.wav',        // ジャーン
  victory: 'victory.wav',           // ファンファーレ
};
```

---

## 📐 レイアウト・グリッド

### レスポンシブデザイン

```css
/* スマートフォン縦（メイン） */
@media (max-width: 767px) {
  .container {
    padding: 16px;
  }
  
  .game-card {
    width: 140px;
    height: 200px;
  }
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 24px;
  }
  
  .game-card {
    width: 160px;
    height: 230px;
  }
}

/* PC・タブレット横 */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .game-card {
    width: 180px;
    height: 260px;
  }
}
```

### セーフエリア

```css
/* iPhone X 以降のノッチ対応 */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## 🎨 デザインシステム実装

### Figmaでの管理

```
プロジェクト構成:
├── 📁 Design System
│   ├── 🎨 Colors（カラーパレット）
│   ├── 🔤 Typography（タイポグラフィ）
│   ├── 🧩 Components（コンポーネント）
│   │   ├── Buttons
│   │   ├── Cards
│   │   ├── Modals
│   │   └── Icons
│   └── 📐 Layout（レイアウトグリッド）
│
├── 📁 Screens
│   ├── Title
│   ├── Game Main
│   ├── Card Selection
│   └── Game End
│
└── 📁 Assets
    ├── Card Illustrations（カードイラスト）
    ├── Icons
    └── Animations（アニメーション仕様）
```

### Reactでの実装例

```typescript
// デザイントークン
export const theme = {
  colors: {
    bg: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.75)',
      tertiary: 'rgba(255, 255, 255, 0.55)',
    },
    accent: {
      primary: '#C62828',
      secondary: '#D32F2F',
      light: '#EF5350',
      gold: '#FFA726',
    },
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.6)',
    large: '0 8px 16px rgba(0, 0, 0, 0.7)',
    glow: '0 0 20px rgba(198, 40, 40, 0.4)',
  },
  
  fonts: {
    family: {
      sans: "'Noto Sans JP', sans-serif",
      serif: "'Noto Serif JP', serif",
      display: "'Cinzel', serif",
    },
    size: {
      xxl: '48px',
      xl: '36px',
      lg: '28px',
      md: '20px',
      base: '16px',
      sm: '14px',
      xs: '12px',
    },
  },
};
```

---

## ✨ デザインの仕上げポイント

### 1. 一貫性
- 全画面で同じデザインシステムを使用
- カラーパレットを厳守
- フォントの使い分けルールを守る

### 2. 階層感
- 重要な要素ほど明るく、手前に
- シャドウで奥行きを表現
- アニメーションで注目を集める

### 3. 緊張感と親しみやすさの両立
- ダークな背景で緊迫感
- ポップなカードで親しみ
- この対比が独特の世界観を生む

### 4. アクセシビリティ
- コントラスト比を確保（WCAG AA以上）
- タッチターゲットは44×44px以上
- 色だけに頼らない情報伝達

### 5. パフォーマンス
- 画像の最適化
- アニメーションの60fps維持
- ロード時間の短縮

---

## 🎯 実装優先度

### Phase 1: MVP（必須）
- ✅ ダークテーマの基本カラー
- ✅ カードイラスト（8種類）
- ✅ 基本UI（ボタン、カード表示）
- ✅ タイポグラフィ

### Phase 2: 強化
- ⭐ アニメーション
- ⭐ 効果音・BGM
- ⭐ 光源エフェクト
- ⭐ カードめくり演出

### Phase 3: 磨き込み
- 💎 パーティクルエフェクト
- 💎 マイクロインタラクション
- 💎 背景アニメーション
- 💎 テーマカスタマイズ

---

## 📚 参考リソース

### デザインインスピレーション
- 人狼ゲーム「牢獄の悪夢」
- Among Us（ポップなキャラデザイン）
- Darkest Dungeon（ダーク×アート）
- Don't Starve（ゴシック×かわいい）

### フォント
- Google Fonts: Noto Sans JP, Noto Serif JP
- Google Fonts: Cinzel, Crimson Text
- Adobe Fonts: 源ノ角ゴシック

### カラーツール
- Coolors.co（カラーパレット生成）
- Material Design Color Tool
- Contrast Checker（アクセシビリティ）

### アイコン
- Lucide Icons
- Heroicons
- Font Awesome

---

**デザインの核心:**
ダークで重厚な世界観の中で、ポップでキュートな害虫たちが躍動する。
この対比が生み出す独特の魅力こそが、このゲームの個性です。
