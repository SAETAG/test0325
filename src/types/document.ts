/**
 * 書類情報を表す型定義
 * マンション管理に関連する各種書類の情報を格納します。
 * この型はアプリケーション全体で書類データの標準形式として使用されます。
 */
export interface Document {
  /** 書類の一意識別子 */
  id: string;
  
  /** 書類のタイトル（例：「第10回管理組合総会議事録」） */
  title: string;
  
  /** 関連するマンション・建物名（例：「サンシャインマンション」） */
  building: string;
  
  /** 書類の種類・カテゴリ（例：「議事録」「点検報告書」「見積書」） */
  type: string;
  
  /** 書類がアップロードされた日時（ISO形式の文字列） */
  uploadedAt: string;
  
  /** 検索や分類に使用されるタグのリスト */
  tags: string[];
  
  /** 書類の概要説明 */
  description: string;
  
  /** 
   * 書類をアップロードしたユーザーの情報
   */
  uploadedBy: {
    /** ユーザーの表示名 */
    name: string;
    
    /** プロフィール画像のURL */
    avatar: string;
    
    /** ユーザー名のイニシャル（アバター画像がない場合の代替表示用） */
    initials: string;
  };
  
  /** 書類のファイルサイズ（例：「1.2MB」） */
  fileSize: string;
  
  /** 書類のページ数 */
  pages: number;
  
  /** 
   * プレビュー表示用のURL（オプション）
   * PDFや画像ファイルへの直接リンクなど
   */
  previewUrl?: string;
  
  /** 
   * この書類に関連する他の書類のリスト
   * 例：同じマンションの関連書類や同じ工事に関する複数書類など
   */
  relatedDocuments: RelatedDocument[];
  
  /**
   * 書類の本文内容
   * OCRで抽出されたテキストデータや書類の全文が含まれます
   * AI質問応答機能やテキスト検索で使用されます
   */
  content: string;
}

/**
 * 関連書類の簡易情報を表す型定義
 * 完全なDocument情報ではなく、参照・リンクのための最小限の情報のみを含みます
 */
export interface RelatedDocument {
  /** 関連書類の一意識別子 */
  id: string;
  
  /** 関連書類のタイトル */
  title: string;
}
