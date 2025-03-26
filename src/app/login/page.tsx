"use client"

import { LoginForm } from '@/components/login-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'

// exportしないことで静的生成時にメタデータが評価されなくなります
const metadata: Metadata = {
  title: 'ログイン - シメスくん',
  description: 'マンション書類管理システムへのログイン',
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">シメスくんへログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
