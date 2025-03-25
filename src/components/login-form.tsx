"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * ログインフォームコンポーネント
 * 
 * このコンポーネントは、ユーザーがメールアドレスとパスワードを入力し、
 * システムにログインするためのフォームを提供します。
 * Googleログインの選択肢も提供しています。
 */
export function LoginForm() {
    // メールアドレスとパスワードの入力状態を管理
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // エラーメッセージと読み込み状態の管理
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 認証関連の関数とルーターの取得
    const { login, loginWithGoogle } = useAuth() || { login: null, loginWithGoogle: null };
    const router = useRouter();

    /**
     * 通常のログイン処理を行う関数
     * メールアドレスとパスワードを使用して認証を行う
     * @param {React.FormEvent} e - フォーム送信イベント
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // フォームのデフォルト送信を防止

        try {
            setError(''); // エラーメッセージをリセット
            setLoading(true); // ローディング状態を開始

            // login関数が存在する場合のみ実行
            if (login) {
                await login(email, password); // 認証処理を実行
                router.push('/'); // 成功時はトップページへリダイレクト
            } else {
                throw new Error('認証機能が初期化されていません');
            }
        } catch (err) {
            // エラーが発生した場合はユーザーに通知
            setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
            console.error(err);
        } finally {
            setLoading(false); // ローディング状態を終了
        }
    }

    /**
     * Googleアカウントでのログイン処理を行う関数
     * Googleの認証ポップアップを表示し、認証を行う
     */
    async function handleGoogleLogin() {
        try {
            setError(''); // エラーメッセージをリセット
            setLoading(true); // ローディング状態を開始

            // loginWithGoogle関数が存在する場合のみ実行
            if (loginWithGoogle) {
                await loginWithGoogle(); // Google認証を実行
                router.push('/'); // 成功時はトップページへリダイレクト
            } else {
                throw new Error('Google認証機能が初期化されていません');
            }
        } catch (err) {
            // エラーが発生した場合はユーザーに通知
            setError('Googleログインに失敗しました。再度お試しください。');
            console.error(err);
        } finally {
            setLoading(false); // ローディング状態を終了
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            {/* カードヘッダー：タイトルと説明 */}
            <CardHeader>
                <CardTitle>ログイン</CardTitle>
                <CardDescription>アカウント情報を入力してログインしてください</CardDescription>
            </CardHeader>

            {/* カードコンテンツ：ログインフォーム */}
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* エラーメッセージ表示エリア */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* メールアドレス入力欄 */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">メールアドレス</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* パスワード入力欄 */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">パスワード</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* ログインボタン */}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </Button>
                </form>
            </CardContent>

            {/* カードフッター：別の認証方法と新規登録リンク */}
            <CardFooter className="flex flex-col gap-4">
                {/* 区切り線 */}
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">または</span>
                    </div>
                </div>

                {/* Googleログインボタン */}
                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                        <path
                            d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.203-2.707-6.735-2.707-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.087z"
                            fill="currentColor"
                        />
                    </svg>
                    Googleでログイン
                </Button>

                {/* 新規登録ページへのリンク */}
                <p className="text-center text-sm text-muted-foreground mt-2">
                    アカウントをお持ちでないですか？{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                        新規登録
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
