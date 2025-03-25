// gemini.ts
// AI回答を生成するための関数を提供します。
// この関数は、Google Generative AI APIを使用して質問に回答を生成します。

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askBuildingManagementQuestion(
  question: string,
  documentContext?: string
) {
  // APIキーの取得と検証（サーバーサイドのみ）
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini APIキーが設定されていません。環境変数を確認してください。"
    );
  }

  try {
    // APIキーを使用してクライアントを初期化
    const genAI = new GoogleGenerativeAI(apiKey);

    // Gemini Pro モデルを使用
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // プロンプトの構築
    let prompt = `あなたはマンション管理のプロフェッショナルアシスタントです。
以下の質問に対して、マンション管理組合の役員や区分所有者向けに、
わかりやすく丁寧に回答してください。
専門用語を使用する場合は、簡単な説明を添えてください。

質問: ${question}`;

    // 文書コンテキストがある場合は追加
    if (documentContext) {
      prompt += `\n\n参考資料:\n${documentContext}`;
    }

    // 生成リクエストの実行
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API呼び出しエラー:", error);
    throw new Error(
      "AI回答の生成に失敗しました。しばらく経ってから再度お試しください。"
    );
  }
}
