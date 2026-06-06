import type {
  Bill,
  MonthlySpending,
  TimeDimension,
  ComparisonType,
  ComparisonData,
  PredictionData,
  AnomalyData,
  DrillDownData,
  TimeRange,
} from '@/types';
import {
  monthlySpending2024,
  monthlySpending2025,
  allBills,
  dailySpending,
  weeklySpending,
  quarterlySpending,
  yearlySpending,
} from '@/mock/subscriptions';

export function calculateComparison(
  currentData: MonthlySpending[],
  previousData: MonthlySpending[]
): ComparisonData[] {
  return currentData.map((current, index) => {
    const previous = previousData[index]?.amount || 0;
    const difference = current.amount - previous;
    const differencePercent = previous > 0 ? (difference / previous) * 100 : 0;
    return {
      period: current.month,
      current: current.amount,
      previous,
      difference,
      differencePercent: Math.round(differencePercent * 100) / 100,
    };
  });
}

export function calculateSamePeriodLastYearComparison(): ComparisonData[] {
  return calculateComparison(monthlySpending2025.slice(0, 6), monthlySpending2024.slice(0, 6));
}

export function calculateLastPeriodComparison(): ComparisonData[] {
  const current = monthlySpending2025.slice(0, 6);
  const previous = monthlySpending2025.slice(6, 12);
  return calculateComparison(current, previous);
}

export function getComparisonData(type: ComparisonType): ComparisonData[] {
  switch (type) {
    case 'last_period':
      return calculateLastPeriodComparison();
    case 'same_period_last_year':
      return calculateSamePeriodLastYearComparison();
    default:
      return [];
  }
}

export function predictSpending(
  historicalData: MonthlySpending[],
  periodsToPredict: number = 6
): PredictionData[] {
  if (historicalData.length === 0) return [];

  const n = historicalData.length;
  const xSum = historicalData.reduce((sum, _, i) => sum + i, 0);
  const ySum = historicalData.reduce((sum, d) => sum + d.amount, 0);
  const xySum = historicalData.reduce((sum, d, i) => sum + i * d.amount, 0);
  const xSquaredSum = historicalData.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  const residuals = historicalData.map((d, i) => Math.abs(d.amount - (slope * i + intercept)));
  const stdDev = Math.sqrt(residuals.reduce((sum, r) => sum + r * r, 0) / n);

  const predictions: PredictionData[] = [];

  historicalData.forEach((d, i) => {
    const predicted = slope * i + intercept;
    predictions.push({
      period: d.month,
      actual: d.amount,
      predicted: Math.round(predicted * 100) / 100,
      lowerBound: Math.round((predicted - stdDev) * 100) / 100,
      upperBound: Math.round((predicted + stdDev) * 100) / 100,
    });
  });

  for (let i = 0; i < periodsToPredict; i++) {
    const index = n + i;
    const predicted = slope * index + intercept;
    const monthNames = ['7月', '8月', '9月', '10月', '11月', '12月'];
    predictions.push({
      period: monthNames[i] || `${index + 1}月`,
      predicted: Math.round(predicted * 100) / 100,
      lowerBound: Math.round((predicted - stdDev) * 100) / 100,
      upperBound: Math.round((predicted + stdDev) * 100) / 100,
    });
  }

  return predictions;
}

export function detectAnomalies(
  data: MonthlySpending[],
  thresholdPercent: number = 30
): AnomalyData[] {
  if (data.length < 3) return [];

  const anomalies: AnomalyData[] = [];
  const amounts = data.map(d => d.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  data.forEach((item) => {
    const deviation = Math.abs(item.amount - mean);
    const deviationPercent = mean > 0 ? (deviation / mean) * 100 : 0;

    if (deviationPercent > thresholdPercent) {
      const type = item.amount > mean ? 'high' : 'low';
      anomalies.push({
        period: item.month,
        amount: item.amount,
        type,
        expectedAmount: Math.round(mean * 100) / 100,
        deviationPercent: Math.round(deviationPercent * 100) / 100,
        description: type === 'high'
          ? `本月支出 ${item.amount} 元，高于平均值 ${Math.round(mean)} 元 ${Math.round(deviationPercent)}%，新增了订阅服务`
          : `本月支出 ${item.amount} 元，低于平均值 ${Math.round(mean)} 元 ${Math.round(deviationPercent)}%，取消了部分订阅`,
      });
    }
  });

  return anomalies;
}

export function getDrillDownData(period: string): DrillDownData | null {
  const monthIndex = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].indexOf(period);
  if (monthIndex === -1) return null;

  const monthStr = String(monthIndex + 1).padStart(2, '0');
  const monthBills = allBills.filter(bill => bill.date.startsWith(`2025-${monthStr}`));

  if (monthBills.length === 0) return null;

  const categoryMap: Record<string, string> = {
    'Figma': '设计工具',
    'Sketch': '设计工具',
    'GitHub': '开发工具',
    'VS Code': '开发工具',
    'Vercel': '开发工具',
    'AWS': '开发工具',
    'Notion': '协作工具',
    'Slack': '协作工具',
    'Linear': '协作工具',
  };

  const items = monthBills.flatMap(bill =>
    bill.items.map(item => {
      const categoryMatch = Object.keys(categoryMap).find(key => item.name.includes(key));
      return {
        name: item.name,
        amount: item.price * item.quantity,
        category: categoryMatch ? categoryMap[categoryMatch] : '其他',
        date: bill.date,
      };
    })
  );

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return {
    period,
    totalAmount,
    items,
  };
}

export function getDataByTimeDimension(
  dimension: TimeDimension,
  timeRange?: TimeRange
): { labels: string[]; data: number[] } {
  switch (dimension) {
    case 'day': {
      const filteredDaily = timeRange
        ? dailySpending.filter(d => d.date >= timeRange.start && d.date <= timeRange.end)
        : dailySpending;
      return {
        labels: filteredDaily.map(d => d.date.slice(5)),
        data: filteredDaily.map(d => d.amount),
      };
    }
    case 'week':
      return {
        labels: weeklySpending.map(w => w.week),
        data: weeklySpending.map(w => w.amount),
      };
    case 'month':
      return {
        labels: monthlySpending2025.map(m => m.month),
        data: monthlySpending2025.map(m => m.amount),
      };
    case 'quarter':
      return {
        labels: quarterlySpending.map(q => q.quarter),
        data: quarterlySpending.map(q => q.amount),
      };
    case 'year':
      return {
        labels: yearlySpending.map(y => y.year),
        data: yearlySpending.map(y => y.amount),
      };
    default:
      return { labels: [], data: [] };
  }
}

export function getSummaryStats(timeDimension: TimeDimension) {
  const data = getDataByTimeDimension(timeDimension);
  const total = data.data.reduce((a, b) => a + b, 0);
  const average = data.data.length > 0 ? total / data.data.length : 0;
  const max = Math.max(...data.data);
  const min = Math.min(...data.data.filter(v => v > 0));

  return { total, average, max, min };
}

export function getBillsByTimeRange(timeRange: TimeRange): Bill[] {
  return allBills.filter(bill => bill.date >= timeRange.start && bill.date <= timeRange.end);
}

export function getPresetTimeRanges() {
  const today = new Date('2025-06-06');
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);

  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  const last90Days = new Date(today);
  last90Days.setDate(today.getDate() - 90);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const thisYearStart = new Date(today.getFullYear(), 0, 1);
  const thisYearEnd = new Date(today.getFullYear(), 11, 31);

  return {
    last7Days: { start: formatDate(last7Days), end: formatDate(today), label: '最近7天' },
    last30Days: { start: formatDate(last30Days), end: formatDate(today), label: '最近30天' },
    last90Days: { start: formatDate(last90Days), end: formatDate(today), label: '最近90天' },
    thisMonth: { start: formatDate(thisMonthStart), end: formatDate(thisMonthEnd), label: '本月' },
    lastMonth: { start: formatDate(lastMonthStart), end: formatDate(lastMonthEnd), label: '上月' },
    thisYear: { start: formatDate(thisYearStart), end: formatDate(thisYearEnd), label: '今年' },
  };
}
