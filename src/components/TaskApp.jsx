import { useEffect, useMemo, useState } from 'react'
import TaskForm from './TaskForm'
import TaskStats from './TaskStats'
import TaskList from './TaskList'
import ConsistencyChart from './ConsistencyChart'

// Chave usada no localStorage para lembrar as tarefas.
const STORAGE_KEY = 'taskapp-v1'

// Tarefas iniciais exibidas na primeira vez que abre o app.
const INITIAL_TASKS = [
  {
    id: 1,
    text: 'Aprender React',
    done: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: 2,
    text: 'Planejar rotina de estudos',
    done: true,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
]

// Nomes curtos para os dias da semana para mostrar no gráfico.
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Retorna YYYY-MM-DD para agrupar por dia.
function getDayKey(date) {
  return new Date(date).toISOString().split('T')[0]
}

// Cria os últimos 7 dias para preencher o gráfico.
function last7Days() {
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days.push(d)
  }
  return days
}

export default function TaskApp() {
  // Estado de tarefas, inicializado a partir do localStorage.
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_TASKS
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
      return INITIAL_TASKS
    } catch {
      return INITIAL_TASKS
    }
  })

  // texto atual do input para nova tarefa.
  const [newTask, setNewTask] = useState('')

  // Sempre que tarefas mudam, salvamos no localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // Cria listas derivadas para tarefas concluídas e pendentes.
  const finishedTasks = useMemo(() => tasks.filter((task) => task.done), [tasks])
  const pendingTasks = useMemo(() => tasks.filter((task) => !task.done), [tasks])

  // Gera dados do gráfico de constância dos últimos 7 dias.
  const consistencyData = useMemo(() => {
    const byDate = {}

    // Conta quantas tarefas foram concluídas em cada dia.
    tasks.forEach((task) => {
      if (task.completedAt) {
        const k = getDayKey(task.completedAt)
        byDate[k] = (byDate[k] || 0) + 1
      }
    })

    const days = last7Days()
    return days.map((day) => {
      const key = getDayKey(day)
      return {
        day: WEEK_DAYS[day.getDay()],
        tasks: byDate[key] || 0,
      }
    })
  }, [tasks])

  // Adiciona nova tarefa com data de criação.
  const handleAddTask = (e) => {
    e.preventDefault()
    const text = newTask.trim()
    if (!text) return

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
    ])

    setNewTask('')
  }

  // Alterna tarefas entre concluída/pendente e define completedAt.
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task
        if (task.done) {
          // Reabrir tarefa: continua pendente.
          return { ...task, done: false, completedAt: null }
        }
        // Marcar concluída e salvar data de conclusão.
        return { ...task, done: true, completedAt: new Date().toISOString() }
      }),
    )
  }

  // Apaga tarefa.
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Tarefas</h1>
          <p className="text-green-300">Adicione, conclua, mova para pendentes e apague tarefas com facilidade.</p>
        </div>

        {/* Passa dados e callbacks para componentes filhos */}
        <TaskForm newTask={newTask} setNewTask={setNewTask} onAddTask={handleAddTask} />
        <TaskStats total={tasks.length} finished={finishedTasks.length} pending={pendingTasks.length} />
        <ConsistencyChart data={consistencyData} />

        <div className="list-grid">
          <TaskList
            title="Tarefas do Dia"
            tasks={pendingTasks}
            emptyText="Nenhuma tarefa pendente."
            onToggle={toggleTask}
            onDelete={deleteTask}
            toggleText="Concluir"
          />
          <TaskList
            title="Ações Não Concluídas"
            tasks={finishedTasks}
            emptyText="Nenhuma tarefa concluída ainda."
            onToggle={toggleTask}
            onDelete={deleteTask}
            toggleText="Reabrir"
          />
        </div>
      </div>
    </div>
  )
}
