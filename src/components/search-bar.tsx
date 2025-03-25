"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

/**
 * 検索バーコンポーネントの型定義
 * 
 * @property {function} onSearch - 検索クエリが入力されたときに呼び出されるコールバック関数
 */
interface SearchBarProps {
  onSearch: (query: string) => void
}

// WebSpeech APIのインターフェース定義
declare global {
  /**
   * ブラウザのWindow拡張インターフェース
   * Web Speech API用の拡張プロパティを定義
   */
  interface Window {
    SpeechRecognition: any    // 標準の音声認識API
    webkitSpeechRecognition: any  // WebKit系ブラウザの音声認識API
  }

  /**
   * 音声認識のメインインターフェース
   * 音声認識の基本設定と関連イベントを管理する
   */
  interface SpeechRecognition extends EventTarget {
    continuous: boolean       // 連続認識モードの設定
    interimResults: boolean   // 中間結果を返すかどうか
    lang: string              // 認識する言語の設定（例：'ja-JP'）
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null  // 結果取得時のコールバック
    onend: ((this: SpeechRecognition, ev: Event) => any) | null                      // 認識終了時のコールバック
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null  // エラー発生時のコールバック
    start: () => void         // 音声認識開始メソッド
    stop: () => void          // 音声認識停止メソッド
    abort: () => void         // 音声認識中断メソッド
  }

  /**
   * 音声認識イベントのインターフェース
   * 認識結果の詳細を提供する
   */
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList  // 認識結果のリスト
    readonly resultIndex: number                   // 現在の結果のインデックス
  }

  /**
   * 音声認識結果のリスト（Array-likeオブジェクト）
   * 複数の認識結果を保持する
   */
  interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult  // インデックスアクセス（読み取り専用）
    readonly length: number                            // 結果の数（読み取り専用）
    item(index: number): SpeechRecognitionResult      // インデックスで結果を取得
  }

  /**
   * 個々の音声認識結果
   * 複数の認識候補と確定状態を保持する
   */
  interface SpeechRecognitionResult {
    readonly [index: number]: SpeechRecognitionAlternative  // 候補のインデックスアクセス
    readonly length: number                                 // 候補の数
    readonly isFinal: boolean                              // 最終結果かどうか
    item(index: number): SpeechRecognitionAlternative      // 候補を取得
  }

  /**
   * 音声認識の候補
   * 認識されたテキストとその信頼度を保持
   */
  interface SpeechRecognitionAlternative {
    readonly transcript: string  // 認識されたテキスト
    readonly confidence: number  // 信頼度
  }

  /**
   * 音声認識のエラーイベント
   */
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode  // エラーコード
  }

  /**
   * 音声認識のエラーコード型
   * エラーの種類を示す文字列リテラル
   */
  type SpeechRecognitionErrorCode =
    | "no-speech"               // 音声が検出されない
    | "aborted"                // 中断された
    | "audio-capture"          // マイクの問題
    | "network"               // ネットワークエラー
    | "not-allowed"           // 権限なし
    | "service-not-allowed"   // サービス利用不可
    | "bad-grammar"           // 文法エラー
    | "language-not-supported" // 言語未対応
}

/**
 * 検索バーコンポーネント
 * 
 * テキストと音声入力による検索機能を提供します。
 * Web Speech APIを使用して音声認識を実装しています。
 * 
 * @param {SearchBarProps} props - コンポーネントのプロパティ
 */
export function SearchBar({ onSearch }: SearchBarProps) {
  // 音声認識の状態管理
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  /**
   * Web Speech APIの初期化
   * ブラウザによる音声認識サポートの確認と設定を行います
   */
  useEffect(() => {
    // ブラウザが音声認識をサポートしているか確認
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      // SpeechRecognitionオブジェクトの取得（ブラウザ間の互換性対応）
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      // 音声認識の基本設定
      recognitionInstance.continuous = false      // 単発の認識モード
      recognitionInstance.interimResults = true   // 中間結果も取得する
      recognitionInstance.lang = "ja-JP"          // 日本語認識に設定

      /**
       * 音声認識の結果を処理するハンドラ
       * 認識結果をトランスクリプトに設定し、最終結果なら検索を実行
       */
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptValue = result[0].transcript
        setTranscript(transcriptValue)

        // 最終結果の場合、検索を実行して音声認識を終了
        if (result.isFinal) {
          onSearch(transcriptValue)
          setIsListening(false)
        }
      }

      /**
       * 音声認識終了時のハンドラ
       * リスニング状態をリセットする
       */
      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      /**
       * 音声認識エラー時のハンドラ
       * エラーをログに出力し、リスニング状態をリセットする
       */
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("音声認識エラー:", event.error)
        setIsListening(false)
      }

      // 認識インスタンスを状態に保存
      setRecognition(recognitionInstance)
    }

    // コンポーネントのクリーンアップ時に音声認識を中止
    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [onSearch])

  /**
   * 音声認識の開始/停止を切り替える関数
   */
  const toggleListening = () => {
    // 音声認識非対応ブラウザの場合、警告を表示
    if (!recognition) {
      alert("お使いのブラウザは音声認識をサポートしていません。")
      return
    }

    // 現在の状態に応じて停止または開始
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      recognition.start()
      setIsListening(true)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 音声検索ボタン */}
      <Button
        type="button"
        variant={isListening ? "destructive" : "default"}
        size="lg"
        onClick={toggleListening}
        className={`w-full flex items-center justify-center gap-2 ${isListening ? "animate-pulse" : ""}`}
      >
        {isListening ? (
          // 音声認識中の表示
          <>
            <MicOff className="h-5 w-5" />
            <span>音声入力を停止</span>
          </>
        ) : (
          // 通常時の表示
          <>
            <Mic className="h-5 w-5" />
            <span>音声で検索</span>
          </>
        )}
      </Button>

      {/* 認識テキスト表示エリア */}
      {transcript && (
        <div className="bg-muted p-3 rounded-md text-sm w-full min-h-[40px] flex items-center">
          <p className="break-words">{transcript}</p>
        </div>
      )}
    </div>
  )
}
