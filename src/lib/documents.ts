import { db, storage } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Document } from "../types";

/**
 * ドキュメントのアップロード処理
 */
export const uploadDocument = async (
  file: File,
  metadata: Partial<Document>,
  mansionId: string
): Promise<Document> => {
  try {
    // Storageにファイルをアップロード
    const storageRef = ref(storage, `documents/${mansionId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    // Firestoreにメタデータを保存
    const docRef = await addDoc(collection(db, "documents"), {
      ...metadata,
      storageUrl: downloadUrl,
      mansionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: docRef.id,
      ...metadata,
      storageUrl: downloadUrl,
      mansionId,
    } as Document;
  } catch (error) {
    console.error("ドキュメントのアップロードに失敗しました:", error);
    throw error;
  }
};
