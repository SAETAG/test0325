import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export function useAiAssistant(documentId?: string) {
  // チャット履歴の状態管理
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // API呼び出しのミューテーション作成
  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          documentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "AIアシスタントとの通信に失敗しました"
        );
      }

      return response.json();
    },
    onSuccess: (data) => {
      // 成功時にAIの回答をメッセージリストに追加
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        timestamp: data.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
  });

  // 質問を送信する関数
  const sendQuestion = (question: string) => {
    // ユーザーの質問をメッセージリストに追加
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // APIに質問を送信
    mutation.mutate(question);
  };

  // 会話履歴をクリアする関数
  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    sendQuestion,
    clearChat,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
