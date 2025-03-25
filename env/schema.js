// @ts-check
const { z } = require('zod')

/**
 * サーバー側で使う環境変数のスキーマを定義
 */
const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    SECRET_TOKEN: z.string().regex(/[a-zA-Z0-9]{32}/), // 32文字英数字
    DIFY_API_KEY: z.string().min(1),
    DIFY_API_ENDPOINT: z.string().url(),
})

/**
 * クライアント側で使う環境変数のスキーマを定義
 * クライアント側に公開するには、`NEXT_PUBLIC_` プレフィックスをつける
 */
const clientSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
})

/** 
 * クライアント側で使う環境変数を定義
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
const clientEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
}

// エクスポート
module.exports = {
    serverSchema,
    clientSchema,
    clientEnv,
}