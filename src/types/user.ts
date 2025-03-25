import { User as FirebaseUser } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "manager" | "user";
export type BuildingAccessLevel = "admin" | "member" | "none";
export type ThemePreference = "light" | "dark" | "system";

// Firestoreに保存する拡張ユーザー情報
export interface AppUserData {
  uid: string; // Firebase AuthのユーザーIDと一致
  displayName: string; // 表示名
  email: string; // メールアドレス
  photoURL?: string; // プロフィール画像URL
  initials: string; // イニシャル
  role: UserRole; // システム全体での役割
  buildingAccess: {
    // マンションごとのアクセス権限
    [buildingId: string]: BuildingAccessLevel;
  };
  preferences: {
    // ユーザー設定
    theme: ThemePreference;
    notifications: boolean;
    // その他の設定
  };
  lastLogin: Timestamp; // 最終ログイン日時
  createdAt: Timestamp; // アカウント作成日時
}

// Firebase AuthのユーザーとFirestoreのデータを組み合わせた完全なユーザー情報
export interface AppUser extends FirebaseUser {
  appUserData?: AppUserData | null;
}

// Firebase UserからAppUserDataを作成するユーティリティ関数
export function createAppUserDataFromFirebaseUser(
  firebaseUser: FirebaseUser,
  additionalData?: Partial<AppUserData>
): AppUserData {
  // デフォルト値とユーザー情報を組み合わせる
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || "ゲスト",
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || undefined,
    initials: getInitials(firebaseUser.displayName || "ゲスト"),
    role: "user", // デフォルトは一般ユーザー
    buildingAccess: {},
    preferences: {
      theme: "system",
      notifications: true,
    },
    lastLogin: Timestamp.now(),
    createdAt: Timestamp.now(),
    ...additionalData,
  };
}

// 名前からイニシャルを生成するヘルパー関数
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .substring(0, 2);
}
