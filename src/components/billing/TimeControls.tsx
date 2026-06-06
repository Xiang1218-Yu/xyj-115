import { useState } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import type { TimeDimension, TimeRange, ComparisonType } from '@/types';
import { getPresetTimeRanges } from '@/lib/billingAnalysis';
import { cn } from '@/lib/utils';

interface TimeControlsProps {
  timeDimension: TimeDimension;
  onTimeDimensionChange: (dim: TimeDimension) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  comparisonType: ComparisonType;
  onComparisonTypeChange: (type: ComparisonType) => void;
}

const DIMENSION_OPTIONS: { id: TimeDimension; label: string }[] = [
  { id: 'day', label: '日' },
  { id: 'week', label: '周' },
  { id: 'month', label: '月' },
  { id: 'quarter', label: '季' },
  { id: 'year', label: '年' },
];

const COMPARISON_OPTIONS: { id: ComparisonType; label: string }[] = [
  { id: 'none', label: '不对比' },
  { id: 'last_period', label: '环比' },
  { id: 'same_period_last_year', label: '同比' },
];

export default function TimeControls({
  timeDimension,
  onTimeDimensionChange,
  timeRange,
  onTimeRangeChange,
  comparisonType,
  onComparisonTypeChange,
}: TimeControlsProps) {
  const [showPresets, setShowPresets] = useState(false);
  const presets = getPresetTimeRanges();

  const presetList = Object.values(presets);

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="flex items-center gap-2 bg-dark-800/50 rounded-xl p-1 w-fit">
          {DIMENSION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onTimeDimensionChange(opt.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                timeDimension === opt.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-800/50 rounded-xl text-gray-300 hover:bg-dark-800 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{timeRange.start} ~ {timeRange.end}</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', showPresets && 'rotate-180')} />
          </button>

          {showPresets && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-dark-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {presetList.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onTimeRangeChange({ start: preset.start, end: preset.end });
                    setShowPresets(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex justify-between items-center transition-colors"
                >
                  <span>{preset.label}</span>
                  <span className="text-gray-500 text-xs">{preset.start}</span>
                </button>
              ))}
              <div className="border-t border-gray-700 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">开始日期</label>
                    <input
                      type="date"
                      value={timeRange.start}
                      onChange={(e) => onTimeRangeChange({ ...timeRange, start: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">结束日期</label>
                    <input
                      type="date"
                      value={timeRange.end}
                      onChange={(e) => onTimeRangeChange({ ...timeRange, end: e.target.value })}
                      className="w-full px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-1 bg-dark-800/50 rounded-xl p-1">
          {COMPARISON_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onComparisonTypeChange(opt.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                comparisonType === opt.id
                  ? 'bg-secondary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
