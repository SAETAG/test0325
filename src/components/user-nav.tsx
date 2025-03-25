"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext';
// 型のインポートを修正
import { AppUser, AppUserData, UserRole } from '@/types/user';

/**
 * ユーザーナビゲーションコンポーネント
 * 
 * ヘッダー部分に表示されるユーザーのプロフィールアイコンと
 * それをクリックした際に表示されるドロップダウンメニューを提供します。
 * ユーザー情報の表示やログアウト機能を含みます。
 */
export function UserNav() {
  // 認証コンテキストからユーザー情報とログアウト関数を取得
  const { currentUser, logout } = useAuth();

  /**
   * ログアウト処理を行うハンドラ関数
   * ユーザーがログアウトボタンをクリックしたときに実行されます
   */
  const handleLogout = async () => {
    try {
      await logout(); // Firebase認証でのログアウト処理
      // ログアウト成功（リダイレクトはAuthProviderで処理）
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  // 管理者権限のチェックヘルパー関数 - 型をAppUserに修正
  const isAdmin = currentUser && (currentUser as AppUser).appUserData?.role === 'admin';

  return (
    <DropdownMenu>
      {/* ユーザーアイコンのトリガー部分 */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* ユーザーのプロフィール画像（設定されている場合） */}
            <AvatarImage src={currentUser?.photoURL || ""} alt={currentUser?.displayName || "ユーザー"} />
            {/* プロフィール画像がない場合のフォールバック（イニシャル表示） */}
            <AvatarFallback>{currentUser?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* ドロップダウンメニューの内容 */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* ユーザー情報部分 */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {/* ユーザー名（または代替テキスト） */}
            <p className="text-sm font-medium leading-none">{currentUser?.displayName || "ユーザー"}</p>
            {/* ユーザーのメールアドレス */}
            <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        {/* 管理者用設定 - ここを修正 */}
        {isAdmin && (
          <DropdownMenuItem onClick={() => window.location.href = "/admin"}>
            管理者ページ
          </DropdownMenuItem>
        )}

        {/* 区切り線 */}

        <DropdownMenuSeparator />

        {/* ログアウトメニュー項目 */}
        <DropdownMenuItem onClick={handleLogout}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

