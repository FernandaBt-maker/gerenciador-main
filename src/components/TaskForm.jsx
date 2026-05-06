import { motion } from 'framer-motion'

export default function TaskForm({ newTask, setNewTask, onAddTask }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onAddTask}
      className="task-form"
    >
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Digite sua tarefa..."
        className="task-input"
      />
      <button className="task-button" type="submit">
        Adicionar tarefa
      </button>
    </motion.form>
  )
}
