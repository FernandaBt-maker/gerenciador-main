export default function TaskStats({ total, finished, pending }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p>Tarefas totais</p>
        <strong>{total}</strong>
      </div>
      <div className="stat-card">
        <p>Concluídas</p>
        <strong>{finished}</strong>
      </div>
      <div className="stat-card">
        <p>Pendentes</p>
        <strong>{pending}</strong>
      </div>
    </div>
  )
}
