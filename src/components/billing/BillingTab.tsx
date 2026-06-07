import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Plus,
  Calendar,
  Receipt,
  Download
} from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useStore } from '@/store/useStore';
import { bills, categorySpending, monthlySpending } from '@/mock/subscriptions';
import { cn } from '@/lib/utils';
import TimeControls from '@/components/billing/TimeControls';
import TrendChart from '@/components/billing/TrendChart';
import ComparisonChart from '@/components/billing/ComparisonChart';
import PredictionChart from '@/components/billing/PredictionChart';
import AnomalyAlert from '@/components/billing/AnomalyAlert';
import DrillDownModal from '@/components/billing/DrillDownModal';
import type { TimeDimension, TimeRange, ComparisonType, DrillDownData as DrillDownDataType } from '@/types';
import {
  getComparisonData,
  predictSpending,
  detectAnomalies,
  getDrillDownData,
  getPresetTimeRanges,
} from '@/lib/billingAnalysis';
import { monthlySpending2025 } from '@/mock/subscriptions';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface BillingTabProps {
  activeSubscriptions: Array<{ id: string; price: number }>;
}

export default function BillingTab({ activeSubscriptions }: BillingTabProps) {
  const { downloadInvoice } = useStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [timeDimension, setTimeDimension] = useState<TimeDimension>('month');
  const presets = getPresetTimeRanges();
  const [timeRange, setTimeRange] = useState<TimeRange>(presets.thisYear);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('same_period_last_year');

  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownDataType | null>(null);
  const [dismissedAnomalies, setDismissedAnomalies] = useState<string[]>([]);

  const comparisonData = useMemo(() => getComparisonData(comparisonType), [comparisonType]);
  const predictionData = useMemo(() => predictSpending(monthlySpending2025.slice(0, 6), 6), []);
  const anomalies = useMemo(() => detectAnomalies(monthlySpending2025, 25), [])
    .filter(a => !dismissedAnomalies.includes(a.period));

  const handleBarClick = (period: string) => {
    const data = getDrillDownData(period);
    if (data) {
      setDrillDownData(data);
      setDrillDownOpen(true);
    }
  };

  const handleDismissAnomaly = (period: string) => {
    setDismissedAnomalies(prev => [...prev, period]);
  };

  const handleViewAnomalyDetail = (period: string) => {
    handleBarClick(period);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <TimeControls
        timeDimension={timeDimension}
        onTimeDimensionChange={setTimeDimension}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        comparisonType={comparisonType}
        onComparisonTypeChange={setComparisonType}
      />

      <AnomalyAlert
        anomalies={anomalies}
        onDismiss={handleDismissAnomaly}
        onViewDetail={handleViewAnomalyDetail}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart
          timeDimension={timeDimension}
          timeRange={timeRange}
          anomalies={anomalies}
          onBarClick={handleBarClick}
        />

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-secondary-400" />
              分类占比
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySpending.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`¥${value}`, '支出']}
                />
                <Legend
                  formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {comparisonType !== 'none' && (
        <div className="mb-6">
          <ComparisonChart
            data={comparisonData}
            comparisonType={comparisonType}
            onBarClick={handleBarClick}
          />
        </div>
      )}

      <div className="mb-6">
        <PredictionChart
          data={predictionData}
          onPointClick={handleBarClick}
        />
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary-400" />
            支付方式
          </h3>
          <button className="btn-outline text-sm">
            <Plus className="w-4 h-4" />
            添加支付方式
          </button>
        </div>
        <div className="bg-dark-900/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="text-white font-medium">•••• •••• •••• 4242</p>
              <p className="text-gray-500 text-sm">到期 12/2027</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-active">默认</span>
            <button className="text-gray-400 hover:text-white text-sm">编辑</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            账单历史
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">日期</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">描述</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">金额</th>
                <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">状态</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-300">{bill.date}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white">{bill.items.map(i => i.name).join(', ')}</p>
                      <p className="text-gray-500 text-sm">{bill.items.length} 个项目</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-white font-semibold">¥{bill.amount}</td>
                  <td className="py-4 px-4 text-center">
                    {bill.status === 'paid' && <span className="badge-active">已支付</span>}
                    {bill.status === 'pending' && <span className="badge-pending">待支付</span>}
                    {bill.status === 'failed' && <span className="badge-expired">支付失败</span>}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        setDownloadingId(bill.id);
                        downloadInvoice(activeSubscriptions[0]?.id || '');
                        setTimeout(() => setDownloadingId(null), 1000);
                      }}
                      disabled={downloadingId === bill.id}
                      className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 ml-auto disabled:opacity-50"
                    >
                      <Download className={cn('w-4 h-4', downloadingId === bill.id && 'animate-spin')} />
                      {downloadingId === bill.id ? '下载中' : '发票'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DrillDownModal
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
        data={drillDownData}
      />
    </motion.div>
  );
}
