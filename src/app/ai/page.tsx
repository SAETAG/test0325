import { Metadata } from "next";
import { AiAssistant } from "@/components/ai-assistant";

export const metadata: Metadata = {
    title: "AIアシスタント - シメスくん",
    description: "マンション管理に関する質問をAIがサポートします",
};

export default function AiPage() {
    return (
        <div className="container py-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">AIアシスタント</h1>
            <p className="mb-4 text-muted-foreground">
                マンション管理に関する質問を入力してください。AIがサポートします。
                特定の書類に関連する質問は、書類詳細画面からも行えます。
            </p>
            <AiAssistant />
        </div>
    );
}
