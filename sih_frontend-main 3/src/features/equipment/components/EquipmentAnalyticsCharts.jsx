import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import Card from '@/components/common/Card/Card';
import CardHeader from '@/components/common/Card/CardHeader';
import CardContent from '@/components/common/Card/CardContent';
import { getDowntimeCausesBreakdown, getMonthlyDowntimeTrend } from '@/data/equipmentData';

export default function EquipmentAnalyticsCharts({ equipmentList }) {
  // Aggregate downtime & availability by mine
  const mineChartData = Object.values(
    equipmentList.reduce((acc, eq) => {
      const code = eq.mineCode || eq.mineName;
      if (!acc[code]) {
        acc[code] = {
          mine: code,
          totalDowntime: 0,
          avgAvailability: 0,
          count: 0,
        };
      }
      acc[code].totalDowntime += eq.avgDowntimeHours;
      acc[code].avgAvailability += eq.availabilityPct;
      acc[code].count += 1;
      return acc;
    }, {})
  ).map((item) => ({
    mine: item.mine,
    avgDowntime: Number((item.totalDowntime / item.count).toFixed(1)),
    availability: Number((item.avgAvailability / item.count).toFixed(1)),
  }));

  const downtimeCauses = getDowntimeCausesBreakdown();
  const monthlyTrend = getMonthlyDowntimeTrend();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Downtime & Availability per Mine */}
      <Card className="lg:col-span-2">
        <CardHeader
          title="Mine Site Equipment Downtime & Availability"
          subtitle="Average monthly downtime hours vs fleet availability by mine location"
        />
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mine" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="avgDowntime" name="Avg Downtime (hrs)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availability" name="Fleet Availability (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Root Causes Donut Chart */}
      <Card className="lg:col-span-1">
        <CardHeader title="Downtime Root Causes" subtitle="Distribution of downtime hours by failure category" />
        <CardContent>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={downtimeCauses}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {downtimeCauses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, item) => [`${value}% (${item.payload.hours} hrs)`, item.payload.name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2 max-h-[100px] overflow-y-auto pr-1">
            {downtimeCauses.map((cause) => (
              <div key={cause.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cause.color }} />
                  <span className="text-slate-600 truncate">{cause.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{cause.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Downtime Trend */}
      <Card className="lg:col-span-3">
        <CardHeader
          title="6-Month Fleet Downtime & Maintenance Expense Trend"
          subtitle="Tracking total monthly downtime hours alongside maintenance operational expenditure"
        />
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="downtimeHrs"
                  name="Total Downtime (hrs)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="maintenanceCost"
                  name="Maintenance Cost ($)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
