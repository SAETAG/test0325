import { Document } from "@/types/document";

/**
 * ドキュメントデータを管理するモジュール
 *
 * このファイルは書類データのモックを提供し、サーバーコンポーネントとクライアントコンポーネントの
 * 両方からアクセスできます。将来的には実際のAPIやデータベースからデータを取得する実装に
 * 置き換えることを想定しています。
 */

// 書類データの型定義（暗黙的）
// id: 書類の一意の識別子
// title: 書類のタイトル
// building: 管理対象のマンション名
// type: ファイル形式（PDF/JPG/PNGなど）
// uploadedAt: アップロード日（YYYY-MM-DD形式）
// tags: 関連するタグの配列
// description: 書類の詳細説明
// uploadedBy: アップロードしたユーザー情報
//   - name: ユーザー名
//   - avatar: アバター画像のURL
//   - initials: イニシャル（アバター画像がない場合の代替表示）
// fileSize: ファイルサイズ（文字列形式、例: "1.2 MB"）
// pages: ドキュメントのページ数
// previewUrl: プレビュー画像のURL
// relatedDocuments: 関連書類の配列
//   - id: 関連書類のID（documentsData内の対応するidを参照）
//   - title: 関連書類のタイトル

/**
 * マンション管理に関連する書類データのサンプル
 *
 * このデータは開発およびデモ用で、実際のデータはFirebaseなどから取得します。
 * データ構造は実際のアプリケーションの要件に合わせて変更できます。
 */
export const documentsData = [
  {
    id: 1,
    title: "第1回理事会議事録",
    building: "グリーンハイツ",
    type: "議事録",
    uploadedAt: "2023-04-15T10:30:00",
    tags: ["理事会", "重要", "2023年度"],
    description:
      "2023年度第1回理事会の議事録です。主な議題は予算案と修繕計画について。",
    uploadedBy: {
      name: "山田太郎",
      avatar: "/avatars/user-01.png",
      initials: "YT",
    },
    fileSize: "1.2MB",
    pages: 5,
    previewUrl: "/previews/document-01.pdf",
    relatedDocuments: [
      { id: 2, title: "修繕計画書" },
      { id: 3, title: "2023年度予算案" },
    ],
  },
  {
    id: 2,
    title: "修繕計画書",
    building: "グリーンハイツ",
    type: "計画書",
    uploadedAt: "2023-03-10T14:20:00",
    tags: ["修繕", "長期計画"],
    description: "今後10年間の修繕計画と概算費用をまとめた資料です。",
    uploadedBy: {
      name: "佐藤花子",
      avatar: "/avatars/user-02.png",
      initials: "SH",
    },
    fileSize: "3.5MB",
    pages: 12,
    previewUrl: "/previews/document-02.pdf",
    relatedDocuments: [
      { id: 1, title: "第1回理事会議事録" },
      { id: 4, title: "修繕積立金検討資料" },
    ],
  },
  // 消防設備点検報告書 - 法令で定められた定期点検の結果報告書
  {
    id: 3,
    title: "消防設備点検報告書",
    building: "パークハイツ横浜", // 別のマンション
    type: "PDF",
    uploadedAt: "2023-12-05",
    tags: ["点検", "消防"], // 点検種別を示すタグ
    description:
      "年次消防設備点検の報告書です。スプリンクラーシステムの一部に不具合が見つかり、修理が必要です。", // 要点と問題点
    uploadedBy: {
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SI",
    },
    fileSize: "2.8 MB",
    pages: 8,
    previewUrl: "/placeholder.svg?height=500&width=400",
    relatedDocuments: [], // 関連書類なし
  },
  // 駐車場利用規約 - マンションの駐車場利用に関するルールを記載した文書
  {
    id: 4,
    title: "駐車場利用規約",
    building: "リバーサイドタワー大阪",
    type: "PDF",
    uploadedAt: "2023-11-28",
    tags: ["規約", "駐車場"], // 文書種別とテーマ
    description:
      "駐車場の利用に関する新しい規約です。料金体系の変更と来客用駐車スペースの利用方法が更新されています。", // 主な変更点
    uploadedBy: {
      name: "山田健太",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YK",
    },
    fileSize: "0.9 MB",
    pages: 3, // 比較的短い文書
    previewUrl: "/placeholder.svg?height=500&width=400",
    relatedDocuments: [], // 関連書類なし
  },
  // エレベーター保守点検報告書 - 設備の定期点検結果報告書
  {
    id: 5,
    title: "防災マニュアル",
    building: "サンシャインマンション",
    type: "マニュアル",
    uploadedAt: "2023-02-01T09:15:00",
    tags: ["防災", "マニュアル", "重要"],
    description: "災害時の避難経路や対応方法についてのマニュアルです。",
    uploadedBy: {
      name: "鈴木一郎",
      avatar: "/avatars/user-05.png",
      initials: "SI",
    },
    fileSize: "2.1MB",
    pages: 8,
    previewUrl: "/previews/document-05.pdf",
    // 関連ドキュメントがない場合でも空配列で初期化
    relatedDocuments: [],
  },
];

/**
 * 使用方法:
 *
 * 1. インポート:
 *   import { documentsData } from "@/lib/document-data"
 *
 * 2. 全てのドキュメントにアクセス:
 *   const allDocuments = documentsData;
 *
 * 3. 特定のドキュメントを検索:
 *   const document = documentsData.find(doc => doc.id === documentId);
 *
 * 4. フィルタリング:
 *   const filteredDocs = documentsData.filter(doc =>
 *     doc.building === "グランドパレス東京" &&
 *     doc.tags.includes("議事録")
 *   );
 *
 * 5. 関連ドキュメントの取得:
 *   const relatedDocs = document.relatedDocuments.map(
 *     relDoc => documentsData.find(d => d.id === relDoc.id)
 *   ).filter(Boolean);
 */
