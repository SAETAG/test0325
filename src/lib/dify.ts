// dify.ts
// Dify APIを利用してAI回答を生成するための関数を提供します。
// この関数は、Difyサービスを使用して質問に回答を生成します。

// 検証済み環境変数をインポート
const { serverEnv } = require("../../env/server");

// 環境変数からAPIキーとエンドポイントを取得
const apiKey = serverEnv.DIFY_API_KEY; // 検証済み環境変数からDify APIキーを取得
const apiEndpoint = serverEnv.DIFY_API_ENDPOINT; // 検証済み環境変数からDify APIエンドポイントのURLを取得

/**
 * Difyのチャットコンプリーションエンドポイントにリクエストを送信
 * @param question ユーザーからの質問
 * @param documentContext 関連文書のコンテキスト（オプション）
 * @param chatHistory 過去のチャット履歴（オプション）
 * @returns AIからの回答
 */
export async function askDifyBuildingManagementQuestion( // マンション管理に関する質問をDify APIに送信する関数をエクスポート
  question: string, // ユーザーからの質問テキスト
  documentContext?: string, // オプション：質問に関連する文書コンテキスト
  chatHistory?: Array<{ role: "user" | "assistant"; content: string }> // オプション：過去のチャット履歴
) {
  if (!apiKey) {
    // APIキーが設定されていない場合のエラーハンドリング
    throw new Error(
      `Dify APIキーが設定されていません。環境変数を確認してください。`
    ); // APIキーがない場合にエラーをスロー
  }

  try {
    // APIリクエスト処理のtry-catchブロック開始
    // APIリクエストの準備
    const endpoint = `${apiEndpoint}/chat-messages`; // チャットメッセージ用のエンドポイントURLを構築

    // リクエストボディの構築
    // DifyのAPIリクエスト構造に合わせて適宜調整
    const requestBody: any = {
      // APIリクエストの本体を定義
      query: question, // ユーザーの質問をクエリとして設定
      response_mode: "blocking", // 同期モードで応答を待つ設定
      conversation_id: "", // 新しい会話として扱う場合は空文字
      user: "end-user", // エンドユーザーとして識別
      inputs: {}, // 追加の入力パラメータを格納するオブジェクト
    };

    // 文書コンテキストがある場合は inputs に追加
    if (documentContext) {
      // 文書コンテキストが提供されている場合の条件分岐
      requestBody.inputs.context = documentContext; // コンテキスト情報をリクエストに追加
    }

    // チャット履歴がある場合は追加
    if (chatHistory && chatHistory.length > 0) {
      // チャット履歴が存在し、空でない場合の条件分岐
      requestBody.conversation_id = "existing-conversation-id"; // 既存の会話IDを設定（実際には動的に生成する必要がある）
    }

    // APIへのリクエスト送信
    const response = await fetch(endpoint, {
      // fetch APIを使用してDify APIにリクエストを送信
      method: "POST", // HTTPメソッドはPOST
      headers: {
        // HTTPヘッダーの設定
        "Content-Type": "application/json", // JSONコンテンツタイプを指定
        Authorization: `Bearer ${apiKey}`, // APIキーをBearerトークンとして認証ヘッダーに追加
      },
      body: JSON.stringify(requestBody), // リクエストボディをJSON文字列に変換
    });

    // レスポンスの処理
    if (!response.ok) {
      // レスポンスステータスが正常でない場合のエラーハンドリング
      const errorData = await response.json(); // エラーレスポンスのJSONを解析
      throw new Error( // エラーメッセージを生成してスロー
        `Dify API エラー: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json(); // 正常なレスポンスのJSONを解析

    // レスポンスを整形して返す
    return {
      // 構造化されたレスポンスオブジェクトを返す
      answer: data.answer || data.text, // 回答テキストを取得（APIの応答形式に応じて調整）
      sources: data.sources || [], // 情報ソースをレスポンスから抽出、ない場合は空配列
      relatedInfo: extractRelatedInfo(data), // 関連情報を抽出するヘルパー関数を呼び出し
      examples: extractExamples(data), // 他マンションの事例を抽出するヘルパー関数を呼び出し
      timestamp: new Date().toISOString(), // レスポンスのタイムスタンプを現在時刻で設定
    };
  } catch (error) {
    // エラーをキャッチ
    console.error("Dify API呼び出しエラー:", error); // エラーをコンソールに出力
    throw new Error( // ユーザーフレンドリーなエラーメッセージをスロー
      "AI回答の生成に失敗しました。しばらく経ってから再度お試しください。"
    );
  }
}

/**
 * Difyのレスポンスから関連情報を抽出
 */
function extractRelatedInfo(response: any): string {
  // APIレスポンスから関連情報を抽出するヘルパー関数
  // Difyのレスポンス構造に合わせて適宜調整
  if (response.additional_reply && response.additional_reply.related_info) {
    // 関連情報が存在するかチェック
    return response.additional_reply.related_info; // 関連情報を返す
  }
  return "関連情報はありません。"; // 関連情報がない場合のデフォルトメッセージ
}

/**
 * Difyのレスポンスから他マンションの事例を抽出
 */
function extractExamples(response: any): string {
  // APIレスポンスから事例を抽出するヘルパー関数
  // Difyのレスポンス構造に合わせて適宜調整
  if (response.additional_reply && response.additional_reply.examples) {
    // 事例情報が存在するかチェック
    return response.additional_reply.examples; // 事例情報を返す
  }
  return "類似事例はありません。"; // 事例がない場合のデフォルトメッセージ
}
