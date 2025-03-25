/**
 * ドキュメントの基本情報を定義
 */
export interface Document {
  id: string;
  title: string;
  documentType: string;
  tags: string[];
  metadata: {
    pageCount: number;
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
    lastAccessedAt: Date;
    accessFrequency: "daily" | "monthly" | "yearly" | "rare";
  };
  mansionId: string;
  storageUrl: string;
  ocrText: string;
}

/**
 * マンション情報の定義
 */
export interface Mansion {
  id: string;
  name: string;
  users: {
    userId: string;
    role: "admin" | "user";
  }[];
}
