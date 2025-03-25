"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Send, Sparkles, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAiAssistant, ChatMessage } from "@/hooks/useAiAssistant";

interface AiAssistantProps {
    documentId?: string;
    documentTitle?: string;
}

export function AiAssistant({ documentId, documentTitle }: AiAssistantProps) {
    const [question, setQuestion] = useState("");
    const { messages, sendQuestion, clearChat, isLoading, error } = useAiAssistant(documentId);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // 新しいメッセージが追加されたら自動スクロール
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // フォーム送信ハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && !isLoading) {
            sendQuestion(question);
            setQuestion("");
        }
    };

    return (
        <Card className="flex flex-col h-[600px]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AIアシスタント
                    </CardTitle>
                    {documentTitle && (
                        <Badge variant="outline" className="ml-auto">
                            書類: {documentTitle}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea className="h-[450px] px-4" ref={scrollAreaRef as any}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                            <Sparkles className="h-10 w-10 mb-2" />
                            <h3 className="font-medium mb-1">マンション管理について質問できます</h3>
                            <p className="text-sm">
                                例: 「修繕積立金の値上げ方法は？」「管理組合の理事会議事録の保管期間は？」
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 py-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                                            <span className="text-sm text-muted-foreground ml-1">考え中...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{(error as Error).message}</AlertDescription>
                        </Alert>
                    )}
                </ScrollArea>
            </CardContent>

            <CardFooter className="border-t p-2">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearChat}
                        title="会話をクリア"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                    <Input
                        placeholder="質問を入力してください..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon" disabled={!question.trim() || isLoading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
