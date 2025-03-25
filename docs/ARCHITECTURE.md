# シメスくんのアーキテクチャ設計

## 基本構成

シメスくんは、Next.js の App Router を基盤としたモダンな Web アプリケーションです。データストレージとユーザー認証には Firebase を利用しています。

## ディレクトリ構造

```
shimesukun/
├── src/
│   ├── app/ - Next.jsのApp Router関連ファイル
│   │   ├── (auth)/ - 認証関連のルート
│   │   ├── admin/ - 管理者用ルート
│   │   ├── documents/ - 書類表示・管理関連のルート
│   │   ├── page.tsx - ホームページ
│   │   └── layout.tsx - ルートレイアウト（サーバーコンポーネント）
│   ├── components/ - 再利用可能なコンポーネント
│   │   ├── ui/ - 基本的なUIコンポーネント
│   │   ├── client-layout.tsx - クライアントサイドのレイアウトラッパー
│   │   └── ... - その他のコンポーネント
│   ├── contexts/ - Reactコンテキスト
│   │   ├── AuthContext.tsx - 認証コンテキスト
│   │   └── data-source-context.tsx - データソース管理コンテキスト
│   ├── lib/ - ユーティリティ関数
│   │   ├── firebase.ts - Firebase初期化と設定
│   │   └── utils.ts - 汎用ユーティリティ関数
│   └── types/ - TypeScript型定義
├── public/ - 静的ファイル
└── docs/ - ドキュメント
```

## レイヤー構造

1. **プレゼンテーション層**: コンポーネント（`src/components`）
2. **アプリケーション層**: コンテキスト、フック（`src/contexts`, `src/app`内のロジック）
3. **データアクセス層**: Firebase サービス（`src/lib/firebase.ts`など）

## サーバーコンポーネントとクライアントコンポーネント

Next.js 13 以降の App Router では、コンポーネントは**デフォルトでサーバーコンポーネント**として扱われます。
クライアントサイドで実行する必要がある場合のみ、ファイルの先頭に`"use client";`ディレクティブを追加します。

### 重要な点

- **サーバーコンポーネント**（layout.tsx など）

  - メタデータを提供
  - SEO に関連する処理
  - 初期データの取得
  - HTML の基本構造を提供

- **クライアントコンポーネント**（ClientLayout など）
  - インタラクティブな機能
  - 状態管理（useState, useReducer）
  - イベントハンドラー
  - ライフサイクル処理（useEffect）
  - ブラウザ API の使用

### ファイルの分割パターン

シメスくんでは、レイアウトとコンテキストプロバイダーを以下のように分割しています：

1. `layout.tsx` (サーバーコンポーネント)

   - メタデータの提供
   - 基本的な HTML レイアウト

2. `client-layout.tsx` (クライアントコンポーネント)
   - ErrorBoundary
   - AuthProvider
   - DataSourceProvider
   - その他のクライアント側プロバイダー

このアプローチにより、以下のメリットがあります：

- サーバーサイドでのレンダリングが最適化される
- メタデータが検索エンジンに正しく提供される
- クライアントバンドルのサイズが小さくなる

## Firebase 統合

### 初期化プロセス

Firebase の初期化は`src/lib/firebase.ts`で行われています。以下のサービスを使用しています：

1. **Firebase Authentication**: ユーザー認証管理
2. **Firestore**: NoSQL データベース
3. **Firebase Storage**: 書類ファイルの保存

初期化はクライアントサイドでのみ行われ、SSR 時には実行されません。

```javascript
// クライアントサイドでのみ初期化
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // ...その他の初期化処理
}
```

### 開発環境のエミュレーター設定

開発環境では、Firebase Local Emulator に接続してオフラインでの開発を可能にしています：

```javascript
// 開発環境のみエミュレーターに接続
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
```

## 認証フロー

1. ユーザーがアプリにアクセス
2. `AuthProvider`が認証状態を確認
3. 未認証の場合はログインページにリダイレクト
4. 認証成功後、適切なページにリダイレクト

## エラーハンドリング

1. コンポーネントレベルのエラーは`ErrorBoundary`でキャプチャ
2. 非同期処理のエラーは try/catch でハンドリング
3. 認証エラーは専用のエラーメッセージで表示
