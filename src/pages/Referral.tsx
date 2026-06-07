import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Users, 
  Trophy, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  Clock,
  Ticket,
  Zap,
  Star,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Crown,
  Medal
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Coupon, ReferralRecord } from '@/types';

type TabType = 'myCode' | 'progress' | 'coupons' | 'leaderboard';

export default function Referral() {
  const { 
    user,
    getMyReferralCode,
    generateReferralCode,
    getMyReferralProgress,
    getMyReferralRecords,
    getMyCoupons,
    getReferralLeaderboard,
    shareReferralLink,
    validateReferralCode,
    referralSettings,
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('myCode');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [validateCode, setValidateCode] = useState('');
  const [validateResult, setValidateResult] = useState<{ valid: boolean; message: string } | null>(null);
  
  const myCode = getMyReferralCode();
  const progress = getMyReferralProgress();
  const records = getMyReferralRecords();
  const availableCoupons = getMyCoupons('available');
  const usedCoupons = getMyCoupons('used');
  const expiredCoupons = getMyCoupons('expired');
  const leaderboard = getReferralLeaderboard();

  const tabs = [
    { id: 'myCode' as TabType, label: '我的推荐码', icon: Gift },
    { id: 'progress' as TabType, label: '推荐进度', icon: TrendingUp },
    { id: 'coupons' as TabType, label: '我的优惠券', icon: Ticket, count: availableCoupons.length },
    { id: 'leaderboard' as TabType, label: '排行榜', icon: Trophy },
  ];

  const handleCopyCode = async () => {
    if (!myCode) return;
    try {
      await navigator.clipboard.writeText(myCode.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      const link = shareReferralLink();
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    generateReferralCode();
    setGenerating(false);
  };

  const handleValidateCode = () => {
    if (!validateCode.trim()) {
      setValidateResult({ valid: false, message: '请输入推荐码' });
      return;
    }
    const result = validateReferralCode(validateCode);
    if (result) {
      setValidateResult({ valid: true, message: `推荐码有效！推荐人：${result.userName}` });
    } else {
      setValidateResult({ valid: false, message: '推荐码无效或已过期' });
    }
  };

  const handleShare = async () => {
    const link = shareReferralLink();
    const text = `邀请你加入 SubHub，使用我的推荐码注册，双方都可获得 ¥${referralSettings.rewardAmount} 订阅优惠券！`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SubHub 邀请',
          text: text,
          url: link,
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const getStatusBadge = (status: ReferralRecord['status']) => {
    const config = {
      registered: { label: '已注册', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      subscribed: { label: '已订阅', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      completed: { label: '已完成', className: 'bg-primary-500/20 text-primary-400 border-primary-500/30' },
    };
    return config[status];
  };

  const getCouponStatusBadge = (status: Coupon['status']) => {
    const config = {
      available: { label: '可使用', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      used: { label: '已使用', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      expired: { label: '已过期', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return config[status];
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-semibold">{rank}</span>;
  };

  const myRank = leaderboard.find(item => item.userId === user?.id);

  const allCouponsEmpty = availableCoupons.length === 0 && usedCoupons.length === 0 && expiredCoupons.length === 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">请先登录</h2>
          <p className="text-gray-400">登录后可查看推荐码和推荐进度</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            推荐<span className="gradient-text">好友</span>
          </h1>
          <p className="text-xl text-gray-400">
            邀请好友注册订阅，双方均可获得 ¥{referralSettings.rewardAmount} 订阅优惠券
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                <Users className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">总邀请数</p>
                <p className="text-3xl font-bold text-white">{progress.totalInvites}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">已注册</p>
                <p className="text-3xl font-bold text-white">{progress.registeredCount}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">已订阅</p>
                <p className="text-3xl font-bold text-white">{progress.subscribedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-amber-500/20 flex items-center justify-center">
                <Gift className="w-7 h-7 text-gold-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">可用奖励</p>
                <p className="text-3xl font-bold text-gold-400">¥{progress.rewardsAvailable}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 p-1 bg-dark-800/50 rounded-xl w-fit overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-dark-900 text-gray-500'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'myCode' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary-400" />
                我的推荐码
              </h3>
              
              {myCode ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 border border-primary-500/20">
                    <div className="text-center">
                      <p className="text-gray-400 mb-3">您的专属推荐码</p>
                      <div className="text-5xl md:text-6xl font-bold tracking-wider gradient-text mb-4">
                        {myCode.code}
                      </div>
                      <p className="text-sm text-gray-500">
                        已使用 {myCode.usedCount}/{myCode.maxUses} 次 · 有效期至 {myCode.expiresAt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleCopyCode}
                      className="flex-1 min-w-[160px] btn-primary flex items-center justify-center gap-2"
                    >
                      {copiedCode ? (
                        <><Check className="w-4 h-4" /> 已复制</>
                      ) : (
                        <><Copy className="w-4 h-4" /> 复制推荐码</>
                      )}
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 min-w-[160px] btn-outline flex items-center justify-center gap-2"
                    >
                      {copiedLink ? (
                        <><Check className="w-4 h-4" /> 已复制链接</>
                      ) : (
                        <><ExternalLink className="w-4 h-4" /> 复制推荐链接</>
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 min-w-[160px] btn-outline flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      分享给好友
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                    <Gift className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">暂无推荐码</h3>
                  <p className="text-gray-400 mb-6">生成您的专属推荐码，邀请好友获得奖励</p>
                  <button
                    onClick={handleGenerateCode}
                    disabled={generating}
                    className="btn-primary disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {generating ? (
                      <>生成中...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> 生成推荐码</>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-400" />
                推荐奖励规则
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">邀请注册</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    好友使用您的推荐码注册账户
                  </p>
                  <div className="flex items-center gap-2 text-gold-400">
                    <Gift className="w-4 h-4" />
                    <span className="font-semibold">双方各得 ¥{referralSettings.rewardAmount}</span>
                  </div>
                </div>
                
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">完成订阅</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    好友首次完成任意订阅
                  </p>
                  <div className="flex items-center gap-2 text-gold-400">
                    <Gift className="w-4 h-4" />
                    <span className="font-semibold">解锁奖励发放</span>
                  </div>
                </div>
                
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                    <Ticket className="w-6 h-6 text-primary-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">使用奖励</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    优惠券可在订阅时直接抵扣
                  </p>
                  <div className="flex items-center gap-2 text-gold-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{referralSettings.validDays} 天有效期</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                验证推荐码
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={validateCode}
                  onChange={(e) => {
                    setValidateCode(e.target.value);
                    setValidateResult(null);
                  }}
                  placeholder="输入推荐码进行验证"
                  className="flex-1 input uppercase"
                />
                <button
                  onClick={handleValidateCode}
                  className="btn-primary whitespace-nowrap"
                >
                  验证推荐码
                </button>
              </div>
              {validateResult && (
                <div className={cn(
                  'mt-4 p-4 rounded-xl border',
                  validateResult.valid 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                )}>
                  <p className={validateResult.valid ? 'text-green-400' : 'text-red-400'}>
                    {validateResult.message}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                我的推荐等级
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4">
                    <div className="w-28 h-28 rounded-full bg-dark-900 flex items-center justify-center">
                      <div>
                        <p className="text-4xl font-bold gradient-text">Lv.{progress.level}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400">当前等级</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400">升级进度</span>
                    <span className="text-white font-medium">
                      {progress.registeredCount} / {progress.nextLevelCount} 人
                    </span>
                  </div>
                  <div className="h-4 bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (progress.registeredCount / progress.nextLevelCount) * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    再邀请 {Math.max(0, progress.nextLevelCount - progress.registeredCount)} 人即可升级到 Lv.{progress.level + 1}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                奖励统计
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">累计获得奖励</p>
                  <p className="text-3xl font-bold text-gold-400">¥{progress.totalRewards}</p>
                </div>
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">已使用奖励</p>
                  <p className="text-3xl font-bold text-gray-400">¥{progress.rewardsUsed}</p>
                </div>
                <div className="bg-dark-900/50 rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-2">可用奖励</p>
                  <p className="text-3xl font-bold text-green-400">¥{progress.rewardsAvailable}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                推荐记录
                <span className="ml-2 px-2 py-1 rounded-full bg-dark-800 text-gray-400 text-sm">
                  共 {records.length} 条
                </span>
              </h3>
              
              {records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">好友</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">邮箱</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">注册时间</th>
                        <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">订阅时间</th>
                        <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">状态</th>
                        <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">您的奖励</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {record.referredName.charAt(0)}
                                </span>
                              </div>
                              <span className="text-white font-medium">{record.referredName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-400">{record.referredEmail}</td>
                          <td className="py-4 px-4 text-gray-300">{record.registeredAt}</td>
                          <td className="py-4 px-4 text-gray-300">{record.subscribedAt || '-'}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={cn(
                              'px-2.5 py-1 rounded-full text-xs font-medium border',
                              getStatusBadge(record.status).className
                            )}>
                              {getStatusBadge(record.status).label}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {record.status === 'completed' ? (
                              <span className="text-gold-400 font-semibold">+¥{referralSettings.rewardAmount}</span>
                            ) : (
                              <span className="text-gray-500">待解锁</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">暂无推荐记录</h3>
                  <p className="text-gray-400 mb-6">分享您的推荐码给好友，开始获取奖励</p>
                  <button
                    onClick={() => setActiveTab('myCode')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    查看我的推荐码 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'coupons' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {allCouponsEmpty ? (
              <div className="card">
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                    <Ticket className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">暂无优惠券</h3>
                  <p className="text-gray-400 mb-6">邀请好友注册并完成订阅，双方均可获得优惠券奖励</p>
                  <button
                    onClick={() => setActiveTab('myCode')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    去邀请好友 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <CouponSection 
                  title="可使用" 
                  coupons={availableCoupons} 
                  type="available"
                  getCouponStatusBadge={getCouponStatusBadge}
                />
                <CouponSection 
                  title="已使用" 
                  coupons={usedCoupons} 
                  type="used"
                  getCouponStatusBadge={getCouponStatusBadge}
                />
                <CouponSection 
                  title="已过期" 
                  coupons={expiredCoupons} 
                  type="expired"
                  getCouponStatusBadge={getCouponStatusBadge}
                />
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {myRank && (
              <div className="card bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-dark-900/80 flex items-center justify-center">
                      {getRankIcon(myRank.rank)}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">我的排名</p>
                      <p className="text-2xl font-bold text-white">
                        第 {myRank.rank} 名
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">邀请人数</p>
                      <p className="text-xl font-bold text-white">{myRank.referralCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">订阅人数</p>
                      <p className="text-xl font-bold text-white">{myRank.subscribedCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">累计奖励</p>
                      <p className="text-xl font-bold text-gold-400">¥{myRank.totalRewards}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-400" />
                推荐排行榜
              </h3>
              <div className="space-y-4">
                {leaderboard.slice(0, 10).map((item, index) => (
                  <motion.div
                    key={item.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl transition-all',
                      item.userId === user?.id 
                        ? 'bg-primary-500/10 border border-primary-500/20' 
                        : 'bg-dark-900/50 hover:bg-dark-900'
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(item.rank)}
                    </div>
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {item.userName}
                        {item.userId === user?.id && (
                          <span className="ml-2 text-xs text-primary-400">(我)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        邀请 {item.referralCount} 人 · 订阅 {item.subscribedCount} 人
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-gold-400 font-bold text-lg">¥{item.totalRewards}</p>
                      <p className="text-xs text-gray-500">累计奖励</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CouponSection({ 
  title, 
  coupons, 
  type,
  getCouponStatusBadge 
}: { 
  title: string; 
  coupons: Coupon[]; 
  type: 'available' | 'used' | 'expired';
  getCouponStatusBadge: (status: Coupon['status']) => { label: string; className: string };
}) {
  const [expanded, setExpanded] = useState(type === 'available');
  const displayCoupons = expanded ? coupons : coupons.slice(0, 3);

  if (coupons.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-primary-400" />
          {title}
          <span className="ml-2 px-2 py-1 rounded-full bg-dark-800 text-gray-400 text-sm">
            0 张
          </span>
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">暂无{title}的优惠券</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary-400" />
          {title}
          <span className="ml-2 px-2 py-1 rounded-full bg-dark-800 text-gray-400 text-sm">
            {coupons.length} 张
          </span>
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCoupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'relative overflow-hidden rounded-xl border transition-all',
              type === 'available' 
                ? 'bg-gradient-to-br from-primary-500/10 to-gold-500/10 border-primary-500/30 hover:border-primary-500/50'
                : 'bg-dark-900/50 border-gray-800 opacity-60'
            )}
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/20 to-transparent" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold mb-1">{coupon.name}</p>
                  <p className="text-xs text-gray-500">{coupon.description}</p>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium border',
                  getCouponStatusBadge(coupon.status).className
                )}>
                  {getCouponStatusBadge(coupon.status).label}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold gradient-text">
                  {coupon.type === 'fixed' ? '¥' : ''}{coupon.amount}{coupon.type === 'percentage' ? '%' : ''}
                </span>
                <span className="text-gray-500 text-sm ml-2">优惠券</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>满 ¥{coupon.minPurchase} 可用</p>
                <p>有效期：{coupon.createdAt} ~ {coupon.expiresAt}</p>
                {coupon.usedAt && <p>使用时间：{coupon.usedAt}</p>}
              </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 rounded-full bg-dark-950" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-4 h-4 rounded-full bg-dark-950" />
          </motion.div>
        ))}
      </div>
      
      {coupons.length > 3 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mt-4 w-full py-2 text-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          {expanded ? '收起' : `查看全部 ${coupons.length} 张`}
        </button>
      )}
    </div>
  );
}
