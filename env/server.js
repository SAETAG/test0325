// @ts-check
require('dotenv').config()
const { clientEnv } = require('./client.js')
const { serverSchema } = require("./schema")

// ブラウザ環境かどうかを判定
const isBrowser = typeof window !== 'undefined';

// デバッグ情報を出力
console.log('🔍 環境変数のデバッグ情報:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SECRET_TOKEN:', process.env.SECRET_TOKEN ? '設定済み' : '未設定');
console.log('DIFY_API_ENDPOINT:', process.env.DIFY_API_ENDPOINT);
console.log('DIFY_API_KEY:', process.env.DIFY_API_KEY ? '設定済み' : '未設定');
console.log('利用可能な環境変数:', Object.keys(process.env));

// サーバー側で使う環境変数を検証
const _serverEnv = serverSchema.safeParse(process.env);

// 検証に失敗した場合の処理
if (!_serverEnv.success) {
    console.error(
        '❌ サーバー環境変数が無効です:',
        JSON.stringify(_serverEnv.error.format(), null, 4)
    );

    // 開発環境またはブラウザ環境では警告のみ表示
    if (process.env.NODE_ENV === 'development' || isBrowser) {
        console.warn('⚠️ 環境変数の検証に失敗しましたが、アプリケーションは継続して動作します');
        // 利用可能な環境変数のみを使用
        const availableEnv = {
            ...process.env,
            ...clientEnv,
            // 必須の環境変数が設定されていない場合はデフォルト値を設定
            NODE_ENV: process.env.NODE_ENV || 'development',
            DIFY_API_KEY: process.env.DIFY_API_KEY || '',
            DIFY_API_ENDPOINT: process.env.DIFY_API_ENDPOINT || 'https://api.dify.ai/v1'
        };
        module.exports.serverEnv = availableEnv;
    } else {
        // 本番環境（サーバーサイド）ではエラーで終了
        console.error('❌ 本番環境では環境変数の検証に失敗したため、アプリケーションを終了します');
        process.exit(1);
    }
} else {
    // クライアント側用に定義した値も使用できるようマージしてエクスポート
    module.exports.serverEnv = { ..._serverEnv.data, ...clientEnv };
}