// @ts-check
const { clientSchema } = require('./schema')

// クライアント側で使う環境変数を定義
const clientEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// クライアント側で使う環境変数を検証
const _clientEnv = clientSchema.safeParse(clientEnv)

// 検証に失敗した場合の処理
if (!_clientEnv.success) {
    console.error(
        '❌ 公開環境変数が無効です:',
        JSON.stringify(_clientEnv.error.format(), null, 4)
    )

    // 開発環境では警告のみ表示
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ 開発環境では環境変数の検証に失敗しましたが、アプリケーションは継続して動作します');
        module.exports.clientEnv = clientEnv;
    } else {
        // 本番環境ではエラーをスロー
        throw new Error('公開環境変数の検証に失敗しました');
    }
} else {
    // 検証済みの値をエクスポート
    module.exports.clientEnv = _clientEnv.data;
}

// `NEXT_PUBLIC_` で始まらない環境変数名がある場合はエラーをログに出力するだけ
for (let key of Object.keys(_clientEnv.success ? _clientEnv.data : {})) {
    if (!key.startsWith('NEXT_PUBLIC_')) {
        console.error(
            `❌ 公開環境変数名が無効です: ${key}。'NEXT_PUBLIC_' で始まる必要があります`
        )
    }
}