import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Shield,
  TrendingUp,
  CreditCard,
  Crown,
  UserMinus,
  Settings,
  PieChart,
  X,
  Check,
  Edit3,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { teamStats } from '@/mock/team';
import type { TeamMember, TeamRole } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const usageData = [
  { name: 'Figma', usage: 85 },
  { name: 'GitHub', usage: 92 },
  { name: 'Notion', usage: 78 },
  { name: 'Slack', usage: 65 },
  { name: 'VS Code', usage: 88 },
];

type TabType = 'members' | 'analytics' | 'settings';

export default function Team() {
  const { 
    teamMembers, 
    teamSettings, 
    inviteMember, 
    removeMember, 
    changeMemberRole, 
    updateTeamSettings 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('member');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  
  const [teamForm, setTeamForm] = useState({
    teamName: teamSettings.teamName,
    teamDescription: teamSettings.teamDescription,
  });
  const [saveSettingsLoading, setSaveSettingsLoading] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  const tabs = [
    { id: 'members' as TabType, label: '成员管理', icon: Users },
    { id: 'analytics' as TabType, label: '使用分析', icon: PieChart },
    { id: 'settings' as TabType, label: '团队设置', icon: Settings },
  ];

  const handleInvite = async () => {
    setInviteError('');
    setInviteSuccess(false);
    
    if (!inviteEmail) {
      setInviteError('请输入邮箱地址');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError('请输入有效的邮箱地址');
      return;
    }
    
    setInviteLoading(true);
    
    const success = await inviteMember(inviteEmail, inviteRole);
    
    if (success) {
      setInviteSuccess(true);
      setInviteEmail('');
      setInviteRole('member');
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 1500);
    } else {
      setInviteError('邀请失败，请重试');
    }
    
    setInviteLoading(false);
  };

  const handleSaveTeamSettings = async () => {
    setSaveSettingsLoading(true);
    setSaveSettingsSuccess(false);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateTeamSettings({
      teamName: teamForm.teamName,
      teamDescription: teamForm.teamDescription,
    });
    
    setSaveSettingsSuccess(true);
    setSaveSettingsLoading(false);
    
    setTimeout(() => setSaveSettingsSuccess(false), 2000);
  };

  const handleToggleSetting = (key: keyof typeof teamSettings) => {
    updateTeamSettings({
      [key]: !teamSettings[key],
    });
  };

  const activeMembers = teamMembers.filter(m => m.status === 'active');
  const pendingMembers = teamMembers.filter(m => m.status === 'pending');

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              团队<span className="gradient-text">协作</span>
            </h1>
            <p className="text-xl text-gray-400">
              管理团队成员，分配订阅权限
            </p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="btn-primary w-full md:w-auto"
          >
            <UserPlus className="w-4 h-4" />
            邀请成员
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">总成员</p>
                <p className="text-xl font-bold text-white">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">活跃成员</p>
                <p className="text-xl font-bold text-white">{activeMembers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">待邀请</p>
                <p className="text-xl font-bold text-white">{pendingMembers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-secondary-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">总订阅</p>
                <p className="text-xl font-bold text-white">{teamStats.totalSubscriptions}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">月支出</p>
                <p className="text-xl font-bold text-white">¥{teamStats.monthlySpending}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">节省比例</p>
                <p className="text-xl font-bold text-green-400">{teamStats.savings}%</p>
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
          <div className="flex items-center gap-2 p-1 bg-dark-800/50 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">成员</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">角色</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">加入日期</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">订阅</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">状态</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => (
                      <MemberRow 
                        key={member.id} 
                        member={member} 
                        index={index}
                        isExpanded={selectedMember === member.id}
                        onToggle={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                        onRemove={() => removeMember(member.id)}
                        onChangeRole={(role) => changeMemberRole(member.id, role)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">工具使用率</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value}%`, '使用率']}
                    />
                    <Bar dataKey="usage" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">活跃成员排行</h3>
              <div className="space-y-4">
                {activeMembers.slice(0, 4).map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-grow">
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-gray-500 text-sm">{member.role === 'admin' ? '管理员' : '成员'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{member.subscriptions.length}</p>
                      <p className="text-gray-500 text-xs">活跃订阅</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">团队信息</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">团队名称</label>
                  <input 
                    type="text" 
                    value={teamForm.teamName}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, teamName: e.target.value }))}
                    className="input" 
                  />
                </div>
                <div>
                  <label className="label">团队描述</label>
                  <textarea 
                    value={teamForm.teamDescription}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, teamDescription: e.target.value }))}
                    className="input h-24 resize-none" 
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleSaveTeamSettings}
                    disabled={saveSettingsLoading}
                    className="btn-primary disabled:opacity-50 flex items-center gap-2"
                  >
                    {saveSettingsLoading ? (
                      '保存中...'
                    ) : saveSettingsSuccess ? (
                      <><Check className="w-4 h-4" /> 已保存</>
                    ) : (
                      '保存更改'
                    )}
                  </button>
                  {saveSettingsSuccess && (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> 团队信息已更新
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-6">安全设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">双因素认证</p>
                    <p className="text-gray-500 text-sm">要求所有成员启用双因素认证</p>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('twoFactorRequired')}
                    className={cn(
                      'w-12 h-6 rounded-full relative transition-colors',
                      teamSettings.twoFactorRequired ? 'bg-primary-500' : 'bg-gray-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      teamSettings.twoFactorRequired ? 'right-1' : 'left-1'
                    )} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">SSO单点登录</p>
                    <p className="text-gray-500 text-sm">启用企业级单点登录</p>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('ssoEnabled')}
                    className={cn(
                      'w-12 h-6 rounded-full relative transition-colors',
                      teamSettings.ssoEnabled ? 'bg-primary-500' : 'bg-gray-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      teamSettings.ssoEnabled ? 'right-1' : 'left-1'
                    )} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl">
                  <div>
                    <p className="text-white font-medium">会话超时</p>
                    <p className="text-gray-500 text-sm">30分钟无操作自动登出</p>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('sessionTimeout')}
                    className={cn(
                      'w-12 h-6 rounded-full relative transition-colors',
                      teamSettings.sessionTimeout ? 'bg-primary-500' : 'bg-gray-700'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      teamSettings.sessionTimeout ? 'right-1' : 'left-1'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInviteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">邀请成员</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inviteSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">邀请已发送</h4>
                  <p className="text-gray-400">邀请邮件已发送至成员邮箱</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="label">邮箱地址</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="member@example.com"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">角色</label>
                    <div className="relative">
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                        className="input appearance-none pr-10"
                      >
                        <option value="member">成员</option>
                        <option value="admin">管理员</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {inviteError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                      {inviteError}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 btn-outline"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleInvite}
                      disabled={inviteLoading}
                      className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {inviteLoading ? (
                        '发送中...'
                      ) : (
                        <><Mail className="w-4 h-4" /> 发送邀请</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MemberRowProps {
  member: TeamMember;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChangeRole: (role: TeamRole) => void;
}

function MemberRow({ member, index, isExpanded, onToggle, onRemove, onChangeRole }: MemberRowProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
      setIsRemoving(false);
    }, 300);
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          'border-b border-gray-800/50 hover:bg-white/5 transition-colors',
          isRemoving && 'opacity-50'
        )}
      >
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-white font-medium">{member.name}</p>
              <p className="text-gray-500 text-sm">{member.email}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:border-gray-600',
                member.role === 'admin' 
                  ? 'bg-gold-500/20 text-gold-400 border-gold-500/30' 
                  : 'bg-dark-900 text-gray-300 border-gray-700'
              )}
            >
              {member.role === 'admin' ? (
                <><Crown className="w-3 h-3" /> 管理员</>
              ) : (
                '成员'
              )}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            
            {showRoleMenu && (
              <div className="absolute top-full left-0 mt-1 w-32 glass rounded-lg py-1 shadow-xl border border-gray-800 z-10">
                <button
                  onClick={() => {
                    onChangeRole('member');
                    setShowRoleMenu(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors',
                    member.role === 'member' ? 'text-primary-400' : 'text-gray-300'
                  )}
                >
                  成员
                </button>
                <button
                  onClick={() => {
                    onChangeRole('admin');
                    setShowRoleMenu(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2',
                    member.role === 'admin' ? 'text-gold-400' : 'text-gray-300'
                  )}
                >
                  <Crown className="w-3 h-3" /> 管理员
                </button>
              </div>
            )}
          </div>
        </td>
        <td className="py-4 px-4 text-gray-400">{member.joinDate}</td>
        <td className="py-4 px-4">
          <div className="flex flex-wrap gap-1">
            {member.subscriptions.length > 0 ? (
              member.subscriptions.slice(0, 3).map((sub) => (
                <span key={sub} className="px-2 py-0.5 rounded bg-dark-900 text-gray-300 text-xs">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">暂无</span>
            )}
            {member.subscriptions.length > 3 && (
              <span className="px-2 py-0.5 rounded bg-dark-900 text-gray-400 text-xs">
                +{member.subscriptions.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-4">
          {member.status === 'active' && <span className="badge-active">活跃</span>}
          {member.status === 'pending' && <span className="badge-pending">待接受</span>}
        </td>
        <td className="py-4 px-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="更改角色"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
              title="移除成员"
            >
              <UserMinus className="w-4 h-4" />
            </button>
            <button 
              onClick={onToggle}
              className={cn(
                'p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all',
                isExpanded && 'text-primary-400 bg-primary-500/10'
              )}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </motion.tr>
      
      {isExpanded && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-dark-900/30"
        >
          <td colSpan={6} className="py-4 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dark-900/50 rounded-xl">
                <p className="text-gray-500 text-xs mb-2">订阅分配</p>
                <div className="flex flex-wrap gap-1">
                  {['Figma', 'GitHub Pro', 'Notion', 'Slack'].map((sub) => (
                    <label key={sub} className="flex items-center gap-2 px-2 py-1 rounded bg-dark-800 text-xs text-gray-300 cursor-pointer hover:bg-dark-700 transition-colors">
                      <input type="checkbox" defaultChecked={member.subscriptions.includes(sub)} className="rounded bg-dark-900 text-primary-500" />
                      {sub}
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-dark-900/50 rounded-xl">
                <p className="text-gray-500 text-xs mb-2">最近活动</p>
                <p className="text-sm text-gray-400">最后登录: 2小时前</p>
                <p className="text-sm text-gray-400">使用工具: Figma, Notion</p>
              </div>
              <div className="p-4 bg-dark-900/50 rounded-xl">
                <p className="text-gray-500 text-xs mb-2">快捷操作</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => onChangeRole(member.role === 'admin' ? 'member' : 'admin')}
                    className="w-full text-left text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    {member.role === 'admin' ? '降级为成员' : '升级为管理员'}
                  </button>
                  <button 
                    onClick={handleRemove}
                    className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    移除成员
                  </button>
                </div>
              </div>
            </div>
          </td>
        </motion.tr>
      )}
    </>
  );
}
