import Link from "next/link";
import { Home, FileText, Building2, Sparkles } from "lucide-react";

export function MainNav() {
    return (
        <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
                href="/"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
                <Home className="w-4 h-4 mr-2" />
                ダッシュボード
            </Link>
            <Link
                href="/documents"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
                <FileText className="w-4 h-4 mr-2" />
                書類一覧
            </Link>
            <Link
                href="/buildings"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
                <Building2 className="w-4 h-4 mr-2" />
                マンション
            </Link>
            <Link
                href="/ai"
                className="flex items-center text-sm font-medium transition-colors hover:text-primary"
            >
                <Sparkles className="w-4 h-4 mr-2" />
                AIアシスタント
            </Link>
        </nav>
    );
}