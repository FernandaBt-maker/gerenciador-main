import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function ConsistencyChart({ data }) {
  return (
    <div className="chart-box">
      <div className="task-box-header">
        <h2>Gráfico de Constância</h2>
        <span>Concluídas por dia</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#4ade80" />
            <YAxis stroke="#4ade80" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1f11',
                border: '1px solid #4ade80',
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="tasks" stroke="#22c55e" strokeWidth={3} dot={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
