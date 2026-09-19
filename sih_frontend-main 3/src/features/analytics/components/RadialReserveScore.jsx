import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RadialReserveScore({ score = 92.4, label = 'Reserve Confidence' }) {
  const data = [
    { name: 'score', value: score },
    { name: 'remaining', value: 100 - score },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={48} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              <Cell fill="#06b6d4" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-900">{score}%</span>
        </div>
      </div>
      <p className="text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}
