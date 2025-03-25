"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentUploader } from "@/components/document-uploader"
import { DocumentList } from "@/components/document-list"
import { BuildingList } from "@/components/building-list"
import { StatsCards } from "@/components/stats-cards"
import { SearchBar } from "@/components/search-bar"
import { UserNav } from "@/components/user-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { askDifyBuildingManagementQuestion } from "@/lib/dify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

/**
 * ダッシュボードページコンポーネント
 * 
 * このコンポーネントはアプリケーションのメイン画面として機能し、
 * 書類一覧、アップロード、検索、AI質問応答、管理機能などの
 * 様々なビューを切り替えて表示します。
 */
export default function DashboardPage() {
  // 検索クエリの状態を管理
  const [searchQuery, setSearchQuery] = useState("")

  // 現在表示中のビューを管理するステート
  // "index": トップページ、"documents": 書類一覧、"upload": アップロード画面など
  const [currentView, setCurrentView] = useState<
    "index" | "documents" | "upload" | "buildings" | "qa" | "users" | "system" | "logs"
  >("index")

  // AI質問応答機能のための状態管理
  const [question, setQuestion] = useState("") // ユーザーの質問文
  const [aiResponse, setAiResponse] = useState<{
    answer: string       // AIの回答
    sources: string      // 回答の根拠となる書類情報
    relatedInfo: string  // 関連情報
    examples: string     // 他マンションの事例
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false) // 読み込み状態
  const [error, setError] = useState<string | null>(null);

  /**
   * AIに質問する処理
   * 
   * ユーザーの質問をDify APIに送信し、回答を取得します。
   * 処理中はローディング状態を表示し、エラーが発生した場合は
   * エラーメッセージをアラートで表示します。
   * 
   */
  const handleAskQuestion = async () => {
    // 質問が空の場合は何もしない
    if (!question.trim()) return;

    // 読み込み中状態に設定
    setIsLoading(true);
    setAiResponse(null); // 既存の回答をクリア

    try {
      // Dify APIを呼び出して回答を取得
      const response = await askDifyBuildingManagementQuestion(question);

      // 回答をステートに設定
      setAiResponse({
        answer: response.answer,
        sources: Array.isArray(response.sources)
          ? response.sources.join(', ')
          : response.sources.toString(),
        relatedInfo: response.relatedInfo,
        examples: response.examples
      });
    } catch (error) {
      console.error("AIリクエストエラー:", error);
      setError((error as Error).message);
    } finally {
      // 読み込み状態を解除
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ヘッダー部分 - 常に画面上部に固定表示 */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <h1
            className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
            onClick={() => setCurrentView("index")}
          >
            書類管理システム
          </h1>
          {/* 右側のナビゲーション - 検索バーとユーザーメニュー */}
          <div className="ml-auto flex items-center space-x-4">
            <SearchBar onSearch={setSearchQuery} />
            <UserNav />
          </div>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      {/* <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8"></main> */}
      {/* 統計カード - ドキュメント数やストレージ使用量などの概要 */}
      <StatsCards />

      {/* トップページ表示時のコンテンツ */}
      {currentView === "index" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">何をしますか？</h2>

          {/* 主要機能のカードグリッド - 3つのカードに */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 書類一覧カード */}
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setCurrentView("documents")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
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
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">書類を探す</h3>
                  <p className="text-muted-foreground mt-2">アップロードされた書類を検索・閲覧します</p>
                </div>
              </CardContent>
            </Card>

            {/* 書類アップロードカード */}
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setCurrentView("upload")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
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
                    className="h-8 w-8 text-primary"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">書類をアップロード</h3>
                  <p className="text-muted-foreground mt-2">新しい書類をシステムに登録します</p>
                </div>
              </CardContent>
            </Card>

            {/* AI質問カード */}
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setCurrentView("qa")}>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
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
                    className="h-8 w-8 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">AIに質問する</h3>
                  <p className="text-muted-foreground mt-2">書類の内容についてAIに質問します</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // インデックス以外のビュー表示時のコンテンツ
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
              {/* 現在のビューに応じたタイトル表示 */}
              {currentView === "documents" && "書類一覧"}
              {currentView === "upload" && "書類アップロード"}
              {currentView === "buildings" && "マンション管理"}
              {currentView === "qa" && "AI質問応答"}
              {currentView === "users" && "ユーザー管理"}
              {currentView === "system" && "システム設定"}
              {currentView === "logs" && "操作ログ"}
            </h2>
          </div>

          {/* 書類一覧ビュー */}
          {currentView === "documents" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>書類検索</CardTitle>
                  <CardDescription>タイトルやOCRで抽出されたテキストから書類を検索できます</CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <div className="overflow-x-auto">
                    {/* 書類一覧コンポーネント表示 */}
                    <DocumentList searchQuery={searchQuery} />
                  </div>
                  <div className="p-4 sm:hidden">
                    <Button variant="outline" className="w-full text-center" onClick={() => { }}>
                      もっと見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 書類アップロードビュー */}
          {currentView === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle>書類アップロード</CardTitle>
                <CardDescription>PDF、JPG、PNG形式の書類をアップロードできます（最大10MB）</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 書類アップローダーコンポーネント */}
                <DocumentUploader />
              </CardContent>
            </Card>
          )}

          {/* マンション一覧ビュー */}
          {currentView === "buildings" && (
            <Card>
              <CardHeader>
                <CardTitle>マンション一覧</CardTitle>
                <CardDescription>登録されているマンションの一覧と書類数を表示します</CardDescription>
              </CardHeader>
              <CardContent>
                {/* マンション一覧コンポーネント */}
                <BuildingList />
              </CardContent>
            </Card>
          )}

          {/* AI質問応答ビュー */}
          {currentView === "qa" && (
            <Card>
              <CardHeader>
                <CardTitle>AI質問応答</CardTitle>
                <CardDescription>アップロードされた書類に基づいて質問に回答します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 質問入力フォーム */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="例: 大規模修繕の見積もりはいくらですか？"
                      className="flex-1"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        // Enterキーで質問を送信（Shift+Enterは改行）
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleAskQuestion()
                        }
                      }}
                    />
                    {/* 質問送信ボタン */}
                    <Button onClick={handleAskQuestion} disabled={isLoading || !question.trim()}>
                      {isLoading ? (
                        <>
                          <span className="animate-pulse mr-2">...</span>
                          処理中
                        </>
                      ) : (
                        "質問する"
                      )}
                    </Button>
                  </div>

                  {/* AIからの回答表示エリア */}
                  <div className="rounded-lg border p-4 space-y-4">
                    {/* 回答セクション */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">回答</h3>
                      <div className="p-3 bg-muted rounded-md">
                        {/* ローディング表示 */}
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse h-3 w-3 rounded-full bg-primary"></div>
                            <div className="animate-pulse h-3 w-3 rounded-full bg-primary"></div>
                            <div className="animate-pulse h-3 w-3 rounded-full bg-primary"></div>
                            <p className="text-sm text-muted-foreground">AIが回答を生成しています...</p>
                          </div>
                        ) : aiResponse ? (
                          // AI回答の表示
                          <p>{aiResponse.answer}</p>
                        ) : !isLoading && (
                          // 初期状態の説明
                          <p>質問を入力すると、AIがアップロードされた書類から回答を生成します。</p>
                        )}
                      </div>
                    </div>

                    {/* エラーメッセージ表示 */}
                    {error && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* 根拠箇所セクション */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">根拠箇所</h3>
                      <div className="p-3 bg-muted rounded-md">
                        {/* 回答の根拠となる書類へのリンク表示 */}
                        {aiResponse ? (
                          <p className="text-sm">
                            参照資料:{" "}
                            {aiResponse.sources.includes("管理組合総会議事録") && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm font-medium text-blue-600 hover:underline"
                                onClick={() => {
                                  setCurrentView("documents")
                                  setTimeout(() => {
                                    window.location.href = "/documents/1"
                                  }, 100)
                                }}
                              >
                                「管理組合総会議事録」
                              </Button>
                            )}
                            {aiResponse.sources.includes("管理組合総会議事録") &&
                              aiResponse.sources.includes("修繕工事見積書") &&
                              ", "}
                            {aiResponse.sources.includes("修繕工事見積書") && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm font-medium text-blue-600 hover:underline"
                                onClick={() => {
                                  setCurrentView("documents")
                                  setTimeout(() => {
                                    window.location.href = "/documents/2"
                                  }, 100)
                                }}
                              >
                                「修繕工事見積書」
                              </Button>
                            )}
                            {aiResponse.sources.includes("消防設備点検報告書") && (
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm font-medium text-blue-600 hover:underline"
                                onClick={() => {
                                  setCurrentView("documents")
                                  setTimeout(() => {
                                    window.location.href = "/documents/3"
                                  }, 100)
                                }}
                              >
                                「消防設備点検報告書」
                              </Button>
                            )}
                            {aiResponse.sources.includes("(2023-12-15)") && " (2023-12-15)"}
                            {aiResponse.sources.includes("(2023-12-10)") && " (2023-12-10)"}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            回答の根拠となる書類の該当箇所が表示されます。
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 関連情報セクション */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">関連情報</h3>
                      <div className="p-3 bg-muted rounded-md">
                        {aiResponse ? (
                          <p className="text-sm">{aiResponse.relatedInfo}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            質問に関連する可能性のある追加情報が表示されます。
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 他マンション事例セクション */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">他マンション事例</h3>
                      <div className="p-3 bg-muted rounded-md">
                        {aiResponse ? (
                          <p className="text-sm">{aiResponse.examples}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            類似の状況における他のマンションの事例が表示されます。
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
    </div>
  )
}

