import type { 
  UserSubscription, 
  Bill, 
  MonthlySpending, 
  CategorySpending,
  DailySpending,
  WeeklySpending,
  QuarterlySpending,
  YearlySpending
} from '@/types';

export const userSubscriptions: UserSubscription[] = [
  {
    id: 'sub-1',
    toolId: '1',
    toolName: 'Figma',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=figma%20logo%20minimal%20design%20gradient&image_size=square',
    planName: 'Professional',
    price: 45,
    period: 'monthly',
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-2',
    toolId: '2',
    toolName: 'GitHub Pro',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=github%20logo%20minimal%20dark%20theme&image_size=square',
    planName: 'Pro',
    price: 32,
    period: 'monthly',
    startDate: '2024-02-01',
    endDate: '2026-02-01',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-3',
    toolId: '3',
    toolName: 'Notion',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=notion%20logo%20minimal%20black%20white&image_size=square',
    planName: 'Plus',
    price: 28,
    period: 'monthly',
    startDate: '2024-03-10',
    endDate: '2026-03-10',
    status: 'active',
    autoRenew: true
  },
  {
    id: 'sub-4',
    toolId: '5',
    toolName: 'VS Code Pro',
    toolLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vscode%20logo%20blue%20gradient%20minimal&image_size=square',
    planName: 'Pro',
    price: 19,
    period: 'monthly',
    startDate: '2023-11-20',
    endDate: '2024-11-20',
    status: 'expired',
    autoRenew: false
  }
];

export const bills: Bill[] = [
  {
    id: 'bill-1',
    date: '2025-06-01',
    amount: 105,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 }
    ]
  },
  {
    id: 'bill-2',
    date: '2025-05-01',
    amount: 105,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 }
    ]
  },
  {
    id: 'bill-3',
    date: '2025-04-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-4',
    date: '2025-03-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-5',
    date: '2025-02-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-6',
    date: '2025-01-01',
    amount: 96,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 19 }
    ]
  }
];

export const monthlySpending: MonthlySpending[] = [
  { month: '1月', amount: 96 },
  { month: '2月', amount: 124 },
  { month: '3月', amount: 124 },
  { month: '4月', amount: 124 },
  { month: '5月', amount: 105 },
  { month: '6月', amount: 105 }
];

export const categorySpending: CategorySpending[] = [
  { name: '设计工具', value: 45 },
  { name: '开发工具', value: 32 },
  { name: '协作工具', value: 28 }
];

export const monthlySpending2024: MonthlySpending[] = [
  { month: '1月', amount: 77 },
  { month: '2月', amount: 82 },
  { month: '3月', amount: 95 },
  { month: '4月', amount: 95 },
  { month: '5月', amount: 110 },
  { month: '6月', amount: 110 },
  { month: '7月', amount: 124 },
  { month: '8月', amount: 124 },
  { month: '9月', amount: 142 },
  { month: '10月', amount: 142 },
  { month: '11月', amount: 124 },
  { month: '12月', amount: 124 }
];

export const monthlySpending2025: MonthlySpending[] = [
  { month: '1月', amount: 96 },
  { month: '2月', amount: 124 },
  { month: '3月', amount: 124 },
  { month: '4月', amount: 124 },
  { month: '5月', amount: 105 },
  { month: '6月', amount: 105 },
  { month: '7月', amount: 138 },
  { month: '8月', amount: 138 },
  { month: '9月', amount: 155 },
  { month: '10月', amount: 155 },
  { month: '11月', amount: 138 },
  { month: '12月', amount: 172 }
];

export const allBills: Bill[] = [
  ...bills,
  {
    id: 'bill-7',
    date: '2024-12-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-8',
    date: '2024-11-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-9',
    date: '2024-10-01',
    amount: 142,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 },
      { name: 'Slack Pro', quantity: 1, price: 18 }
    ]
  },
  {
    id: 'bill-10',
    date: '2024-09-01',
    amount: 142,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 },
      { name: 'Slack Pro', quantity: 1, price: 18 }
    ]
  },
  {
    id: 'bill-11',
    date: '2024-08-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-12',
    date: '2024-07-01',
    amount: 124,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'VS Code Pro', quantity: 1, price: 19 }
    ]
  },
  {
    id: 'bill-13',
    date: '2025-07-01',
    amount: 138,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 }
    ]
  },
  {
    id: 'bill-14',
    date: '2025-08-01',
    amount: 138,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 }
    ]
  },
  {
    id: 'bill-15',
    date: '2025-09-01',
    amount: 155,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 },
      { name: 'Vercel Pro', quantity: 1, price: 17 }
    ]
  },
  {
    id: 'bill-16',
    date: '2025-10-01',
    amount: 155,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 },
      { name: 'Vercel Pro', quantity: 1, price: 17 }
    ]
  },
  {
    id: 'bill-17',
    date: '2025-11-01',
    amount: 138,
    status: 'paid',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 }
    ]
  },
  {
    id: 'bill-18',
    date: '2025-12-01',
    amount: 172,
    status: 'pending',
    items: [
      { name: 'Figma Professional', quantity: 1, price: 45 },
      { name: 'GitHub Pro', quantity: 1, price: 32 },
      { name: 'Notion Plus', quantity: 1, price: 28 },
      { name: 'Slack Pro', quantity: 1, price: 18 },
      { name: 'Linear Pro', quantity: 1, price: 15 },
      { name: 'Vercel Pro', quantity: 1, price: 17 },
      { name: 'AWS Basic', quantity: 1, price: 17 }
    ]
  }
];

export const dailySpending: DailySpending[] = [
  { date: '2025-06-01', amount: 105, category: '全部' },
  { date: '2025-06-02', amount: 0 },
  { date: '2025-06-03', amount: 0 },
  { date: '2025-06-04', amount: 0 },
  { date: '2025-06-05', amount: 15, category: '开发工具' },
  { date: '2025-06-06', amount: 0 },
  { date: '2025-06-07', amount: 0 },
  { date: '2025-06-08', amount: 0 },
  { date: '2025-06-09', amount: 0 },
  { date: '2025-06-10', amount: 28, category: '协作工具' },
  { date: '2025-06-11', amount: 0 },
  { date: '2025-06-12', amount: 0 },
  { date: '2025-06-13', amount: 0 },
  { date: '2025-06-14', amount: 0 },
  { date: '2025-06-15', amount: 45, category: '设计工具' },
  { date: '2025-06-16', amount: 0 },
  { date: '2025-06-17', amount: 0 },
  { date: '2025-06-18', amount: 0 },
  { date: '2025-06-19', amount: 0 },
  { date: '2025-06-20', amount: 32, category: '开发工具' },
  { date: '2025-06-21', amount: 0 },
  { date: '2025-06-22', amount: 0 },
  { date: '2025-06-23', amount: 0 },
  { date: '2025-06-24', amount: 0 },
  { date: '2025-06-25', amount: 0 },
  { date: '2025-06-26', amount: 0 },
  { date: '2025-06-27', amount: 0 },
  { date: '2025-06-28', amount: 0 },
  { date: '2025-06-29', amount: 0 },
  { date: '2025-06-30', amount: 0 },
];

export const weeklySpending: WeeklySpending[] = [
  { week: '第1周', weekStart: '2025-06-01', weekEnd: '2025-06-07', amount: 120 },
  { week: '第2周', weekStart: '2025-06-08', weekEnd: '2025-06-14', amount: 28 },
  { week: '第3周', weekStart: '2025-06-15', weekEnd: '2025-06-21', amount: 77 },
  { week: '第4周', weekStart: '2025-06-22', weekEnd: '2025-06-28', amount: 0 },
  { week: '第5周', weekStart: '2025-06-29', weekEnd: '2025-06-30', amount: 0 },
];

export const quarterlySpending: QuarterlySpending[] = [
  { quarter: '2024 Q1', year: 2024, q: 1, amount: 254 },
  { quarter: '2024 Q2', year: 2024, q: 2, amount: 315 },
  { quarter: '2024 Q3', year: 2024, q: 3, amount: 390 },
  { quarter: '2024 Q4', year: 2024, q: 4, amount: 390 },
  { quarter: '2025 Q1', year: 2025, q: 1, amount: 344 },
  { quarter: '2025 Q2', year: 2025, q: 2, amount: 334 },
];

export const yearlySpending: YearlySpending[] = [
  { year: '2023', amount: 580 },
  { year: '2024', amount: 1349 },
  { year: '2025', amount: 1060 },
];

export const pricingPlans = [
  {
    id: 'personal',
    name: '个人版',
    description: '适合个人开发者和自由职业者',
    price: 0,
    period: 'monthly',
    features: [
      '浏览所有工具',
      '最多5个活跃订阅',
      '基础账单管理',
      '社区支持'
    ],
    recommended: false
  },
  {
    id: 'team',
    name: '团队版',
    description: '适合中小企业和创业团队',
    price: 29,
    period: 'monthly',
    features: [
      '所有个人版功能',
      '无限活跃订阅',
      '团队成员管理',
      '订阅分配功能',
      '高级账单分析',
      '优先客户支持',
      '专属客户经理'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合大型企业和机构',
    price: 99,
    period: 'monthly',
    features: [
      '所有团队版功能',
      'SSO单点登录',
      '高级安全审计',
      '定制化集成',
      '专属技术支持',
      'SLA服务保障',
      '定制化培训'
    ],
    recommended: false
  }
];
