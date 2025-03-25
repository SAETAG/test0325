import * as admin from "firebase-admin";

// 初期化がまだ行われていない場合のみ初期化を実行
if (!admin.apps.length) {
  // サービスアカウントキーがある場合（ローカル開発環境など）
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } catch (error) {
      console.error("Firebase admin initialization error:", error);
    }
  }
  // Vercel などの環境変数を使用する場合
  else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
}

// Firestoreのエクスポート
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
