"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BuildingList } from "@/components/building-list"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { SearchBar } from "@/components/search-bar"

/**
 * 管理者ページコンポーネント
 * 
 * このコンポーネントは管理者向け機能を提供します。
 * マンション管理、ユーザー管理、システム設定、操作ログなどの
 * 管理者機能を集約しています。
 */
export default function AdminPage() {
    // 現在表示中のビューを管理するステート
    const [currentView, setCurrentView] = useState<
        "index" | "buildings" | "users" | "system" | "logs"
    >("index")

    return (
        <div className="flex min-h-screen flex-col">
            {/* ヘッダー部分 - 常に画面上部に固定表示 */}
            <header className="sticky top-0 z-10 border-b bg-background">
                <div className="flex h-16 items-center px-4 sm:px-6">
                    <h1
                        className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setCurrentView("index")}
                    >
                        管理ページ
                    </h1>
                    {/* 右側のナビゲーション - 検索バーとユーザーメニュー */}
                    <div className="ml-auto flex items-center space-x-4">
                        <SearchBar onSearch={() => { }} />
                        <UserNav />
                    </div>
                </div>
            </header>

            {/* メインコンテンツエリア */}
            <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
                {/* トップページ表示時のコンテンツ */}
                {currentView === "index" ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5 text-primary"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            </svg>
                            <h2 className="text-2xl font-bold tracking-tight">管理者用設定</h2>
                        </div>

                        {/* 管理者用カードグリッド */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* マンション管理カード */}
                            <Card
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setCurrentView("buildings")}
                            >
                                <CardContent className="p-4 flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-primary"
                                        >
                                            <path d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
                                            <path d="M9 2v18" />
                                            <path d="M14 8h.01" />
                                            <path d="M14 12h.01" />
                                            <path d="M14 16h.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">マンション管理</h3>
                                        <p className="text-sm text-muted-foreground">マンション情報の設定</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ユーザー管理カード */}
                            <Card
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setCurrentView("users")}
                            >
                                <CardContent className="p-4 flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-primary"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">ユーザー管理</h3>
                                        <p className="text-sm text-muted-foreground">アクセス権限の設定</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* システム設定カード */}
                            <Card
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setCurrentView("system")}
                            >
                                <CardContent className="p-4 flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-primary"
                                        >
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">システム設定</h3>
                                        <p className="text-sm text-muted-foreground">システム全体の設定</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 操作ログカード */}
                            <Card
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setCurrentView("logs")}
                            >
                                <CardContent className="p-4 flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2 rounded">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 text-primary"
                                        >
                                            <path d="M12 2v8" />
                                            <path d="m4.93 10.93 1.41 1.41" />
                                            <path d="M2 18h2" />
                                            <path d="M20 18h2" />
                                            <path d="m19.07 10.93-1.41 1.41" />
                                            <path d="M22 22H2" />
                                            <path d="m16 6-4 4-4-4" />
                                            <path d="M16 18a4 4 0 0 0-8 0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">操作ログ</h3>
                                        <p className="text-sm text-muted-foreground">システム利用履歴</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 戻るボタンとページタイトル */}
                        <div className="flex items-center">
                            <Button variant="ghost" className="mr-2" onClick={() => setCurrentView("index")}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 mr-2"
                                >
                                    <path d="m12 19-7-7 7-7" />
                                    <path d="M19 12H5" />
                                </svg>
                                戻る
                            </Button>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {currentView === "buildings" && "マンション管理"}
                                {currentView === "users" && "ユーザー管理"}
                                {currentView === "system" && "システム設定"}
                                {currentView === "logs" && "操作ログ"}
                            </h2>
                        </div>

                        {/* マンション一覧ビュー */}
                        {currentView === "buildings" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>マンション一覧</CardTitle>
                                    <CardDescription>登録されているマンションの一覧と書類数を表示します</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BuildingList />
                                </CardContent>
                            </Card>
                        )}

                        {/* ユーザー管理ビュー */}
                        {currentView === "users" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>ユーザー管理</CardTitle>
                                    <CardDescription>システムユーザーのアクセス権限を管理します</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-6 text-muted-foreground">
                                        <p>ユーザー管理機能は準備中です</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* システム設定ビュー */}
                        {currentView === "system" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>システム設定</CardTitle>
                                    <CardDescription>システム全体の設定を管理します</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-6 text-muted-foreground">
                                        <p>システム設定機能は準備中です</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* 操作ログビュー */}
                        {currentView === "logs" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>操作ログ</CardTitle>
                                    <CardDescription>システムの利用履歴を確認します</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-6 text-muted-foreground">
                                        <p>操作ログ機能は準備中です</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
