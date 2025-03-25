import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import { Document } from "@/types/document";

/**
 * Firebaseから全てのドキュメントを取得する
 * @returns ドキュメント一覧
 */
export async function getAllDocuments() {
  try {
    const docsRef = collection(db, "documents");
    const snapshot = await getDocs(docsRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // relatedDocumentsが存在しない場合でも空配列を保証
        relatedDocuments: data.relatedDocuments || [],
      };
    });
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    throw new Error("ドキュメントの取得に失敗しました");
  }
}

/**
 * 特定のドキュメントをIDで取得する
 * @param id ドキュメントID
 * @returns ドキュメント情報、存在しない場合はnull
 */
export async function getDocumentById(id: string) {
  try {
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // relatedDocumentsが存在しない場合でも空配列を保証
        relatedDocuments: data.relatedDocuments || [],
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    throw new Error("ドキュメントの取得に失敗しました");
  }
}

/**
 * 新しいドキュメントを追加する
 * @param documentData ドキュメントデータ
 * @returns 作成されたドキュメントID
 */
export async function addDocument(documentData: Partial<Document>) {
  try {
    const docData = {
      ...documentData,
      // 必ず空配列を初期化する
      relatedDocuments: documentData.relatedDocuments || [],
      uploadedAt: documentData.uploadedAt || new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "documents"), docData);
    return docRef.id;
  } catch (error) {
    console.error("ドキュメント追加エラー:", error);
    throw new Error("ドキュメントの追加に失敗しました");
  }
}

/**
 * ドキュメントを更新する
 * @param id ドキュメントID
 * @param documentData 更新データ
 */
export async function updateDocument(
  id: string,
  documentData: Partial<Document>
) {
  try {
    // relatedDocumentsがundefinedの場合、空配列を設定
    if (documentData.relatedDocuments === undefined) {
      documentData.relatedDocuments = [];
    }

    const docRef = doc(db, "documents", id);
    await updateDoc(docRef, documentData);
    return true;
  } catch (error) {
    console.error("ドキュメント更新エラー:", error);
    throw new Error("ドキュメントの更新に失敗しました");
  }
}
