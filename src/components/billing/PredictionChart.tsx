import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Sparkles } from 'lucide-react';
import type { PredictionData } from '@/types';

interface PredictionChartProps {
  data: PredictionData[];
  onPointClick?: (period: string) => void;
}

export default function PredictionChart({ data, onPointClick }: PredictionChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((item) => ({
    period: item.period,
    实际支出: item.actual,
    预测支出: item.predicted,
    置信上限: item.upperBound,
    置信下限: item.lowerBound,
    isPrediction: item.actual === undefined,
  }));

  const totalPredicted = data
    .filter((d) => d.actual === undefined)
    .reduce((sum, d) => sum + d.predicted, 0);

  const avgMonthlyPredicted = data.filter((d) => d.actual === undefined).length > 0
    ? totalPredicted / data.filter((d) => d.actual === undefined).length
    : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            支出预测分析
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            基于历史数据的线性回归预测，含置信区间
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-400">¥{totalPredicted.toFixed(0)}</p>
          <p className="text-sm text-gray-400">预测未来总支出</p>
          <p className="text-xs text-gray-500">月均 ¥{avgMonthlyPredicted.toFixed(0)}</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number, name: string) => [`¥${value.toFixed(2)}`, name]}
            />
            <Legend
              formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="置信上限"
              stroke="none"
              fill="url(#confidenceGradient)"
              strokeWidth={0}
            />
            <Area
              type="monotone"
              dataKey="置信下限"
              stroke="none"
              fill="#0a0a0f"
              strokeWidth={0}
            />
            <Line
              type="monotone"
              dataKey="实际支出"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, onClick: (props: unknown) => onPointClick?.((props as { payload: { period: string } }).payload.period) }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="预测支出"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4, onClick: (props: unknown) => onPointClick?.((props as { payload: { period: string } }).payload.period) }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-400">实际支出</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-yellow-500 border-dashed"></div>
          <span className="text-sm text-gray-400">预测支出</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500/20"></div>
          <span className="text-sm text-gray-400">95% 置信区间</span>
        </div>
      </div>
    </div>
  );
}
