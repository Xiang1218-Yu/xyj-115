import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DrillDownData } from '@/types';
import { cn } from '@/lib/utils';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  '设计工具': 'bg-purple-500',
  '开发工具': 'bg-cyan-500',
  '协作工具': 'bg-emerald-500',
  '其他': 'bg-gray-500',
};

export default function DrillDownModal({ isOpen, onClose, data }: DrillDownModalProps) {
  if (!data) return null;

  const categoryTotals = data.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-dark-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white">{data.period} 支出明细</h2>
                <p className="text-sm text-gray-400 mt-1">
                  共 {data.items.length} 笔消费，总计{' '}
                  <span className="text-primary-400 font-semibold">¥{data.totalAmount}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {sortedCategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">分类汇总</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sortedCategories.map(([category, amount]) => (
                      <div
                        key={category}
                        className="bg-dark-800/50 rounded-xl p-4 border border-gray-800"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn('w-2 h-2 rounded-full', CATEGORY_COLORS[category] || CATEGORY_COLORS['其他'])}
                          ></div>
                          <span className="text-sm text-gray-400">{category}</span>
                        </div>
                        <p className="text-lg font-bold text-white">¥{amount}</p>
                        <p className="text-xs text-gray-500">
                          {((amount / data.totalAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">消费明细</h3>
                <div className="space-y-2">
                  {data.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl border border-gray-800 hover:bg-dark-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            CATEGORY_COLORS[item.category]
                              ? `${CATEGORY_COLORS[item.category].replace('bg-', 'bg-').replace('500', '500/20')}`
                              : 'bg-gray-500/20'
                          )}
                        >
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full',
                              CATEGORY_COLORS[item.category] || CATEGORY_COLORS['其他']
                            )}
                          ></span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                color: item.category === '设计工具' ? '#a78bfa' :
                                       item.category === '开发工具' ? '#22d3ee' :
                                       item.category === '协作工具' ? '#34d399' : '#9ca3af',
                                backgroundColor: item.category === '设计工具' ? 'rgba(167, 139, 250, 0.2)' :
                                                 item.category === '开发工具' ? 'rgba(34, 211, 238, 0.2)' :
                                                 item.category === '协作工具' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                              }}
                            >
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">¥{item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                数据来源：订阅账单系统自动记录
              </div>
              <button className="btn-outline text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出明细
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
