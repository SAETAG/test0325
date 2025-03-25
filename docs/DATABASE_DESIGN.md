# シメスくん データベース設計

このドキュメントではシメスくんアプリケーションの Firebase データベース設計について説明します。

## データベース概要

- **データベースタイプ**: Firebase Firestore (NoSQL)
- **認証**: Firebase Authentication

## コレクション構造

シメスくんでは以下の主要コレクションを使用します：

```mermaid
graph TD;
    A[buildings] --> B[documents];
    A --> C[users];
    A --> D[settings];
    B --> E[users];
    C --> F[settings];
```

```
firestore/
├── buildings/            # マンション情報
│   └── {buildingId}/     # マンションドキュメント
│
├── documents/            # 書類情報
│   └── {documentId}/     # 書類ドキュメント
│
├── users/                # ユーザー追加情報
│   └── {userId}/         # ユーザードキュメント
│
└── settings/             # アプリケーション設定
    └── {settingId}/      # 設定ドキュメント
```

## ユーティリティ関数

以下のユーティリティ関数を使用してデータベースとやり取りします：

- `getUserData(uid)`: ユーザー情報を取得
- `createUserData(firebaseUser, additionalData)`: ユーザー情報を作成
- `getAppSettings(settingId)`: アプリケーション設定を取得

## ドキュメント構造

### buildings コレクション

マンション（建物）の基本情報を保存します。

```typescript
interface Building {
  id: string; // マンションID
  name: string; // マンション名称
  address: string; // 住所
  constructionYear: number; // 築年数
  units: number; // 総戸数
  floors: number; // 階数
  managementCompany: string; // 管理会社名
  contactInfo: {
    // 連絡先情報
    phone: string;
    email: string;
    website?: string;
  };
  administrators: string[]; // 管理者権限を持つユーザーID配列
  members: string[]; // 一般閲覧権限を持つユーザーID配列
  createdAt: Timestamp; // 作成日時
  updatedAt: Timestamp; // 最終更新日時
  imageUrl?: string; // マンション画像URL
  status: "active" | "inactive"; // ステータス
}
```

### documents コレクション

マンション管理に関連する書類情報を保存します。

```typescript
interface Document {
  id: string; // 書類ID
  title: string; // タイトル
  building: string; // 関連マンションID
  buildingName: string; // マンション名（検索・表示の効率化のため）
  type: string; // 書類タイプ（議事録、点検報告書など）
  uploadedAt: Timestamp; // アップロード日時
  tags: string[]; // タグ
  description: string; // 説明
  uploadedBy: {
    // アップロードユーザー情報
    uid: string; // ユーザーID
    name: string; // 名前
    avatar: string; // アバター画像URL
    initials: string; // イニシャル
  };
  fileData: {
    // ファイル情報
    path: string; // Storageパス
    size: number; // サイズ（バイト）
    sizeFormatted: string; // フォーマット済サイズ（例：「1.2MB」）
    type: string; // MIMEタイプ
    pages: number; // ページ数
  };
  previewUrl: string; // プレビューURL
  content: string; // OCR抽出テキスト
  relatedDocuments: {
    // 関連書類
    id: string;
    title: string;
  }[];
  accessLevel: "public" | "members" | "administrators"; // アクセスレベル
  isArchived: boolean; // アーカイブ状態
}
```

### users コレクション

Firebase Authentication に加えて保存する追加のユーザー情報。

```typescript
interface User {
  uid: string; // ユーザーID（Firebase Authと同一）
  displayName: string; // 表示名
  email: string; // メールアドレス
  photoURL?: string; // プロフィール画像URL
  initials: string; // イニシャル
  role: "admin" | "manager" | "user"; // システム全体での役割
  buildingAccess: {
    // マンションごとのアクセス権限
    [buildingId: string]: "admin" | "member" | "none";
  };
  preferences: {
    // ユーザー設定
    theme: "light" | "dark" | "system";
    notifications: boolean;
    // その他の設定
  };
  lastLogin: Timestamp; // 最終ログイン日時
  createdAt: Timestamp; // アカウント作成日時
}
```

### settings コレクション

アプリケーション全体の設定を保存します。

```typescript
interface AppSettings {
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
```

## データリレーション

NoSQL データベースでは、リレーショナルデータベースとは異なる方法でデータ間の関係を表現します：

1. **マンションと書類**:

   - 書類ドキュメントに `building` フィールドでマンション ID を参照
   - 性能向上のため `buildingName` も保持（マンション名で検索する場合に結合不要）

2. **ユーザーとマンション**:

   - マンションドキュメントに `administrators` と `members` フィールドでユーザー ID を配列として保持
   - ユーザードキュメントに `buildingAccess` オブジェクトでマンションごとの権限を保持

3. **書類間の関係**:
   - `relatedDocuments` 配列で関連書類を参照

## インデックス設計

検索パフォーマンス向上のために以下のインデックスを作成します：

1. **書類検索のための複合インデックス**:

   - `building` + `type` + `uploadedAt`（マンションごとの書類種類別時系列表示）
   - `building` + `tags` + `uploadedAt`（タグ検索）
   - `content` (Firestore 全文検索に対応する場合)

2. **ユーザーアクセス権管理のためのインデックス**:
   - `buildings` コレクションの `administrators` フィールド
   - `buildings` コレクションの `members` フィールド

## セキュリティルール

以下は Firebase Security Rules の概要です（実際の環境にあわせて詳細化が必要）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証済みユーザーのみアクセス可能
    match /{document=**} {
      allow read, write: if false; // デフォルトで全拒否
    }

    // ユーザー自身のデータのみ読み書き可能
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // マンションへのアクセス
    match /buildings/{buildingId} {
      // 管理者は全操作可能、メンバーは閲覧のみ
      allow read: if request.auth.uid != null &&
                   (resource.data.administrators.hasAny([request.auth.uid]) ||
                    resource.data.members.hasAny([request.auth.uid]));
      allow write: if request.auth.uid != null &&
                    resource.data.administrators.hasAny([request.auth.uid]);
    }

    // 書類へのアクセス
    match /documents/{documentId} {
      function hasAccessToBuilding(buildingId) {
        let building = get(/databases/$(database)/documents/buildings/$(buildingId)).data;
        return building.administrators.hasAny([request.auth.uid]) ||
               building.members.hasAny([request.auth.uid]);
      }

      allow read: if request.auth.uid != null && hasAccessToBuilding(resource.data.building);
      allow write: if request.auth.uid != null &&
                    get(/databases/$(database)/documents/buildings/$(resource.data.building)).data
                    .administrators.hasAny([request.auth.uid]);
    }

    // アプリ設定は管理者のみ
    match /settings/{settingId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null &&
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## ストレージ構造

Firebase Storage は以下の構造でファイルを保存します：

```
storage/
├── documents/                     # 書類ファイル
│   ├── {buildingId}/              # マンション別
│   │   └── {documentId}/          # 書類ID別
│   │       ├── original.pdf       # 元ファイル
│   │       └── preview.jpg        # プレビュー画像
│   │
│   └── ocr/                       # OCR処理後テキスト
│       └── {documentId}.json      # OCR結果
│
└── buildings/                     # マンション関連ファイル
    └── {buildingId}/              # マンション別
        └── profile.jpg            # マンション画像
```

## データアクセスパターン

アプリケーションの主要なデータアクセスパターンは以下の通りです：

1. **書類検索と閲覧**:

   - マンション選択 → 書類タイプ/タグでフィルタ → 時系列で表示
   - キーワード検索 → 全文検索結果を表示

2. **アクセス権管理**:

   - ユーザー情報を取得 → マンションごとのアクセス権を確認
   - マンション情報を取得 → 管理者/メンバーリストを取得

3. **AI 機能のデータ利用**:
   - 特定書類のコンテンツ取得 → AI 処理のためのコンテキスト構築
   - 複数書類の横断検索 → 関連情報の抽出

## キャッシュ戦略

パフォーマンス向上のためのキャッシュ戦略：

1. **クライアントサイドキャッシング**:

   - Firebase クライアントのオフラインキャッシュを活用
   - 頻繁にアクセスされる書類のローカルストレージキャッシュ

2. **サーバーサイドキャッシング**:
   - AI 応答のキャッシュ
   - 複雑なクエリ結果のキャッシュ

## データ移行と拡張

将来的なデータ構造の拡張と移行計画：

1. **スキーマバージョニング**:

   - ドキュメントに `schemaVersion` フィールドを追加
   - バージョン間の移行スクリプトを用意

2. **バックアップと復元**:
   - Firebase エクスポート機能による定期バックアップ
   - JSON フォーマットでのエクスポート/インポート機能

## まとめ

この設計はアプリケーションの現在の要件に基づいています。実際の運用をしながら、パフォーマンス要件やユースケースの変更に応じて適宜調整していく必要があります。特に以下の点に注意してください：

- ドキュメントサイズの制限（Firestore は 1MB まで）
- 大量のデータに対するクエリパフォーマンス
- セキュリティルールの厳密性と柔軟性のバランス

## 今後の検討事項

1. **分析データの保存**:

   - 利用統計や分析データのための別コレクションの導入

2. **監査ログ**:

   - 重要な操作（書類アップロード、権限変更など）の記録

3. **通知システム**:
   - ユーザーへの通知を管理するコレクションの設計
