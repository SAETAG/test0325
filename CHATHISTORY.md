# 音声認識機能（Web Speech API）の実装ポイント

## Web Speech API とは

Web Speech API はウェブアプリケーションに音声機能を提供する JavaScript の API です。主に以下の 2 つの機能を提供しています：

1. **音声認識（Speech Recognition）**：ユーザーの音声入力をテキストに変換する機能
2. **音声合成（Speech Synthesis）**：テキストを音声に変換する機能（Text-to-Speech）

Web Speech API は W3C によって標準化が進められていますが、現時点ではブラウザ互換性に差があります。Chrome、Edge、Safari などで対応していますが、Firefox ではデフォルトで OFF になっているため注意が必要です。

この API の利点：

- サーバーサイドの処理なしでブラウザ内で音声認識が可能
- 外部ライブラリを必要とせず、標準機能として使用可能
- リアルタイム性が高い
- 複数の言語に対応（日本語も対応）

Web Speech API を使用するには、HTTPS または localhost でのみ動作することに注意が必要です。これはセキュリティとプライバシーの観点からマイクアクセスを保護するためです。

## 概要

Web Speech API を使用した音声認識機能を実装するための主要コンポーネントと実装のポイントを説明します。

## 基本構成

### インターフェースの定義

```typescript
// WebSpeech APIのインターフェース定義
declare global {
  interface Window {
    SpeechRecognition: any; // 標準の音声認識API
    webkitSpeechRecognition: any; // WebKit系ブラウザの音声認識API
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean; // 連続認識モードの設定
    interimResults: boolean; // 中間結果を返すかどうか
    lang: string; // 認識する言語の設定
    // 各種イベントハンドラ
    start: () => void; // 音声認識開始メソッド
    stop: () => void; // 音声認識停止メソッド
    abort: () => void; // 音声認識中断メソッド
  }

  // 他のインターフェース定義...
}
```

### 状態管理

```typescript
// 音声認識の状態管理
const [isListening, setIsListening] = useState(false); // 認識中かどうか
const [transcript, setTranscript] = useState(""); // 認識されたテキスト
const [recognition, setRecognition] = useState<SpeechRecognition | null>(null); // 認識インスタンス
```

## 実装のポイント

### 1. ブラウザ互換性への対応

```typescript
// ブラウザの互換性チェック
if (
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionInstance = new SpeechRecognition();
  // ...
}
```

### 2. 基本設定

```typescript
// 音声認識の基本設定
recognitionInstance.continuous = false; // 単発の認識モード
recognitionInstance.interimResults = true; // 中間結果も取得する
recognitionInstance.lang = "ja-JP"; // 日本語認識に設定
```

### 3. イベントハンドラの設定

```typescript
// 結果取得のハンドラ
recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
  const current = event.resultIndex;
  const result = event.results[current];
  const transcriptValue = result[0].transcript;
  setTranscript(transcriptValue);

  // 最終結果の場合、検索を実行
  if (result.isFinal) {
    onSearch(transcriptValue);
    setIsListening(false);
  }
};

// 終了時のハンドラ
recognitionInstance.onend = () => {
  setIsListening(false);
};

// エラー時のハンドラ
recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
  console.error("音声認識エラー:", event.error);
  setIsListening(false);
};
```

### 4. 音声認識の開始/停止制御

```typescript
const toggleListening = () => {
  // 非対応ブラウザのチェック
  if (!recognition) {
    alert("お使いのブラウザは音声認識をサポートしていません。");
    return;
  }

  // 状態に応じた動作切替
  if (isListening) {
    recognition.stop();
    setIsListening(false);
  } else {
    setTranscript("");
    recognition.start();
    setIsListening(true);
  }
};
```

### 5. クリーンアップ処理

```typescript
// コンポーネントのアンマウント時にリソース解放
return () => {
  if (recognition) {
    recognition.abort();
  }
};
```

### 6. UI での視覚的フィードバック

```tsx
<Button
  variant={isListening ? "destructive" : "default"}
  onClick={toggleListening}
  className={`${isListening ? "animate-pulse" : ""}`}
>
  {isListening ? (
    <>
      <MicOff className="h-5 w-5" />
      <span>音声入力を停止</span>
    </>
  ) : (
    <>
      <Mic className="h-5 w-5" />
      <span>音声で検索</span>
    </>
  )}
</Button>;

{
  /* 認識テキスト表示 */
}
{
  transcript && (
    <div className="bg-muted p-3 rounded-md">
      <p>{transcript}</p>
    </div>
  );
}
```

## 注意点

1. **ブラウザ対応**: すべてのブラウザでサポートされていないため、動作確認が必要
2. **エラーハンドリング**: マイク許可エラーなど様々なエラー状態への対応
3. **ユーザビリティ**: 明確な視覚的フィードバックで状態を伝える工夫
4. **言語設定**: 日本語認識には `lang = "ja-JP"` の設定が必須
5. **プライバシー配慮**: マイク利用に関するユーザーへの通知

## 改善ポイント

1. より詳細なエラーメッセージの表示
2. 認識精度向上のためのフィードバック機能
3. モバイル端末での最適化
4. アクセシビリティの強化
