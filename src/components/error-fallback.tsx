"use client";

import { Button } from "@/components/ui/button";
import { FallbackProps } from "react-error-boundary";

/**
 * エラー発生時に表示されるフォールバックコンポーネント
 * 
 * アプリケーション内でエラーが発生した場合に、ErrorBoundaryによって表示されます。
 * エラーの詳細を表示し、ユーザーに再試行のオプションを提供します。
 */
export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">エラーが発生しました</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{error.message}</p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 overflow-auto max-h-32 p-2 bg-gray-50 dark:bg-gray-700 rounded">
          {error.stack && (
            <pre className="whitespace-pre-wrap">{error.stack}</pre>
          )}
        </div>
        <Button
          onClick={resetErrorBoundary}
          className="w-full"
        >
          再読み込み
        </Button>
      </div>
    </div>
  );
}
