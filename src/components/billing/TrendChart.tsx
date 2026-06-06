import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TimeDimension, TimeRange, AnomalyData } from '@/types';
import { getDataByTimeDimension, getSummaryStats } from '@/lib/billingAnalysis';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  timeDimension: TimeDimension;
  timeRange: TimeRange;
  anomalies: AnomalyData[];
  onBarClick?: (period: string) => void;
}

const ANOMALY_COLORS = {
  high: '#ef4444',
  normal: '#8b5cf6',
  low: '#3b82f6',
};

export default function TrendChart({
  timeDimension,
  timeRange,
  anomalies,
  onBarClick,
}: TrendChartProps) {
  const chartData = useMemo(() => {
    const { labels, data } = getDataByTimeDimension(timeDimension, timeRange);
    return labels.map((label, index) => ({
      period: label,
      amount: data[index],
      isAnomaly: anomalies.some((a) => a.period === label),
      anomalyType: anomalies.find((a) => a.period === label)?.type,
    }));
  }, [timeDimension, timeRange, anomalies]);

  const stats = useMemo(() => getSummaryStats(timeDimension), [timeDimension]);

  const dimensionLabel = {
    day: '日',
    week: '周',
    month: '月',
    quarter: '季度',
    year: '年',
  }[timeDimension];

  const getBarColor = (entry: { isAnomaly: boolean; anomalyType?: 'high' | 'low' }) => {
    if (!entry.isAnomaly) return ANOMALY_COLORS.normal;
    return entry.anomalyType === 'high' ? ANOMALY_COLORS.high : ANOMALY_COLORS.low;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            支出趋势
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            按{dimensionLabel}度统计，点击柱形可查看明细
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">¥{stats.total.toFixed(0)}</p>
            <p className="text-xs text-gray-500">总支出</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-400">¥{stats.average.toFixed(0)}</p>
            <p className="text-xs text-gray-500">平均{dimensionLabel}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">¥{stats.max}</p>
            <p className="text-xs text-gray-500">最高</p>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              formatter={(value: number) => [`¥${value}`, '支出']}
              labelFormatter={(label) => `${dimensionLabel}: ${label}`}
            />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              onClick={(data) => onBarClick?.(data.period)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry)}
                  className={cn('transition-all duration-300 hover:opacity-80')}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {anomalies.length > 0 && (
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-400">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-400">消费过高</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-400">消费过低</span>
          </div>
        </div>
      )}
    </div>
  );
}
