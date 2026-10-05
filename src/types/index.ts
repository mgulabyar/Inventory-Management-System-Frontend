export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'WarehouseManager' | 'SalesCashier';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: Category | null;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

// NEW CONFIG: Dashboard metrics pipeline interfaces
export interface FinancialsMetrics {
  totalRevenue: number;
  totalGrossProfit: number;
  totalInwardPurchaseExpenses: number;
  netSimulatedCashflow: number;
}

export interface InventorySummaryCounters {
  totalUniqueProductsIndexed: number;
  totalSalesTransactionsProcessed: number;
  totalIndividualItemsSoldCount: number;
  lowStockAlertsActiveCount: number;
}

export interface CriticalAlertItem {
  id: string;
  name: string;
  remainingStock: number;
  sku: string;
}

export interface TopSellingPerformer {
  name: string;
  sku: string;
  totalSoldUnits: number;
}

export interface DashboardSummaryPayload {
  financials: FinancialsMetrics;
  inventorySummary: InventorySummaryCounters;
  criticalAlerts: CriticalAlertItem[];
  topSellingPerformers: TopSellingPerformer[];
}

export interface DashboardAPIResponse {
  success: boolean;
  data: DashboardSummaryPayload;
}
