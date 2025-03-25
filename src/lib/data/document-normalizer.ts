import { Document } from "@/types/document";

/**
 * ドキュメントデータを統一形式に変換する共通関数
 * @param doc 処理対象のドキュメント
 * @returns 統一形式のドキュメント
 */
export function normalizeDocument(doc: any): Document {
  return {
    ...doc,
    id: doc.id.toString(),
    relatedDocuments: Array.isArray(doc.relatedDocuments)
      ? doc.relatedDocuments.map((relatedDoc: any) => ({
          id: relatedDoc.id?.toString() || "",
          title: relatedDoc.title || "",
        }))
      : [],
  } as Document;
}
