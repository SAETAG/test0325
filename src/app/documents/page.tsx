import { getAllDocuments } from '@/lib/data/documents';
import { DocumentList } from '@/components/document-list';
import { cookies } from "next/headers";
import { documentsData } from '@/lib/document-data';

// normalizeDocument関数をインポート
import { normalizeDocument } from '@/lib/data/document-normalizer';

// サーバーコンポーネントでデータを取得
export default async function DocumentsPage() {
    // クッキーからデータソース設定を取得（デフォルトはfirebase）
    const cookieStore = await cookies();
    const dataSource = cookieStore.get('dataSource')?.value as 'firebase' | 'mock' || 'firebase';

    try {
        // 統一インターフェースでデータを取得
        const documents = await getAllDocuments(dataSource);

        // クライアントコンポーネントにデータを渡す
        return <DocumentList initialDocuments={documents} />;
    } catch (error) {
        console.error("サーバーサイドでのデータ取得エラー:", error);

        // Firebaseが空/接続失敗でモックデータを使用する旨をログに出力
        if (dataSource === 'firebase') {
            console.log("WARNING: Firebaseからのデータ取得に失敗しました。代わりにモックデータを使用します。");
        }

        // エラーが発生した場合はモックデータを使用（型を適切に変換）
        return <DocumentList initialDocuments={dataSource === 'mock' ? [] : documentsData.map(doc => normalizeDocument(doc))} />;
    }
}
