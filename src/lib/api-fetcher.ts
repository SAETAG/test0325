import { useDataSource } from "@/contexts/data-source-context";

/**
 * データソースの設定を含めたカスタムフェッチャー関数
 */
export const createApiFetcher = () => {
  // フェッチャー関数を返す
  return async (url: string) => {
    // デフォルト値を設定
    let dataSource = "firebase";

    // ブラウザ環境かどうかを確認してからlocalStorageにアクセス
    if (typeof window !== "undefined") {
      dataSource = (localStorage.getItem("dataSource") as string) || "firebase";
    }

    const res = await fetch(url, {
      headers: {
        // カスタムヘッダーでデータソース情報を送信
        "x-data-source": dataSource,
      },
    });

    if (!res.ok) {
      throw new Error("APIリクエストに失敗しました");
    }

    return res.json();
  };
};

/**
 * Reactコンポーネント内で使用するフェッチャーを取得するフック
 */
export function useApiFetcher() {
  const { dataSource } = useDataSource();

  return async (url: string) => {
    const res = await fetch(url, {
      headers: {
        "x-data-source": dataSource,
      },
    });

    if (!res.ok) {
      throw new Error("APIリクエストに失敗しました");
    }

    return res.json();
  };
}
