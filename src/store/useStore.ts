import { create } from 'zustand';
import type { User, UserSubscription, Tool, Category } from '@/types';
import { userSubscriptions } from '@/mock/subscriptions';
import { tools } from '@/mock/tools';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  subscriptionReminders: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface Store {
  user: User | null;
  subscriptions: UserSubscription[];
  tools: Tool[];
  selectedCategory: Category | 'all';
  searchQuery: string;
  isAuthenticated: boolean;
  notificationSettings: NotificationSettings;
  userPassword: string;
  
  setUser: (user: User | null) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  addSubscription: (subscription: UserSubscription) => void;
  cancelSubscription: (id: string) => void;
  renewSubscription: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  downloadInvoice: (id: string) => void;
  getFilteredTools: () => Tool[];
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  subscriptionReminders: true,
  marketingEmails: false,
  securityAlerts: true,
};

export const useStore = create<Store>((set, get) => ({
  user: null,
  subscriptions: userSubscriptions,
  tools: tools,
  selectedCategory: 'all',
  searchQuery: '',
  isAuthenticated: false,
  notificationSettings: defaultNotificationSettings,
  userPassword: '',

  setUser: (user) => set({ user }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
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
  
  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (name && email && password) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait%20simple%20minimal&image_size=square',
      };
      set({ user: newUser, isAuthenticated: true, userPassword: password });
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
  
  addSubscription: (subscription) => 
    set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),
  
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
    const { tools, selectedCategory, searchQuery } = get();
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  },
}));
