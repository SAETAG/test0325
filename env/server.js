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

    // ブラウザ環境ではクライアント環境変数のみを返す
    if (typeof window !== 'undefined') {
        module.exports.serverEnv = { ...clientEnv };
        return;
    }

    // サーバーサイドでは終了
    process.exit(1);
}

// クライアント側用に定義した値も使用できるようマージしてエクスポート
module.exports.serverEnv = { ..._serverEnv.data, ...clientEnv }