import { AlertTriangle, TrendingUp, TrendingDown, X } from 'lucide-react';
import type { AnomalyData } from '@/types';
import { cn } from '@/lib/utils';

interface AnomalyAlertProps {
  anomalies: AnomalyData[];
  onDismiss?: (period: string) => void;
  onViewDetail?: (period: string) => void;
}

export default function AnomalyAlert({ anomalies, onDismiss, onViewDetail }: AnomalyAlertProps) {
  if (anomalies.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">异常消费提醒</h3>
        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
          {anomalies.length} 项
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anomalies.map((anomaly, index) => (
          <div
            key={index}
            className={cn(
              'relative rounded-xl p-4 border transition-all hover:shadow-lg',
              anomaly.type === 'high'
                ? 'bg-red-500/10 border-red-500/30 hover:border-red-400/50'
                : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400/50'
            )}
          >
            {onDismiss && (
              <button
                onClick={() => onDismiss(anomaly.period)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  anomaly.type === 'high' ? 'bg-red-500/20' : 'bg-blue-500/20'
                )}
              >
                {anomaly.type === 'high' ? (
                  <TrendingUp className="w-5 h-5 text-red-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{anomaly.period}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full font-medium',
                      anomaly.type === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    )}
                  >
                    {anomaly.type === 'high' ? '消费过高' : '消费过低'}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-2">
                  支出 <span className="text-white font-medium">¥{anomaly.amount}</span>
                  {' / '}
                  预期 <span className="text-gray-500">¥{anomaly.expectedAmount}</span>
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        anomaly.type === 'high' ? 'bg-red-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${Math.min(anomaly.deviationPercent, 100)}%` }}
                    ></div>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      anomaly.type === 'high' ? 'text-red-400' : 'text-blue-400'
                    )}
                  >
                    {anomaly.type === 'high' ? '+' : ''}{anomaly.deviationPercent}%
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-3">{anomaly.description}</p>

                {onViewDetail && (
                  <button
                    onClick={() => onViewDetail(anomaly.period)}
                    className={cn(
                      'text-xs font-medium transition-colors',
                      anomaly.type === 'high'
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-blue-400 hover:text-blue-300'
                    )}
                  >
                    查看详情 →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
