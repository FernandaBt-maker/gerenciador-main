export default function TaskList({ title, tasks, emptyText, onToggle, onDelete, toggleText }) {
  return (
    <div className="task-box">
      <div className="task-box-header">
        <h2>{title}</h2>
        <span>{tasks.length} {title.includes('Dia') ? 'pendentes' : 'concluídas'}</span>
      </div>
      {tasks.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
              <span>{task.text}</span>
              <div className="actions">
                <button onClick={() => onToggle(task.id)} className={task.done ? 'undo-btn' : 'done-btn'}>
                  {toggleText}
                </button>
                <button onClick={() => onDelete(task.id)} className="delete-btn">
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
