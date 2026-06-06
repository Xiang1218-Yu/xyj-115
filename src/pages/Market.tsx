import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { useStore } from '@/store/useStore';
import { categories } from '@/mock/tools';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export default function Market() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredTools, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'price-high'>('popular');

  useEffect(() => {
    const categoryParam = searchParams.get('category') as Category | null;
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, setSelectedCategory]);

  const filteredTools = getFilteredTools();
  
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return Math.min(...a.plans.map(p => p.price)) - Math.min(...b.plans.map(p => p.price));
      case 'price-high':
        return Math.min(...b.plans.map(p => p.price)) - Math.min(...a.plans.map(p => p.price));
      default:
        return b.usersCount - a.usersCount;
    }
  });

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || sortBy !== 'popular';

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            工具<span className="gradient-text">市场</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            探索精选的SaaS工具，按需订阅，灵活高效
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索工具名称、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 pr-12 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input w-auto min-w-[160px] bg-dark-900"
            >
              <option value="popular">最受欢迎</option>
              <option value="rating">评分最高</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-outline lg:hidden',
                showFilters && 'bg-primary-500/20 border-primary-500 text-primary-400'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'lg:w-64 flex-shrink-0',
              'lg:block',
              showFilters ? 'block' : 'hidden'
            )}
          >
            <div className="card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary-400" />
                  分类筛选
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    清除
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between',
                    selectedCategory === 'all'
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span>全部工具</span>
                  <span className="text-sm">{useStore.getState().tools.length}</span>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id as Category)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between',
                      selectedCategory === category.id
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm">
                      {useStore.getState().tools.filter(t => t.category === category.id).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-4">筛选结果</h4>
                <p className="text-2xl font-bold text-white">
                  {sortedTools.length} <span className="text-gray-400 text-base font-normal">个工具</span>
                </p>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            {sortedTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">未找到相关工具</h3>
                <p className="text-gray-400 mb-6">尝试调整搜索关键词或筛选条件</p>
                <button onClick={clearFilters} className="btn-primary">
                  清除筛选条件
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
