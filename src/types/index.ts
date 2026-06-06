export type Category = 'design' | 'development' | 'marketing' | 'collaboration';
export type PlanPeriod = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type BillStatus = 'paid' | 'pending' | 'failed';
export type TeamRole = 'admin' | 'member';
export type MemberStatus = 'active' | 'pending';
export type SortOption = 'popular' | 'rating' | 'price-low' | 'price-high' | 'newest' | 'users-desc' | 'users-asc';
export type SubscriptionFilter = 'all' | 'subscribed' | 'not-subscribed' | 'expired';
export type UsersRange = 'all' | 'lt-10k' | '10k-50k' | '50k-100k' | 'gt-100k';

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: PlanPeriod;
  features: string[];
  recommended?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  logo: string;
  rating: number;
  usersCount: number;
  plans: Plan[];
  features: string[];
  screenshots: string[];
  tags: string[];
}

export interface UserSubscription {
  id: string;
  toolId: string;
  toolName: string;
  toolLogo: string;
  planName: string;
  price: number;
  period: PlanPeriod;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
}

export interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  date: string;
  amount: number;
  status: BillStatus;
  items: BillItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: TeamRole;
  joinDate: string;
  status: MemberStatus;
  subscriptions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teamId?: string;
  teamRole?: TeamRole;
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  name: string;
  value: number;
}

export type TimeDimension = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type ComparisonType = 'none' | 'last_period' | 'same_period_last_year';

export interface TimeRange {
  start: string;
  end: string;
}

export interface DailySpending {
  date: string;
  amount: number;
  category?: string;
}

export interface WeeklySpending {
  week: string;
  weekStart: string;
  weekEnd: string;
  amount: number;
}

export interface QuarterlySpending {
  quarter: string;
  year: number;
  q: number;
  amount: number;
}

export interface YearlySpending {
  year: string;
  amount: number;
}

export interface ComparisonData {
  period: string;
  current: number;
  previous: number;
  difference: number;
  differencePercent: number;
}

export interface PredictionData {
  period: string;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface AnomalyData {
  period: string;
  amount: number;
  type: 'high' | 'low';
  expectedAmount: number;
  deviationPercent: number;
  description: string;
}

export interface DrillDownData {
  period: string;
  totalAmount: number;
  items: {
    name: string;
    amount: number;
    category: string;
    date: string;
  }[];
}
