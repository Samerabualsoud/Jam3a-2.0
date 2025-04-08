import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

interface BankTransferFormProps {
  onComplete: (data: any) => void;
  isProcessing?: boolean;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({ 
  onComplete,
  isProcessing = false
}) => {
  const { language } = useLanguage();
  const [transferDate, setTransferDate] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState('');
  const [transferReference, setTransferReference] = React.useState('');
  const [senderName, setSenderName] = React.useState('');
  const [senderBank, setSenderBank] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      transferDate,
      transferAmount,
      transferReference,
      senderName,
      senderBank,
      method: 'bank_transfer'
    });
  };
  
  const content = {
    en: {
      title: 'Bank Transfer Details',
      instructions: 'Please transfer the exact amount to our bank account and fill in the details below:',
      bankName: 'Bank Name: Saudi National Bank',
      accountName: 'Account Name: Jam3a Trading Company',
      iban: 'IBAN: SA123456789012345678901',
      accountNumber: 'Account Number: 1234567890',
      transferDate: 'Transfer Date',
      transferAmount: 'Transfer Amount',
      transferReference: 'Transfer Reference/ID',
      senderName: 'Sender Name',
      senderBank: 'Sender Bank',
      submit: 'Confirm Transfer',
      processing: 'Processing...',
      note: 'Note: Your order will be processed after we verify your transfer.'
    },
    ar: {
      title: 'تفاصيل التحويل المصرفي',
      instructions: 'يرجى تحويل المبلغ المطلوب بالضبط إلى حسابنا المصرفي وملء التفاصيل أدناه:',
      bankName: 'اسم البنك: البنك الأهلي السعودي',
      accountName: 'اسم الحساب: شركة جمعة التجارية',
      iban: 'آيبان: SA123456789012345678901',
      accountNumber: 'رقم الحساب: 1234567890',
      transferDate: 'تاريخ التحويل',
      transferAmount: 'مبلغ التحويل',
      transferReference: 'مرجع/رقم التحويل',
      senderName: 'اسم المرسل',
      senderBank: 'بنك المرسل',
      submit: 'تأكيد التحويل',
      processing: 'جاري المعالجة...',
      note: 'ملاحظة: سيتم معالجة طلبك بعد التحقق من التحويل الخاص بك.'
    }
  };
  
  const currentContent = content[language];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentContent.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
            <p>{currentContent.instructions}</p>
            <p className="font-medium">{currentContent.bankName}</p>
            <p>{currentContent.accountName}</p>
            <p>{currentContent.iban}</p>
            <p>{currentContent.accountNumber}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="transferDate">{currentContent.transferDate}</Label>
              <Input
                id="transferDate"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transferAmount">{currentContent.transferAmount}</Label>
              <Input
                id="transferAmount"
                type="text"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transferReference">{currentContent.transferReference}</Label>
              <Input
                id="transferReference"
                type="text"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="senderName">{currentContent.senderName}</Label>
              <Input
                id="senderName"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="senderBank">{currentContent.senderBank}</Label>
              <Input
                id="senderBank"
                type="text"
                value={senderBank}
                onChange={(e) => setSenderBank(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? currentContent.processing : currentContent.submit}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              {currentContent.note}
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferForm;
