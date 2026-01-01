import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleLayout } from '@/components/shared/ModuleLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calculator, FileText, BarChart3, Plus, BookOpen, Receipt, Warehouse, Building2, Activity, LineChart, AlertCircle, CreditCard, Banknote, Building, Calendar, Target, Lock, Unlock, Download, Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { mockCostCenters, getCostCenterName } from '@/store/data';
import type { CostCenter } from '@shared/types';
import {
  mockPreCostings, mockActualCostings, mockCostVariances, mockCostPerMinutes, mockCostPerStyles, mockCostPerLines,
  mockChartOfAccounts, mockJournalEntries, mockAccountBalances,
  mockInventoryValuations,
  mockTaxConfigurations, mockTaxTransactions,
  mockProfitLossStatement, mockBalanceSheet, mockCashFlowStatement,
  mockAccountsReceivable, mockARPayments, mockAccountsPayable, mockAPPayments,
  mockBankAccounts, mockBankTransactions, mockBudgets, mockFiscalPeriods,
  PreCosting, ActualCosting, CostVariance, CostPerStyle, CostPerMinute, CostPerLine,
  ChartOfAccount, JournalEntry, AccountBalance,
  InventoryValuation,
  TaxConfiguration, TaxTransaction,
  ProfitLossStatement, BalanceSheet, CashFlowStatement,
  AccountsReceivable, ARPayment, AccountsPayable, APPayment,
  BankAccount, BankTransaction, Budget, FiscalPeriod,
  generateId,
} from '@/store/financeData';
import { formatCurrency } from '@/store/currencyData';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MegaMenuTabs } from '@/components/shared/MegaMenuTabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  PreCostingForm, JournalEntryForm, ChartOfAccountForm, TaxConfigurationForm,
  CostCenterForm, InventoryValuationForm, ActualCostingForm
} from '@/components/finance/FinanceForms';
import { ARPaymentForm, APPaymentForm, BankAccountForm, BankTransactionForm, BudgetForm } from '@/components/finance/AccountingFormsNew';

export default function Accounting() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();

  const [preCostings, setPreCostings] = useState<PreCosting[]>(mockPreCostings);
  const [actualCostings, setActualCostings] = useState<ActualCosting[]>(mockActualCostings);
  const [costVariances] = useState<CostVariance[]>(mockCostVariances);
  const [costPerStyles] = useState<CostPerStyle[]>(mockCostPerStyles);
  const [costPerMinutes] = useState<CostPerMinute[]>(mockCostPerMinutes);
  const [costPerLines] = useState<CostPerLine[]>(mockCostPerLines);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(mockChartOfAccounts);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [accountBalances] = useState<AccountBalance[]>(mockAccountBalances);
  const [inventoryValuations, setInventoryValuations] = useState<InventoryValuation[]>(mockInventoryValuations);
  const [taxConfigurations, setTaxConfigurations] = useState<TaxConfiguration[]>(mockTaxConfigurations);
  const [taxTransactions] = useState<TaxTransaction[]>(mockTaxTransactions);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(mockCostCenters);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-Q1');
  
  // New accounting modules state
  const [accountsReceivable, setAccountsReceivable] = useState<AccountsReceivable[]>(mockAccountsReceivable);
  const [arPayments, setARPayments] = useState<ARPayment[]>(mockARPayments);
  const [accountsPayable, setAccountsPayable] = useState<AccountsPayable[]>(mockAccountsPayable);
  const [apPayments, setAPPayments] = useState<APPayment[]>(mockAPPayments);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(mockBankTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>(mockFiscalPeriods);

  // Dialog states
  const [preCostingDialogOpen, setPreCostingDialogOpen] = useState(false);
  const [selectedPreCosting, setSelectedPreCosting] = useState<PreCosting | null>(null);
  const [journalEntryDialogOpen, setJournalEntryDialogOpen] = useState(false);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [taxConfigDialogOpen, setTaxConfigDialogOpen] = useState(false);
  const [selectedTaxConfig, setSelectedTaxConfig] = useState<TaxConfiguration | null>(null);
  const [costCenterDialogOpen, setCostCenterDialogOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const [inventoryValuationDialogOpen, setInventoryValuationDialogOpen] = useState(false);
  const [selectedInventoryValuation, setSelectedInventoryValuation] = useState<InventoryValuation | null>(null);
  const [actualCostingDialogOpen, setActualCostingDialogOpen] = useState(false);
  const [selectedActualCosting, setSelectedActualCosting] = useState<ActualCosting | null>(null);
  
  // New dialog states
  const [isAddARPaymentOpen, setIsAddARPaymentOpen] = useState(false);
  const [isAddAPPaymentOpen, setIsAddAPPaymentOpen] = useState(false);
  const [isAddBankAccountOpen, setIsAddBankAccountOpen] = useState(false);
  const [isAddBankTransactionOpen, setIsAddBankTransactionOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isReconcileBankOpen, setIsReconcileBankOpen] = useState(false);
  
  const [selectedARPayment, setSelectedARPayment] = useState<ARPayment | null>(null);
  const [selectedAPPayment, setSelectedAPPayment] = useState<APPayment | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [activeTab, setActiveTab] = useState<string>('ledger');

  // Handlers
  const handleSavePreCosting = (data: any) => {
    const newPreCosting: PreCosting = {
      ...data,
      id: selectedPreCosting?.id || generateId(),
      code: selectedPreCosting?.code || `PC-${new Date().getFullYear()}-${String(preCostings.length + 1).padStart(3, '0')}`,
      createdAt: selectedPreCosting?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedPreCosting) {
      setPreCostings(preCostings.map(pc => pc.id === selectedPreCosting.id ? newPreCosting : pc));
      toast({ title: isRTL ? 'تم تحديث التكلفة المسبقة بنجاح' : 'Pre-costing updated successfully' });
    } else {
      setPreCostings([...preCostings, newPreCosting]);
      toast({ title: isRTL ? 'تم إنشاء التكلفة المسبقة بنجاح' : 'Pre-costing created successfully' });
    }
    setSelectedPreCosting(null);
  };

  const handleSaveJournalEntry = (data: any) => {
    const newEntry: JournalEntry = {
      ...data,
      id: selectedJournalEntry?.id || generateId(),
      entryNumber: selectedJournalEntry?.entryNumber || `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      status: data.status || 'draft',
      createdBy: 'user-1',
      createdAt: selectedJournalEntry?.createdAt || new Date().toISOString().split('T')[0],
      postedBy: data.status === 'posted' ? 'user-1' : undefined,
      postedAt: data.status === 'posted' ? new Date().toISOString().split('T')[0] : undefined,
      referenceId: data.referenceNumber || undefined,
    };
    if (selectedJournalEntry) {
      setJournalEntries(journalEntries.map(je => je.id === selectedJournalEntry.id ? newEntry : je));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث القيد بنجاح' : 'Journal entry updated successfully' });
    } else {
      setJournalEntries([...journalEntries, newEntry]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء القيد بنجاح' : 'Journal entry created successfully' });
    }
    setSelectedJournalEntry(null);
  };

  const handleSaveAccount = (data: any) => {
    const newAccount: ChartOfAccount = {
      ...data,
      id: selectedAccount?.id || generateId(),
      createdAt: selectedAccount?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedAccount) {
      setChartOfAccounts(chartOfAccounts.map(acc => acc.id === selectedAccount.id ? newAccount : acc));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث الحساب بنجاح' : 'Account updated successfully' });
    } else {
      setChartOfAccounts([...chartOfAccounts, newAccount]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully' });
    }
    setSelectedAccount(null);
  };

  const handleSaveTaxConfig = (data: any) => {
    const newTaxConfig: TaxConfiguration = {
      ...data,
      id: selectedTaxConfig?.id || generateId(),
      createdAt: selectedTaxConfig?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedTaxConfig) {
      setTaxConfigurations(taxConfigurations.map(tax => tax.id === selectedTaxConfig.id ? newTaxConfig : tax));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث الضريبة بنجاح' : 'Tax configuration updated successfully' });
    } else {
      setTaxConfigurations([...taxConfigurations, newTaxConfig]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء الضريبة بنجاح' : 'Tax configuration created successfully' });
    }
    setSelectedTaxConfig(null);
  };

  const handleSaveCostCenter = (data: any) => {
    const newCostCenter: CostCenter = {
      ...data,
      id: selectedCostCenter?.id || generateId(),
      createdAt: selectedCostCenter?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedCostCenter) {
      setCostCenters(costCenters.map(cc => cc.id === selectedCostCenter.id ? newCostCenter : cc));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث مركز التكلفة بنجاح' : 'Cost center updated successfully' });
    } else {
      setCostCenters([...costCenters, newCostCenter]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء مركز التكلفة بنجاح' : 'Cost center created successfully' });
    }
    setSelectedCostCenter(null);
  };

  const handleSaveInventoryValuation = (data: any) => {
    const newValuation: InventoryValuation = {
      ...data,
      id: selectedInventoryValuation?.id || generateId(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    if (selectedInventoryValuation) {
      setInventoryValuations(inventoryValuations.map(iv => iv.id === selectedInventoryValuation.id ? newValuation : iv));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث تقييم المخزون بنجاح' : 'Inventory valuation updated successfully' });
    } else {
      setInventoryValuations([...inventoryValuations, newValuation]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء تقييم المخزون بنجاح' : 'Inventory valuation created successfully' });
    }
    setSelectedInventoryValuation(null);
  };

  const handleSaveActualCosting = (data: any) => {
    const newActualCosting: ActualCosting = {
      ...data,
      id: selectedActualCosting?.id || generateId(),
      code: selectedActualCosting?.code || `AC-${new Date().getFullYear()}-${String(actualCostings.length + 1).padStart(3, '0')}`,
      actualMaterialDetails: [],
      actualLaborDetails: [],
      createdAt: selectedActualCosting?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedActualCosting) {
      setActualCostings(actualCostings.map(ac => ac.id === selectedActualCosting.id ? newActualCosting : ac));
      toast({ title: isRTL ? 'تم التحديث' : 'Updated', description: isRTL ? 'تم تحديث التكلفة الفعلية بنجاح' : 'Actual costing updated successfully' });
    } else {
      setActualCostings([...actualCostings, newActualCosting]);
      toast({ title: isRTL ? 'تم الإنشاء' : 'Created', description: isRTL ? 'تم إنشاء التكلفة الفعلية بنجاح' : 'Actual costing created successfully' });
    }
    setSelectedActualCosting(null);
  };

  // New handler functions
  const handleSaveARPayment = (data: any) => {
    const newPayment: ARPayment = {
      ...data,
      id: selectedARPayment?.id || generateId(),
      paymentNumber: selectedARPayment?.paymentNumber || `AR-PAY-${new Date().getFullYear()}-${String(arPayments.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdBy: 'user-1',
      createdAt: selectedARPayment?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (selectedARPayment) {
      setARPayments(arPayments.map(p => p.id === selectedARPayment.id ? newPayment : p));
      toast({ title: isRTL ? 'تم تحديث الدفعة' : 'Payment updated' });
    } else {
      setARPayments([...arPayments, newPayment]);
      toast({ title: isRTL ? 'تم تسجيل الدفعة' : 'Payment recorded' });
    }
    setSelectedARPayment(null);
    setIsAddARPaymentOpen(false);
  };

  const handleSaveAPPayment = (data: any) => {
    const newPayment: APPayment = {
      ...data,
      id: selectedAPPayment?.id || generateId(),
      paymentNumber: selectedAPPayment?.paymentNumber || `AP-PAY-${new Date().getFullYear()}-${String(apPayments.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdBy: 'user-1',
      createdAt: selectedAPPayment?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (selectedAPPayment) {
      setAPPayments(apPayments.map(p => p.id === selectedAPPayment.id ? newPayment : p));
      toast({ title: isRTL ? 'تم تحديث الدفعة' : 'Payment updated' });
    } else {
      setAPPayments([...apPayments, newPayment]);
      toast({ title: isRTL ? 'تم تسجيل الدفعة' : 'Payment recorded' });
    }
    setSelectedAPPayment(null);
    setIsAddAPPaymentOpen(false);
  };

  const handleSaveBankAccount = (data: any) => {
    const newAccount: BankAccount = {
      ...data,
      id: selectedBankAccount?.id || generateId(),
      openingBalance: data.openingBalance || 0,
      currentBalance: data.openingBalance || 0,
      isActive: true,
      createdAt: selectedBankAccount?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedBankAccount) {
      setBankAccounts(bankAccounts.map(ba => ba.id === selectedBankAccount.id ? newAccount : ba));
      toast({ title: isRTL ? 'تم تحديث الحساب البنكي' : 'Bank account updated' });
    } else {
      setBankAccounts([...bankAccounts, newAccount]);
      toast({ title: isRTL ? 'تم إنشاء الحساب البنكي' : 'Bank account created' });
    }
    setSelectedBankAccount(null);
    setIsAddBankAccountOpen(false);
  };

  const handleSaveBankTransaction = (data: any) => {
    const newTransaction: BankTransaction = {
      ...data,
      id: generateId(),
      transactionNumber: `BT-${new Date().getFullYear()}-${String(bankTransactions.length + 1).padStart(3, '0')}`,
      valueDate: data.transactionDate,
      balance: 0, // Will be calculated
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBankTransactions([...bankTransactions, newTransaction]);
    toast({ title: isRTL ? 'تم تسجيل المعاملة البنكية' : 'Bank transaction recorded' });
    setIsAddBankTransactionOpen(false);
  };

  const handleSaveBudget = (data: any) => {
    const newBudget: Budget = {
      ...data,
      id: selectedBudget?.id || generateId(),
      budgetNumber: selectedBudget?.budgetNumber || `BUD-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(3, '0')}`,
      status: 'draft',
      allocatedAmount: 0,
      spentAmount: 0,
      remainingAmount: data.totalBudget || 0,
      items: [],
      createdBy: 'user-1',
      createdAt: selectedBudget?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (selectedBudget) {
      setBudgets(budgets.map(b => b.id === selectedBudget.id ? newBudget : b));
      toast({ title: isRTL ? 'تم تحديث الميزانية' : 'Budget updated' });
    } else {
      setBudgets([...budgets, newBudget]);
      toast({ title: isRTL ? 'تم إنشاء الميزانية' : 'Budget created' });
    }
    setSelectedBudget(null);
    setIsAddBudgetOpen(false);
  };

  const totalBudget = mockCostCenters.reduce((sum, cc) => sum + cc.budget, 0);
  const totalSpent = mockCostCenters.reduce((sum, cc) => sum + cc.spent, 0);
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);
  
  // Finance stats
  const totalPreCostAmount = preCostings.reduce((sum, pc) => sum + pc.totalCost, 0);
  const totalActualCostAmount = actualCostings.reduce((sum, ac) => sum + ac.totalActualCost, 0);
  const totalVariance = costVariances.reduce((sum, cv) => sum + cv.totalVariance, 0);
  const profitableStyles = costPerStyles.filter(s => s.profitability === 'profitable').length;
  const totalInventoryValue = inventoryValuations.reduce((sum, iv) => sum + iv.totalValue, 0);

  // Mega Menu Tabs Configuration
  const megaMenuTabs = useMemo(() => [
    {
      id: 'ledger',
      label: 'General Ledger',
      labelAr: 'دفتر الأستاذ',
      subtitle: 'Chart of Accounts',
      subtitleAr: 'دليل الحسابات',
      icon: <BookOpen className="w-4 h-4" />,
      onClick: () => setActiveTab('ledger'),
    },
    {
      id: 'receivable',
      label: 'Accounts Receivable',
      labelAr: 'الذمم المدينة',
      subtitle: 'Customer Invoices',
      subtitleAr: 'فواتير العملاء',
      icon: <CreditCard className="w-4 h-4" />,
      onClick: () => setActiveTab('receivable'),
    },
    {
      id: 'payable',
      label: 'Accounts Payable',
      labelAr: 'الذمم الدائنة',
      subtitle: 'Supplier Bills',
      subtitleAr: 'فواتير الموردين',
      icon: <Banknote className="w-4 h-4" />,
      onClick: () => setActiveTab('payable'),
    },
    {
      id: 'banks',
      label: 'Banks',
      labelAr: 'البنوك',
      subtitle: 'Bank Accounts',
      subtitleAr: 'الحسابات البنكية',
      icon: <Building className="w-4 h-4" />,
      onClick: () => setActiveTab('banks'),
    },
    {
      id: 'budgets',
      label: 'Budgets',
      labelAr: 'الميزانيات',
      subtitle: 'Budget Planning',
      subtitleAr: 'تخطيط الميزانية',
      icon: <Target className="w-4 h-4" />,
      onClick: () => setActiveTab('budgets'),
    },
    {
      id: 'periods',
      label: 'Fiscal Periods',
      labelAr: 'الفترات المالية',
      subtitle: 'Period Closing',
      subtitleAr: 'إقفال الفترات',
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => setActiveTab('periods'),
    },
    {
      id: 'precosting',
      label: 'Pre-Costing',
      labelAr: 'التكلفة المسبقة',
      subtitle: 'Estimated Cost',
      subtitleAr: 'التكلفة المقدرة',
      icon: <Calculator className="w-4 h-4" />,
      onClick: () => setActiveTab('precosting'),
    },
    {
      id: 'actualcosting',
      label: 'Actual Costing',
      labelAr: 'التكلفة الفعلية',
      subtitle: 'Real Cost',
      subtitleAr: 'التكلفة الحقيقية',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('actualcosting'),
    },
    {
      id: 'variance',
      label: 'Variance',
      labelAr: 'تحليل الفروقات',
      subtitle: 'Cost Differences',
      subtitleAr: 'فروقات التكلفة',
      icon: <TrendingDown className="w-4 h-4" />,
      onClick: () => setActiveTab('variance'),
    },
    {
      id: 'costmetrics',
      label: 'Cost Metrics',
      labelAr: 'مقاييس التكلفة',
      subtitle: 'Cost Analysis',
      subtitleAr: 'تحليل التكلفة',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => setActiveTab('costmetrics'),
    },
    {
      id: 'costcenters',
      label: 'Cost Centers',
      labelAr: 'مراكز التكلفة',
      subtitle: 'Department Costs',
      subtitleAr: 'تكاليف الأقسام',
      icon: <Building2 className="w-4 h-4" />,
      onClick: () => setActiveTab('costcenters'),
    },
    {
      id: 'inventory',
      label: 'Inventory Valuation',
      labelAr: 'تقييم المخزون',
      subtitle: 'Stock Value',
      subtitleAr: 'قيمة المخزون',
      icon: <Warehouse className="w-4 h-4" />,
      onClick: () => setActiveTab('inventory'),
    },
    {
      id: 'tax',
      label: 'Tax Management',
      labelAr: 'الضرائب',
      subtitle: 'Tax Configuration',
      subtitleAr: 'إعدادات الضرائب',
      icon: <Receipt className="w-4 h-4" />,
      onClick: () => setActiveTab('tax'),
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      labelAr: 'التقارير المالية',
      subtitle: 'P&L, Balance Sheet',
      subtitleAr: 'قائمة الدخل، الميزانية',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => setActiveTab('reports'),
    },
    {
      id: 'profitability',
      label: 'Profitability',
      labelAr: 'الربحية',
      subtitle: 'Profit Analysis',
      subtitleAr: 'تحليل الربحية',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => setActiveTab('profitability'),
    },
  ], []);

  // Cost Center Columns
  const costCenterColumns: Column<CostCenter>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono text-sm">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Cost Center',
      headerAr: 'مركز التكلفة',
      render: (item) => getCostCenterName(item, i18n.language)
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <span className="capitalize">{item.type}</span>
    },
    {
      key: 'budget',
      header: 'Budget',
      headerAr: 'الميزانية',
      render: (item) => formatCurrency(item.budget, 'USD')
    },
    {
      key: 'spent',
      header: 'Spent',
      headerAr: 'المصروف',
      render: (item) => formatCurrency(item.spent, 'USD')
    },
    {
      key: 'utilization',
      header: 'Utilization',
      headerAr: 'الاستخدام',
      render: (item) => {
        const pct = Math.round((item.spent / item.budget) * 100);
        return (
          <div className="w-24">
            <Progress 
              value={pct} 
              className={`h-2 ${pct > 90 ? '[&>div]:bg-red-500' : pct > 75 ? '[&>div]:bg-yellow-500' : ''}`} 
            />
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>
        );
      }
    },
    {
      key: 'remaining',
      header: 'Remaining',
      headerAr: 'المتبقي',
      render: (item) => {
        const remaining = item.budget - item.spent;
        return (
          <span className={remaining < 0 ? 'text-red-500 font-medium' : 'text-green-600'}>
            {formatCurrency(remaining, 'USD')}
          </span>
        );
      }
    },
  ];

  // Pre-Costing Columns
  const preCostingColumns: Column<PreCosting>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'product',
      header: 'Product',
      headerAr: 'المنتج',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.productCode}</p>
        </div>
      )
    },
    {
      key: 'materialCost',
      header: 'Material',
      headerAr: 'المواد',
      render: (item) => formatCurrency(item.materialCost, item.currency)
    },
    {
      key: 'laborCost',
      header: 'Labor',
      headerAr: 'العمالة',
      render: (item) => formatCurrency(item.laborCost, item.currency)
    },
    {
      key: 'overheadCost',
      header: 'Overhead',
      headerAr: 'النفقات العامة',
      render: (item) => formatCurrency(item.overheadCost, item.currency)
    },
    {
      key: 'totalCost',
      header: 'Total Cost',
      headerAr: 'التكلفة الإجمالية',
      render: (item) => <span className="font-bold">{formatCurrency(item.totalCost, item.currency)}</span>
    },
    {
      key: 'targetSellingPrice',
      header: 'Target Price',
      headerAr: 'السعر المستهدف',
      render: (item) => formatCurrency(item.targetSellingPrice, item.currency)
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => (
        <StatusBadge status={item.status === 'approved' ? 'completed' : item.status === 'draft' ? 'pending' : 'cancelled'} />
      )
    },
  ];

  // Actual Costing Columns
  const actualCostingColumns: Column<ActualCosting>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'product',
      header: 'Product',
      headerAr: 'المنتج',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.productCode}</p>
        </div>
      )
    },
    {
      key: 'productionOrder',
      header: 'Production Order',
      headerAr: 'أمر الإنتاج',
      render: (item) => <span className="font-mono text-sm">{item.productionOrderCode}</span>
    },
    {
      key: 'quantity',
      header: 'Quantity',
      headerAr: 'الكمية',
      render: (item) => <span>{item.quantityProduced.toLocaleString()}</span>
    },
    {
      key: 'totalActualCost',
      header: 'Total Cost',
      headerAr: 'التكلفة الإجمالية',
      render: (item) => formatCurrency(item.totalActualCost, item.currency)
    },
    {
      key: 'costPerUnit',
      header: 'Cost/Unit',
      headerAr: 'التكلفة/وحدة',
      render: (item) => formatCurrency(item.costPerUnit, item.currency)
    },
    {
      key: 'productionDate',
      header: 'Date',
      headerAr: 'التاريخ',
      render: (item) => new Date(item.productionDate).toLocaleDateString()
    },
  ];

  // Cost Variance Columns
  const varianceColumns: Column<CostVariance>[] = [
    {
      key: 'code',
      header: 'Variance #',
      headerAr: 'رقم الفرق',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'product',
      header: 'Product',
      headerAr: 'المنتج',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.productCode}</p>
        </div>
      )
    },
    {
      key: 'materialVariance',
      header: 'Material Variance',
      headerAr: 'فرق المواد',
      render: (item) => (
        <span className={item.materialVariance > 0 ? 'text-red-500' : 'text-green-600'}>
          {formatCurrency(item.materialVariance, item.currency)} ({item.materialVariancePercent.toFixed(1)}%)
        </span>
      )
    },
    {
      key: 'laborVariance',
      header: 'Labor Variance',
      headerAr: 'فرق العمالة',
      render: (item) => (
        <span className={item.laborVariance > 0 ? 'text-red-500' : 'text-green-600'}>
          {formatCurrency(item.laborVariance, item.currency)} ({item.laborVariancePercent.toFixed(1)}%)
        </span>
      )
    },
    {
      key: 'totalVariance',
      header: 'Total Variance',
      headerAr: 'الفرق الإجمالي',
      render: (item) => (
        <span className={`font-medium ${item.totalVariance > 0 ? 'text-red-500' : 'text-green-600'}`}>
          {formatCurrency(item.totalVariance, item.currency)} ({item.totalVariancePercent.toFixed(1)}%)
        </span>
      )
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => (
        <StatusBadge status={item.varianceType === 'favorable' ? 'completed' : 'pending'} />
      )
    },
  ];

  // Cost Per Style Columns
  const styleColumns: Column<CostPerStyle>[] = [
    {
      key: 'style',
      header: 'Style',
      headerAr: 'الموديل',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.styleNameAr : item.styleName}</p>
          <p className="text-sm text-muted-foreground font-mono">{item.styleCode}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Quantity',
      headerAr: 'الكمية',
      render: (item) => <span>{item.quantityProduced.toLocaleString()}</span>
    },
    {
      key: 'cost',
      header: 'Total Cost',
      headerAr: 'التكلفة الإجمالية',
      render: (item) => formatCurrency(item.totalCost, item.currency)
    },
    {
      key: 'revenue',
      header: 'Revenue',
      headerAr: 'الإيرادات',
      render: (item) => formatCurrency(item.revenue, item.currency)
    },
    {
      key: 'profit',
      header: 'Net Profit',
      headerAr: 'صافي الربح',
      render: (item) => (
        <span className={item.netProfit > 0 ? 'text-green-600' : 'text-red-500'}>
          {formatCurrency(item.netProfit, item.currency)}
        </span>
      )
    },
    {
      key: 'margin',
      header: 'Margin',
      headerAr: 'الهامش',
      render: (item) => `${item.netMargin.toFixed(1)}%`
    },
    {
      key: 'profitability',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => (
        <StatusBadge 
          status={item.profitability === 'profitable' ? 'completed' : item.profitability === 'break_even' ? 'pending' : 'cancelled'} 
        />
      )
    },
  ];

  // Chart of Accounts Columns
  const chartOfAccountsColumns: Column<ChartOfAccount>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Account Name',
      headerAr: 'اسم الحساب',
      render: (item) => isRTL ? item.nameAr : item.name
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <Badge variant="outline" className="capitalize">{item.type}</Badge>
    },
    {
      key: 'category',
      header: 'Category',
      headerAr: 'الفئة',
      render: (item) => <span className="text-sm">{item.category}</span>
    },
    {
      key: 'balance',
      header: 'Balance',
      headerAr: 'الرصيد',
      render: (item) => (
        <span className={item.type === 'asset' || item.type === 'expense' ? 'text-blue-600' : 'text-green-600'}>
          {formatCurrency(item.balance, item.currency)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.isActive ? 'completed' : 'cancelled'} />
    },
  ];

  // Journal Entry Columns
  const journalEntryColumns: Column<JournalEntry>[] = [
    {
      key: 'entryNumber',
      header: 'Entry #',
      headerAr: 'رقم القيد',
      render: (item) => <span className="font-mono font-medium">{item.entryNumber}</span>
    },
    {
      key: 'date',
      header: 'Date',
      headerAr: 'التاريخ',
      render: (item) => new Date(item.date).toLocaleDateString()
    },
    {
      key: 'description',
      header: 'Description',
      headerAr: 'الوصف',
      render: (item) => isRTL ? item.descriptionAr : item.description
    },
    {
      key: 'referenceNumber',
      header: 'Reference',
      headerAr: 'المرجع',
      render: (item) => item.referenceNumber ? <span className="font-mono text-sm">{item.referenceNumber}</span> : '-'
    },
    {
      key: 'totalDebit',
      header: 'Total Debit',
      headerAr: 'إجمالي المدين',
      render: (item) => formatCurrency(item.totalDebit, item.currency)
    },
    {
      key: 'totalCredit',
      header: 'Total Credit',
      headerAr: 'إجمالي الدائن',
      render: (item) => formatCurrency(item.totalCredit, item.currency)
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status === 'posted' ? 'completed' : item.status === 'draft' ? 'pending' : 'cancelled'} />
    },
  ];

  // Inventory Valuation Columns
  const inventoryValuationColumns: Column<InventoryValuation>[] = [
    {
      key: 'material',
      header: 'Material',
      headerAr: 'المادة',
      render: (item) => (
        <div>
          <p className="font-medium">{isRTL ? item.materialNameAr : item.materialName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.materialCode}</p>
        </div>
      )
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      headerAr: 'المستودع',
      render: (item) => item.warehouseName
    },
    {
      key: 'valuationMethod',
      header: 'Method',
      headerAr: 'الطريقة',
      render: (item) => <Badge variant="outline">{item.valuationMethod}</Badge>
    },
    {
      key: 'quantity',
      header: 'Quantity',
      headerAr: 'الكمية',
      render: (item) => <span>{item.quantity.toLocaleString()}</span>
    },
    {
      key: 'unitCost',
      header: 'Unit Cost',
      headerAr: 'تكلفة الوحدة',
      render: (item) => formatCurrency(item.unitCost, item.currency)
    },
    {
      key: 'totalValue',
      header: 'Total Value',
      headerAr: 'القيمة الإجمالية',
      render: (item) => <span className="font-bold">{formatCurrency(item.totalValue, item.currency)}</span>
    },
  ];

  // Tax Configuration Columns
  const taxConfigColumns: Column<TaxConfiguration>[] = [
    {
      key: 'code',
      header: 'Code',
      headerAr: 'الكود',
      render: (item) => <span className="font-mono font-medium">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Tax Name',
      headerAr: 'اسم الضريبة',
      render: (item) => isRTL ? item.nameAr : item.name
    },
    {
      key: 'type',
      header: 'Type',
      headerAr: 'النوع',
      render: (item) => <Badge variant="outline">{item.type}</Badge>
    },
    {
      key: 'rate',
      header: 'Rate',
      headerAr: 'المعدل',
      render: (item) => <span className="font-medium">{item.rate}%</span>
    },
    {
      key: 'appliesTo',
      header: 'Applies To',
      headerAr: 'ينطبق على',
      render: (item) => <span className="capitalize">{item.appliesTo}</span>
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.isActive ? 'completed' : 'cancelled'} />
    },
  ];

  // Tax Transaction Columns
  const taxTransactionColumns: Column<TaxTransaction>[] = [
    {
      key: 'transactionNumber',
      header: 'Transaction #',
      headerAr: 'رقم المعاملة',
      render: (item) => <span className="font-mono font-medium">{item.transactionNumber}</span>
    },
    {
      key: 'taxName',
      header: 'Tax',
      headerAr: 'الضريبة',
      render: (item) => isRTL ? item.taxNameAr : item.taxName
    },
    {
      key: 'referenceNumber',
      header: 'Reference',
      headerAr: 'المرجع',
      render: (item) => <span className="font-mono text-sm">{item.referenceNumber}</span>
    },
    {
      key: 'subtotal',
      header: 'Subtotal',
      headerAr: 'المجموع الفرعي',
      render: (item) => formatCurrency(item.subtotal, item.currency)
    },
    {
      key: 'taxAmount',
      header: 'Tax Amount',
      headerAr: 'مبلغ الضريبة',
      render: (item) => <span className="font-medium">{formatCurrency(item.taxAmount, item.currency)}</span>
    },
    {
      key: 'total',
      header: 'Total',
      headerAr: 'الإجمالي',
      render: (item) => <span className="font-bold">{formatCurrency(item.total, item.currency)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      headerAr: 'الحالة',
      render: (item) => <StatusBadge status={item.status === 'paid' ? 'completed' : item.status === 'pending' ? 'pending' : 'cancelled'} />
    },
  ];

  return (
    <ModuleLayout>
      <PageHeader
        icon={DollarSign}
        title="Finance & Costing Management"
        titleAr="المالية وإدارة التكاليف"
        subtitle="Complete financial management: Pre-costing, actual costing, variance analysis, GL, inventory valuation, tax, financial reports"
        subtitleAr="إدارة مالية شاملة: التكلفة المسبقة، التكلفة الفعلية، تحليل الفروقات، دفتر الأستاذ، تقييم المخزون، الضرائب، التقارير المالية"
        colorGradient="from-green-500 to-green-600"
        actionLabel="New Entry"
        actionLabelAr="قيد جديد"
        onAction={() => {}}
      />

      {/* Period Selector */}
      <div className="mb-6 flex justify-end">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-Q1">2024-Q1</SelectItem>
            <SelectItem value="2024-Q2">2024-Q2</SelectItem>
            <SelectItem value="2024-Q3">2024-Q3</SelectItem>
            <SelectItem value="2024-Q4">2024-Q4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          titleAr="إجمالي الإيرادات"
          value={formatCurrency(mockProfitLossStatement.totalRevenue, 'USD')}
          change={12}
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <StatCard
          title="Net Profit"
          titleAr="صافي الربح"
          value={formatCurrency(mockProfitLossStatement.netIncome, 'USD')}
          change={8}
          changeType="increase"
          icon={DollarSign}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Budget Utilization"
          titleAr="استخدام الميزانية"
          value={`${budgetUtilization}%`}
          icon={PieChart}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Net Margin"
          titleAr="هامش الربح الصافي"
          value={`${mockProfitLossStatement.netMarginPercent.toFixed(1)}%`}
          change={1.2}
          changeType="increase"
          icon={TrendingUp}
          iconColor="text-cyan-500"
        />
        <StatCard
          title="Inventory Value"
          titleAr="قيمة المخزون"
          value={formatCurrency(totalInventoryValue, 'USD')}
          icon={Warehouse}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Cost Variance"
          titleAr="الفرق في التكلفة"
          value={formatCurrency(Math.abs(totalVariance), 'USD')}
          changeType={totalVariance > 0 ? 'decrease' : 'increase'}
          icon={AlertCircle}
          iconColor={totalVariance > 0 ? 'text-red-500' : 'text-green-500'}
        />
      </div>

      {/* P&L Summary */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{isRTL ? 'ملخص الأرباح والخسائر' : 'Profit & Loss Summary'}</h3>
          <Badge variant="outline">{selectedPeriod}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium">{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(mockProfitLossStatement.totalRevenue, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span>{isRTL ? 'تكلفة البضاعة المباعة' : 'Cost of Goods Sold'}</span>
              <span className="text-red-500">{formatCurrency(mockProfitLossStatement.totalCOGS, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-t-2 border-blue-500">
              <span className="font-medium">{isRTL ? 'إجمالي الربح' : 'Gross Profit'}</span>
              <span className="font-bold text-blue-600">{formatCurrency(mockProfitLossStatement.grossProfit, 'USD')}</span>
            </div>
            <div className="text-sm text-muted-foreground text-end">
              {isRTL ? 'هامش الربح الإجمالي' : 'Gross Margin'}: {mockProfitLossStatement.grossMarginPercent.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span>{isRTL ? 'المصاريف التشغيلية' : 'Operating Expenses'}</span>
              <span className="text-red-500">{formatCurrency(mockProfitLossStatement.totalOperatingExpenses, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-t-2 border-blue-500">
              <span className="font-medium">{isRTL ? 'الدخل التشغيلي' : 'Operating Income'}</span>
              <span className="font-bold text-blue-600">{formatCurrency(mockProfitLossStatement.operatingIncome, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span>{isRTL ? 'ضريبة الدخل' : 'Income Tax'}</span>
              <span className="text-red-500">{formatCurrency(mockProfitLossStatement.incomeTax, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border-t-2 border-green-500">
              <span className="font-bold">{isRTL ? 'صافي الربح' : 'Net Income'}</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(mockProfitLossStatement.netIncome, 'USD')}</span>
            </div>
            <div className="text-sm text-muted-foreground text-end">
              {isRTL ? 'هامش الربح الصافي' : 'Net Margin'}: {mockProfitLossStatement.netMarginPercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mega Menu */}
      <div className="mb-6">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2">
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة جديد' : 'Add New'}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[800px] grid-cols-4 gap-3 p-4">
                  <Link to="#" onClick={(e) => { e.preventDefault(); setSelectedJournalEntry(null); setJournalEntryDialogOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'قيد يومية' : 'Journal Entry'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء قيد محاسبي' : 'Create journal entry'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setSelectedAccount(null); setAccountDialogOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <FileText className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'حساب جديد' : 'New Account'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إضافة حساب محاسبي' : 'Add chart account'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddARPaymentOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'دفعة عميل' : 'AR Payment'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل دفعة عميل' : 'Record customer payment'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddAPPaymentOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Banknote className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'دفعة مورد' : 'AP Payment'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل دفعة مورد' : 'Record supplier payment'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddBankAccountOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Building className="w-5 h-5 text-cyan-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'حساب بنكي' : 'Bank Account'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إضافة حساب بنكي' : 'Add bank account'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddBankTransactionOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'معاملة بنكية' : 'Bank Transaction'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسجيل معاملة بنكية' : 'Record bank transaction'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsAddBudgetOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <Target className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'ميزانية' : 'Budget'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'إنشاء ميزانية' : 'Create budget'}</div>
                    </div>
                  </Link>
                  <Link to="#" onClick={(e) => { e.preventDefault(); setIsReconcileBankOpen(true); }} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                    <RefreshCw className="w-5 h-5 text-teal-500" />
                    <div>
                      <div className="font-medium">{isRTL ? 'تسوية بنكية' : 'Bank Reconciliation'}</div>
                      <div className="text-xs text-muted-foreground">{isRTL ? 'تسوية الحساب البنكي' : 'Reconcile bank account'}</div>
                    </div>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mega Menu Tabs */}
      <MegaMenuTabs
        tabs={megaMenuTabs.map(tab => ({
          ...tab,
          isActive: activeTab === tab.id,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRTL={isRTL}
        className="mb-6"
      />

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

        {/* Accounts Receivable Tab */}
        <TabsContent value="receivable">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {isRTL ? 'الذمم المدينة' : 'Accounts Receivable'}
                </h3>
                <Button onClick={() => setIsAddARPaymentOpen(true)}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'دفعة عميل' : 'Record Payment'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'إجمالي المستحقات' : 'Total Receivables'}</p>
                  <p className="text-2xl font-bold">{formatCurrency(accountsReceivable.reduce((sum, ar) => sum + ar.outstandingAmount, 0), 'USD')}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المستحقات المفتوحة' : 'Open Invoices'}</p>
                  <p className="text-2xl font-bold text-blue-600">{accountsReceivable.filter(ar => ar.status === 'open' || ar.status === 'partial').length}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المستحقات المتأخرة' : 'Overdue'}</p>
                  <p className="text-2xl font-bold text-red-600">{accountsReceivable.filter(ar => ar.status === 'overdue').length}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المدفوعات هذا الشهر' : 'Payments This Month'}</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(arPayments.reduce((sum, p) => sum + p.amount, 0), 'USD')}</p>
                </div>
              </div>
              <DataTable
                data={accountsReceivable}
                columns={[
                  { key: 'invoiceNumber', header: 'Invoice #', headerAr: 'رقم الفاتورة', render: (item) => <span className="font-mono font-medium">{item.invoiceNumber}</span> },
                  { key: 'customerName', header: 'Customer', headerAr: 'العميل' },
                  { key: 'invoiceDate', header: 'Invoice Date', headerAr: 'تاريخ الفاتورة' },
                  { key: 'dueDate', header: 'Due Date', headerAr: 'تاريخ الاستحقاق' },
                  { key: 'invoiceAmount', header: 'Invoice Amount', headerAr: 'مبلغ الفاتورة', render: (item) => formatCurrency(item.invoiceAmount, item.currency) },
                  { key: 'outstandingAmount', header: 'Outstanding', headerAr: 'المستحق', render: (item) => (
                    <span className={item.outstandingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {formatCurrency(item.outstandingAmount, item.currency)}
                    </span>
                  )},
                  { key: 'agingDays', header: 'Aging Days', headerAr: 'أيام التأخير', render: (item) => (
                    <Badge variant={item.agingDays > 90 ? 'destructive' : item.agingDays > 60 ? 'default' : 'secondary'}>
                      {item.agingDays} {isRTL ? 'يوم' : 'days'}
                    </Badge>
                  )},
                  { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status === 'paid' ? 'completed' : item.status === 'overdue' ? 'cancelled' : 'pending'} /> },
                ]}
                searchKey="invoiceNumber"
              />
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'المدفوعات المستلمة' : 'Payments Received'}</h3>
              <DataTable
                data={arPayments}
                columns={[
                  { key: 'paymentNumber', header: 'Payment #', headerAr: 'رقم الدفعة', render: (item) => <span className="font-mono font-medium">{item.paymentNumber}</span> },
                  { key: 'invoiceNumber', header: 'Invoice', headerAr: 'الفاتورة' },
                  { key: 'customerName', header: 'Customer', headerAr: 'العميل' },
                  { key: 'paymentDate', header: 'Payment Date', headerAr: 'تاريخ الدفعة' },
                  { key: 'amount', header: 'Amount', headerAr: 'المبلغ', render: (item) => formatCurrency(item.amount, item.currency) },
                  { key: 'paymentMethod', header: 'Method', headerAr: 'الطريقة', render: (item) => <Badge variant="outline">{item.paymentMethod}</Badge> },
                  { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status === 'cleared' ? 'completed' : item.status === 'bounced' ? 'cancelled' : 'pending'} /> },
                ]}
                searchKey="paymentNumber"
              />
            </div>
          </div>
        </TabsContent>

        {/* Accounts Payable Tab */}
        <TabsContent value="payable">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Banknote className="w-5 h-5" />
                  {isRTL ? 'الذمم الدائنة' : 'Accounts Payable'}
                </h3>
                <Button onClick={() => setIsAddAPPaymentOpen(true)}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'دفعة مورد' : 'Record Payment'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'إجمالي المستحقات' : 'Total Payables'}</p>
                  <p className="text-2xl font-bold">{formatCurrency(accountsPayable.reduce((sum, ap) => sum + ap.outstandingAmount, 0), 'USD')}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'الفواتير المفتوحة' : 'Open Bills'}</p>
                  <p className="text-2xl font-bold text-blue-600">{accountsPayable.filter(ap => ap.status === 'open' || ap.status === 'partial').length}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المستحقات المتأخرة' : 'Overdue'}</p>
                  <p className="text-2xl font-bold text-red-600">{accountsPayable.filter(ap => ap.status === 'overdue').length}</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{isRTL ? 'المدفوعات هذا الشهر' : 'Payments This Month'}</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(apPayments.reduce((sum, p) => sum + p.amount, 0), 'USD')}</p>
                </div>
              </div>
              <DataTable
                data={accountsPayable}
                columns={[
                  { key: 'billNumber', header: 'Bill #', headerAr: 'رقم الفاتورة', render: (item) => <span className="font-mono font-medium">{item.billNumber}</span> },
                  { key: 'supplierName', header: 'Supplier', headerAr: 'المورد' },
                  { key: 'billDate', header: 'Bill Date', headerAr: 'تاريخ الفاتورة' },
                  { key: 'dueDate', header: 'Due Date', headerAr: 'تاريخ الاستحقاق' },
                  { key: 'billAmount', header: 'Bill Amount', headerAr: 'مبلغ الفاتورة', render: (item) => formatCurrency(item.billAmount, item.currency) },
                  { key: 'outstandingAmount', header: 'Outstanding', headerAr: 'المستحق', render: (item) => (
                    <span className={item.outstandingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {formatCurrency(item.outstandingAmount, item.currency)}
                    </span>
                  )},
                  { key: 'agingDays', header: 'Aging Days', headerAr: 'أيام التأخير', render: (item) => (
                    <Badge variant={item.agingDays > 90 ? 'destructive' : item.agingDays > 60 ? 'default' : 'secondary'}>
                      {item.agingDays} {isRTL ? 'يوم' : 'days'}
                    </Badge>
                  )},
                  { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status === 'paid' ? 'completed' : item.status === 'overdue' ? 'cancelled' : 'pending'} /> },
                ]}
                searchKey="billNumber"
              />
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'المدفوعات المقدمة' : 'Payments Made'}</h3>
              <DataTable
                data={apPayments}
                columns={[
                  { key: 'paymentNumber', header: 'Payment #', headerAr: 'رقم الدفعة', render: (item) => <span className="font-mono font-medium">{item.paymentNumber}</span> },
                  { key: 'billNumber', header: 'Bill', headerAr: 'الفاتورة' },
                  { key: 'supplierName', header: 'Supplier', headerAr: 'المورد' },
                  { key: 'paymentDate', header: 'Payment Date', headerAr: 'تاريخ الدفعة' },
                  { key: 'amount', header: 'Amount', headerAr: 'المبلغ', render: (item) => formatCurrency(item.amount, item.currency) },
                  { key: 'paymentMethod', header: 'Method', headerAr: 'الطريقة', render: (item) => <Badge variant="outline">{item.paymentMethod}</Badge> },
                  { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status === 'cleared' ? 'completed' : item.status === 'bounced' ? 'cancelled' : 'pending'} /> },
                ]}
                searchKey="paymentNumber"
              />
            </div>
          </div>
        </TabsContent>

        {/* Banks Tab */}
        <TabsContent value="banks">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {isRTL ? 'الحسابات البنكية' : 'Bank Accounts'}
                </h3>
                <Button onClick={() => setIsAddBankAccountOpen(true)}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'حساب بنكي جديد' : 'New Bank Account'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {bankAccounts.map(bank => (
                  <Card key={bank.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{isRTL ? bank.bankNameAr : bank.bankName}</CardTitle>
                      <CardDescription className="font-mono">{bank.accountNumber}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'الرصيد الحالي' : 'Current Balance'}</span>
                          <span className="text-xl font-bold text-green-600">{formatCurrency(bank.currentBalance, bank.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'نوع الحساب' : 'Account Type'}</span>
                          <Badge variant="outline">{bank.accountType}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'الحالة' : 'Status'}</span>
                          <StatusBadge status={bank.isActive ? 'completed' : 'cancelled'} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'المعاملات البنكية' : 'Bank Transactions'}</h3>
                <Button onClick={() => setIsAddBankTransactionOpen(true)}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'معاملة جديدة' : 'New Transaction'}
                </Button>
              </div>
              <DataTable
                data={bankTransactions}
                columns={[
                  { key: 'transactionNumber', header: 'Transaction #', headerAr: 'رقم المعاملة', render: (item) => <span className="font-mono font-medium">{item.transactionNumber}</span> },
                  { key: 'bankAccountNumber', header: 'Account', headerAr: 'الحساب' },
                  { key: 'transactionDate', header: 'Date', headerAr: 'التاريخ' },
                  { key: 'transactionType', header: 'Type', headerAr: 'النوع', render: (item) => <Badge variant="outline">{item.transactionType}</Badge> },
                  { key: 'amount', header: 'Amount', headerAr: 'المبلغ', render: (item) => (
                    <span className={item.transactionType === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                      {item.transactionType === 'deposit' ? '+' : '-'}{formatCurrency(Math.abs(item.amount), item.currency)}
                    </span>
                  )},
                  { key: 'balance', header: 'Balance', headerAr: 'الرصيد', render: (item) => formatCurrency(item.balance, item.currency) },
                  { key: 'status', header: 'Status', headerAr: 'الحالة', render: (item) => <StatusBadge status={item.status === 'reconciled' ? 'completed' : item.status === 'cancelled' ? 'cancelled' : 'pending'} /> },
                ]}
                searchKey="transactionNumber"
              />
            </div>
          </div>
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isRTL ? 'الميزانيات' : 'Budgets'}
              </h3>
              <Button onClick={() => setIsAddBudgetOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'ميزانية جديدة' : 'New Budget'}
              </Button>
            </div>
            <div className="space-y-4">
              {budgets.map(budget => (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{isRTL ? budget.nameAr : budget.name}</CardTitle>
                        <CardDescription>{budget.period.startDate} - {budget.period.endDate}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{budget.budgetType}</Badge>
                        <StatusBadge status={budget.status === 'active' ? 'completed' : budget.status === 'closed' ? 'cancelled' : 'pending'} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي الميزانية' : 'Total Budget'}</p>
                        <p className="text-xl font-bold">{formatCurrency(budget.totalBudget, budget.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'المصروف' : 'Spent'}</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(budget.spentAmount, budget.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'المتبقي' : 'Remaining'}</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(budget.remainingAmount, budget.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'نسبة الاستخدام' : 'Utilization'}</p>
                        <p className="text-xl font-bold">
                          {Math.round((budget.spentAmount / budget.totalBudget) * 100)}%
                        </p>
                      </div>
                    </div>
                    <Progress value={(budget.spentAmount / budget.totalBudget) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Fiscal Periods Tab */}
        <TabsContent value="periods">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {isRTL ? 'الفترات المالية' : 'Fiscal Periods'}
              </h3>
            </div>
            <div className="space-y-4">
              {fiscalPeriods.map(period => (
                <Card key={period.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{isRTL ? period.periodNameAr : period.periodName}</CardTitle>
                        <CardDescription>{period.startDate} - {period.endDate}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {period.isCurrentPeriod && <Badge className="bg-green-100 text-green-800">{isRTL ? 'الفترة الحالية' : 'Current Period'}</Badge>}
                        {period.status === 'closed' ? (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="w-3 h-3" />
                            {isRTL ? 'مقفلة' : 'Closed'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Unlock className="w-3 h-3" />
                            {isRTL ? 'مفتوحة' : 'Open'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {period.closingDate && (
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'تاريخ الإقفال' : 'Closed on'}: {period.closingDate} {period.closedBy && `(${isRTL ? 'بواسطة' : 'by'} ${period.closedBy})`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pre-Costing Tab */}
        <TabsContent value="precosting">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'التكلفة المسبقة للمنتجات' : 'Pre-Costing'}</h3>
              <Button onClick={() => {
                setSelectedPreCosting(null);
                setPreCostingDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'تكلفة مسبقة جديدة' : 'New Pre-Costing'}
              </Button>
            </div>
            <DataTable
              data={preCostings}
              columns={preCostingColumns}
              searchKey="productName"
              searchPlaceholder={isRTL ? 'البحث في التكاليف المسبقة...' : 'Search pre-costings...'}
              searchPlaceholderAr="البحث في التكاليف المسبقة..."
            />
          </div>
        </TabsContent>

        {/* Actual Costing Tab */}
        <TabsContent value="actualcosting">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'التكلفة الفعلية' : 'Actual Costing'}</h3>
              <Button onClick={() => {
                setSelectedActualCosting(null);
                setActualCostingDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'تكلفة فعلية جديدة' : 'New Actual Costing'}
              </Button>
            </div>
            <DataTable
              data={actualCostings}
              columns={actualCostingColumns}
              searchKey="productName"
              searchPlaceholder={isRTL ? 'البحث في التكاليف الفعلية...' : 'Search actual costings...'}
              searchPlaceholderAr="البحث في التكاليف الفعلية..."
            />
          </div>
        </TabsContent>

        {/* Variance Analysis Tab */}
        <TabsContent value="variance">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'تحليل الفروقات' : 'Variance Analysis'}</h3>
            </div>
            <DataTable
              data={costVariances}
              columns={varianceColumns}
              searchKey="productName"
              searchPlaceholder={isRTL ? 'البحث في الفروقات...' : 'Search variances...'}
              searchPlaceholderAr="البحث في الفروقات..."
            />
          </div>
        </TabsContent>

        {/* Cost Metrics Tab */}
        <TabsContent value="costmetrics">
          <div className="space-y-6">
            {/* Cost per Minute */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'التكلفة لكل دقيقة' : 'Cost per Minute'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {costPerMinutes.map((cpm) => (
                  <Card key={cpm.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{isRTL ? cpm.productionLineNameAr : cpm.productionLineName}</CardTitle>
                      <CardDescription className="text-xs">{cpm.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'التكلفة/دقيقة' : 'Cost/Minute'}</span>
                          <span className="font-bold">{formatCurrency(cpm.costPerMinute, cpm.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الدقائق' : 'Total Minutes'}</span>
                          <span>{cpm.totalMinutes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</span>
                          <span className="font-medium">{formatCurrency(cpm.totalCost, cpm.currency)}</span>
                        </div>
                        <div className="pt-2 border-t space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{isRTL ? 'العمالة' : 'Labor'}</span>
                            <span>{formatCurrency(cpm.breakdown.labor, cpm.currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{isRTL ? 'النفقات العامة' : 'Overhead'}</span>
                            <span>{formatCurrency(cpm.breakdown.overhead, cpm.currency)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cost per Line */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'التكلفة لكل خط إنتاج' : 'Cost per Production Line'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costPerLines.map((cpl) => (
                  <Card key={cpl.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{isRTL ? cpl.lineNameAr : cpl.lineName}</CardTitle>
                      <CardDescription className="text-xs">{cpl.period}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'التكلفة/وحدة' : 'Cost/Unit'}</p>
                          <p className="text-xl font-bold">{formatCurrency(cpl.costPerUnit, cpl.currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'التكلفة/دقيقة' : 'Cost/Minute'}</p>
                          <p className="text-xl font-bold">{formatCurrency(cpl.costPerMinute, cpl.currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'الوحدات المنتجة' : 'Units Produced'}</p>
                          <p className="text-lg font-semibold">{cpl.totalUnitsProduced.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isRTL ? 'إجمالي التكلفة' : 'Total Cost'}</p>
                          <p className="text-lg font-semibold">{formatCurrency(cpl.totalCost, cpl.currency)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cost per Style */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'التكلفة لكل موديل' : 'Cost per Style'}</h3>
              <DataTable
                data={costPerStyles}
                columns={styleColumns}
                searchKey="styleName"
                searchPlaceholder={isRTL ? 'البحث في الموديلات...' : 'Search styles...'}
                searchPlaceholderAr="البحث في الموديلات..."
              />
            </div>
          </div>
        </TabsContent>

        {/* General Ledger Tab */}
        <TabsContent value="ledger">
          <div className="space-y-6">
            {/* Chart of Accounts */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'دليل الحسابات' : 'Chart of Accounts'}</h3>
                <Button onClick={() => {
                  setSelectedAccount(null);
                  setAccountDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'حساب جديد' : 'New Account'}
                </Button>
              </div>
              <DataTable
                data={chartOfAccounts}
                columns={chartOfAccountsColumns}
                searchKey="name"
                searchPlaceholder={isRTL ? 'البحث في الحسابات...' : 'Search accounts...'}
                searchPlaceholderAr="البحث في الحسابات..."
              />
            </div>

            {/* Journal Entries */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'القيود اليومية' : 'Journal Entries'}</h3>
                <Button onClick={() => {
                  setSelectedJournalEntry(null);
                  setJournalEntryDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'قيد جديد' : 'New Entry'}
                </Button>
              </div>
              <DataTable
                data={journalEntries}
                columns={journalEntryColumns}
                searchKey="entryNumber"
                searchPlaceholder={isRTL ? 'البحث في القيود...' : 'Search entries...'}
                searchPlaceholderAr="البحث في القيود..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Cost Centers Tab */}
        <TabsContent value="costcenters">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'مراكز التكلفة' : 'Cost Centers'}</h3>
              <Button onClick={() => {
                setSelectedCostCenter(null);
                setCostCenterDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'مركز تكلفة جديد' : 'New Cost Center'}
              </Button>
            </div>
            <DataTable
              data={costCenters}
              columns={costCenterColumns}
              searchKey="name"
              searchPlaceholder={isRTL ? 'البحث في مراكز التكلفة...' : 'Search cost centers...'}
              searchPlaceholderAr="البحث في مراكز التكلفة..."
            />
          </div>
        </TabsContent>

        {/* Inventory Valuation Tab */}
        <TabsContent value="inventory">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'تقييم المخزون' : 'Inventory Valuation'}</h3>
              <Button onClick={() => {
                setSelectedInventoryValuation(null);
                setInventoryValuationDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 me-2" />
                {isRTL ? 'تقييم جديد' : 'New Valuation'}
              </Button>
            </div>
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{isRTL ? 'إجمالي قيمة المخزون' : 'Total Inventory Value'}</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalInventoryValue, 'USD')}</span>
              </div>
            </div>
            <DataTable
              data={inventoryValuations}
              columns={inventoryValuationColumns}
              searchKey="materialName"
              searchPlaceholder={isRTL ? 'البحث في المواد...' : 'Search materials...'}
              searchPlaceholderAr="البحث في المواد..."
            />
          </div>
        </TabsContent>

        {/* Tax Management Tab */}
        <TabsContent value="tax">
          <div className="space-y-6">
            {/* Tax Configuration */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'إعدادات الضرائب' : 'Tax Configuration'}</h3>
                <Button onClick={() => {
                  setSelectedTaxConfig(null);
                  setTaxConfigDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRTL ? 'ضريبة جديدة' : 'New Tax'}
                </Button>
              </div>
              <DataTable
                data={taxConfigurations}
                columns={taxConfigColumns}
                searchKey="name"
                searchPlaceholder={isRTL ? 'البحث في الضرائب...' : 'Search taxes...'}
                searchPlaceholderAr="البحث في الضرائب..."
              />
            </div>

            {/* Tax Transactions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{isRTL ? 'المعاملات الضريبية' : 'Tax Transactions'}</h3>
              <DataTable
                data={taxTransactions}
                columns={taxTransactionColumns}
                searchKey="transactionNumber"
                searchPlaceholder={isRTL ? 'البحث في المعاملات...' : 'Search transactions...'}
                searchPlaceholderAr="البحث في المعاملات..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Financial Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Balance Sheet */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'الميزانية العمومية' : 'Balance Sheet'}</h3>
                <Badge variant="outline">{mockBalanceSheet.date}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">{isRTL ? 'الأصول' : 'Assets'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>{isRTL ? 'الأصول المتداولة' : 'Current Assets'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.currentAssets.total, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded ms-4">
                      <span className="text-muted-foreground">{isRTL ? 'النقدية' : 'Cash'}</span>
                      <span>{formatCurrency(mockBalanceSheet.currentAssets.cash, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded ms-4">
                      <span className="text-muted-foreground">{isRTL ? 'الذمم المدينة' : 'Accounts Receivable'}</span>
                      <span>{formatCurrency(mockBalanceSheet.currentAssets.accountsReceivable, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded ms-4">
                      <span className="text-muted-foreground">{isRTL ? 'المخزون' : 'Inventory'}</span>
                      <span>{formatCurrency(mockBalanceSheet.currentAssets.inventory, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>{isRTL ? 'الأصول غير المتداولة' : 'Non-Current Assets'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.nonCurrentAssets.total, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border-t-2 border-green-500">
                      <span className="font-bold">{isRTL ? 'إجمالي الأصول' : 'Total Assets'}</span>
                      <span className="font-bold text-green-600">{formatCurrency(mockBalanceSheet.totalAssets, 'USD')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">{isRTL ? 'الخصوم وحقوق الملكية' : 'Liabilities & Equity'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>{isRTL ? 'الخصوم المتداولة' : 'Current Liabilities'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.currentLiabilities.total, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>{isRTL ? 'الخصوم غير المتداولة' : 'Non-Current Liabilities'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.nonCurrentLiabilities.total, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded border-t">
                      <span className="font-medium">{isRTL ? 'إجمالي الخصوم' : 'Total Liabilities'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.totalLiabilities, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>{isRTL ? 'حقوق الملكية' : 'Equity'}</span>
                      <span className="font-medium">{formatCurrency(mockBalanceSheet.equity.total, 'USD')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border-t-2 border-green-500">
                      <span className="font-bold">{isRTL ? 'إجمالي الخصوم وحقوق الملكية' : 'Total Liabilities & Equity'}</span>
                      <span className="font-bold text-green-600">{formatCurrency(mockBalanceSheet.totalLiabilitiesAndEquity, 'USD')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Flow Statement */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{isRTL ? 'قائمة التدفقات النقدية' : 'Cash Flow Statement'}</h3>
                <Badge variant="outline">{mockCashFlowStatement.period}</Badge>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium mb-2">{isRTL ? 'الأنشطة التشغيلية' : 'Operating Activities'}</div>
                  <div className="space-y-1 text-sm ms-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'صافي الدخل' : 'Net Income'}</span>
                      <span>{formatCurrency(mockCashFlowStatement.operatingActivities.netIncome, 'USD')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الاستهلاك' : 'Depreciation'}</span>
                      <span>{formatCurrency(mockCashFlowStatement.operatingActivities.depreciation, 'USD')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t font-bold">
                    <span>{isRTL ? 'إجمالي التدفق من الأنشطة التشغيلية' : 'Net Cash from Operating Activities'}</span>
                    <span className="text-blue-600">{formatCurrency(mockCashFlowStatement.operatingActivities.total, 'USD')}</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-medium mb-2">{isRTL ? 'الأنشطة الاستثمارية' : 'Investing Activities'}</div>
                  <div className="flex justify-between mt-2 pt-2 border-t font-bold">
                    <span>{isRTL ? 'صافي التدفق من الأنشطة الاستثمارية' : 'Net Cash from Investing Activities'}</span>
                    <span className="text-purple-600">{formatCurrency(mockCashFlowStatement.investingActivities.total, 'USD')}</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="font-medium mb-2">{isRTL ? 'الأنشطة التمويلية' : 'Financing Activities'}</div>
                  <div className="flex justify-between mt-2 pt-2 border-t font-bold">
                    <span>{isRTL ? 'صافي التدفق من الأنشطة التمويلية' : 'Net Cash from Financing Activities'}</span>
                    <span className="text-orange-600">{formatCurrency(mockCashFlowStatement.financingActivities.total, 'USD')}</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border-t-2 border-green-500">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{isRTL ? 'صافي التدفق النقدي' : 'Net Cash Flow'}</span>
                    <span className="text-green-600">{formatCurrency(mockCashFlowStatement.netCashFlow, 'USD')}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'النقدية الافتتاحية' : 'Opening Cash'}</span>
                    <span>{formatCurrency(mockCashFlowStatement.openingCash, 'USD')}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1">
                    <span>{isRTL ? 'النقدية الاختتامية' : 'Closing Cash'}</span>
                    <span className="text-green-600">{formatCurrency(mockCashFlowStatement.closingCash, 'USD')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Profitability Tab */}
        <TabsContent value="profitability">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isRTL ? 'تحليل الربحية' : 'Profitability Analysis'}</h3>
            </div>
            <DataTable
              data={costPerStyles}
              columns={styleColumns}
              searchKey="styleName"
              searchPlaceholder={isRTL ? 'البحث في الموديلات...' : 'Search styles...'}
              searchPlaceholderAr="البحث في الموديلات..."
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Existing Forms */}
      <PreCostingForm
        open={preCostingDialogOpen}
        onOpenChange={(open) => {
          setPreCostingDialogOpen(open);
          if (!open) setSelectedPreCosting(null);
        }}
        preCosting={selectedPreCosting}
        onSave={handleSavePreCosting}
        isRTL={isRTL}
      />

      <JournalEntryForm
        open={journalEntryDialogOpen}
        onOpenChange={(open) => {
          setJournalEntryDialogOpen(open);
          if (!open) setSelectedJournalEntry(null);
        }}
        entry={selectedJournalEntry}
        accounts={chartOfAccounts}
        costCenters={costCenters}
        onSave={handleSaveJournalEntry}
        isRTL={isRTL}
      />

      <ChartOfAccountForm
        open={accountDialogOpen}
        onOpenChange={(open) => {
          setAccountDialogOpen(open);
          if (!open) setSelectedAccount(null);
        }}
        account={selectedAccount}
        accounts={chartOfAccounts}
        onSave={handleSaveAccount}
        isRTL={isRTL}
      />

      <TaxConfigurationForm
        open={taxConfigDialogOpen}
        onOpenChange={(open) => {
          setTaxConfigDialogOpen(open);
          if (!open) setSelectedTaxConfig(null);
        }}
        taxConfig={selectedTaxConfig}
        accounts={chartOfAccounts}
        onSave={handleSaveTaxConfig}
        isRTL={isRTL}
      />

      <CostCenterForm
        open={costCenterDialogOpen}
        onOpenChange={(open) => {
          setCostCenterDialogOpen(open);
          if (!open) setSelectedCostCenter(null);
        }}
        costCenter={selectedCostCenter}
        onSave={handleSaveCostCenter}
        isRTL={isRTL}
      />

      <InventoryValuationForm
        open={inventoryValuationDialogOpen}
        onOpenChange={(open) => {
          setInventoryValuationDialogOpen(open);
          if (!open) setSelectedInventoryValuation(null);
        }}
        valuation={selectedInventoryValuation}
        onSave={handleSaveInventoryValuation}
        isRTL={isRTL}
      />

      <ActualCostingForm
        open={actualCostingDialogOpen}
        onOpenChange={(open) => {
          setActualCostingDialogOpen(open);
          if (!open) setSelectedActualCosting(null);
        }}
        actualCosting={selectedActualCosting}
        onSave={handleSaveActualCosting}
        isRTL={isRTL}
      />

      {/* New Accounting Forms */}
      <ARPaymentForm
        open={isAddARPaymentOpen}
        onOpenChange={(open) => {
          setIsAddARPaymentOpen(open);
          if (!open) setSelectedARPayment(null);
        }}
        payment={selectedARPayment}
        onSave={handleSaveARPayment}
        isRTL={isRTL}
      />

      <APPaymentForm
        open={isAddAPPaymentOpen}
        onOpenChange={(open) => {
          setIsAddAPPaymentOpen(open);
          if (!open) setSelectedAPPayment(null);
        }}
        payment={selectedAPPayment}
        onSave={handleSaveAPPayment}
        isRTL={isRTL}
      />

      <BankAccountForm
        open={isAddBankAccountOpen}
        onOpenChange={(open) => {
          setIsAddBankAccountOpen(open);
          if (!open) setSelectedBankAccount(null);
        }}
        bankAccount={selectedBankAccount}
        onSave={handleSaveBankAccount}
        isRTL={isRTL}
      />

      <BankTransactionForm
        open={isAddBankTransactionOpen}
        onOpenChange={(open) => {
          setIsAddBankTransactionOpen(open);
        }}
        transaction={null}
        bankAccounts={bankAccounts}
        onSave={handleSaveBankTransaction}
        isRTL={isRTL}
      />

      <BudgetForm
        open={isAddBudgetOpen}
        onOpenChange={(open) => {
          setIsAddBudgetOpen(open);
          if (!open) setSelectedBudget(null);
        }}
        budget={selectedBudget}
        onSave={handleSaveBudget}
        isRTL={isRTL}
      />
    </ModuleLayout>
  );
}