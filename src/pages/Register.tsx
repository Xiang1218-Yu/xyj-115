import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Zap, User, Check, Gift, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function Register() {
  const { register, isAuthenticated, validateReferralCode, setPendingReferralCode, referralSettings } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get('ref');
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: refParam || '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralValidation, setReferralValidation] = useState<{ valid: boolean; message: string; userName?: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (refParam) {
      handleValidateReferral(refParam);
    }
  }, [refParam]);

  const handleValidateReferral = (code: string) => {
    if (!code.trim()) {
      setReferralValidation(null);
      return;
    }
    const result = validateReferralCode(code);
    if (result) {
      setReferralValidation({ 
        valid: true, 
        message: `推荐码有效！推荐人：${result.userName}`,
        userName: result.userName
      });
    } else {
      setReferralValidation({ valid: false, message: '推荐码无效或已过期' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不匹配');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('密码长度至少为8个字符');
      return;
    }
    
    if (formData.referralCode && (!referralValidation || !referralValidation.valid)) {
      setError('请输入有效的推荐码');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register(
      formData.name, 
      formData.email, 
      formData.password,
      formData.referralCode || undefined
    );
    
    if (success) {
      navigate('/');
    } else {
      setError('注册失败，请检查输入信息');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const passwordStrength = [
    { label: '至少8个字符', valid: formData.password.length >= 8 },
    { label: '包含数字', valid: /\d/.test(formData.password) },
    { label: '包含字母', valid: /[a-zA-Z]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">创建账户</h1>
            <p className="text-gray-400">开始您的 SubHub 之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">姓名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="您的姓名"
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-3 space-y-1.5">
                  {passwordStrength.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className={cn(
                        'w-4 h-4',
                        item.valid ? 'text-green-400' : 'text-gray-600'
                      )} />
                      <span className={item.valid ? 'text-green-400' : 'text-gray-500'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-12 pr-12"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">密码不匹配</p>
                )}
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary-400" />
                推荐码 <span className="text-gray-500 font-normal">(可选)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={(e) => {
                    handleChange(e);
                    setReferralValidation(null);
                  }}
                  onBlur={() => handleValidateReferral(formData.referralCode)}
                  placeholder="输入好友的推荐码"
                  className="input pl-4 pr-4 uppercase"
                />
              </div>
              {referralValidation && (
                <div className={cn(
                  'mt-2 flex items-start gap-2 p-3 rounded-lg text-sm',
                  referralValidation.valid 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                )}>
                  {referralValidation.valid ? (
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p>{referralValidation.message}</p>
                    {referralValidation.valid && (
                      <p className="text-xs mt-1 opacity-80">
                        双方将各获得 ¥{referralSettings.rewardAmount} 订阅优惠券
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!formData.referralCode && (
                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  没有推荐码？直接注册也可，后续可在推荐页面输入
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-dark-900 text-primary-500 focus:ring-primary-500"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-400">
                我已阅读并同意{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">服务条款</a>
                {' '}和{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">隐私政策</a>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '创建账户'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            已有账户？{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              立即登录
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


