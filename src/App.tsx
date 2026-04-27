import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableTodoItem } from './SortableTodoItem'
import type { Priority, Todo } from './types'
import './App.css'

type Filter = 'all' | 'active' | 'completed'
type SortBy = 'manual' | 'priority' | 'dueDate'

const STORAGE_KEY = 'todo-app:todos'
const NOTIFY_KEY = 'todo-app:lastNotifyDate'

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function todayString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getDueOrOverdue(todos: Todo[]): Todo[] {
  const today = todayString()
  return todos.filter(
    (t) => !t.done && t.dueDate && t.dueDate <= today,
  )
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<Todo>[]
    return parsed.map((t, i) => ({
      id: t.id ?? crypto.randomUUID(),
      text: t.text ?? '',
      done: t.done ?? false,
      dueDate: t.dueDate,
      priority: t.priority ?? 'medium',
      createdAt: t.createdAt ?? i,
    }))
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())
  const [input, setInput] = useState('')
  const [dueInput, setDueInput] = useState('')
  const [priorityInput, setPriorityInput] = useState<Priority>('medium')
  const [filter, setFilter] = useState<Filter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('manual')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editDue, setEditDue] = useState('')
  const [editPriority, setEditPriority] = useState<Priority>('medium')

  const [notifyPermission, setNotifyPermission] =
    useState<NotificationPermission>(
      typeof Notification !== 'undefined' ? Notification.permission : 'denied',
    )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if (typeof Notification === 'undefined') return
    if (notifyPermission !== 'granted') return

    const today = todayString()
    const lastNotify = localStorage.getItem(NOTIFY_KEY)
    if (lastNotify === today) return

    const due = getDueOrOverdue(todos)
    if (due.length === 0) return

    const body = due
      .slice(0, 5)
      .map((t) => `・${t.text}（${t.dueDate}）`)
      .join('\n')
    const more = due.length > 5 ? `\n…ほか ${due.length - 5} 件` : ''

    new Notification(`期限のタスクが ${due.length} 件あります`, {
      body: body + more,
    })
    localStorage.setItem(NOTIFY_KEY, today)
  }, [todos, notifyPermission])

  const requestNotifyPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('このブラウザは通知に対応していません')
      return
    }
    const result = await Notification.requestPermission()
    setNotifyPermission(result)
  }

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        done: false,
        dueDate: dueInput || undefined,
        priority: priorityInput,
        createdAt: Date.now(),
      },
    ])
    setInput('')
    setDueInput('')
    setPriorityInput('medium')
  }

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )

  const removeTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id))

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.done))

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditDue(todo.dueDate ?? '')
    setEditPriority(todo.priority)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditDue('')
    setEditPriority('medium')
  }

  const saveEdit = () => {
    const text = editText.trim()
    if (!text || !editingId) {
      cancelEdit()
      return
    }
    setTodos((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              text,
              dueDate: editDue || undefined,
              priority: editPriority,
            }
          : t,
      ),
    )
    cancelEdit()
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id)
      const newIndex = prev.findIndex((t) => t.id === over.id)
      if (oldIndex < 0 || newIndex < 0) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const visibleTodos = useMemo(() => {
    const filtered = todos.filter((t) => {
      if (filter === 'active') return !t.done
      if (filter === 'completed') return t.done
      return true
    })

    if (sortBy === 'priority') {
      return [...filtered].sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
      )
    }
    if (sortBy === 'dueDate') {
      return [...filtered].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
    }
    return filtered
  }, [todos, filter, sortBy])

  const isDraggable = sortBy === 'manual' && filter === 'all' && !editingId
  const remaining = todos.filter((t) => !t.done).length
  const completedCount = todos.length - remaining

  return (
    <main className="container">
      <div className="header">
        <h1>ToDo</h1>
        {notifyPermission !== 'granted' && (
          <button
            type="button"
            className="notify-btn"
            onClick={requestNotifyPermission}
            title="期限が来たタスクを通知します"
          >
            🔔 通知を有効化
          </button>
        )}
        {notifyPermission === 'granted' && (
          <span className="notify-status" title="通知が有効です">
            🔔 ON
          </span>
        )}
      </div>

      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault()
          addTodo()
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="やることを入力..."
          aria-label="新しいタスク"
        />
        <input
          type="date"
          value={dueInput}
          onChange={(e) => setDueInput(e.target.value)}
          aria-label="期限日"
        />
        <select
          value={priorityInput}
          onChange={(e) => setPriorityInput(e.target.value as Priority)}
          aria-label="優先度"
        >
          <option value="high">優先度: 高</option>
          <option value="medium">優先度: 中</option>
          <option value="low">優先度: 低</option>
        </select>
        <button type="submit">追加</button>
      </form>

      <div className="controls">
        <div className="filters">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
            </button>
          ))}
        </div>
        <label className="sort">
          並び替え:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="manual">手動（D&D）</option>
            <option value="priority">優先度</option>
            <option value="dueDate">期限日</option>
          </select>
        </label>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                editText={editText}
                editDue={editDue}
                editPriority={editPriority}
                draggable={isDraggable}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onChangeEditText={setEditText}
                onChangeEditDue={setEditDue}
                onChangeEditPriority={setEditPriority}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="footer">
        {todos.length === 0 ? (
          <p className="empty">タスクはまだありません</p>
        ) : (
          <p className="status">残り {remaining} 件</p>
        )}
        {completedCount > 0 && (
          <button
            type="button"
            className="clear-completed"
            onClick={clearCompleted}
          >
            完了済みを削除 ({completedCount})
          </button>
        )}
      </div>
    </main>
  )
}

export default App
