// @ts-check
require('dotenv').config()
const { clientEnv } = require('./client.js')
const { serverSchema } = require("./schema")

// サーバー側で使う環境変数を検証
const _serverEnv = serverSchema.safeParse(process.env);

// 検証に失敗した場合の処理
if (!_serverEnv.success) {
    console.error(
        '❌ サーバー環境変数が無効です:',
        JSON.stringify(_serverEnv.error.format(), null, 4)
    );

    // 開発環境では警告のみ表示
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ 開発環境では環境変数の検証をスキップします');
        module.exports.serverEnv = { ...process.env, ...clientEnv };
    } else {
        // 本番環境ではエラーで終了（サーバーサイドのみ）
        console.error('❌ 本番環境では環境変数の検証に失敗したため、アプリケーションを終了します');
        if (typeof window === 'undefined') {
            process.exit(1);
        } else {
            // ブラウザ環境ではエラーメッセージのみ表示
            console.error('⚠️ ブラウザ環境では環境変数の検証に失敗しました');
            module.exports.serverEnv = { ...process.env, ...clientEnv };
        }
    }
} else {
    // クライアント側用に定義した値も使用できるようマージしてエクスポート
    module.exports.serverEnv = { ..._serverEnv.data, ...clientEnv };
}