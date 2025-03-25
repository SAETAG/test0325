import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"

// サンプルデータ
const recentDocuments = [
  {
    id: 1,
    title: "管理組合総会議事録",
    building: "グランドパレス東京",
    uploadedAt: "2023-12-15 14:30",
    uploadedBy: {
      name: "田中太郎",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "TT",
    },
  },
  {
    id: 2,
    title: "修繕工事見積書",
    building: "サンシャインマンション",
    uploadedAt: "2023-12-10 11:15",
    uploadedBy: {
      name: "佐藤花子",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SH",
    },
  },
  {
    id: 3,
    title: "消防設備点検報告書",
    building: "パークハイツ横浜",
    uploadedAt: "2023-12-05 09:45",
    uploadedBy: {
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SI",
    },
  },
]

export function RecentDocuments() {
  return (
    <div className="space-y-4">
      {recentDocuments.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-muted p-2">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{doc.title}</h4>
                  <p className="text-sm text-muted-foreground">{doc.building}</p>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={doc.uploadedBy.avatar} alt={doc.uploadedBy.name} />
                  <AvatarFallback>{doc.uploadedBy.initials}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm">
                  表示
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

