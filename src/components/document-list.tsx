"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Eye, Search, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Document } from "@/types/document"
import useSWR from 'swr'
import { useApiFetcher } from "@/lib/api-fetcher"

interface DocumentListProps {
  searchQuery?: string
  initialDocuments?: Document[]
}

export function DocumentList({ searchQuery = "", initialDocuments = [] }: DocumentListProps) {
  const router = useRouter()
  const [buildingFilter, setBuildingFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  const fetcher = useApiFetcher()

  const { data, error, isLoading } = useSWR<{ documents: Document[] }>(
    '/api/documents',
    fetcher,
    {
      fallbackData: initialDocuments.length ? { documents: initialDocuments } : undefined,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (err) => {
        console.error('データ取得エラー:', err);
      }
    }
  );

  // 安全にコンポーネントがマウントされているかを追跡
  const isMounted = useRef(true);

  // コンポーネントのアンマウント時に変数を設定
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // コンポーネントがマウントされている場合のみ状態を更新
      if (isMounted.current) {
        setViewMode(window.innerWidth < 640 ? "card" : "table");
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    // クリーンアップ関数を追加
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 安全な早期リターン
  if (isLoading && !initialDocuments.length) {
    return <div className="py-8 text-center">書類データを読み込み中...</div>;
  }

  if (error) {
    console.error('データ取得エラー:', error);
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">データの読み込みに失敗しました。</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </Button>
        <Button
          variant="secondary"
          className="mt-4 ml-2"
          onClick={() => {
            // モックデータに切り替え
            localStorage.setItem("dataSource", "mock");
            console.log("INFO: Firebaseが空/接続失敗のため、モックデータに切り替えました。");
            window.location.reload();
          }}
        >
          モックデータを使用
        </Button>
      </div>
    );
  }

  // 安全なデータ取得
  const documents = data?.documents || [];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      localSearchQuery === "" ||
      doc.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(localSearchQuery.toLowerCase()))

    const matchesBuilding = buildingFilter === "" || doc.building === buildingFilter

    const matchesType = typeFilter === "" || doc.type === typeFilter

    return matchesSearch && matchesBuilding && matchesType
  })

  const navigateToDocumentDetails = (docId: string) => {
    router.push(`/documents/${docId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="キーワードで検索..."
            value={localSearchQuery || searchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        <Select value={buildingFilter} onValueChange={setBuildingFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="マンション" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="グランドパレス東京">グランドパレス東京</SelectItem>
            <SelectItem value="サンシャインマンション">サンシャインマンション</SelectItem>
            <SelectItem value="パークハイツ横浜">パークハイツ横浜</SelectItem>
            <SelectItem value="リバーサイドタワー大阪">リバーサイドタワー大阪</SelectItem>
            <SelectItem value="グリーンヒルズ札幌">グリーンヒルズ札幌</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="ファイル形式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="JPG">JPG</SelectItem>
            <SelectItem value="PNG">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>マンション</TableHead>
                <TableHead>タグ</TableHead>
                <TableHead>アップロード日</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer" onClick={() => navigateToDocumentDetails(doc.id)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>{doc.building}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateToDocumentDetails(doc.id)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">表示</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">ダウンロード</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    検索条件に一致する書類がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="overflow-hidden cursor-pointer"
                onClick={() => navigateToDocumentDetails(doc.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.building}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.uploadedAt}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">検索条件に一致する書類がありません</div>
          )}
        </div>
      )}
    </div>
  )
}
