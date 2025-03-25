import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // クライアントのローカルストレージの値をサーバーに伝えるため、Cookieに転送
  const dataSourceFromCookie = request.cookies.get("dataSource")?.value;

  // リクエストヘッダーからクライアントのデータソース設定を取得
  const dataSourceFromHeader = request.headers.get("x-data-source");

  // ヘッダー情報があればそれを、なければCookieの値を使用
  const dataSource = dataSourceFromHeader || dataSourceFromCookie || "firebase";

  // Cookieに設定
  response.cookies.set("dataSource", dataSource);

  return response;
}

// API ルートに対してのみミドルウェアを適用
export const config = {
  matcher: "/api/:path*",
};
