# 学習ロードマップ

本プロジェクトで使用した技術を、**推奨学習順序**で整理したものです。
（前提: HTML / CSS / JavaScript の基本構文・DOM操作は既習）

---

## Phase 1: モダンJavaScriptの土台

### 1. ES Modules（ESM）
- `import` / `export` 構文
- なぜモジュールが必要か（スコープ分離・依存管理）
- `default export` と `named export` の使い分け
- **本プロジェクトでの登場箇所**: 全 `.tsx` / `.ts` ファイルの先頭

### 2. ES2015+ の主要構文
- アロー関数 `() => {}`
- 分割代入 `const { a, b } = obj`
- スプレッド構文 `[...arr]`, `{...obj}`
- テンプレートリテラル `` `Hello ${name}` ``
- `const` / `let` のスコープ
- **本プロジェクトでの登場箇所**: 状態更新 `setTodos(prev => [...prev, newTodo])` など全般

### 3. 配列メソッド（関数型スタイル）
- `map` / `filter` / `find` / `findIndex` / `sort` / `reduce`
- イミュータブル（元の配列を壊さない）な操作の重要性
- **本プロジェクトでの登場箇所**: タスクの追加・削除・トグルすべて

### 4. 非同期処理（async / await）
- Promise の基礎
- `async function` と `await` の関係
- **本プロジェクトでの登場箇所**: `Notification.requestPermission()` の呼び出し

---

## Phase 2: 開発環境とパッケージ管理

### 5. Node.js / npm
- Node.js は「JS をブラウザ外で動かす実行環境」
- `package.json` の役割（依存関係・スクリプト定義）
- `npm install` / `npm run <script>` の意味
- `node_modules` と `package-lock.json`
- **本プロジェクトでの登場箇所**: プロジェクト全体の依存管理

### 6. ターミナル / シェル基本操作
- `cd` / `ls` / ファイル操作
- 環境変数の概念
- **本プロジェクトでの登場箇所**: 開発サーバ起動、ビルド、Git操作

---

## Phase 3: 型システム

### 7. TypeScript の基礎
- プリミティブ型 (`string`, `number`, `boolean`)
- `type` と `interface` の違い
- ユニオン型 `'high' | 'medium' | 'low'`
- オプショナル `?` と `undefined`
- ジェネリクス `Array<T>`, `Record<K, V>`
- **本プロジェクトでの登場箇所**: `types.ts` の `Todo` 型定義、Reactフックの型引数

### 8. TypeScript と React の型
- `useState<T>` のジェネリクス
- イベントハンドラの型 (`React.CSSProperties`, `DragEndEvent`)
- Props の型定義パターン
- **本プロジェクトでの登場箇所**: `SortableTodoItem.tsx` の Props 型

---

## Phase 4: ビルドツール

### 9. Vite
- なぜビルドツールが必要か（モジュール解決・JSX変換・最適化）
- 開発サーバとHMR（Hot Module Replacement）
- 本番ビルドとは何をするか（バンドル・minify・コード分割）
- `vite.config.ts` の役割
- **本プロジェクトでの登場箇所**: `npm run dev` / `npm run build` の裏側

---

## Phase 5: React 本体

### 10. React 入門概念
- JSX = JavaScript内にHTMLライクな記法
- コンポーネント = UIを返す関数
- Props でデータを子に渡す
- 宣言的UI（「どう描くか」ではなく「どう見えるべきか」）
- **本プロジェクトでの登場箇所**: 全コンポーネント

### 11. 状態管理: `useState`
- 状態とは何か、なぜ必要か
- `setState` 呼び出し → 再レンダリング の流れ
- 関数型更新 `setX(prev => ...)` を使う場面
- **本プロジェクトでの登場箇所**: `todos`, `input`, `editingId` など多数

### 12. 副作用: `useEffect`
- レンダリングと副作用の分離
- 依存配列 `[deps]` の意味と落とし穴
- クリーンアップ関数
- **本プロジェクトでの登場箇所**: localStorage への保存、通知の発火

### 13. パフォーマンス最適化: `useMemo`
- 再計算コストを減らす
- 依存配列で再計算タイミングを制御
- いつ使うか / 使わないか（早すぎる最適化に注意）
- **本プロジェクトでの登場箇所**: `visibleTodos`（フィルタ + ソート結果）

### 14. React のイミュータブル更新パターン
- なぜ `todos.push()` ではなく `[...todos, newTodo]` か
- 参照の同一性とReactの差分検知
- ネストしたオブジェクト更新の書き方
- **本プロジェクトでの登場箇所**: 全ての `setTodos` 呼び出し

### 15. コンポーネント分離
- 単一責任の原則
- Props経由の親→子データ流し
- コールバック経由の子→親通知
- **本プロジェクトでの登場箇所**: `App` から `SortableTodoItem` への分離

### 16. フォーム制御
- 制御コンポーネント（`value` + `onChange`）
- フォーム送信 (`onSubmit` + `preventDefault`)
- **本プロジェクトでの登場箇所**: タスク追加フォーム、編集フォーム

### 17. 条件付きレンダリング / リストレンダリング
- `&&` 演算子と三項演算子の使い分け
- `key` propの重要性
- **本プロジェクトでの登場箇所**: 編集モード切替、タスク一覧

---

## Phase 6: ブラウザAPI

### 18. localStorage
- 同期APIである点
- 文字列しか保存できない → JSON.stringify / parse
- 容量制限（5MB程度）
- **本プロジェクトでの登場箇所**: タスクの永続化、通知日付の記録

### 19. Notification API
- 権限モデル（granted / denied / default）
- `Notification.requestPermission()` のフロー
- ユーザー操作起点でのみリクエスト可能な制約
- **本プロジェクトでの登場箇所**: 期限通知

### 20. その他Web API
- `crypto.randomUUID()` — ID生成
- `Date` オブジェクトと日付比較
- **本プロジェクトでの登場箇所**: タスクID、期限切れ判定

---

## Phase 7: サードパーティライブラリ

### 21. ライブラリ導入の流れ
- npm検索 → ドキュメント確認 → `npm install` → import
- バージョン指定（`^`, `~`, ピン留め）
- **本プロジェクトでの登場箇所**: `@dnd-kit/*` の導入

### 22. @dnd-kit によるドラッグ&ドロップ
- `DndContext` でドラッグ範囲を定義
- `SortableContext` でリスト順序管理
- `useSortable` フックで個別要素をドラッグ可能化
- センサー設定（PointerSensor の `activationConstraint`）
- **本プロジェクトでの登場箇所**: `App.tsx`, `SortableTodoItem.tsx`

---

## Phase 8: バージョン管理

### 23. Git 基礎
- リポジトリ / コミット / ブランチの概念
- `init` / `add` / `commit` / `status` / `log`
- `.gitignore` の役割
- **本プロジェクトでの登場箇所**: ローカルでの初期化とコミット

### 24. リモートリポジトリ操作
- `remote add` / `push` / `pull` / `fetch`
- HTTPS vs SSH 認証
- **本プロジェクトでの登場箇所**: GitHubへのpush

### 25. GitHub
- リポジトリ作成・公開設定
- README.md がトップページに表示される仕組み
- Issue / Pull Request（応用）
- **本プロジェクトでの登場箇所**: ソースコードホスティング

---

## Phase 9: デプロイと CI/CD

### 26. 静的サイトホスティング
- 静的ファイル（HTML/CSS/JS）とは
- SPA（Single Page Application）とは
- CDN による高速配信
- **本プロジェクトでの登場箇所**: Vite ビルド成果物 `dist/`

### 27. Vercel
- GitHub連携による自動デプロイ
- Webhook → ビルド → デプロイのフロー
- プレビューデプロイ（PRごとに別URL）
- 環境変数の設定（応用）
- **本プロジェクトでの登場箇所**: 本番運用

### 28. CI/CD の概念
- 継続的インテグレーション・継続的デプロイの考え方
- git push → 自動ビルド → 自動デプロイ
- **本プロジェクトでの登場箇所**: Vercelで自動化済み

---

## Phase 10: 周辺・応用

### 29. CSS の中級トピック
- Flexbox レイアウト
- メディアクエリ（`prefers-color-scheme` でダークモード）
- CSS変数
- **本プロジェクトでの登場箇所**: `App.css` 全般

### 30. アクセシビリティ（a11y）
- `aria-label` / `role` / セマンティックHTML
- キーボード操作のサポート
- **本プロジェクトでの登場箇所**: 各ボタンの `aria-label`

### 31. ESLint / コード品質
- 静的解析でバグを未然に防ぐ
- ルール設定とエディタ統合
- **本プロジェクトでの登場箇所**: `eslint.config.js`（Viteテンプレートに同梱）

---

## 学習のヒント

- **順番は目安**：興味のある所から飛ばし読みでもOK。ただしReactは `useState` → `useEffect` → `useMemo` の順が安全。
- **小さく作って動かす**：各概念ごとに最小サンプルを書くのが最速。
- **公式ドキュメント優先**：[react.dev](https://react.dev) / [vite.dev](https://vite.dev) / [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) は質が高い。
- **ハマったら型を読む**：TypeScriptはエラーメッセージそのものが学習素材。
