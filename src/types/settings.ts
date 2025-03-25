export interface AppSettings {
  id: string; // 設定ID
  aiFeatures: {
    // AI機能の設定
    enabled: boolean;
    model: string;
    maxTokens: number;
  };
  storage: {
    // ストレージ設定
    maxFileSize: number; // 最大ファイルサイズ（MB）
    allowedTypes: string[]; // 許可するファイルタイプ
  };
  features: {
    // 機能のオンオフ設定
    ocr: boolean; // OCR機能
    aiSuggestions: boolean; // AI提案
    crossSearch: boolean; // 横断検索
  };
}
