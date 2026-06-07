import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User, 
  UserSubscription, 
  Tool, 
  Category, 
  SortOption, 
  SubscriptionFilter, 
  UsersRange, 
  TeamMember, 
  TeamRole,
  ReferralCode,
  Coupon,
  ReferralRecord,
  ReferralProgress,
  ReferralLeaderboardItem,
  ReferralSettings,
  CouponStatus,
} from '@/types';
import { userSubscriptions as defaultSubscriptions } from '@/mock/subscriptions';
import { tools as defaultTools } from '@/mock/tools';
import { teamMembers as defaultTeamMembers } from '@/mock/team';
import { 
  referralCodes as defaultReferralCodes, 
  coupons as defaultCoupons, 
  referralRecords as defaultReferralRecords,
  referralProgress as defaultReferralProgress,
  referralLeaderboard as defaultReferralLeaderboard,
  referralSettings as defaultReferralSettings,
} from '@/mock/referral';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  subscriptionReminders: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface TeamSettings {
  teamName: string;
  teamDescription: string;
  twoFactorRequired: boolean;
  ssoEnabled: boolean;
  sessionTimeout: boolean;
}

interface Store {
  user: User | null;
  subscriptions: UserSubscription[];
  tools: Tool[];
  teamMembers: TeamMember[];
  teamSettings: TeamSettings;
  selectedCategory: Category | 'all';
  searchQuery: string;
  sortBy: SortOption;
  priceMin: number;
  priceMax: number;
  ratingMin: number;
  ratingMax: number;
  usersRange: UsersRange;
  selectedTags: string[];
  subscriptionFilter: SubscriptionFilter;
  isAuthenticated: boolean;
  notificationSettings: NotificationSettings;
  userPassword: string;
  referralCodes: ReferralCode[];
  coupons: Coupon[];
  referralRecords: ReferralRecord[];
  referralLeaderboard: ReferralLeaderboardItem[];
  referralSettings: ReferralSettings;
  pendingReferralCode: string | null;
  
  setUser: (user: User | null) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setPriceRange: (min: number, max: number) => void;
  setRatingRange: (min: number, max: number) => void;
  setUsersRange: (range: UsersRange) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSubscriptionFilter: (filter: SubscriptionFilter) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  addSubscription: (subscription: UserSubscription, couponId?: string) => { success: boolean; finalPrice: number; message?: string };
  cancelSubscription: (id: string) => void;
  renewSubscription: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  downloadInvoice: (id: string) => void;
  getFilteredTools: () => Tool[];
  clearAllFilters: () => void;
  getAllTags: () => string[];
  getPriceRange: () => { min: number; max: number };
  inviteMember: (email: string, role: TeamRole) => Promise<boolean>;
  removeMember: (id: string) => void;
  changeMemberRole: (id: string, role: TeamRole) => void;
  updateTeamSettings: (settings: Partial<TeamSettings>) => void;
  resetToDefaults: () => void;
  
  generateReferralCode: () => ReferralCode;
  getMyReferralCode: () => ReferralCode | undefined;
  validateReferralCode: (code: string) => ReferralCode | null;
  setPendingReferralCode: (code: string | null) => void;
  getMyReferralProgress: () => ReferralProgress;
  getMyReferralRecords: () => ReferralRecord[];
  getMyCoupons: (status?: CouponStatus) => Coupon[];
  getReferralLeaderboard: () => ReferralLeaderboardItem[];
  useCoupon: (couponId: string, amount: number) => { success: boolean; discount: number; message?: string };
  calculateDiscount: (couponId: string, amount: number) => number;
  shareReferralLink: () => string;
  issueReferralRewardsInternal: (referralCode: ReferralCode, recordId: string, referredUserId: string, referredUserName: string) => void;
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  subscriptionReminders: true,
  marketingEmails: false,
  securityAlerts: true,
};

const defaultTeamSettings: TeamSettings = {
  teamName: '创新科技团队',
  teamDescription: '专注于产品创新和开发的高效团队',
  twoFactorRequired: true,
  ssoEnabled: false,
  sessionTimeout: true,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      subscriptions: defaultSubscriptions,
      tools: defaultTools,
      teamMembers: defaultTeamMembers,
      teamSettings: defaultTeamSettings,
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'popular',
      priceMin: 0,
      priceMax: 1000,
      ratingMin: 0,
      ratingMax: 5,
      usersRange: 'all',
      selectedTags: [],
      subscriptionFilter: 'all',
      isAuthenticated: false,
      notificationSettings: defaultNotificationSettings,
      userPassword: '',
      referralCodes: defaultReferralCodes,
      coupons: defaultCoupons,
      referralRecords: defaultReferralRecords,
      referralLeaderboard: defaultReferralLeaderboard,
      referralSettings: defaultReferralSettings,
      pendingReferralCode: null,

      setUser: (user) => set({ user }),
      
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortBy: (sort) => set({ sortBy: sort }),
      
      setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
      
      setRatingRange: (min, max) => set({ ratingMin: min, ratingMax: max }),
      
      setUsersRange: (range) => set({ usersRange: range }),
      
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      
      toggleTag: (tag) => set((state) => ({
        selectedTags: state.selectedTags.includes(tag)
          ? state.selectedTags.filter(t => t !== tag)
          : [...state.selectedTags, tag]
      })),
      
      setSubscriptionFilter: (filter) => set({ subscriptionFilter: filter }),
      
      login: async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { userPassword, user } = get();
        
        if (email && password) {
          if (user && user.email === email && userPassword === password) {
            set({ isAuthenticated: true });
            return true;
          }
          
          const newUser: User = {
            id: 'user-' + Date.now(),
            name: email.split('@')[0],
            email: email,
            avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20simple%20minimal&image_size=square',
          };
          set({ user: newUser, isAuthenticated: true, userPassword: password });
          return true;
        }
        return false;
      },
      
      register: async (name, email, password, referralCode) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (name && email && password) {
          const newUser: User = {
            id: 'user-' + Date.now(),
            name: name,
            email: email,
            avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20simple%20minimal&image_size=square',
          };
          
          let referrerInfo: { code: ReferralCode; recordId: string } | null = null;
          
          if (referralCode) {
            const validCode = get().validateReferralCode(referralCode);
            if (validCode) {
              const recordId = 'rr-' + Date.now();
              const newRecord: ReferralRecord = {
                id: recordId,
                referrerId: validCode.userId,
                referrerName: validCode.userName,
                referredId: newUser.id,
                referredName: name,
                referredEmail: email,
                referralCode: validCode.code,
                status: 'registered',
                registeredAt: new Date().toISOString().split('T')[0],
              };
              
              set((state) => ({
                referralRecords: [...state.referralRecords, newRecord],
                referralCodes: state.referralCodes.map(rc => 
                  rc.id === validCode.id ? { ...rc, usedCount: rc.usedCount + 1 } : rc
                ),
              }));
              
              referrerInfo = { code: validCode, recordId };
            }
          }
          
          set({ user: newUser, isAuthenticated: true, userPassword: password, pendingReferralCode: null });
          
          if (referrerInfo && !get().referralSettings.requireSubscription) {
            get().issueReferralRewardsInternal(referrerInfo.code, referrerInfo.recordId, newUser.id, name);
          }
          
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUserProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      
      changePassword: async (oldPassword, newPassword) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { userPassword } = get();
        if (userPassword === oldPassword) {
          set({ userPassword: newPassword });
          return true;
        }
        return false;
      },
      
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        })),
      
      addSubscription: (subscription, couponId) => {
        const { user, coupons, referralRecords, referralSettings } = get();
        let finalPrice = subscription.price;
        let usedCoupon: Coupon | null = null;
        
        if (couponId && user) {
          const coupon = coupons.find(c => c.id === couponId && c.userId === user.id && c.status === 'available');
          if (coupon) {
            const now = new Date();
            const expiresAt = new Date(coupon.expiresAt);
            
            if (expiresAt < now) {
              return { success: false, finalPrice, message: '优惠券已过期' };
            }
            
            if (subscription.price < coupon.minPurchase) {
              return { success: false, finalPrice, message: `订单金额需满 ¥${coupon.minPurchase} 才能使用此优惠券` };
            }
            
            const discount = coupon.type === 'fixed' 
              ? Math.min(coupon.amount, subscription.price)
              : Math.round(subscription.price * coupon.amount / 100);
            
            finalPrice = Math.max(0, subscription.price - discount);
            usedCoupon = coupon;
          }
        }
        
        const updatedSubscription = { ...subscription, price: finalPrice };
        
        if (usedCoupon && user) {
          set((state) => ({
            subscriptions: [...state.subscriptions, updatedSubscription],
            coupons: state.coupons.map(c => 
              c.id === usedCoupon!.id 
                ? { ...c, status: 'used' as const, usedAt: new Date().toISOString().split('T')[0] }
                : c
            ),
          }));
        } else {
          set((state) => ({ subscriptions: [...state.subscriptions, updatedSubscription] }));
        }
        
        if (user) {
          const referralRecord = referralRecords.find(r => r.referredId === user.id && r.status === 'registered');
          if (referralRecord) {
            set((state) => ({
              referralRecords: state.referralRecords.map(r => 
                r.id === referralRecord.id 
                  ? { 
                      ...r, 
                      status: 'subscribed' as const, 
                      subscribedAt: new Date().toISOString().split('T')[0] 
                    } 
                  : r
              ),
            }));
            
            if (referralSettings.requireSubscription) {
              const referrerCode = get().referralCodes.find(rc => rc.code === referralRecord.referralCode);
              if (referrerCode) {
                get().issueReferralRewardsInternal(referrerCode, referralRecord.id, user.id, user.name);
              }
            }
          }
        }
        
        return { success: true, finalPrice };
      },
      
      cancelSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, status: 'cancelled' as const, autoRenew: false } : sub
          ),
        })),
      
      renewSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id 
              ? { 
                  ...sub, 
                  status: 'active' as const, 
                  autoRenew: true,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                } 
              : sub
          ),
        })),
      
      toggleAutoRenew: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, autoRenew: !sub.autoRenew } : sub
          ),
        })),
      
      downloadInvoice: (id) => {
        const subscription = get().subscriptions.find(s => s.id === id);
        if (!subscription) return;
        
        const invoiceContent = `
发票
=====================================
发票编号: INV-${id.toUpperCase()}
日期: ${new Date().toLocaleDateString('zh-CN')}

订阅信息:
工具名称: ${subscription.toolName}
订阅方案: ${subscription.planName}
订阅周期: ${subscription.period === 'monthly' ? '月度' : '年度'}
开始日期: ${subscription.startDate}
结束日期: ${subscription.endDate}

费用明细:
=====================================
订阅费用: ¥${subscription.price}
=====================================
总计: ¥${subscription.price}

感谢您使用 SubHub!
    `.trim();
        
        const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `发票-${subscription.toolName}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      
      getFilteredTools: () => {
        const { tools, selectedCategory, searchQuery, priceMin, priceMax, ratingMin, ratingMax, usersRange, selectedTags, subscriptionFilter, sortBy, subscriptions } = get();
        
        const filtered = tools.filter((tool) => {
          const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
          
          const matchesSearch = !searchQuery ||
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          const minPrice = Math.min(...tool.plans.map(p => p.price));
          const matchesPrice = minPrice >= priceMin && minPrice <= priceMax;
          
          const matchesRating = tool.rating >= ratingMin && tool.rating <= ratingMax;
          
          let matchesUsers = true;
          switch (usersRange) {
            case 'lt-10k':
              matchesUsers = tool.usersCount < 10000;
              break;
            case '10k-50k':
              matchesUsers = tool.usersCount >= 10000 && tool.usersCount < 50000;
              break;
            case '50k-100k':
              matchesUsers = tool.usersCount >= 50000 && tool.usersCount < 100000;
              break;
            case 'gt-100k':
              matchesUsers = tool.usersCount >= 100000;
              break;
          }
          
          const matchesTags = selectedTags.length === 0 ||
            selectedTags.every(tag => tool.tags.includes(tag));
          
          let matchesSubscription = true;
          const userSub = subscriptions.find(s => s.toolId === tool.id);
          switch (subscriptionFilter) {
            case 'subscribed':
              matchesSubscription = !!userSub && userSub.status === 'active';
              break;
            case 'not-subscribed':
              matchesSubscription = !userSub || userSub.status !== 'active';
              break;
            case 'expired':
              matchesSubscription = !!userSub && userSub.status === 'expired';
              break;
          }
          
          return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesUsers && matchesTags && matchesSubscription;
        });
        
        return [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'price-low':
              return Math.min(...a.plans.map(p => p.price)) - Math.min(...b.plans.map(p => p.price));
            case 'price-high':
              return Math.min(...b.plans.map(p => p.price)) - Math.min(...a.plans.map(p => p.price));
            case 'newest':
              return parseInt(b.id) - parseInt(a.id);
            case 'users-desc':
              return b.usersCount - a.usersCount;
            case 'users-asc':
              return a.usersCount - b.usersCount;
            case 'popular':
            default:
              return b.usersCount - a.usersCount;
          }
        });
      },
      
      clearAllFilters: () => set({
        selectedCategory: 'all',
        searchQuery: '',
        sortBy: 'popular',
        priceMin: 0,
        priceMax: 1000,
        ratingMin: 0,
        ratingMax: 5,
        usersRange: 'all',
        selectedTags: [],
        subscriptionFilter: 'all',
      }),
      
      getAllTags: () => {
        const { tools } = get();
        const tagSet = new Set<string>();
        tools.forEach(tool => tool.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
      },
      
      getPriceRange: () => {
        const { tools } = get();
        const prices = tools.flatMap(tool => tool.plans.map(p => p.price));
        return {
          min: Math.min(...prices),
          max: Math.max(...prices),
        };
      },

      inviteMember: async (email, role) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (!email) return false;
        
        const newMember: TeamMember = {
          id: 'member-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20${encodeURIComponent(email)}&image_size=square`,
          role: role,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          subscriptions: [],
        };
        
        set((state) => ({
          teamMembers: [...state.teamMembers, newMember],
        }));
        
        return true;
      },

      removeMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter(m => m.id !== id),
        })),

      changeMemberRole: (id, role) =>
        set((state) => ({
          teamMembers: state.teamMembers.map(m =>
            m.id === id ? { ...m, role } : m
          ),
        })),

      updateTeamSettings: (settings) =>
        set((state) => ({
          teamSettings: { ...state.teamSettings, ...settings },
        })),

      generateReferralCode: () => {
        const { user, referralSettings, referralCodes } = get();
        if (!user) {
          throw new Error('请先登录');
        }
        
        const existingCode = referralCodes.find(rc => rc.userId === user.id && rc.isActive);
        if (existingCode) {
          return existingCode;
        }
        
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const namePart = user.name.substring(0, 4).toUpperCase();
        const code = `${namePart}${randomPart}`;
        
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        
        const newCode: ReferralCode = {
          id: 'rc-' + Date.now(),
          code: code,
          userId: user.id,
          userName: user.name,
          createdAt: new Date().toISOString().split('T')[0],
          usedCount: 0,
          maxUses: referralSettings.maxUsesPerCode,
          expiresAt: expiresAt.toISOString().split('T')[0],
          isActive: true,
        };
        
        set((state) => ({
          referralCodes: [...state.referralCodes, newCode],
        }));
        
        return newCode;
      },

      getMyReferralCode: () => {
        const { user, referralCodes } = get();
        if (!user) return undefined;
        return referralCodes.find(rc => rc.userId === user.id && rc.isActive);
      },

      validateReferralCode: (code) => {
        const { referralCodes } = get();
        const normalizedCode = code.toUpperCase().trim();
        const referralCode = referralCodes.find(rc => 
          rc.code.toUpperCase() === normalizedCode && rc.isActive
        );
        
        if (!referralCode) return null;
        
        const now = new Date();
        const expiresAt = new Date(referralCode.expiresAt);
        if (expiresAt < now) return null;
        
        if (referralCode.usedCount >= referralCode.maxUses) return null;
        
        return referralCode;
      },

      setPendingReferralCode: (code) => set({ pendingReferralCode: code }),

      getMyReferralProgress: (): ReferralProgress => {
        const { user, referralRecords, coupons } = get();
        if (!user) {
          return {
            userId: '',
            totalInvites: 0,
            registeredCount: 0,
            subscribedCount: 0,
            totalRewards: 0,
            rewardsUsed: 0,
            rewardsAvailable: 0,
            level: 1,
            nextLevelCount: 5,
          };
        }
        
        const myRecords = referralRecords.filter(r => r.referrerId === user.id);
        const myCoupons = coupons.filter(c => c.userId === user.id && c.source === 'referral');
        
        const registeredCount = myRecords.length;
        const subscribedCount = myRecords.filter(r => r.status === 'subscribed' || r.status === 'completed').length;
        const totalRewards = myCoupons.reduce((sum, c) => sum + c.amount, 0);
        const rewardsUsed = myCoupons.filter(c => c.status === 'used').reduce((sum, c) => sum + c.amount, 0);
        const rewardsAvailable = myCoupons.filter(c => c.status === 'available').reduce((sum, c) => sum + c.amount, 0);
        
        const level = Math.floor(registeredCount / 5) + 1;
        const nextLevelCount = (level) * 5;
        
        return {
          userId: user.id,
          totalInvites: myRecords.length,
          registeredCount,
          subscribedCount,
          totalRewards,
          rewardsUsed,
          rewardsAvailable,
          level,
          nextLevelCount,
        };
      },

      getMyReferralRecords: () => {
        const { user, referralRecords } = get();
        if (!user) return [];
        return referralRecords
          .filter(r => r.referrerId === user.id)
          .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      },

      getMyCoupons: (status) => {
        const { user, coupons } = get();
        if (!user) return [];
        
        let filtered = coupons.filter(c => c.userId === user.id);
        if (status) {
          filtered = filtered.filter(c => c.status === status);
        }
        
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getReferralLeaderboard: () => {
        const { referralLeaderboard, user } = get();
        
        if (user && !referralLeaderboard.some(item => item.userId === user.id)) {
          const myProgress = get().getMyReferralProgress();
          const myRank = referralLeaderboard.filter(item => item.referralCount > myProgress.totalInvites).length + 1;
          
          const myEntry: ReferralLeaderboardItem = {
            rank: myRank,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            referralCount: myProgress.totalInvites,
            subscribedCount: myProgress.subscribedCount,
            totalRewards: myProgress.totalRewards,
          };
          
          return [...referralLeaderboard, myEntry].sort((a, b) => a.rank - b.rank);
        }
        
        return referralLeaderboard.sort((a, b) => a.rank - b.rank);
      },

      useCoupon: (couponId, amount) => {
        const { user, coupons } = get();
        if (!user) {
          return { success: false, discount: 0, message: '请先登录' };
        }
        
        const coupon = coupons.find(c => c.id === couponId && c.userId === user.id);
        if (!coupon) {
          return { success: false, discount: 0, message: '优惠券不存在' };
        }
        
        if (coupon.status !== 'available') {
          return { success: false, discount: 0, message: '优惠券不可用' };
        }
        
        const now = new Date();
        const expiresAt = new Date(coupon.expiresAt);
        if (expiresAt < now) {
          return { success: false, discount: 0, message: '优惠券已过期' };
        }
        
        if (amount < coupon.minPurchase) {
          return { success: false, discount: 0, message: `订单金额需满 ¥${coupon.minPurchase} 才能使用此优惠券` };
        }
        
        const discount = coupon.type === 'fixed' 
          ? Math.min(coupon.amount, amount)
          : Math.round(amount * coupon.amount / 100);
        
        return { success: true, discount };
      },

      calculateDiscount: (couponId, amount) => {
        const { coupons } = get();
        const coupon = coupons.find(c => c.id === couponId);
        if (!coupon || coupon.status !== 'available') return 0;
        
        const now = new Date();
        const expiresAt = new Date(coupon.expiresAt);
        if (expiresAt < now) return 0;
        
        if (amount < coupon.minPurchase) return 0;
        
        return coupon.type === 'fixed' 
          ? Math.min(coupon.amount, amount)
          : Math.round(amount * coupon.amount / 100);
      },

      shareReferralLink: () => {
        const { user, referralCodes } = get();
        if (!user) return '';
        
        let myCode = referralCodes.find(rc => rc.userId === user.id && rc.isActive);
        if (!myCode) {
          myCode = get().generateReferralCode();
        }
        
        const baseUrl = window.location.origin;
        return `${baseUrl}/register?ref=${myCode.code}`;
      },

      issueReferralRewardsInternal: (referralCode: ReferralCode, recordId: string, referredUserId: string, referredUserName: string) => {
        const { referralSettings } = get();
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + referralSettings.validDays);
        
        const referrerCoupon: Coupon = {
          id: 'cpn-' + Date.now(),
          code: `REF-${referralCode.code}-${referralSettings.rewardAmount}`,
          userId: referralCode.userId,
          name: '推荐好友奖励',
          description: `成功邀请 ${referredUserName} 注册获得的订阅优惠券`,
          amount: referralSettings.rewardAmount,
          type: referralSettings.rewardType,
          minPurchase: referralSettings.minPurchase,
          status: 'available',
          source: 'referral',
          referralRecordId: recordId,
          createdAt: now.toISOString().split('T')[0],
          expiresAt: expiresAt.toISOString().split('T')[0],
        };
        
        const referredCoupon: Coupon = {
          id: 'cpn-' + (Date.now() + 1),
          code: `NEW-${referralCode.code}-${referralSettings.rewardAmount}`,
          userId: referredUserId,
          name: '新人注册奖励',
          description: `使用推荐码注册获得的订阅优惠券`,
          amount: referralSettings.rewardAmount,
          type: referralSettings.rewardType,
          minPurchase: referralSettings.minPurchase,
          status: 'available',
          source: 'referral',
          referralRecordId: recordId,
          createdAt: now.toISOString().split('T')[0],
          expiresAt: expiresAt.toISOString().split('T')[0],
        };
        
        set((state) => ({
          coupons: [...state.coupons, referrerCoupon, referredCoupon],
          referralRecords: state.referralRecords.map(r => 
            r.id === recordId 
              ? { 
                  ...r, 
                  status: 'completed' as const, 
                  completedAt: now.toISOString().split('T')[0],
                  referrerRewardId: referrerCoupon.id,
                  referredRewardId: referredCoupon.id,
                } 
              : r
          ),
        }));
      },

      resetToDefaults: () => set({
        user: null,
        subscriptions: defaultSubscriptions,
        teamMembers: defaultTeamMembers,
        teamSettings: defaultTeamSettings,
        isAuthenticated: false,
        notificationSettings: defaultNotificationSettings,
        userPassword: '',
        selectedCategory: 'all',
        searchQuery: '',
        sortBy: 'popular',
        priceMin: 0,
        priceMax: 1000,
        ratingMin: 0,
        ratingMax: 5,
        usersRange: 'all',
        selectedTags: [],
        subscriptionFilter: 'all',
        referralCodes: defaultReferralCodes,
        coupons: defaultCoupons,
        referralRecords: defaultReferralRecords,
        referralLeaderboard: defaultReferralLeaderboard,
        referralSettings: defaultReferralSettings,
        pendingReferralCode: null,
      }),
    }),
    {
      name: 'subhub-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        subscriptions: state.subscriptions,
        teamMembers: state.teamMembers,
        teamSettings: state.teamSettings,
        isAuthenticated: state.isAuthenticated,
        notificationSettings: state.notificationSettings,
        userPassword: state.userPassword,
        referralCodes: state.referralCodes,
        coupons: state.coupons,
        referralRecords: state.referralRecords,
        pendingReferralCode: state.pendingReferralCode,
      }),
    }
  )
);
