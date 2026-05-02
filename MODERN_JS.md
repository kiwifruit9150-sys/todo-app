# モダンJavaScript 学習ロードマップ

本プロジェクトで使用した「モダンJavaScript（ES2015以降）」の技術を、**推奨学習順序**で整理したものです。
（前提: HTML / CSS / JavaScript の基本構文・DOM操作は既習）

---

## Step 1: 変数宣言の刷新

### 1. `let` / `const`
- `var` の問題点（関数スコープ・巻き上げ）
- ブロックスコープを持つ `let` / `const`
- 「再代入しないものは `const`」を基本ルールに
```ts
const STORAGE_KEY = 'todo-app:todos'   // 再代入しない
let editingId: string | null = null    // 後で変わる可能性
```
- **本プロジェクト**: ほぼ全行で使用

---

## Step 2: 関数の書き方

### 2. アロー関数
- `function` 式との違い
- `this` の扱いがレキシカル（外側の `this` を引き継ぐ）
- 1引数なら `()` 省略可、式1つなら `{}` と `return` 省略可
```ts
const addTodo = () => { ... }
todos.filter(t => !t.done)
setTodos(prev => [...prev, newTodo])
```
- **本プロジェクト**: ハンドラ・コールバックすべて

### 3. デフォルト引数
```ts
function loadTodos(initial: Todo[] = []) { ... }
```

### 4. 関数の即時実行と高階関数
- 関数を引数として渡す感覚を身につける
- **本プロジェクト**: `setTodos(prev => ...)` のような関数型更新

---

## Step 3: 文字列とリテラル

### 5. テンプレートリテラル
- バッククォート `` ` `` で囲み、`${}` で値を埋め込む
- 改行をそのまま含められる
```ts
className={`${todo.done ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}
`期限のタスクが ${due.length} 件あります`
```
- **本プロジェクト**: 動的なクラス名・通知メッセージ

---

## Step 4: 真偽値・条件式の表現力

### 6. 三項演算子
```ts
filter === 'all' ? 'すべて' : filter === 'active' ? '未完了' : '完了'
```
- **本プロジェクト**: 条件付きレンダリングで多用

### 7. 短絡評価 `&&` `||`
- `A && B` … Aが真ならBを評価して返す
- `A || B` … Aが偽ならBを返す（デフォルト値として使われがち）
```tsx
{todo.dueDate && <span>期限: {todo.dueDate}</span>}
```
- **本プロジェクト**: JSX内の条件付き表示

### 8. Nullish合体演算子 `??`
- `||` との違い: `0` や `''` を「値あり」と扱う
```ts
priority: t.priority ?? 'medium'
```
- **本プロジェクト**: localStorage復元時のデフォルト値

### 9. オプショナルチェイニング `?.`（応用）
- `obj?.prop` で nullish の場合に短絡
- 本プロジェクトでは未使用だが、必修知識

---

## Step 5: オブジェクトと配列の操作

### 10. オブジェクトリテラル拡張
- プロパティショートハンド `{ text, done }` （変数名と同じキー）
- 計算プロパティ名 `{ [key]: value }`
```ts
{
  id: crypto.randomUUID(),
  text,            // text: text の省略
  done: false,
  priority: priorityInput,
}
```
- **本プロジェクト**: タスク作成時

### 11. 分割代入（オブジェクト）
```ts
const { active, over } = event
const { todo, isEditing, onToggle } = props
```
- **本プロジェクト**: Props展開、イベントオブジェクト分解

### 12. 分割代入（配列）
```ts
const [count, setCount] = useState(0)
```
- **本プロジェクト**: Reactフックの戻り値（配列分割）

### 13. スプレッド構文 `...`
- 配列・オブジェクトの「コピーして一部変更」を簡潔に書く
```ts
[...prev, newTodo]                      // 配列に追加
{ ...t, done: !t.done }                 // オブジェクトの一部変更
```
- **本プロジェクト**: イミュータブルな状態更新の中心技術

### 14. レストパラメータ `...args`
- スプレッドの逆。可変長引数を配列でまとめて受け取る
- 本プロジェクトでは未使用だが対概念として理解

---

## Step 6: 配列メソッド（関数型スタイル）

### 15. 基本: `map` / `filter` / `find`
- すべて元の配列を変更しない（イミュータブル）
```ts
todos.filter(t => !t.done)                          // 未完了だけ
todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
prev.findIndex(t => t.id === active.id)
```
- **本プロジェクト**: フィルタ・トグル・編集すべて

### 16. 並び替え: `sort`
- 比較関数を渡す `(a, b) => 数値`
- ⚠️ 元の配列を変更するので `[...arr].sort(...)` でコピー
```ts
[...filtered].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
```
- **本プロジェクト**: 優先度・期限日ソート

### 17. その他: `slice` / `reduce` / `some` / `every`
```ts
due.slice(0, 5)                          // 先頭5件
```
- **本プロジェクト**: 通知メッセージで `slice`

### 18. 文字列の比較: `localeCompare`
```ts
a.dueDate.localeCompare(b.dueDate)
```
- **本プロジェクト**: 日付文字列のソート

---

## Step 7: モジュールシステム

### 19. ES Modules（ESM）
- `export` / `import` の構文
- `default export` と `named export` の使い分け
- ファイル単位でスコープ分離
```ts
// types.ts
export type Todo = { ... }

// App.tsx
import type { Priority, Todo } from './types'
import { SortableTodoItem } from './SortableTodoItem'
```
- **本プロジェクト**: 全 `.ts` / `.tsx` ファイル

### 20. `import type`
- 型のみのインポート（ランタイムで消える）を明示
```ts
import type { DragEndEvent } from '@dnd-kit/core'
```
- **本プロジェクト**: TypeScriptとの組み合わせで活躍

---

## Step 8: 非同期処理

### 21. Promise の基礎
- 非同期処理の結果を表すオブジェクト
- `.then()` / `.catch()` のチェーン
- 状態: pending / fulfilled / rejected

### 22. `async` / `await`
- Promiseを同期的に書ける構文糖
- `async function` の戻り値は自動でPromise
```ts
const requestNotifyPermission = async () => {
  const result = await Notification.requestPermission()
  setNotifyPermission(result)
}
```
- **本プロジェクト**: 通知許可リクエスト

### 23. エラーハンドリング: `try` / `catch`
- 同期にも非同期(`await`)にも使える
```ts
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? (JSON.parse(raw) as Todo[]) : []
} catch {
  return []
}
```
- **本プロジェクト**: localStorage読み込み時の壊れデータ対策

---

## Step 9: データ表現

### 24. JSON
- `JSON.stringify(obj)` … オブジェクト → 文字列
- `JSON.parse(str)` … 文字列 → オブジェクト
- localStorageは文字列しか扱えないため必須
```ts
localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
JSON.parse(raw) as Todo[]
```
- **本プロジェクト**: 永続化のシリアライズ

### 25. `Date` オブジェクト
- `new Date()` / `getFullYear()` / `getMonth()`
- 日付比較の落とし穴（時刻成分のリセット）
```ts
const today = new Date()
today.setHours(0, 0, 0, 0)
return new Date(dueDate) < today
```
- **本プロジェクト**: 期限切れ判定

### 26. 日付の文字列表現
- ISO 8601 形式 `YYYY-MM-DD` は文字列のまま比較可能
- `<input type="date">` の値もこの形式
```ts
return a.dueDate.localeCompare(b.dueDate)
```
- **本プロジェクト**: 期限日ソート

---

## Step 10: その他のWeb API・新機能

### 27. `crypto.randomUUID()`
- ランダムなID文字列を生成（衝突実質ゼロ）
```ts
id: crypto.randomUUID()
```
- **本プロジェクト**: タスクID生成

### 28. ブラウザストレージAPI
- `localStorage.setItem` / `getItem` / `removeItem`
- 同期API・容量約5MB・文字列のみ
- **本プロジェクト**: タスクと通知日付の永続化

### 29. 通知API
- `Notification.permission` で状態確認
- `Notification.requestPermission()` で許可リクエスト
- `new Notification(title, options)` で通知表示
- **本プロジェクト**: 期限通知

---

## Step 11: 型システム連携（TypeScript視点で再学習）

JavaScriptの基礎を押さえたら、TypeScriptで以下が組み合わさる:

### 30. ジェネリクス
- `Array<T>` / `Record<K, V>` / `useState<T>()`

### 31. ユニオン型・リテラル型
- `'high' | 'medium' | 'low'` のような型は実行時には文字列だが、型レベルで限定される

### 32. 型ガード
- `typeof Notification === 'undefined'` のような実行時チェックで型が絞り込まれる
```ts
if (typeof Notification === 'undefined') return
```

---

## 学習のヒント

- **小さなサンプルで試す**: 各機能はブラウザのコンソール `F12` でも試せる。例: `[1,2,3].map(n => n * 2)`
- **MDNを引く癖をつける**: [developer.mozilla.org](https://developer.mozilla.org) はJavaScript全機能の正典
- **「なぜスプレッドが必要か」を理解する**: モダンJSで最も重要な概念。Reactの状態更新やfunctionalな思考の根幹
- **エラーメッセージを読む**: `Cannot read property 'x' of undefined` などは Optional chaining の必要性を教えてくれる
- **TypeScriptに移る前にJSの基礎を固める**: 型エラーかロジックエラーか切り分けやすくなる
