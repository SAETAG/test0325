import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document } from "@/types/document";

/**
 * 全ドキュメント取得のためのフック
 * @returns 書類一覧とクエリ状態
 */
export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("データ取得に失敗しました");
      return res.json();
    },
  });
}

/**
 * 特定のドキュメント取得のためのフック
 * @param id 取得する書類のID
 * @returns 書類データとクエリ状態
 */
export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error("データ取得に失敗しました");
      return res.json();
    },
    enabled: !!id, // idが存在する場合のみクエリを実行
  });
}
