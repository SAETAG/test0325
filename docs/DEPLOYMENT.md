# シメスくんのデプロイ手順

このドキュメントでは、シメスくんアプリケーションを Vercel にデプロイする方法について説明します。

## 前提条件

- [Vercel アカウント](https://vercel.com/signup)
- [GitHub アカウント](https://github.com/join)
- [Firebase プロジェクト](https://console.firebase.google.com/)
- [Dify アカウント](https://dify.ai/) - AI 質問応答機能に使用

## Firebase 設定

### 必要な環境変数

以下の環境変数を`.env.local`ファイルに設定する必要があります：

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Firebase Local Emulator のセットアップ

開発環境では、Firebase Local Emulator を使用することをお勧めします：

1. Firebase CLI をインストール

   ```bash
   npm install -g firebase-tools
   ```

2. エミュレーターを起動

   ```bash
   firebase emulators:start
   ```

3. エミュレーターのデフォルトポート
   - Authentication: 9099
   - Firestore: 8080
   - Storage: 9199

## デプロイ手順

### 1. 環境変数の準備

Firebase プロジェクトの設定から必要な情報を取得し、以下の環境変数を準備します。

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxxxxxxxxx:web:xxxxxxxxxxxx

# Dify API関連の環境変数
DIFY_API_KEY=your-dify-api-key
DIFY_API_ENDPOINT=https://api.dify.ai/v1 # または自己ホスティングのエンドポイント
```

### 2. Vercel でのデプロイ

1. [Vercel Dashboard](https://vercel.com/dashboard)にログインします
2. 「New Project」をクリックします
3. GitHub からリポジトリをインポートします
4. 「Environment Variables」セクションで、上記の環境変数を追加します
5. 「Deploy」ボタンをクリックしてデプロイを開始します

### 3. デプロイ後の設定

1. **Firebase 認証の設定**:

   - Firebase Console で「Authentication」→「Sign-in method」を開きます
   - 「承認済みドメイン」に Vercel のドメイン（例: `your-app.vercel.app`）を追加します

2. **Firebase セキュリティルールの確認**:
   - Firestore、Storage のセキュリティルールが適切に設定されていることを確認します

### 4. Dify の設定

1. **Dify アカウントの作成**:

   - [Dify.ai](https://dify.ai/) にアクセスしてアカウントを作成します
   - または Dify を自己ホスティングする場合は、[GitHub リポジトリ](https://github.com/langgenius/dify) の手順に従ってインストールします

2. **アプリケーションの作成**:

   - Dify ダッシュボードで「Create Application」をクリックします
   - アプリケーションタイプとして「Completion App」または「Chat App」を選択します
   - マンション管理に関連するプロンプトテンプレートを設定します

3. **API キーの取得**:

   - 作成したアプリケーションの Settings ページから「API Reference」を開きます
   - 「API Key」タブで API キーをコピーし、環境変数 `DIFY_API_KEY` に設定します

4. **ナレッジベースの作成 (オプション)**:
   - 「Knowledge Base」タブで新しいナレッジベースを作成します
   - マンション管理に関連する文書をアップロードして、AI が参照できるようにします

## 一般的な問題と解決策

### 環境変数関連のエラー

**症状**: 「Firebase is not initialized」などのエラーが表示される

**解決策**:

- Vercel のプロジェクト設定で環境変数が正しく設定されているか確認します
- 特に`NEXT_PUBLIC_`プレフィックスが付いているか確認します

### 認証エラー

**症状**: ログインは成功するが、すぐにログイン画面にリダイレクトされる

**解決策**:

- Firebase Console で Vercel ドメインが承認済みドメインに追加されているか確認します
- ブラウザの Cookie とローカルストレージをクリアしてみます

### React/Next.js に関するエラー

**症状**: ビルドエラーが発生する

**解決策**:

1. クライアントコンポーネントとサーバーコンポーネントの混在を確認します

   - サーバーコンポーネント(`layout.tsx`)からメタデータのみをエクスポート
   - クライアント機能は別ファイル(`client-layout.tsx`)に分離

2. React Hooks のルール違反を確認します
   - Hooks は常にコンポーネントのトップレベルで呼び出す
   - 条件付きでフックを呼び出さない

### Dify API 関連のエラー

**症状**: 「Failed to fetch data from Dify API」などのエラーが表示される

**解決策**:

- Dify API キーが正しく設定されているか確認します
- API エンドポイントが正しいか確認します
- Dify のダッシュボードでアプリケーションのステータスを確認します
- ネットワークタブでリクエスト/レスポンスを調査します

## 継続的デプロイ

GitHub リポジトリと Vercel を連携することで、main ブランチへのプッシュごとに自動的にデプロイが実行されます。
