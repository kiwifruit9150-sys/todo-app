import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Priority, Todo } from './types'

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

function isOverdue(dueDate: string | undefined, done: boolean): boolean {
  if (!dueDate || done) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

type Props = {
  todo: Todo
  isEditing: boolean
  editText: string
  editDue: string
  editPriority: Priority
  draggable: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onChangeEditText: (v: string) => void
  onChangeEditDue: (v: string) => void
  onChangeEditPriority: (v: Priority) => void
}

export function SortableTodoItem(props: Props) {
  const {
    todo,
    isEditing,
    editText,
    editDue,
    editPriority,
    draggable,
    onToggle,
    onRemove,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onChangeEditText,
    onChangeEditDue,
    onChangeEditPriority,
  } = props

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: !draggable })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${todo.done ? 'done' : ''} ${
        isOverdue(todo.dueDate, todo.done) ? 'overdue' : ''
      }`}
    >
      {isEditing ? (
        <form
          className="edit-form"
          onSubmit={(e) => {
            e.preventDefault()
            onSaveEdit()
          }}
        >
          <input
            type="text"
            value={editText}
            onChange={(e) => onChangeEditText(e.target.value)}
            autoFocus
          />
          <input
            type="date"
            value={editDue}
            onChange={(e) => onChangeEditDue(e.target.value)}
          />
          <select
            value={editPriority}
            onChange={(e) => onChangeEditPriority(e.target.value as Priority)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <button type="submit">保存</button>
          <button type="button" onClick={onCancelEdit}>
            取消
          </button>
        </form>
      ) : (
        <>
          {draggable && (
            <span
              className="drag-handle"
              {...attributes}
              {...listeners}
              aria-label="ドラッグして並び替え"
              title="ドラッグして並び替え"
            >
              ⋮⋮
            </span>
          )}
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <span className={`priority-tag p-${todo.priority}`}>
              {PRIORITY_LABEL[todo.priority]}
            </span>
            <span className="text">{todo.text}</span>
            {todo.dueDate && (
              <span className="due">期限: {todo.dueDate}</span>
            )}
          </label>
          <div className="actions">
            <button
              type="button"
              className="edit"
              onClick={() => onStartEdit(todo)}
              aria-label="編集"
            >
              ✎
            </button>
            <button
              type="button"
              className="delete"
              onClick={() => onRemove(todo.id)}
              aria-label="削除"
            >
              ×
            </button>
          </div>
        </>
      )}
    </li>
  )
}
