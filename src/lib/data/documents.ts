import { Document, RelatedDocument } from "@/types/document";
import { documentsData } from "@/lib/document-data";
import {
  getAllDocuments as getFirebaseDocuments,
  getDocumentById as getFirebaseDocumentById,
} from "@/lib/firebase/documents";
import { normalizeDocument } from "./document-normalizer";

/**
 * 設定されたデータソースに応じて全ドキュメントを取得
 * @param dataSource データソース設定（'firebase' または 'mock'）
 */
export async function getAllDocuments(
  dataSource: "firebase" | "mock"
): Promise<Document[]> {
  if (dataSource === "firebase") {
    try {
      // Firebase からデータ取得し、型変換
      const firebaseDocuments = await getFirebaseDocuments();

      // データが空かチェック
      if (!firebaseDocuments || firebaseDocuments.length === 0) {
        console.log(
          "WARNING: Firebaseから取得したデータが空です。代わりにモックデータを使用します。"
        );
        return documentsData.map(normalizeDocument);
      }

      return firebaseDocuments.map(normalizeDocument);
    } catch (error) {
      console.error("Firebaseからのデータ取得に失敗:", error);
      console.log(
        "WARNING: Firebaseからのデータ取得に失敗したため、モックデータを使用します。"
      );
      return documentsData.map(normalizeDocument);
    }
  } else {
    // モックデータ使用の場合、明示的にログ出力
    console.log("INFO: データソース設定に基づき、モックデータを使用します。");
    return documentsData.map(normalizeDocument);
  }
}

/**
 * 設定されたデータソースに応じて特定のドキュメントを取得
 * @param id ドキュメントID
 * @param dataSource データソース設定
 * @returns ドキュメント情報
 */
export async function getDocumentById(
  id: string,
  dataSource: "firebase" | "mock"
): Promise<Document | null> {
  // Firebase データソースの場合
  if (dataSource === "firebase") {
    try {
      const firebaseDocument = await getFirebaseDocumentById(id);
      if (!firebaseDocument) {
        console.log(
          `WARNING: Firebaseから指定されたID(${id})のドキュメントが見つかりませんでした。代わりにモックデータを検索します。`
        );
        const numId = parseInt(id);
        const mockDoc = documentsData.find((doc) => doc.id === numId);
        return mockDoc ? normalizeDocument(mockDoc) : null;
      }
      return normalizeDocument(firebaseDocument);
    } catch (error) {
      console.error("Firebaseからのドキュメント取得に失敗:", error);
      console.log(
        "WARNING: Firebaseからのドキュメント取得に失敗したため、モックデータを使用します。"
      );
      const numId = parseInt(id);
      const mockDoc = documentsData.find((doc) => doc.id === numId);
      return mockDoc ? normalizeDocument(mockDoc) : null;
    }
    // モックデータの場合
  } else {
    console.log(`INFO: モックデータからID(${id})のドキュメントを取得します。`);
    const numId = parseInt(id);
    const doc = documentsData.find((doc) => doc.id === numId);
    return doc ? normalizeDocument(doc) : null;
  }
}
