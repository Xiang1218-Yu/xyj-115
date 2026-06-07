import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../useStore';
import type { User, UserSubscription, TeamRole, Coupon, ReferralCode } from '@/types';

const createTestUser = (): User => ({
  id: 'test-user-id',
  name: '测试用户',
  email: 'test@example.com',
  avatar: 'test-avatar-url',
});

const createTestSubscription = (overrides?: Partial<UserSubscription>): UserSubscription => ({
  id: 'test-sub-id',
  toolId: '1',
  toolName: 'Figma',
  toolLogo: 'test-logo',
  planName: 'Professional',
  price: 100,
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: '2024-02-01',
  status: 'active',
  autoRenew: true,
  ...overrides,
});

describe('useStore - Zustand Store Tests', () => {
  beforeEach(() => {
    useStore.getState().resetToDefaults();
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state values', () => {
      const state = useStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.selectedCategory).toBe('all');
      expect(state.searchQuery).toBe('');
      expect(state.sortBy).toBe('popular');
      expect(state.priceMin).toBe(0);
      expect(state.priceMax).toBe(1000);
      expect(state.ratingMin).toBe(0);
      expect(state.ratingMax).toBe(5);
      expect(state.usersRange).toBe('all');
      expect(state.selectedTags).toEqual([]);
      expect(state.subscriptionFilter).toBe('all');
      expect(state.pendingReferralCode).toBeNull();
    });

    it('should have default notification settings', () => {
      const { notificationSettings } = useStore.getState();
      expect(notificationSettings.emailNotifications).toBe(true);
      expect(notificationSettings.pushNotifications).toBe(true);
      expect(notificationSettings.subscriptionReminders).toBe(true);
      expect(notificationSettings.marketingEmails).toBe(false);
      expect(notificationSettings.securityAlerts).toBe(true);
    });

    it('should have default team settings', () => {
      const { teamSettings } = useStore.getState();
      expect(teamSettings.teamName).toBe('创新科技团队');
      expect(teamSettings.teamDescription).toBe('专注于产品创新和开发的高效团队');
      expect(teamSettings.twoFactorRequired).toBe(true);
      expect(teamSettings.ssoEnabled).toBe(false);
      expect(teamSettings.sessionTimeout).toBe(true);
    });
  });

  describe('Basic Setter Actions', () => {
    it('setUser should update user state', () => {
      const user = createTestUser();
      useStore.getState().setUser(user);
      expect(useStore.getState().user).toEqual(user);
    });

    it('setUser with null should clear user', () => {
      useStore.getState().setUser(createTestUser());
      useStore.getState().setUser(null);
      expect(useStore.getState().user).toBeNull();
    });

    it('setSelectedCategory should update category', () => {
      useStore.getState().setSelectedCategory('design');
      expect(useStore.getState().selectedCategory).toBe('design');
      useStore.getState().setSelectedCategory('all');
      expect(useStore.getState().selectedCategory).toBe('all');
    });

    it('setSearchQuery should update search query', () => {
      useStore.getState().setSearchQuery('figma');
      expect(useStore.getState().searchQuery).toBe('figma');
      useStore.getState().setSearchQuery('');
      expect(useStore.getState().searchQuery).toBe('');
    });

    it('setSortBy should update sort option', () => {
      useStore.getState().setSortBy('rating');
      expect(useStore.getState().sortBy).toBe('rating');
      useStore.getState().setSortBy('price-low');
      expect(useStore.getState().sortBy).toBe('price-low');
    });

    it('setPriceRange should update price min and max', () => {
      useStore.getState().setPriceRange(50, 200);
      expect(useStore.getState().priceMin).toBe(50);
      expect(useStore.getState().priceMax).toBe(200);
    });

    it('setRatingRange should update rating min and max', () => {
      useStore.getState().setRatingRange(3, 5);
      expect(useStore.getState().ratingMin).toBe(3);
      expect(useStore.getState().ratingMax).toBe(5);
    });

    it('setUsersRange should update users range', () => {
      useStore.getState().setUsersRange('10k-50k');
      expect(useStore.getState().usersRange).toBe('10k-50k');
      useStore.getState().setUsersRange('gt-100k');
      expect(useStore.getState().usersRange).toBe('gt-100k');
    });

    it('setSelectedTags should replace tags array', () => {
      useStore.getState().setSelectedTags(['UI设计', '原型']);
      expect(useStore.getState().selectedTags).toEqual(['UI设计', '原型']);
      useStore.getState().setSelectedTags([]);
      expect(useStore.getState().selectedTags).toEqual([]);
    });

    it('toggleTag should add tag if not present', () => {
      useStore.getState().toggleTag('UI设计');
      expect(useStore.getState().selectedTags).toContain('UI设计');
    });

    it('toggleTag should remove tag if already present', () => {
      useStore.getState().setSelectedTags(['UI设计', '原型']);
      useStore.getState().toggleTag('UI设计');
      expect(useStore.getState().selectedTags).not.toContain('UI设计');
      expect(useStore.getState().selectedTags).toContain('原型');
    });

    it('setSubscriptionFilter should update filter', () => {
      useStore.getState().setSubscriptionFilter('subscribed');
      expect(useStore.getState().subscriptionFilter).toBe('subscribed');
      useStore.getState().setSubscriptionFilter('not-subscribed');
      expect(useStore.getState().subscriptionFilter).toBe('not-subscribed');
    });

    it('setPendingReferralCode should update pending code', () => {
      useStore.getState().setPendingReferralCode('TEST123');
      expect(useStore.getState().pendingReferralCode).toBe('TEST123');
      useStore.getState().setPendingReferralCode(null);
      expect(useStore.getState().pendingReferralCode).toBeNull();
    });
  });

  describe('User Profile Actions', () => {
    beforeEach(() => {
      useStore.getState().setUser(createTestUser());
    });

    it('updateUserProfile should update partial user fields', () => {
      useStore.getState().updateUserProfile({ name: '新名称' });
      expect(useStore.getState().user?.name).toBe('新名称');
      expect(useStore.getState().user?.email).toBe('test@example.com');
    });

    it('updateUserProfile should not affect other fields', () => {
      useStore.getState().updateUserProfile({ email: 'new@example.com' });
      expect(useStore.getState().user?.email).toBe('new@example.com');
      expect(useStore.getState().user?.name).toBe('测试用户');
    });

    it('updateUserProfile should do nothing when user is null', () => {
      useStore.getState().setUser(null);
      useStore.getState().updateUserProfile({ name: '新名称' });
      expect(useStore.getState().user).toBeNull();
    });

    it('updateNotificationSettings should update partial settings', () => {
      useStore.getState().updateNotificationSettings({ marketingEmails: true });
      expect(useStore.getState().notificationSettings.marketingEmails).toBe(true);
      expect(useStore.getState().notificationSettings.emailNotifications).toBe(true);
    });

    it('updateNotificationSettings should merge with existing settings', () => {
      useStore.getState().updateNotificationSettings({
        emailNotifications: false,
        pushNotifications: false,
      });
      expect(useStore.getState().notificationSettings.emailNotifications).toBe(false);
      expect(useStore.getState().notificationSettings.pushNotifications).toBe(false);
      expect(useStore.getState().notificationSettings.securityAlerts).toBe(true);
    });
  });

  describe('Authentication Actions', () => {
    describe('login', () => {
      it('should return false for empty credentials', async () => {
        const result = await useStore.getState().login('', '');
        expect(result).toBe(false);
        expect(useStore.getState().isAuthenticated).toBe(false);
      });

      it('should login existing user with correct password', async () => {
        await useStore.getState().login('zhangming@example.com', 'password123');
        expect(useStore.getState().isAuthenticated).toBe(true);
        expect(useStore.getState().user).not.toBeNull();
        expect(useStore.getState().user?.email).toBe('zhangming@example.com');
      });

      it('should reject existing user with wrong password', async () => {
        await useStore.getState().login('newuser@example.com', 'password123');
        expect(useStore.getState().userPassword).toBe('password123');
        expect(useStore.getState().users.some(u => u.email === 'newuser@example.com')).toBe(true);
        
        useStore.setState({ isAuthenticated: false, user: null });
        const result = await useStore.getState().login('newuser@example.com', 'wrongpassword');
        expect(result).toBe(false);
        expect(useStore.getState().isAuthenticated).toBe(false);
      });

      it('should create new user for non-existing email', async () => {
        const result = await useStore.getState().login('newuser@example.com', 'password123');
        expect(result).toBe(true);
        expect(useStore.getState().isAuthenticated).toBe(true);
        expect(useStore.getState().user?.email).toBe('newuser@example.com');
        expect(useStore.getState().user?.name).toBe('newuser');
      });

      it('should login with uppercase email', async () => {
        const result = await useStore.getState().login('NEWUSER@EXAMPLE.COM', 'password123');
        expect(result).toBe(true);
        expect(useStore.getState().user?.email).toBe('NEWUSER@EXAMPLE.COM');
      });
    });

    describe('register', () => {
      it('should return false for missing required fields', async () => {
        const result1 = await useStore.getState().register('', 'test@example.com', 'password123');
        expect(result1).toBe(false);

        const result2 = await useStore.getState().register('Test', '', 'password123');
        expect(result2).toBe(false);

        const result3 = await useStore.getState().register('Test', 'test@example.com', '');
        expect(result3).toBe(false);
      });

      it('should register new user successfully', async () => {
        const result = await useStore.getState().register('新用户', 'new@example.com', 'password123');
        expect(result).toBe(true);
        expect(useStore.getState().isAuthenticated).toBe(true);
        expect(useStore.getState().user?.name).toBe('新用户');
        expect(useStore.getState().user?.email).toBe('new@example.com');
      });

      it('should register with valid referral code when requireSubscription is false', async () => {
        const settings = useStore.getState().referralSettings;
        useStore.getState().referralSettings.requireSubscription = false;
        
        const result = await useStore.getState().register(
          '推荐用户', 
          'referral@example.com', 
          'password123',
          'ZHANG2026'
        );
        
        expect(result).toBe(true);
        expect(useStore.getState().isAuthenticated).toBe(true);
        
        useStore.getState().referralSettings = settings;
      });

      it('should register with invalid referral code', async () => {
        const result = await useStore.getState().register(
          '测试用户',
          'invalid@example.com',
          'password123',
          'INVALIDCODE'
        );
        expect(result).toBe(true);
      });

      it('should clear pending referral code after registration', async () => {
        useStore.getState().setPendingReferralCode('ZHANG2026');
        await useStore.getState().register('测试', 'test@example.com', 'password123');
        expect(useStore.getState().pendingReferralCode).toBeNull();
      });
    });

    describe('logout', () => {
      it('should clear user and authentication state', () => {
        useStore.getState().setUser(createTestUser());
        useStore.setState({ isAuthenticated: true, userPassword: 'test123' });
        
        useStore.getState().logout();
        
        expect(useStore.getState().user).toBeNull();
        expect(useStore.getState().isAuthenticated).toBe(false);
        expect(useStore.getState().userPassword).toBe('');
      });
    });

    describe('changePassword', () => {
      it('should return false for wrong old password', async () => {
        useStore.getState().setUser(createTestUser());
        useStore.setState({ userPassword: 'oldpassword' });
        
        const result = await useStore.getState().changePassword('wrong', 'newpassword');
        expect(result).toBe(false);
        expect(useStore.getState().userPassword).toBe('oldpassword');
      });

      it('should change password with correct old password', async () => {
        useStore.getState().setUser(createTestUser());
        useStore.setState({ userPassword: 'oldpassword' });
        
        const result = await useStore.getState().changePassword('oldpassword', 'newpassword');
        expect(result).toBe(true);
        expect(useStore.getState().userPassword).toBe('newpassword');
      });
    });
  });

  describe('Subscription Management Actions', () => {
    beforeEach(() => {
      useStore.getState().setUser(createTestUser());
      useStore.setState({ userPassword: 'password123' });
    });

    describe('addSubscription', () => {
      it('should add subscription without coupon', () => {
        const sub = createTestSubscription();
        const result = useStore.getState().addSubscription(sub);
        
        expect(result.success).toBe(true);
        expect(result.finalPrice).toBe(100);
        expect(useStore.getState().subscriptions).toContainEqual(
          expect.objectContaining({ id: 'test-sub-id', price: 100 })
        );
      });

      it('should apply fixed coupon correctly', () => {
        const coupon: Coupon = {
          id: 'test-coupon',
          code: 'TEST50',
          userId: 'test-user-id',
          name: '测试优惠券',
          description: '测试',
          amount: 30,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });

        const sub = createTestSubscription({ price: 100 });
        const result = useStore.getState().addSubscription(sub, 'test-coupon');
        
        expect(result.success).toBe(true);
        expect(result.finalPrice).toBe(70);
      });

      it('should apply percentage coupon correctly', () => {
        const coupon: Coupon = {
          id: 'test-coupon-2',
          code: 'SAVE20',
          userId: 'test-user-id',
          name: '8折优惠',
          description: '测试',
          amount: 20,
          type: 'percentage',
          minPurchase: 50,
          status: 'available',
          source: 'promotion',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });

        const sub = createTestSubscription({ price: 100 });
        const result = useStore.getState().addSubscription(sub, 'test-coupon-2');
        
        expect(result.success).toBe(true);
        expect(result.finalPrice).toBe(80);
      });

      it('should reject expired coupon', () => {
        const coupon: Coupon = {
          id: 'expired-coupon',
          code: 'EXPIRED',
          userId: 'test-user-id',
          name: '过期优惠券',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2020-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });

        const sub = createTestSubscription({ price: 100 });
        const result = useStore.getState().addSubscription(sub, 'expired-coupon');
        
        expect(result.success).toBe(false);
        expect(result.message).toBe('优惠券已过期');
        expect(result.finalPrice).toBe(100);
      });

      it('should reject coupon when amount below minPurchase', () => {
        const coupon: Coupon = {
          id: 'min-coupon',
          code: 'MIN100',
          userId: 'test-user-id',
          name: '满100减50',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 100,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });

        const sub = createTestSubscription({ price: 50 });
        const result = useStore.getState().addSubscription(sub, 'min-coupon');
        
        expect(result.success).toBe(false);
        expect(result.message).toContain('满 ¥100');
      });

      it('should handle non-existent coupon gracefully', () => {
        const sub = createTestSubscription();
        const result = useStore.getState().addSubscription(sub, 'nonexistent');
        
        expect(result.success).toBe(true);
        expect(result.finalPrice).toBe(100);
      });

      it('should handle fixed coupon exceeding subscription price', () => {
        const coupon: Coupon = {
          id: 'big-coupon',
          code: 'BIG100',
          userId: 'test-user-id',
          name: '大额优惠券',
          description: '测试',
          amount: 200,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });

        const sub = createTestSubscription({ price: 100 });
        const result = useStore.getState().addSubscription(sub, 'big-coupon');
        
        expect(result.success).toBe(true);
        expect(result.finalPrice).toBe(0);
      });

      it('should update referral record status when user was referred', async () => {
        const settings = useStore.getState().referralSettings;
        useStore.getState().referralSettings.requireSubscription = true;
        
        const referralCode = 'ZHANG2026';
        await useStore.getState().register(
          '新注册用户',
          'referred@example.com',
          'password123',
          referralCode
        );
        
        const sub = createTestSubscription({ id: 'sub-referred' });
        const result = useStore.getState().addSubscription(sub);
        
        expect(result.success).toBe(true);
        
        const record = useStore.getState().referralRecords.find(r => r.referredEmail === 'referred@example.com');
        expect(record?.status).toBe('completed');
        
        useStore.getState().referralSettings = settings;
      });
    });

    describe('cancelSubscription', () => {
      it('should cancel active subscription', () => {
        const sub = createTestSubscription();
        useStore.getState().addSubscription(sub);
        
        useStore.getState().cancelSubscription('test-sub-id');
        
        const updated = useStore.getState().subscriptions.find(s => s.id === 'test-sub-id');
        expect(updated?.status).toBe('cancelled');
        expect(updated?.autoRenew).toBe(false);
      });

      it('should not affect other subscriptions', () => {
        useStore.getState().addSubscription(createTestSubscription({ id: 'sub-1' }));
        useStore.getState().addSubscription(createTestSubscription({ id: 'sub-2' }));
        
        useStore.getState().cancelSubscription('sub-1');
        
        const sub1 = useStore.getState().subscriptions.find(s => s.id === 'sub-1');
        const sub2 = useStore.getState().subscriptions.find(s => s.id === 'sub-2');
        expect(sub1?.status).toBe('cancelled');
        expect(sub2?.status).toBe('active');
      });
    });

    describe('renewSubscription', () => {
      it('should renew cancelled subscription', () => {
        const sub = createTestSubscription({ 
          status: 'cancelled', 
          autoRenew: false,
          id: 'renew-test'
        });
        useStore.getState().addSubscription(sub);
        
        useStore.getState().renewSubscription('renew-test');
        
        const updated = useStore.getState().subscriptions.find(s => s.id === 'renew-test');
        expect(updated?.status).toBe('active');
        expect(updated?.autoRenew).toBe(true);
        expect(updated?.startDate).toBeDefined();
        expect(updated?.endDate).toBeDefined();
      });

      it('should set correct end date 30 days from now', () => {
        const sub = createTestSubscription({ 
          status: 'expired', 
          id: 'renew-date-test' 
        });
        useStore.getState().addSubscription(sub);
        
        const beforeDate = new Date();
        useStore.getState().renewSubscription('renew-date-test');
        const afterDate = new Date();
        
        const updated = useStore.getState().subscriptions.find(s => s.id === 'renew-date-test');
        const endDate = new Date(updated?.endDate || '');
        const expectedMinEndDate = new Date(beforeDate);
        expectedMinEndDate.setDate(expectedMinEndDate.getDate() + 29);
        const expectedMaxEndDate = new Date(afterDate);
        expectedMaxEndDate.setDate(expectedMaxEndDate.getDate() + 31);
        
        expect(endDate.getTime()).toBeGreaterThanOrEqual(expectedMinEndDate.getTime());
        expect(endDate.getTime()).toBeLessThanOrEqual(expectedMaxEndDate.getTime());
      });
    });

    describe('toggleAutoRenew', () => {
      it('should toggle autoRenew from true to false', () => {
        const sub = createTestSubscription({ autoRenew: true, id: 'toggle-test' });
        useStore.getState().addSubscription(sub);
        
        useStore.getState().toggleAutoRenew('toggle-test');
        
        const updated = useStore.getState().subscriptions.find(s => s.id === 'toggle-test');
        expect(updated?.autoRenew).toBe(false);
      });

      it('should toggle autoRenew from false to true', () => {
        const sub = createTestSubscription({ autoRenew: false, id: 'toggle-test-2' });
        useStore.getState().addSubscription(sub);
        
        useStore.getState().toggleAutoRenew('toggle-test-2');
        
        const updated = useStore.getState().subscriptions.find(s => s.id === 'toggle-test-2');
        expect(updated?.autoRenew).toBe(true);
      });
    });

    describe('downloadInvoice', () => {
      it('should create and download invoice for existing subscription', () => {
        const createElementSpy = vi.spyOn(document, 'createElement');
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        
        const sub = createTestSubscription();
        useStore.getState().addSubscription(sub);
        
        useStore.getState().downloadInvoice('test-sub-id');
        
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
        expect(URL.createObjectURL).toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
        
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
      });

      it('should do nothing for non-existent subscription', () => {
        const createElementSpy = vi.spyOn(document, 'createElement');
        
        useStore.getState().downloadInvoice('nonexistent');
        
        expect(createElementSpy).not.toHaveBeenCalled();
        
        createElementSpy.mockRestore();
      });
    });
  });

  describe('Filter and Derived State Actions', () => {
    describe('getFilteredTools', () => {
      it('should return all tools when no filters applied', () => {
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.length).toBe(useStore.getState().tools.length);
      });

      it('should filter by category', () => {
        useStore.getState().setSelectedCategory('design');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.category === 'design')).toBe(true);
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('should filter by search query in name', () => {
        useStore.getState().setSearchQuery('figma');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.name.toLowerCase().includes('figma'))).toBe(true);
      });

      it('should filter by search query in description', () => {
        useStore.getState().setSearchQuery('代码');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('should filter by search query in tags', () => {
        useStore.getState().setSearchQuery('UI设计');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.tags.some(tag => tag.toLowerCase().includes('ui设计')))).toBe(true);
      });

      it('should filter by price range', () => {
        useStore.getState().setPriceRange(0, 50);
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => Math.min(...t.plans.map(p => p.price)) <= 50)).toBe(true);
      });

      it('should filter by rating range', () => {
        useStore.getState().setRatingRange(4.8, 5);
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.rating >= 4.8 && t.rating <= 5)).toBe(true);
      });

      it('should filter by users range - lt-10k', () => {
        useStore.getState().setUsersRange('lt-10k');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.usersCount < 10000)).toBe(true);
      });

      it('should filter by users range - 10k-50k', () => {
        useStore.getState().setUsersRange('10k-50k');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.usersCount >= 10000 && t.usersCount < 50000)).toBe(true);
      });

      it('should filter by users range - 50k-100k', () => {
        useStore.getState().setUsersRange('50k-100k');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.usersCount >= 50000 && t.usersCount < 100000)).toBe(true);
      });

      it('should filter by users range - gt-100k', () => {
        useStore.getState().setUsersRange('gt-100k');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.usersCount >= 100000)).toBe(true);
      });

      it('should filter by selected tags - all tags must match', () => {
        useStore.getState().setSelectedTags(['UI设计', '协作']);
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => 
          t.tags.includes('UI设计') && t.tags.includes('协作')
        )).toBe(true);
      });

      it('should filter by subscription status - subscribed', () => {
        useStore.getState().setSubscriptionFilter('subscribed');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.length).toBe(3);
      });

      it('should filter by subscription status - not-subscribed', () => {
        useStore.getState().setSubscriptionFilter('not-subscribed');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.length).toBe(5);
      });

      it('should filter by subscription status - expired', () => {
        useStore.getState().setSubscriptionFilter('expired');
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.length).toBe(1);
        expect(filtered[0].id).toBe('5');
      });

      it('should sort by rating descending', () => {
        useStore.getState().setSortBy('rating');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          expect(filtered[i - 1].rating).toBeGreaterThanOrEqual(filtered[i].rating);
        }
      });

      it('should sort by price low to high', () => {
        useStore.getState().setSortBy('price-low');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          const prevMin = Math.min(...filtered[i - 1].plans.map(p => p.price));
          const currMin = Math.min(...filtered[i].plans.map(p => p.price));
          expect(prevMin).toBeLessThanOrEqual(currMin);
        }
      });

      it('should sort by price high to low', () => {
        useStore.getState().setSortBy('price-high');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          const prevMin = Math.min(...filtered[i - 1].plans.map(p => p.price));
          const currMin = Math.min(...filtered[i].plans.map(p => p.price));
          expect(prevMin).toBeGreaterThanOrEqual(currMin);
        }
      });

      it('should sort by newest', () => {
        useStore.getState().setSortBy('newest');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          expect(parseInt(filtered[i - 1].id)).toBeGreaterThanOrEqual(parseInt(filtered[i].id));
        }
      });

      it('should sort by users descending', () => {
        useStore.getState().setSortBy('users-desc');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          expect(filtered[i - 1].usersCount).toBeGreaterThanOrEqual(filtered[i].usersCount);
        }
      });

      it('should sort by users ascending', () => {
        useStore.getState().setSortBy('users-asc');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          expect(filtered[i - 1].usersCount).toBeLessThanOrEqual(filtered[i].usersCount);
        }
      });

      it('should sort by popular (users descending) by default', () => {
        useStore.getState().setSortBy('popular');
        const filtered = useStore.getState().getFilteredTools();
        for (let i = 1; i < filtered.length; i++) {
          expect(filtered[i - 1].usersCount).toBeGreaterThanOrEqual(filtered[i].usersCount);
        }
      });

      it('should combine multiple filters', () => {
        useStore.getState().setSelectedCategory('development');
        useStore.getState().setRatingRange(4.8, 5);
        useStore.getState().setSortBy('rating');
        
        const filtered = useStore.getState().getFilteredTools();
        expect(filtered.every(t => t.category === 'development')).toBe(true);
        expect(filtered.every(t => t.rating >= 4.8)).toBe(true);
      });
    });

    describe('clearAllFilters', () => {
      it('should reset all filter values to defaults', () => {
        useStore.getState().setSelectedCategory('design');
        useStore.getState().setSearchQuery('test');
        useStore.getState().setSortBy('rating');
        useStore.getState().setPriceRange(50, 200);
        useStore.getState().setRatingRange(3, 4);
        useStore.getState().setUsersRange('10k-50k');
        useStore.getState().setSelectedTags(['UI设计']);
        useStore.getState().setSubscriptionFilter('subscribed');
        
        useStore.getState().clearAllFilters();
        
        const state = useStore.getState();
        expect(state.selectedCategory).toBe('all');
        expect(state.searchQuery).toBe('');
        expect(state.sortBy).toBe('popular');
        expect(state.priceMin).toBe(0);
        expect(state.priceMax).toBe(1000);
        expect(state.ratingMin).toBe(0);
        expect(state.ratingMax).toBe(5);
        expect(state.usersRange).toBe('all');
        expect(state.selectedTags).toEqual([]);
        expect(state.subscriptionFilter).toBe('all');
      });
    });

    describe('getAllTags', () => {
      it('should return all unique tags sorted', () => {
        const tags = useStore.getState().getAllTags();
        expect(Array.isArray(tags)).toBe(true);
        expect(tags.length).toBeGreaterThan(0);
        expect(tags).toEqual([...tags].sort());
        
        const uniqueTags = new Set(tags);
        expect(tags.length).toBe(uniqueTags.size);
      });

      it('should include tags from all tools', () => {
        const tags = useStore.getState().getAllTags();
        const tools = useStore.getState().tools;
        tools.forEach(tool => {
          tool.tags.forEach(tag => {
            expect(tags).toContain(tag);
          });
        });
      });
    });

    describe('getPriceRange', () => {
      it('should return correct min and max prices', () => {
        const range = useStore.getState().getPriceRange();
        const allPrices = useStore.getState().tools.flatMap(t => t.plans.map(p => p.price));
        
        expect(range.min).toBe(Math.min(...allPrices));
        expect(range.max).toBe(Math.max(...allPrices));
        expect(range.min).toBe(0);
        expect(range.max).toBe(499);
      });
    });
  });

  describe('Team Management Actions', () => {
    describe('inviteMember', () => {
      it('should invite new member successfully', async () => {
        const initialCount = useStore.getState().teamMembers.length;
        const result = await useStore.getState().inviteMember('newmember@example.com', 'member');
        
        expect(result).toBe(true);
        expect(useStore.getState().teamMembers.length).toBe(initialCount + 1);
        
        const newMember = useStore.getState().teamMembers.find(m => m.email === 'newmember@example.com');
        expect(newMember).toBeDefined();
        expect(newMember?.name).toBe('newmember');
        expect(newMember?.role).toBe('member');
        expect(newMember?.status).toBe('pending');
      });

      it('should return false for empty email', async () => {
        const initialCount = useStore.getState().teamMembers.length;
        const result = await useStore.getState().inviteMember('', 'admin');
        
        expect(result).toBe(false);
        expect(useStore.getState().teamMembers.length).toBe(initialCount);
      });

      it('should invite with admin role', async () => {
        const result = await useStore.getState().inviteMember('admin@example.com', 'admin');
        
        expect(result).toBe(true);
        const newMember = useStore.getState().teamMembers.find(m => m.email === 'admin@example.com');
        expect(newMember?.role).toBe('admin');
      });
    });

    describe('removeMember', () => {
      it('should remove existing member', () => {
        const initialCount = useStore.getState().teamMembers.length;
        useStore.getState().removeMember('member-1');
        
        expect(useStore.getState().teamMembers.length).toBe(initialCount - 1);
        expect(useStore.getState().teamMembers.find(m => m.id === 'member-1')).toBeUndefined();
      });

      it('should not fail for non-existent member', () => {
        const initialCount = useStore.getState().teamMembers.length;
        useStore.getState().removeMember('non-existent');
        
        expect(useStore.getState().teamMembers.length).toBe(initialCount);
      });
    });

    describe('changeMemberRole', () => {
      it('should change member role from member to admin', () => {
        useStore.getState().changeMemberRole('member-2', 'admin');
        
        const member = useStore.getState().teamMembers.find(m => m.id === 'member-2');
        expect(member?.role).toBe('admin');
      });

      it('should change member role from admin to member', () => {
        useStore.getState().changeMemberRole('member-1', 'member');
        
        const member = useStore.getState().teamMembers.find(m => m.id === 'member-1');
        expect(member?.role).toBe('member');
      });

      it('should not affect other members', () => {
        useStore.getState().changeMemberRole('member-2', 'admin' as TeamRole);
        
        const member1 = useStore.getState().teamMembers.find(m => m.id === 'member-1');
        const member3 = useStore.getState().teamMembers.find(m => m.id === 'member-3');
        expect(member1?.role).toBe('admin');
        expect(member3?.role).toBe('member');
      });
    });

    describe('updateTeamSettings', () => {
      it('should update partial team settings', () => {
        useStore.getState().updateTeamSettings({ teamName: '新团队名称' });
        
        expect(useStore.getState().teamSettings.teamName).toBe('新团队名称');
        expect(useStore.getState().teamSettings.teamDescription).toBe('专注于产品创新和开发的高效团队');
      });

      it('should update multiple settings at once', () => {
        useStore.getState().updateTeamSettings({
          ssoEnabled: true,
          twoFactorRequired: false,
          teamDescription: '新的团队描述',
        });
        
        expect(useStore.getState().teamSettings.ssoEnabled).toBe(true);
        expect(useStore.getState().teamSettings.twoFactorRequired).toBe(false);
        expect(useStore.getState().teamSettings.teamDescription).toBe('新的团队描述');
        expect(useStore.getState().teamSettings.sessionTimeout).toBe(true);
      });
    });
  });

  describe('Referral System Actions', () => {
    describe('generateReferralCode', () => {
      it('should throw error when user not logged in', () => {
        expect(() => useStore.getState().generateReferralCode()).toThrow('请先登录');
      });

      it('should generate new referral code for logged in user', () => {
        useStore.getState().setUser(createTestUser());
        
        const code = useStore.getState().generateReferralCode();
        expect(code).toBeDefined();
        expect(code.userId).toBe('test-user-id');
        expect(code.isActive).toBe(true);
        expect(code.code.length).toBe(10);
        expect(code.usedCount).toBe(0);
        expect(code.maxUses).toBe(100);
      });
      
      it('should generate referral code with latin characters correctly', () => {
        useStore.getState().setUser({
          id: 'test-user-2',
          name: 'John',
          email: 'john@example.com',
          avatar: 'test',
        });
        
        const code = useStore.getState().generateReferralCode();
        expect(code.code).toMatch(/^JOHN[A-Z0-9]{6}$/);
      });

      it('should return existing active code instead of generating new', () => {
        useStore.getState().setUser(createTestUser());
        
        const code1 = useStore.getState().generateReferralCode();
        const code2 = useStore.getState().generateReferralCode();
        
        expect(code1.id).toBe(code2.id);
        expect(code1.code).toBe(code2.code);
      });

      it('should set correct expiration date (1 year from now)', () => {
        useStore.getState().setUser(createTestUser());
        
        const code = useStore.getState().generateReferralCode();
        const expiresAt = new Date(code.expiresAt);
        const now = new Date();
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        
        expect(expiresAt.getFullYear()).toBe(oneYearLater.getFullYear());
      });
    });

    describe('getMyReferralCode', () => {
      it('should return undefined when not logged in', () => {
        const code = useStore.getState().getMyReferralCode();
        expect(code).toBeUndefined();
      });

      it('should return active referral code for logged in user', () => {
        useStore.getState().setUser(createTestUser());
        const generated = useStore.getState().generateReferralCode();
        
        const retrieved = useStore.getState().getMyReferralCode();
        expect(retrieved).toEqual(generated);
      });

      it('should return undefined when user has no active code', () => {
        useStore.getState().setUser(createTestUser());
        const code = useStore.getState().getMyReferralCode();
        expect(code).toBeUndefined();
      });
    });

    describe('validateReferralCode', () => {
      it('should validate active code successfully', () => {
        const result = useStore.getState().validateReferralCode('ZHANG2026');
        expect(result).not.toBeNull();
        expect(result?.code).toBe('ZHANG2026');
      });

      it('should be case insensitive', () => {
        const result1 = useStore.getState().validateReferralCode('zhang2026');
        const result2 = useStore.getState().validateReferralCode('Zhang2026');
        
        expect(result1).not.toBeNull();
        expect(result2).not.toBeNull();
        expect(result1?.code).toBe(result2?.code);
      });

      it('should trim whitespace', () => {
        const result = useStore.getState().validateReferralCode('  ZHANG2026  ');
        expect(result).not.toBeNull();
      });

      it('should return null for invalid code', () => {
        const result = useStore.getState().validateReferralCode('INVALID');
        expect(result).toBeNull();
      });

      it('should return null for expired code', () => {
        const expiredCode: ReferralCode = {
          id: 'rc-expired',
          code: 'EXPIRED',
          userId: 'test-user-id',
          userName: '测试',
          createdAt: '2024-01-01',
          usedCount: 0,
          maxUses: 100,
          expiresAt: '2020-01-01',
          isActive: true,
        };
        useStore.setState({ referralCodes: [...useStore.getState().referralCodes, expiredCode] });
        
        const result = useStore.getState().validateReferralCode('EXPIRED');
        expect(result).toBeNull();
      });

      it('should return null for max used code', () => {
        const maxUsedCode: ReferralCode = {
          id: 'rc-max',
          code: 'MAXUSED',
          userId: 'test-user-id',
          userName: '测试',
          createdAt: '2024-01-01',
          usedCount: 100,
          maxUses: 100,
          expiresAt: '2099-01-01',
          isActive: true,
        };
        useStore.setState({ referralCodes: [...useStore.getState().referralCodes, maxUsedCode] });
        
        const result = useStore.getState().validateReferralCode('MAXUSED');
        expect(result).toBeNull();
      });

      it('should return null for inactive code', () => {
        const inactiveCode: ReferralCode = {
          id: 'rc-inactive',
          code: 'INACTIVE',
          userId: 'test-user-id',
          userName: '测试',
          createdAt: '2024-01-01',
          usedCount: 0,
          maxUses: 100,
          expiresAt: '2099-01-01',
          isActive: false,
        };
        useStore.setState({ referralCodes: [...useStore.getState().referralCodes, inactiveCode] });
        
        const result = useStore.getState().validateReferralCode('INACTIVE');
        expect(result).toBeNull();
      });
    });

    describe('getMyReferralProgress', () => {
      it('should return empty progress when not logged in', () => {
        const progress = useStore.getState().getMyReferralProgress();
        expect(progress.userId).toBe('');
        expect(progress.totalInvites).toBe(0);
        expect(progress.level).toBe(1);
      });

      it('should return correct progress for user with referrals', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const progress = useStore.getState().getMyReferralProgress();
        expect(progress.userId).toBe('user-1');
        expect(progress.totalInvites).toBe(5);
        expect(progress.registeredCount).toBe(5);
        expect(progress.subscribedCount).toBe(3);
        expect(progress.totalRewards).toBe(150);
      });

      it('should calculate level correctly', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const progress = useStore.getState().getMyReferralProgress();
        expect(progress.level).toBe(2);
        expect(progress.nextLevelCount).toBe(10);
      });
    });

    describe('getMyReferralRecords', () => {
      it('should return empty array when not logged in', () => {
        const records = useStore.getState().getMyReferralRecords();
        expect(records).toEqual([]);
      });

      it('should return records for logged in user', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const records = useStore.getState().getMyReferralRecords();
        expect(records.length).toBe(5);
        expect(records.every(r => r.referrerId === 'user-1')).toBe(true);
      });

      it('should sort records by registeredAt descending', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const records = useStore.getState().getMyReferralRecords();
        for (let i = 1; i < records.length; i++) {
          const prevDate = new Date(records[i - 1].registeredAt);
          const currDate = new Date(records[i].registeredAt);
          expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
        }
      });
    });

    describe('getMyCoupons', () => {
      it('should return empty array when not logged in', () => {
        const coupons = useStore.getState().getMyCoupons();
        expect(coupons).toEqual([]);
      });

      it('should return all coupons for logged in user', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const coupons = useStore.getState().getMyCoupons();
        expect(coupons.length).toBe(3);
        expect(coupons.every(c => c.userId === 'user-1')).toBe(true);
      });

      it('should filter by status when provided', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const available = useStore.getState().getMyCoupons('available');
        const used = useStore.getState().getMyCoupons('used');
        
        expect(available.length).toBe(2);
        expect(available.every(c => c.status === 'available')).toBe(true);
        expect(used.length).toBe(1);
        expect(used.every(c => c.status === 'used')).toBe(true);
      });

      it('should sort coupons by createdAt descending', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test',
        });
        
        const coupons = useStore.getState().getMyCoupons();
        for (let i = 1; i < coupons.length; i++) {
          const prevDate = new Date(coupons[i - 1].createdAt);
          const currDate = new Date(coupons[i].createdAt);
          expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
        }
      });
    });

    describe('getReferralLeaderboard', () => {
      it('should return leaderboard with correct ranking', () => {
        const leaderboard = useStore.getState().getReferralLeaderboard();
        expect(Array.isArray(leaderboard)).toBe(true);
        expect(leaderboard.length).toBeGreaterThan(0);
        
        for (let i = 1; i < leaderboard.length; i++) {
          expect(leaderboard[i - 1].rank).toBeLessThan(leaderboard[i].rank);
        }
      });

      it('should include user stats when logged in', () => {
        useStore.getState().setUser({
          id: 'user-1',
          name: '张明',
          email: 'zhangming@example.com',
          avatar: 'test-avatar',
        });
        
        const leaderboard = useStore.getState().getReferralLeaderboard();
        const userEntry = leaderboard.find(l => l.userId === 'user-1');
        
        expect(userEntry).toBeDefined();
        expect(userEntry?.userName).toBe('张明');
        expect(userEntry?.userAvatar).toBe('test-avatar');
        expect(userEntry?.referralCount).toBe(5);
        expect(userEntry?.subscribedCount).toBe(3);
      });

      it('should sort by totalRewards descending', () => {
        const leaderboard = useStore.getState().getReferralLeaderboard();
        for (let i = 1; i < leaderboard.length; i++) {
          if (leaderboard[i - 1].totalRewards !== leaderboard[i].totalRewards) {
            expect(leaderboard[i - 1].totalRewards).toBeGreaterThan(leaderboard[i].totalRewards);
          }
        }
      });

      it('should include all required fields', () => {
        const leaderboard = useStore.getState().getReferralLeaderboard();
        leaderboard.forEach(item => {
          expect(item).toHaveProperty('rank');
          expect(item).toHaveProperty('userId');
          expect(item).toHaveProperty('userName');
          expect(item).toHaveProperty('userAvatar');
          expect(item).toHaveProperty('referralCount');
          expect(item).toHaveProperty('subscribedCount');
          expect(item).toHaveProperty('totalRewards');
        });
      });

      it('should sort by subscribedCount when totalRewards and referralCount are equal', () => {
        const customRecords = [
          {
            id: 'rr-custom-1',
            referrerId: 'user-custom-1',
            referrerName: '用户A',
            referredId: 'user-ref-1',
            referredName: '被推荐1',
            referredEmail: 'ref1@test.com',
            referralCode: 'CODEA',
            status: 'subscribed' as const,
            registeredAt: '2024-01-01',
            subscribedAt: '2024-01-02',
          },
          {
            id: 'rr-custom-2',
            referrerId: 'user-custom-1',
            referrerName: '用户A',
            referredId: 'user-ref-2',
            referredName: '被推荐2',
            referredEmail: 'ref2@test.com',
            referralCode: 'CODEA',
            status: 'subscribed' as const,
            registeredAt: '2024-01-01',
            subscribedAt: '2024-01-02',
          },
          {
            id: 'rr-custom-3',
            referrerId: 'user-custom-2',
            referrerName: '用户B',
            referredId: 'user-ref-3',
            referredName: '被推荐3',
            referredEmail: 'ref3@test.com',
            referralCode: 'CODEB',
            status: 'registered' as const,
            registeredAt: '2024-01-01',
          },
          {
            id: 'rr-custom-4',
            referrerId: 'user-custom-2',
            referrerName: '用户B',
            referredId: 'user-ref-4',
            referredName: '被推荐4',
            referredEmail: 'ref4@test.com',
            referralCode: 'CODEB',
            status: 'subscribed' as const,
            registeredAt: '2024-01-01',
            subscribedAt: '2024-01-02',
          },
        ];
        
        const customCodes = [
          {
            id: 'rc-custom-1',
            code: 'CODEA',
            userId: 'user-custom-1',
            userName: '用户A',
            createdAt: '2024-01-01',
            usedCount: 2,
            maxUses: 100,
            expiresAt: '2099-01-01',
            isActive: true,
          },
          {
            id: 'rc-custom-2',
            code: 'CODEB',
            userId: 'user-custom-2',
            userName: '用户B',
            createdAt: '2024-01-01',
            usedCount: 2,
            maxUses: 100,
            expiresAt: '2099-01-01',
            isActive: true,
          },
        ];
        
        useStore.setState({
          referralCodes: customCodes,
          referralRecords: customRecords,
          coupons: [],
          referralLeaderboard: [],
        });
        
        const leaderboard = useStore.getState().getReferralLeaderboard();
        const userA = leaderboard.find(l => l.userId === 'user-custom-1');
        const userB = leaderboard.find(l => l.userId === 'user-custom-2');
        
        expect(userA?.subscribedCount).toBe(2);
        expect(userB?.subscribedCount).toBe(1);
        expect(userA!.rank).toBeLessThan(userB!.rank);
      });
    });

    describe('useCoupon', () => {
      it('should return error when not logged in', () => {
        const result = useStore.getState().useCoupon('test-coupon', 100);
        expect(result.success).toBe(false);
        expect(result.message).toBe('请先登录');
      });

      it('should return error for non-existent coupon', () => {
        useStore.getState().setUser(createTestUser());
        const result = useStore.getState().useCoupon('nonexistent', 100);
        expect(result.success).toBe(false);
        expect(result.message).toBe('优惠券不存在');
      });

      it('should return error for used coupon', () => {
        useStore.getState().setUser(createTestUser());
        const usedCoupon: Coupon = {
          id: 'used-coupon',
          code: 'USED',
          userId: 'test-user-id',
          name: '已使用',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 50,
          status: 'used',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
          usedAt: '2024-01-15',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, usedCoupon] });
        
        const result = useStore.getState().useCoupon('used-coupon', 100);
        expect(result.success).toBe(false);
        expect(result.message).toBe('优惠券不可用');
      });

      it('should return error for expired coupon', () => {
        useStore.getState().setUser(createTestUser());
        const expiredCoupon: Coupon = {
          id: 'expired-coupon',
          code: 'EXPIRED2',
          userId: 'test-user-id',
          name: '已过期',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2020-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, expiredCoupon] });
        
        const result = useStore.getState().useCoupon('expired-coupon', 100);
        expect(result.success).toBe(false);
        expect(result.message).toBe('优惠券已过期');
      });

      it('should return error when amount below minPurchase', () => {
        useStore.getState().setUser(createTestUser());
        const coupon: Coupon = {
          id: 'min-coupon-2',
          code: 'MIN100',
          userId: 'test-user-id',
          name: '满100减50',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 100,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const result = useStore.getState().useCoupon('min-coupon-2', 50);
        expect(result.success).toBe(false);
        expect(result.message).toContain('满 ¥100');
      });

      it('should calculate fixed discount correctly', () => {
        useStore.getState().setUser(createTestUser());
        const coupon: Coupon = {
          id: 'success-coupon',
          code: 'SUCCESS',
          userId: 'test-user-id',
          name: '成功优惠券',
          description: '测试',
          amount: 30,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const result = useStore.getState().useCoupon('success-coupon', 100);
        expect(result.success).toBe(true);
        expect(result.discount).toBe(30);
      });

      it('should calculate percentage discount correctly', () => {
        useStore.getState().setUser(createTestUser());
        const coupon: Coupon = {
          id: 'percent-coupon',
          code: 'SAVE20',
          userId: 'test-user-id',
          name: '8折',
          description: '测试',
          amount: 20,
          type: 'percentage',
          minPurchase: 50,
          status: 'available',
          source: 'promotion',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const result = useStore.getState().useCoupon('percent-coupon', 100);
        expect(result.success).toBe(true);
        expect(result.discount).toBe(20);
      });
    });

    describe('calculateDiscount', () => {
      it('should return 0 for non-existent coupon', () => {
        const discount = useStore.getState().calculateDiscount('nonexistent', 100);
        expect(discount).toBe(0);
      });

      it('should return 0 for used coupon', () => {
        const usedCoupon: Coupon = {
          id: 'calc-used',
          code: 'CALCUSED',
          userId: 'any',
          name: '已使用',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 50,
          status: 'used',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, usedCoupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-used', 100);
        expect(discount).toBe(0);
      });

      it('should return 0 for expired coupon', () => {
        const expiredCoupon: Coupon = {
          id: 'calc-expired',
          code: 'CALCEXPIRED',
          userId: 'any',
          name: '已过期',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2020-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, expiredCoupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-expired', 100);
        expect(discount).toBe(0);
      });

      it('should return 0 when below minPurchase', () => {
        const coupon: Coupon = {
          id: 'calc-min',
          code: 'CALCMIN',
          userId: 'any',
          name: '满100减50',
          description: '测试',
          amount: 50,
          type: 'fixed',
          minPurchase: 100,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-min', 50);
        expect(discount).toBe(0);
      });

      it('should calculate fixed discount correctly', () => {
        const coupon: Coupon = {
          id: 'calc-fixed',
          code: 'CALCFIXED',
          userId: 'any',
          name: '测试',
          description: '测试',
          amount: 30,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-fixed', 100);
        expect(discount).toBe(30);
      });

      it('should calculate percentage discount correctly', () => {
        const coupon: Coupon = {
          id: 'calc-percent',
          code: 'CALCPERCENT',
          userId: 'any',
          name: '测试',
          description: '测试',
          amount: 15,
          type: 'percentage',
          minPurchase: 50,
          status: 'available',
          source: 'promotion',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-percent', 200);
        expect(discount).toBe(30);
      });

      it('should cap fixed discount at amount', () => {
        const coupon: Coupon = {
          id: 'calc-cap',
          code: 'CALCCAP',
          userId: 'any',
          name: '测试',
          description: '测试',
          amount: 200,
          type: 'fixed',
          minPurchase: 50,
          status: 'available',
          source: 'referral',
          createdAt: '2024-01-01',
          expiresAt: '2099-01-01',
        };
        useStore.setState({ coupons: [...useStore.getState().coupons, coupon] });
        
        const discount = useStore.getState().calculateDiscount('calc-cap', 100);
        expect(discount).toBe(100);
      });
    });

    describe('shareReferralLink', () => {
      it('should return empty string when not logged in', () => {
        const link = useStore.getState().shareReferralLink();
        expect(link).toBe('');
      });

      it('should generate share link with existing code', () => {
        useStore.getState().setUser(createTestUser());
        const code = useStore.getState().generateReferralCode();
        
        const link = useStore.getState().shareReferralLink();
        expect(link).toContain(`/register?ref=${code.code}`);
        expect(link).toContain(window.location.origin);
      });

      it('should generate code if user has no active code', () => {
        useStore.getState().setUser(createTestUser());
        
        expect(useStore.getState().getMyReferralCode()).toBeUndefined();
        const link = useStore.getState().shareReferralLink();
        
        expect(link).not.toBe('');
        expect(useStore.getState().getMyReferralCode()).toBeDefined();
        expect(link).toContain('/register?ref=');
      });
    });

    describe('issueReferralRewardsInternal', () => {
      it('should create coupons for both referrer and referred', () => {
        const referrerCode: ReferralCode = {
          id: 'rc-issue',
          code: 'ISSUE2024',
          userId: 'referrer-id',
          userName: '推荐人',
          createdAt: '2024-01-01',
          usedCount: 0,
          maxUses: 100,
          expiresAt: '2099-01-01',
          isActive: true,
        };
        
        const initialCoupons = useStore.getState().coupons.length;
        const initialRecords = useStore.getState().referralRecords.length;
        
        useStore.getState().issueReferralRewardsInternal(
          referrerCode,
          'record-123',
          'referred-id',
          '被推荐人'
        );
        
        expect(useStore.getState().coupons.length).toBe(initialCoupons + 2);
        
        const referrerCoupon = useStore.getState().coupons.find(c => c.userId === 'referrer-id');
        const referredCoupon = useStore.getState().coupons.find(c => c.userId === 'referred-id');
        
        expect(referrerCoupon).toBeDefined();
        expect(referredCoupon).toBeDefined();
        expect(referrerCoupon?.name).toBe('推荐好友奖励');
        expect(referredCoupon?.name).toBe('新人注册奖励');
        expect(referrerCoupon?.status).toBe('available');
        expect(referredCoupon?.status).toBe('available');
        expect(referrerCoupon?.source).toBe('referral');
        expect(referredCoupon?.source).toBe('referral');
      });

      it('should update referral record status to completed', () => {
        const referrerCode: ReferralCode = {
          id: 'rc-issue-2',
          code: 'ISSUE2024-2',
          userId: 'referrer-id-2',
          userName: '推荐人2',
          createdAt: '2024-01-01',
          usedCount: 0,
          maxUses: 100,
          expiresAt: '2099-01-01',
          isActive: true,
        };
        
        const testRecord = {
          id: 'rr-test',
          referrerId: 'referrer-id-2',
          referrerName: '推荐人2',
          referredId: 'referred-id-2',
          referredName: '被推荐人2',
          referredEmail: 'test2@example.com',
          referralCode: 'ISSUE2024-2',
          status: 'subscribed' as const,
          registeredAt: '2024-01-01',
          subscribedAt: '2024-01-02',
        };
        useStore.setState({ referralRecords: [...useStore.getState().referralRecords, testRecord] });
        
        useStore.getState().issueReferralRewardsInternal(
          referrerCode,
          'rr-test',
          'referred-id-2',
          '被推荐人2'
        );
        
        const updatedRecord = useStore.getState().referralRecords.find(r => r.id === 'rr-test');
        expect(updatedRecord?.status).toBe('completed');
        expect(updatedRecord?.completedAt).toBeDefined();
        expect(updatedRecord?.referrerRewardId).toBeDefined();
        expect(updatedRecord?.referredRewardId).toBeDefined();
      });

      it('should set correct expiration date based on settings', () => {
        const referrerCode: ReferralCode = {
          id: 'rc-issue-3',
          code: 'ISSUE2024-3',
          userId: 'referrer-id-3',
          userName: '推荐人3',
          createdAt: '2024-01-01',
          usedCount: 0,
          maxUses: 100,
          expiresAt: '2099-01-01',
          isActive: true,
        };
        
        const settings = useStore.getState().referralSettings;
        const beforeDate = new Date();
        
        useStore.getState().issueReferralRewardsInternal(
          referrerCode,
          'record-456',
          'referred-id-3',
          '被推荐人3'
        );
        
        const referrerCoupon = useStore.getState().coupons.find(c => c.userId === 'referrer-id-3');
        const expiresAt = new Date(referrerCoupon?.expiresAt || '');
        const expectedExpiry = new Date(beforeDate);
        expectedExpiry.setDate(expectedExpiry.getDate() + settings.validDays);
        
        expect(expiresAt.getFullYear()).toBe(expectedExpiry.getFullYear());
        expect(expiresAt.getMonth()).toBe(expectedExpiry.getMonth());
        expect(expiresAt.getDate()).toBe(expectedExpiry.getDate());
      });
    });
  });

  describe('Reset Action', () => {
    describe('resetToDefaults', () => {
      it('should reset all state to default values', () => {
        useStore.getState().setUser(createTestUser());
        useStore.setState({
          isAuthenticated: true,
          searchQuery: 'test',
          selectedCategory: 'design',
          userPassword: 'password123',
        });
        
        useStore.getState().resetToDefaults();
        
        const state = useStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.searchQuery).toBe('');
        expect(state.selectedCategory).toBe('all');
        expect(state.userPassword).toBe('');
        expect(state.subscriptions.length).toBe(4);
      });

      it('should reset team settings to defaults', () => {
        useStore.getState().updateTeamSettings({ teamName: '临时团队' });
        useStore.getState().resetToDefaults();
        expect(useStore.getState().teamSettings.teamName).toBe('创新科技团队');
      });

      it('should reset notification settings to defaults', () => {
        useStore.getState().updateNotificationSettings({ marketingEmails: true });
        useStore.getState().resetToDefaults();
        expect(useStore.getState().notificationSettings.marketingEmails).toBe(false);
      });
    });
  });

  describe('generateUserId helper', () => {
    it('should generate correct user id from email', async () => {
      await useStore.getState().login('john.doe+test@example.com', 'password');
      expect(useStore.getState().user?.id).toBe('user-johndoetest-example');
    });

    it('should handle email without domain dot', async () => {
      await useStore.getState().login('user@test', 'password');
      expect(useStore.getState().user?.id).toBe('user-user-test');
    });

    it('should handle uppercase email', async () => {
      await useStore.getState().login('USER@EXAMPLE.COM', 'password');
      expect(useStore.getState().user?.id).toBe('user-user-example');
    });
  });
});