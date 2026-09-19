import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useZoneContext } from '@/context';
import Card from '@/components/common/Card/Card';
import CardHeader from '@/components/common/Card/CardHeader';
import CardContent from '@/components/common/Card/CardContent';

export default function ProductionVarianceChart() {
  const { zones } = useZoneContext();

  const data = zones.map((z) => ({
    name: z.code,
    target: z.monthlyTargetMT,
    actual: z.actualProductionMT,
    shortfall: z.shortfallMT,
  }));

  return (
    <Card>
      <CardHeader title="Production vs Target" subtitle="Monthly target variance by mine zone" />
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)' }}
                labelStyle={{ color: '#475569', fontWeight: 600 }}
              />
              <Bar dataKey="target" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Target (MT)" />
              <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actual (MT)" />
              <Bar dataKey="shortfall" fill="#ef4444" radius={[4, 4, 0, 0]} name="Shortfall (MT)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
