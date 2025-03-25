"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { DataSourceProvider } from "@/contexts/data-source-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback"; // パスを修正

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <SettingsProvider>
          <DataSourceProvider>
            {children}
          </DataSourceProvider>
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
