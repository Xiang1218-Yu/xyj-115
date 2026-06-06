import { create } from 'zustand';
import type { User, UserSubscription, Tool, Category } from '@/types';
import { currentUser } from '@/mock/user';
import { userSubscriptions } from '@/mock/subscriptions';
import { tools } from '@/mock/tools';

interface Store {
  user: User | null;
  subscriptions: UserSubscription[];
  tools: Tool[];
  selectedCategory: Category | 'all';
  searchQuery: string;
  isAuthenticated: boolean;
  
  setUser: (user: User | null) => void;
  setSelectedCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addSubscription: (subscription: UserSubscription) => void;
  cancelSubscription: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  getFilteredTools: () => Tool[];
}

export const useStore = create<Store>((set, get) => ({
  user: currentUser,
  subscriptions: userSubscriptions,
  tools: tools,
  selectedCategory: 'all',
  searchQuery: '',
  isAuthenticated: true,

  setUser: (user) => set({ user }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password) {
      set({ user: currentUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  addSubscription: (subscription) => 
    set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),
  
  cancelSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'cancelled' as const, autoRenew: false } : sub
      ),
    })),
  
  toggleAutoRenew: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, autoRenew: !sub.autoRenew } : sub
      ),
    })),
  
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
