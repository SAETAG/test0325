import { NextRequest, NextResponse } from "next/server";
import { getAllDocuments } from "@/lib/data/documents";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // データソース設定をクッキーから取得（クライアントのローカルストレージは参照できないため）
    const cookieStore = await cookies(); // 修正: awaitを追加し、ネストされたawaitを削除
    const dataSource =
      (cookieStore.get("dataSource")?.value as "firebase" | "mock") ||
      "firebase";

    // 統一インターフェースでデータを取得
    const documents = await getAllDocuments(dataSource);

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    return NextResponse.json(
      { error: "ドキュメント取得に失敗しました" },
      { status: 500 }
    );
  }
}
