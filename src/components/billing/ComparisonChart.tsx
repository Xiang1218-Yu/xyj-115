import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ComparisonData, ComparisonType } from '@/types';
import { cn } from '@/lib/utils';

interface ComparisonChartProps {
  data: ComparisonData[];
  comparisonType: ComparisonType;
  onBarClick?: (period: string) => void;
}

export default function ComparisonChart({ data, comparisonType, onBarClick }: ComparisonChartProps) {
  if (comparisonType === 'none' || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    period: item.period,
    当期: item.current,
    对比期: item.previous,
  }));

  const totalCurrent = data.reduce((sum, item) => sum + item.current, 0);
  const totalPrevious = data.reduce((sum, item) => sum + item.previous, 0);
  const totalDiff = totalCurrent - totalPrevious;
  const totalDiffPercent = totalPrevious > 0 ? (totalDiff / totalPrevious) * 100 : 0;

  const comparisonLabel = comparisonType === 'last_period' ? '环比' : '同比';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary-400" />
            {comparisonLabel}分析
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {comparisonType === 'last_period' ? '与上一周期对比' : '与去年同期对比'}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            {totalDiff > 0 ? (
              <TrendingUp className="w-5 h-5 text-red-400" />
            ) : totalDiff < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-400" />
            ) : (
              <Minus className="w-5 h-5 text-gray-400" />
            )}
            <span
              className={cn(
                'text-2xl font-bold',
                totalDiff > 0 ? 'text-red-400' : totalDiff < 0 ? 'text-green-400' : 'text-gray-400'
              )}
            >
              {totalDiff > 0 ? '+' : ''}{totalDiffPercent.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {comparisonLabel}{totalDiff > 0 ? '增加' : totalDiff < 0 ? '减少' : '持平'} ¥{Math.abs(totalDiff)}
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
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
              formatter={(value: number, name: string) => [`¥${value}`, name]}
            />
            <Legend
              formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
            />
            <Bar
              dataKey="当期"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              onClick={(data) => onBarClick?.(data.period)}
              cursor={onBarClick ? 'pointer' : 'default'}
            />
            <Bar
              dataKey="对比期"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              onClick={(data) => onBarClick?.(data.period)}
              cursor={onBarClick ? 'pointer' : 'default'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
        {data.slice(-3).map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-sm text-gray-400 mb-1">{item.period}</p>
            <p className="text-white font-semibold">¥{item.current}</p>
            <p
              className={cn(
                'text-xs font-medium',
                item.difference > 0 ? 'text-red-400' : item.difference < 0 ? 'text-green-400' : 'text-gray-400'
              )}
            >
              {item.difference > 0 ? '+' : ''}{item.differencePercent.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
