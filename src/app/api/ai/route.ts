import { NextRequest, NextResponse } from "next/server";
// import { askBuildingManagementQuestion } from "@/lib/gemini"; // 古いGemini APIを使った関数
import { askDifyBuildingManagementQuestion } from "@/lib/dify"; // 新しいDify APIを使った関数
import { getDocumentById } from "@/lib/data/documents";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { question, documentId } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "質問が指定されていません" },
        { status: 400 }
      );
    }

    let documentContext = "";

    // ドキュメントIDが指定されている場合、そのドキュメントの内容を取得
    if (documentId) {
      // データソース設定をクッキーから取得
      const cookieStore = await cookies();
      const dataSource =
        (cookieStore.get("dataSource")?.value as "firebase" | "mock") ||
        "firebase";

      const document = await getDocumentById(documentId, dataSource);
      if (document) {
        documentContext = `タイトル: ${document.title}
内容: ${document.content ?? "内容なし"} 
日付: ${document.uploadedAt}
マンション名: ${document.building}`;
      }
    }

    // Dify APIに質問を送信
    const result = await askDifyBuildingManagementQuestion(
      question,
      documentContext
    );

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      relatedInfo: result.relatedInfo,
      examples: result.examples,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error("AI処理エラー:", error);
    return NextResponse.json(
      { error: "AI回答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
