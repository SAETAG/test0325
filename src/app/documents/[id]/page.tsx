import { Metadata } from 'next'
import { DocumentViewer } from './document-viewer'
import { getDocumentById } from '@/lib/data/documents'
import { cookies } from "next/headers";
import { Document } from '@/types/document'

// Next.js 15.2.2の型定義に完全に合わせる
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // searchParamsもPromiseに修正
}

// サーバーサイドでドキュメントを取得する関数
async function getDocument(id: string): Promise<Document | null> {
  // クッキーからデータソース設定を取得
  const cookieStore = await cookies();
  const dataSource = cookieStore.get('dataSource')?.value as 'firebase' | 'mock' || 'firebase';

  return await getDocumentById(id, dataSource);
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params // awaitを追加
  const document = await getDocument(id)

  return {
    title: document ? `${document.title} - 書類管理システム` : '書類が見つかりません',
    description: document?.description || '指定された書類は存在しないか、アクセス権限がありません。',
  }
}

export default async function DocumentPage({
  params,
  searchParams
}: Props) {
  const { id } = await params // awaitを追加
  const searchParamsData = await searchParams // searchParamsもawaitする
  const document = await getDocument(id)

  return <DocumentViewer initialDocument={document} documentId={id} />
}
