"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { FileUp, Upload, Check, AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [building, setBuilding] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingOcr, setIsProcessingOcr] = useState(false)

  // AI提案用の状態
  const [suggestedTitle, setSuggestedTitle] = useState<string | null>(null)
  const [suggestedBuilding, setSuggestedBuilding] = useState<string | null>(null)
  const [suggestedDescription, setSuggestedDescription] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("ファイルサイズは10MB以下にしてください")
        return
      }

      const fileType = selectedFile.type
      if (fileType !== "application/pdf" && fileType !== "image/jpeg" && fileType !== "image/png") {
        setError("PDF、JPG、PNG形式のファイルのみアップロード可能です")
        return
      }

      setFile(selectedFile)
      setError(null)

      // OCR処理とAIによる各種提案を開始
      processOcrAndSuggestMetadata(selectedFile)
    }
  }

  const processOcrAndSuggestMetadata = async (file: File) => {
    // 実際の実装ではここでOCR処理とAI処理を行う
    setIsProcessingOcr(true)

    // OCRとAI処理をシミュレート
    setTimeout(() => {
      // ファイル名から拡張子を除いたものをベースにタイトルを生成
      const baseName = file.name.replace(/\.[^/.]+$/, "")

      // タイトル提案
      const documentTypes = ["議事録", "報告書", "見積書", "契約書", "点検記録"]
      const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)]
      const suggestedTitle = `${baseName} ${randomType}`

      // マンション提案
      const buildingOptions = [
        "building1", // グランドパレス東京
        "building2", // サンシャインマンション
        "building3", // パークハイツ横浜
        "building4", // リバーサイドタワー大阪
        "building5", // グリーンヒルズ札幌
      ]
      const suggestedBuilding = buildingOptions[Math.floor(Math.random() * buildingOptions.length)]

      // 説明提案
      const descriptionTemplates = [
        `${randomType}の内容に関する書類です。${baseName}に関連する重要な情報が含まれています。`,
        `${baseName}についての${randomType}です。今後の管理に必要な内容が記載されています。`,
        `マンション管理に関する${randomType}です。${baseName}の詳細が記録されています。`,
      ]
      const suggestedDescription = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)]

      // 提案をセット
      setSuggestedTitle(suggestedTitle)
      setSuggestedBuilding(suggestedBuilding)
      setSuggestedDescription(suggestedDescription)
      setIsProcessingOcr(false)
    }, 2000) // 2秒後に結果を返す
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("ファイルを選択してください")
      return
    }

    if (!title) {
      setError("タイトルを入力してください")
      return
    }

    if (!building) {
      setError("マンションを選択してください")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    // 実際のアップロード処理をシミュレート
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setSuccess(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setBuilding("")
    setSuccess(false)
    setError(null)
    setSuggestedTitle(null)
    setSuggestedBuilding(null)
    setSuggestedDescription(null)
    setIsProcessingOcr(false)
  }

  // 全ての提案を一括で適用する
  const applyAllSuggestions = () => {
    if (suggestedTitle) setTitle(suggestedTitle)
    if (suggestedBuilding) setBuilding(suggestedBuilding)
    if (suggestedDescription) setDescription(suggestedDescription)

    // 提案をクリア
    setSuggestedTitle(null)
    setSuggestedBuilding(null)
    setSuggestedDescription(null)
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">アップロード完了</AlertTitle>
        <AlertDescription className="text-green-700">
          書類が正常にアップロードされました。OCRによるテキスト抽出が完了次第、検索可能になります。
        </AlertDescription>
        <Button onClick={resetForm} className="mt-4">
          新しい書類をアップロード
        </Button>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="file">ファイル選択</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file")?.click()}
            className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
          >
            <FileUp className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{file ? file.name : "クリックしてファイルを選択"}</span>
          </Button>
          <Input id="file" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
        </div>
        <p className="text-xs text-muted-foreground">PDF、JPG、PNG形式のファイル（最大10MB）</p>
      </div>

      {isProcessingOcr && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-blue-500 mr-2"></span>
            <AlertTitle className="text-blue-800">OCRとAI分析中...</AlertTitle>
          </div>
          <AlertDescription className="text-blue-700">
            アップロードされた書類を分析しています。タイトル、マンション、説明の提案を生成中です。
          </AlertDescription>
        </Alert>
      )}

      {(suggestedTitle || suggestedBuilding || suggestedDescription) && !isProcessingOcr && (
        <Alert className="bg-purple-50 border-purple-200">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertTitle className="text-purple-800">AI提案が利用可能です</AlertTitle>
          <AlertDescription className="text-purple-700">
            OCR結果に基づいて、以下のメタデータが提案されました。
          </AlertDescription>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 bg-purple-100 hover:bg-purple-200 border-purple-300"
            onClick={applyAllSuggestions}
          >
            <Sparkles className="h-3 w-3 mr-2" />
            すべての提案を適用
          </Button>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <div className="space-y-2">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="書類のタイトルを入力"
            required
            disabled={isProcessingOcr}
          />
          {suggestedTitle && !isProcessingOcr && (
            <div className="text-sm p-2 border rounded bg-muted/50">
              <div className="flex items-center justify-between">
                <p className="text-blue-600">{suggestedTitle}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTitle(suggestedTitle)
                    setSuggestedTitle(null)
                  }}
                >
                  採用する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="building">マンション</Label>
        <div className="space-y-2">
          <Select value={building} onValueChange={setBuilding} required disabled={isProcessingOcr}>
            <SelectTrigger>
              <SelectValue placeholder="マンションを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="building1">グランドパレス東京</SelectItem>
              <SelectItem value="building2">サンシャインマンション</SelectItem>
              <SelectItem value="building3">パークハイツ横浜</SelectItem>
              <SelectItem value="building4">リバーサイドタワー大阪</SelectItem>
              <SelectItem value="building5">グリーンヒルズ札幌</SelectItem>
            </SelectContent>
          </Select>
          {suggestedBuilding && !isProcessingOcr && (
            <div className="text-sm p-2 border rounded bg-muted/50">
              <div className="flex items-center justify-between">
                <p className="text-blue-600">
                  {suggestedBuilding === "building1" && "グランドパレス東京"}
                  {suggestedBuilding === "building2" && "サンシャインマンション"}
                  {suggestedBuilding === "building3" && "パークハイツ横浜"}
                  {suggestedBuilding === "building4" && "リバーサイドタワー大阪"}
                  {suggestedBuilding === "building5" && "グリーンヒルズ札幌"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBuilding(suggestedBuilding)
                    setSuggestedBuilding(null)
                  }}
                >
                  採用する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明（任意）</Label>
        <div className="space-y-2">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="書類の説明を入力"
            rows={3}
            disabled={isProcessingOcr}
          />
          {suggestedDescription && !isProcessingOcr && (
            <div className="text-sm p-2 border rounded bg-muted/50">
              <div className="flex items-center justify-between">
                <p className="text-blue-600">{suggestedDescription}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDescription(suggestedDescription)
                    setSuggestedDescription(null)
                  }}
                >
                  採用する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>アップロード中...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <Button type="submit" disabled={uploading || isProcessingOcr} className="w-full">
        {uploading ? (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4 animate-pulse" />
            アップロード中...
          </span>
        ) : isProcessingOcr ? (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            AI分析中...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            アップロード
          </span>
        )}
      </Button>
    </form>
  )
}

