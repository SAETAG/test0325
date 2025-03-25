"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { DataSourceProvider } from "@/contexts/data-source-context";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from "react";

// エラーフォールバックコンポーネント
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
                <p className="text-gray-700 mb-4">{error.message}</p>
                <button
                    onClick={resetErrorBoundary}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                >
                    再読み込み
                </button>
            </div>
        </div>
    );
}

/**
 * クライアントサイドのレイアウトラッパー
 * 
 * AuthProviderやErrorBoundaryなど、クライアントサイドで必要な
 * プロバイダーやラッパーを提供します。
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
    // QueryClientのインスタンスをステートとして保持
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.reload()}
        >
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <DataSourceProvider>
                        {children}
                        <Toaster />
                    </DataSourceProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
