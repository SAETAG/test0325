"use client"

import { SignupForm } from '@/components/signup-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'

// exportしないことで静的生成時にメタデータが評価されなくなります
const metadata: Metadata = {
    title: '新規登録 - シメスくん',
    description: 'マンション書類管理システムへの新規登録',
}

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">シメスくんに新規登録</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    )
}
