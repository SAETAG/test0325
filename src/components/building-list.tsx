"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, FileText, Plus } from "lucide-react"
import { useState } from "react"

// サンプルデータ
const buildings = [
  {
    id: 1,
    name: "グランドパレス東京",
    address: "東京都中央区日本橋1-1-1",
    documentCount: 24,
    units: 120,
  },
  {
    id: 2,
    name: "サンシャインマンション",
    address: "東京都新宿区西新宿2-2-2",
    documentCount: 18,
    units: 85,
  },
  {
    id: 3,
    name: "パークハイツ横浜",
    address: "神奈川県横浜市西区みなとみらい3-3-3",
    documentCount: 15,
    units: 64,
  },
  {
    id: 4,
    name: "リバーサイドタワー大阪",
    address: "大阪府大阪市北区中之島4-4-4",
    documentCount: 12,
    units: 150,
  },
  {
    id: 5,
    name: "グリーンヒルズ札幌",
    address: "北海道札幌市中央区大通西5-5-5",
    documentCount: 9,
    units: 42,
  },
]

export function BuildingList() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [units, setUnits] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 実際の実装ではここでAPIを呼び出してマンションを追加
    setOpen(false)
    setName("")
    setAddress("")
    setUnits("")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">登録マンション一覧</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>マンション新規登録</DialogTitle>
              <DialogDescription>新しいマンションの情報を入力してください</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">マンション名</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="マンション名を入力"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">住所</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="住所を入力"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">総戸数</Label>
                  <Input
                    id="units"
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="総戸数を入力"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">登録</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => (
          <Card key={building.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{building.name}</h4>
                    <p className="text-sm text-muted-foreground">{building.address}</p>
                  </div>
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{building.documentCount}件の書類</span>
                  </div>
                  <span>{building.units}戸</span>
                </div>
              </div>
              <div className="bg-muted p-3 flex justify-end">
                <Button variant="ghost" size="sm">
                  詳細を表示
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

