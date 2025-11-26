export const COLORS = {
  // Backgrounds
  background: ['#1E1E1E', '#121212', '#0A0A0A'] as const,
  overlay: 'rgba(45, 45, 45, 0.6)',
  overlayDark: 'rgba(45, 45, 45, 0.9)',
  
  // Text
  text: '#FFFFFF',
  textDim: 'rgba(255, 255, 255, 0.75)',
  textDark: 'rgba(255, 255, 255, 0.5)',
  
  // Accents
  primary: '#FFA726', // Orange/Yellow for warnings, highlights
  secondary: '#4CAF50', // Green for success/selection
  danger: '#EF5350', // Red for danger/doubt
  dangerDark: '#C62828',
  info: '#42A5F5', // Blue for info/believe
  
  // UI Elements
  border: 'rgba(255, 255, 255, 0.1)',
  borderHighlight: 'rgba(255, 255, 255, 0.2)',
  cardBg: '#2D2D2D',
  
  // Gradients
  gradientRed: ['#C62828', '#D32F2F'] as const,
  gradientBlue: ['#42A5F5', '#1E88E5'] as const,
  gradientGreen: ['#66BB6A', '#43A047'] as const,
  gradientOrange: ['#FFA726', '#FB8C00'] as const,
  gradientGray: ['#666666', '#555555'] as const,
};

export const LAYOUT = {
  // headerPaddingTopは動的にuseSafeAreaInsets()で取得するため削除
  // headerPaddingTop: 50, // 削除: 動的なノッチ処理を使用
  headerHeight: 60, // Approximation
  spacing: 16,
  borderRadius: 12,
};

export const TIMING = {
  screenTransitionDelay: 100, // 画面遷移の遅延時間（ms）
} as const;

