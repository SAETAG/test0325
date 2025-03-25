"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

/**
 * サインアップフォームコンポーネント
 * 
 * 新規ユーザーがアカウント登録するためのフォームを提供します。
 * メールアドレス/パスワードによる登録とGoogleアカウントによる登録の2種類に対応しています。
 */
export function SignupForm() {
    // フォーム入力の状態管理
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    // エラーメッセージと処理中の状態管理
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 認証コンテキストとルーターの取得
    const auth = useAuth();
    const signup = auth?.signup;
    const loginWithGoogle = auth?.loginWithGoogle;
    const router = useRouter();

    /**
     * 新規アカウント登録処理を行う関数
     * メールアドレスとパスワードを使用してアカウントを作成します
     * 
     * @param {React.FormEvent} e - フォーム送信イベント
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // パスワードの一致チェック
        if (password !== passwordConfirm) {
            return setError('パスワードが一致しません');
        }

        try {
            setError('');
            setLoading(true);

            // signup関数が存在する場合のみ実行
            if (signup) {
                await signup(email, password);
                setSuccess(true);

                // 2秒後にトップページへリダイレクト
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                throw new Error('認証機能が初期化されていません');
            }
        } catch (err: any) {
            // メールアドレス重複エラーの場合
            if (err.code === 'auth/email-already-in-use') {
                setError('このメールアドレスは既に使用されています。');
            } else {
                setError('アカウント作成に失敗しました。再度お試しください。');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Googleアカウントでのサインアップ/ログイン処理
     * Googleの認証ポップアップを表示し、認証を行います
     */
    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);

            // loginWithGoogle関数が存在する場合のみ実行
            if (loginWithGoogle) {
                await loginWithGoogle();
                router.push('/');
            } else {
                throw new Error('Google認証機能が初期化されていません');
            }
        } catch (err: any) {
            setError('Googleログインに失敗しました。再度お試しください。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            {/* カードヘッダー：タイトルと説明 */}
            <CardHeader>
                <CardTitle>新規アカウント登録</CardTitle>
                <CardDescription>アカウントを作成して書類管理システムを利用開始しましょう</CardDescription>
            </CardHeader>

            {/* カードコンテンツ：登録フォーム */}
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* エラーメッセージと成功メッセージの表示エリア */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">アカウントが作成されました！</p>}

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
                        <p className="text-xs text-muted-foreground">6文字以上で入力してください</p>
                    </div>

                    {/* パスワード確認入力欄 */}
                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">パスワード（確認）</label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>

                    {/* アカウント作成ボタン */}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? '登録中...' : 'アカウント作成'}
                    </Button>
                </form>
            </CardContent>

            {/* カードフッター：別の認証方法とログインリンク */}
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

                {/* Google認証ボタン */}
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
                    Googleで登録
                </Button>

                {/* ログインページへのリンク */}
                <p className="text-center text-sm text-muted-foreground mt-2">
                    既にアカウントをお持ちですか？{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        ログイン
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
