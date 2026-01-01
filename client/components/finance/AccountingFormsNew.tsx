// ==================== NEW ACCOUNTING FORMS ====================

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { ARPayment, APPayment, BankAccount, BankTransaction, Budget } from '@/store/financeData';
import { baseCurrencies } from '@/store/currencyData';
import { mockAccountsReceivable, mockAccountsPayable, mockBankAccounts } from '@/store/financeData';

// ==================== AR PAYMENT FORM ====================

interface ARPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: ARPayment | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function ARPaymentForm({ open, onOpenChange, payment, onSave, isRTL }: ARPaymentFormProps) {
  const [formData, setFormData] = useState({
    invoiceId: payment?.invoiceId || '',
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    amount: payment?.amount || 0,
    paymentMethod: payment?.paymentMethod || 'bank_transfer' as any,
    paymentReference: payment?.paymentReference || '',
    bankName: payment?.bankName || '',
    checkNumber: payment?.checkNumber || '',
    notes: payment?.notes || '',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        invoiceId: payment.invoiceId,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference || '',
        bankName: payment.bankName || '',
        checkNumber: payment.checkNumber || '',
        notes: payment.notes || '',
      });
    }
  }, [payment, open]);

  const handleSubmit = () => {
    const selectedInvoice = mockAccountsReceivable.find(ar => ar.id === formData.invoiceId);
    onSave({
      ...formData,
      invoiceNumber: selectedInvoice?.invoiceNumber || '',
      customerId: selectedInvoice?.customerId || '',
      customerName: selectedInvoice?.customerName || '',
      currency: selectedInvoice?.currency || 'USD',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payment ? (isRTL ? 'تعديل دفعة العميل' : 'Edit AR Payment') : (isRTL ? 'دفعة عميل جديدة' : 'New AR Payment')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الفاتورة' : 'Invoice'}</Label>
              <Select value={formData.invoiceId} onValueChange={(v) => setFormData({...formData, invoiceId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockAccountsReceivable.filter(ar => ar.status !== 'paid').map(ar => (
                    <SelectItem key={ar.id} value={ar.id}>{ar.invoiceNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الدفعة' : 'Payment Date'}</Label>
              <Input type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المبلغ' : 'Amount'}</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'طريقة الدفع' : 'Payment Method'}</Label>
              <Select value={formData.paymentMethod} onValueChange={(v: any) => setFormData({...formData, paymentMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{isRTL ? 'نقد' : 'Cash'}</SelectItem>
                  <SelectItem value="bank_transfer">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</SelectItem>
                  <SelectItem value="check">{isRTL ? 'شيك' : 'Check'}</SelectItem>
                  <SelectItem value="credit_card">{isRTL ? 'بطاقة ائتمان' : 'Credit Card'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Payment Reference'}</Label>
              <Input value={formData.paymentReference} onChange={(e) => setFormData({...formData, paymentReference: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم البنك' : 'Bank Name'}</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== AP PAYMENT FORM ====================

interface APPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: APPayment | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function APPaymentForm({ open, onOpenChange, payment, onSave, isRTL }: APPaymentFormProps) {
  const [formData, setFormData] = useState({
    billId: payment?.billId || '',
    paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
    amount: payment?.amount || 0,
    paymentMethod: payment?.paymentMethod || 'bank_transfer' as any,
    paymentReference: payment?.paymentReference || '',
    bankName: payment?.bankName || '',
    checkNumber: payment?.checkNumber || '',
    notes: payment?.notes || '',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        billId: payment.billId,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference || '',
        bankName: payment.bankName || '',
        checkNumber: payment.checkNumber || '',
        notes: payment.notes || '',
      });
    }
  }, [payment, open]);

  const handleSubmit = () => {
    const selectedBill = mockAccountsPayable.find(ap => ap.id === formData.billId);
    onSave({
      ...formData,
      billNumber: selectedBill?.billNumber || '',
      supplierId: selectedBill?.supplierId || '',
      supplierName: selectedBill?.supplierName || '',
      currency: selectedBill?.currency || 'USD',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payment ? (isRTL ? 'تعديل دفعة المورد' : 'Edit AP Payment') : (isRTL ? 'دفعة مورد جديدة' : 'New AP Payment')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الفاتورة' : 'Bill'}</Label>
              <Select value={formData.billId} onValueChange={(v) => setFormData({...formData, billId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockAccountsPayable.filter(ap => ap.status !== 'paid').map(ap => (
                    <SelectItem key={ap.id} value={ap.id}>{ap.billNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ الدفعة' : 'Payment Date'}</Label>
              <Input type="date" value={formData.paymentDate} onChange={(e) => setFormData({...formData, paymentDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المبلغ' : 'Amount'}</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'طريقة الدفع' : 'Payment Method'}</Label>
              <Select value={formData.paymentMethod} onValueChange={(v: any) => setFormData({...formData, paymentMethod: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{isRTL ? 'نقد' : 'Cash'}</SelectItem>
                  <SelectItem value="bank_transfer">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</SelectItem>
                  <SelectItem value="check">{isRTL ? 'شيك' : 'Check'}</SelectItem>
                  <SelectItem value="credit_card">{isRTL ? 'بطاقة ائتمان' : 'Credit Card'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Payment Reference'}</Label>
              <Input value={formData.paymentReference} onChange={(e) => setFormData({...formData, paymentReference: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم البنك' : 'Bank Name'}</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BANK ACCOUNT FORM ====================

interface BankAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccount?: BankAccount | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function BankAccountForm({ open, onOpenChange, bankAccount, onSave, isRTL }: BankAccountFormProps) {
  const [formData, setFormData] = useState({
    accountNumber: bankAccount?.accountNumber || '',
    bankName: bankAccount?.bankName || '',
    bankNameAr: bankAccount?.bankNameAr || '',
    accountName: bankAccount?.accountName || '',
    accountNameAr: bankAccount?.accountNameAr || '',
    accountType: bankAccount?.accountType || 'checking' as any,
    currency: bankAccount?.currency || 'USD',
    openingBalance: bankAccount?.openingBalance || 0,
    glAccountCode: bankAccount?.glAccountCode || '',
    bankAddress: bankAccount?.bankAddress || '',
    bankSwiftCode: bankAccount?.bankSwiftCode || '',
    bankIBAN: bankAccount?.bankIBAN || '',
    contactPerson: bankAccount?.contactPerson || '',
    phone: bankAccount?.phone || '',
    email: bankAccount?.email || '',
  });

  useEffect(() => {
    if (bankAccount) {
      setFormData({
        accountNumber: bankAccount.accountNumber,
        bankName: bankAccount.bankName,
        bankNameAr: bankAccount.bankNameAr,
        accountName: bankAccount.accountName,
        accountNameAr: bankAccount.accountNameAr,
        accountType: bankAccount.accountType,
        currency: bankAccount.currency,
        openingBalance: bankAccount.openingBalance,
        glAccountCode: bankAccount.glAccountCode,
        bankAddress: bankAccount.bankAddress || '',
        bankSwiftCode: bankAccount.bankSwiftCode || '',
        bankIBAN: bankAccount.bankIBAN || '',
        contactPerson: bankAccount.contactPerson || '',
        phone: bankAccount.phone || '',
        email: bankAccount.email || '',
      });
    }
  }, [bankAccount, open]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bankAccount ? (isRTL ? 'تعديل الحساب البنكي' : 'Edit Bank Account') : (isRTL ? 'حساب بنكي جديد' : 'New Bank Account')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم الحساب' : 'Account Number'}</Label>
              <Input value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم البنك (إنجليزي)' : 'Bank Name (English)'}</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم البنك (عربي)' : 'Bank Name (Arabic)'}</Label>
              <Input value={formData.bankNameAr} onChange={(e) => setFormData({...formData, bankNameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الحساب (إنجليزي)' : 'Account Name (English)'}</Label>
              <Input value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'اسم الحساب (عربي)' : 'Account Name (Arabic)'}</Label>
              <Input value={formData.accountNameAr} onChange={(e) => setFormData({...formData, accountNameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الحساب' : 'Account Type'}</Label>
              <Select value={formData.accountType} onValueChange={(v: any) => setFormData({...formData, accountType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">{isRTL ? 'جاري' : 'Checking'}</SelectItem>
                  <SelectItem value="savings">{isRTL ? 'توفير' : 'Savings'}</SelectItem>
                  <SelectItem value="current">{isRTL ? 'حالي' : 'Current'}</SelectItem>
                  <SelectItem value="deposit">{isRTL ? 'إيداع' : 'Deposit'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>{isRTL ? curr.nameAr : curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الرصيد الافتتاحي' : 'Opening Balance'}</Label>
              <Input type="number" step="0.01" value={formData.openingBalance} onChange={(e) => setFormData({...formData, openingBalance: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'كود الحساب المحاسبي' : 'GL Account Code'}</Label>
              <Input value={formData.glAccountCode} onChange={(e) => setFormData({...formData, glAccountCode: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'SWIFT Code' : 'SWIFT Code'}</Label>
              <Input value={formData.bankSwiftCode} onChange={(e) => setFormData({...formData, bankSwiftCode: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'IBAN' : 'IBAN'}</Label>
              <Input value={formData.bankIBAN} onChange={(e) => setFormData({...formData, bankIBAN: e.target.value})} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BANK TRANSACTION FORM ====================

interface BankTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: BankTransaction | null;
  bankAccounts: BankAccount[];
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function BankTransactionForm({ open, onOpenChange, transaction, bankAccounts, onSave, isRTL }: BankTransactionFormProps) {
  const [formData, setFormData] = useState({
    bankAccountId: transaction?.bankAccountId || '',
    transactionDate: transaction?.transactionDate || new Date().toISOString().split('T')[0],
    transactionType: transaction?.transactionType || 'deposit' as any,
    amount: transaction?.amount || 0,
    description: transaction?.description || '',
    descriptionAr: transaction?.descriptionAr || '',
    referenceNumber: transaction?.referenceNumber || '',
    checkNumber: transaction?.checkNumber || '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        bankAccountId: transaction.bankAccountId,
        transactionDate: transaction.transactionDate,
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        description: transaction.description,
        descriptionAr: transaction.descriptionAr || '',
        referenceNumber: transaction.referenceNumber || '',
        checkNumber: transaction.checkNumber || '',
      });
    }
  }, [transaction, open]);

  const handleSubmit = () => {
    const selectedBank = bankAccounts.find(ba => ba.id === formData.bankAccountId);
    onSave({
      ...formData,
      bankAccountNumber: selectedBank?.accountNumber || '',
      currency: selectedBank?.currency || 'USD',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transaction ? (isRTL ? 'تعديل المعاملة البنكية' : 'Edit Bank Transaction') : (isRTL ? 'معاملة بنكية جديدة' : 'New Bank Transaction')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الحساب البنكي' : 'Bank Account'}</Label>
              <Select value={formData.bankAccountId} onValueChange={(v) => setFormData({...formData, bankAccountId: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bankAccounts.filter(ba => ba.isActive).map(ba => (
                    <SelectItem key={ba.id} value={ba.id}>{ba.accountNumber} - {isRTL ? ba.bankNameAr : ba.bankName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ المعاملة' : 'Transaction Date'}</Label>
              <Input type="date" value={formData.transactionDate} onChange={(e) => setFormData({...formData, transactionDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع المعاملة' : 'Transaction Type'}</Label>
              <Select value={formData.transactionType} onValueChange={(v: any) => setFormData({...formData, transactionType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">{isRTL ? 'إيداع' : 'Deposit'}</SelectItem>
                  <SelectItem value="withdrawal">{isRTL ? 'سحب' : 'Withdrawal'}</SelectItem>
                  <SelectItem value="transfer">{isRTL ? 'تحويل' : 'Transfer'}</SelectItem>
                  <SelectItem value="fee">{isRTL ? 'رسوم' : 'Fee'}</SelectItem>
                  <SelectItem value="interest">{isRTL ? 'فائدة' : 'Interest'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'المبلغ' : 'Amount'}</Label>
              <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Input value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'رقم المرجع' : 'Reference Number'}</Label>
              <Input value={formData.referenceNumber} onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== BUDGET FORM ====================

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  onSave: (data: any) => void;
  isRTL: boolean;
}

export function BudgetForm({ open, onOpenChange, budget, onSave, isRTL }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    nameAr: budget?.nameAr || '',
    description: budget?.description || '',
    descriptionAr: budget?.descriptionAr || '',
    budgetType: budget?.budgetType || 'annual' as any,
    startDate: budget?.period.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.period.endDate || '',
    totalBudget: budget?.totalBudget || 0,
    currency: budget?.currency || 'USD',
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        nameAr: budget.nameAr,
        description: budget.description,
        descriptionAr: budget.descriptionAr,
        budgetType: budget.budgetType,
        startDate: budget.period.startDate,
        endDate: budget.period.endDate,
        totalBudget: budget.totalBudget,
        currency: budget.currency,
      });
    }
  }, [budget, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      period: {
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{budget ? (isRTL ? 'تعديل الميزانية' : 'Edit Budget') : (isRTL ? 'ميزانية جديدة' : 'New Budget')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
              <Input value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'نوع الميزانية' : 'Budget Type'}</Label>
              <Select value={formData.budgetType} onValueChange={(v: any) => setFormData({...formData, budgetType: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{isRTL ? 'سنوية' : 'Annual'}</SelectItem>
                  <SelectItem value="quarterly">{isRTL ? 'ربع سنوية' : 'Quarterly'}</SelectItem>
                  <SelectItem value="monthly">{isRTL ? 'شهرية' : 'Monthly'}</SelectItem>
                  <SelectItem value="project">{isRTL ? 'مشروع' : 'Project'}</SelectItem>
                  <SelectItem value="department">{isRTL ? 'قسم' : 'Department'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {baseCurrencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>{isRTL ? curr.nameAr : curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ البداية' : 'Start Date'}</Label>
              <Input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'تاريخ النهاية' : 'End Date'}</Label>
              <Input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? 'إجمالي الميزانية' : 'Total Budget'}</Label>
              <Input type="number" step="0.01" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: parseFloat(e.target.value) || 0})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={2} dir="rtl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>
          <Button onClick={handleSubmit}>{isRTL ? 'حفظ' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

