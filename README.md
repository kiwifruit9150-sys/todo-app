# ToDo App

React + TypeScript + Vite で構築した ToDo リストアプリ。Vercel にデプロイ済み。

---

## 1. 機能一覧

| 機能 | 説明 |
|------|------|
| タスク追加 / 削除 / 編集 | 基本のCRUD |
| 完了チェック | チェックボックスでトグル |
| 期限日 | 日付選択。期限切れは赤色で警告 |
| 優先度 | 高 / 中 / 低の3段階。色付きタグで表示 |
| フィルタ | すべて / 未完了 / 完了 |
| 並び替え | 手動（D&D） / 優先度 / 期限日 |
| ドラッグ&ドロップ | `@dnd-kit` で手動並び替え |
| 完了済み一括削除 | フッターのボタン |
| ブラウザ通知 | 期限切れ/今日期限のタスクを1日1回通知 |
| ローカル永続化 | `localStorage` に自動保存 |
| ダークモード | OS設定に追従（CSS Media Query） |

---

## 2. 使用技術

### フロントエンド
- **React 19** — UIライブラリ
- **TypeScript** — 型安全な開発
- **Vite** — 高速な開発サーバ＆ビルドツール

### ライブラリ
- **@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities** — ドラッグ&ドロップ並び替え

### ブラウザAPI
- **localStorage** — データ永続化
- **Notification API** — ブラウザ通知
- **crypto.randomUUID()** — タスクIDの生成

### デプロイ
- **GitHub** — ソースコード管理
- **Vercel** — 自動ビルド & ホスティング（git pushで自動デプロイ）

---

## 3. 開発の流れ

### 環境構築
```bash
npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install
```

### 開発サーバ起動
```bash
npm run dev
```
→ `http://localhost:5173` で確認

### ビルド
```bash
npm run build
```
→ `dist/` に本番用静的ファイル出力

### 段階的な機能実装
1. **基本CRUD** … タスクの追加・削除・完了チェック・localStorage保存
2. **編集機能 / 期限日 / フィルタ** … UI状態の追加と日付処理
3. **優先度 / 並び替え / 一括削除** … `useMemo` でソート結果をキャッシュ
4. **ドラッグ&ドロップ** … `@dnd-kit` 導入、コンポーネント分離（`SortableTodoItem`）
5. **ブラウザ通知** … 権限リクエスト + 1日1回通知ロジック

### デプロイ
1. `git init` → `git commit` → GitHubにpush
2. Vercel で GitHub リポジトリを Import
3. Vite を自動検出してビルド・デプロイ
4. 以後は git push で自動再デプロイ

---

## 4. 主要な技術概念

### React のフック
| フック | 用途 | 本アプリでの使用例 |
|--------|------|-------------------|
| `useState` | 状態管理 | タスク一覧、入力欄、編集中ID |
| `useEffect` | 副作用 | localStorage への自動保存、通知の発火 |
| `useMemo` | 計算結果のキャッシュ | フィルタ・ソート後のリスト |

### TypeScript の型定義
タスクの構造を `type Todo` として定義し、誤った型のデータが混入しないよう保証。
```ts
type Todo = {
  id: string
  text: string
  done: boolean
  dueDate?: string
  priority: 'high' | 'medium' | 'low'
  createdAt: number
}
```

### コンポーネント分離
`App.tsx` がロジックと状態を持ち、`SortableTodoItem.tsx` が個々のタスク表示を担当。Props経由でハンドラを受け渡す。

### イミュータブルな状態更新
`setTodos(prev => [...prev, newTodo])` のように既存配列を変更せず、新しい配列を作成。Reactの再レンダリング検知のために必須。

### localStorage 永続化パターン
- 初期化時: `useState(() => loadFromStorage())` でlazy初期化
- 更新時: `useEffect(() => saveToStorage(todos), [todos])` で自動同期

### ブラウザ通知のフロー
1. `Notification.permission` で現在の許可状態を確認
2. `Notification.requestPermission()` でユーザーに許可を求める
3. `new Notification(title, { body })` で通知を表示
4. 重複通知防止に「最後に通知した日付」を localStorage に記録

### Vite の役割
- **dev**: ESモジュールベースの高速HMR（ファイル変更で即反映）
- **build**: Rollup で本番向けに最適化（コード分割・圧縮・gzip）

### Vercel の自動デプロイ
GitHub リポジトリへの push を Webhook で検知 → Vite ビルドを実行 → `dist/` をCDNに配信。プレビューデプロイ機能でPRごとにURLが発行される。

---

## 5. プロジェクト構成

```
todo-app/
├── public/              # 静的ファイル
├── src/
│   ├── App.tsx          # メインロジック・状態管理
│   ├── App.css          # スタイル
│   ├── SortableTodoItem.tsx  # タスク1件の表示コンポーネント
│   ├── types.ts         # 型定義
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # グローバルスタイル
├── index.html           # HTMLテンプレート
├── package.json
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```

---

## 6. 今後の拡張候補

- カテゴリ / タグ機能
- サブタスク（ネストしたToDo）
- CSV/JSON エクスポート・インポート
- バックエンド連携（Supabase などで複数デバイス同期）
- ユーザー認証
- PWA化（オフライン対応・ホーム画面追加）
