"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // shadcn/uiのuseToastからsonnerのtoastに変更
import { useDataSource } from "@/contexts/data-source-context"
import { ArrowLeft, Database, FileJson } from "lucide-react"

export default function AdminSettingsPage() {
    const { dataSource, setDataSource } = useDataSource();
    const [selectedSource, setSelectedSource] = useState<'firebase' | 'mock'>(dataSource);
    const router = useRouter();

    // 変更を保存する
    const saveChanges = () => {
        setDataSource(selectedSource);
        toast("設定を保存しました", {
            description: `データソースを ${selectedSource === 'firebase' ? 'Firebase' : 'モックデータ'} に変更しました`,
        });
    };

    // 戻るボタン
    const goBack = () => {
        router.back();
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <Button variant="ghost" onClick={goBack} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
            </Button>

            <h1 className="text-2xl font-bold mb-6">管理者設定</h1>

            <Card>
                <CardHeader>
                    <CardTitle>データソース設定</CardTitle>
                    <CardDescription>
                        アプリケーションが使用するデータソースを選択します
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedSource}
                        onValueChange={(value) => setSelectedSource(value as 'firebase' | 'mock')}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted">
                            <RadioGroupItem value="firebase" id="firebase" />
                            <Label htmlFor="firebase" className="flex items-center cursor-pointer">
                                <Database className="mr-2 h-4 w-4 text-primary" />
                                <div>
                                    <p className="font-medium">Firebase (実データ)</p>
                                    <p className="text-sm text-muted-foreground">
                                        Firebase Firestoreからリアルタイムでデータを取得します
                                    </p>
                                </div>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted">
                            <RadioGroupItem value="mock" id="mock" />
                            <Label htmlFor="mock" className="flex items-center cursor-pointer">
                                <FileJson className="mr-2 h-4 w-4 text-primary" />
                                <div>
                                    <p className="font-medium">モックデータ (テスト用)</p>
                                    <p className="text-sm text-muted-foreground">
                                        アプリ内のモックデータを使用します。テストや開発に便利です
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>

                    <Button onClick={saveChanges} className="mt-6">
                        設定を保存
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
