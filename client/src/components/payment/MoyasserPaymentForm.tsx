import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/layout/Header';

interface MoyasserPaymentFormProps {
  onComplete: (data: any) => void;
  amount: number;
  isProcessing?: boolean;
}

const MoyasserPaymentForm: React.FC<MoyasserPaymentFormProps> = ({ 
  onComplete,
  amount,
  isProcessing = false
}) => {
  const { language } = useLanguage();
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would integrate with Moyasser payment gateway
    onComplete({
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      method: 'credit_card'
    });
  };
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  
  const content = {
    en: {
      title: 'Credit Card Payment',
      cardNumber: 'Card Number',
      cardName: 'Name on Card',
      expiryDate: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
      submit: 'Pay Now',
      processing: 'Processing Payment...',
      amount: 'Amount',
      secure: 'Secure payment powered by Moyasser',
      currency: 'SAR'
    },
    ar: {
      title: 'الدفع ببطاقة الائتمان',
      cardNumber: 'رقم البطاقة',
      cardName: 'الاسم على البطاقة',
      expiryDate: 'تاريخ الانتهاء (MM/YY)',
      cvv: 'رمز التحقق',
      submit: 'ادفع الآن',
      processing: 'جاري معالجة الدفع...',
      amount: 'المبلغ',
      secure: 'دفع آمن مدعوم من مياسر',
      currency: 'ريال'
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
          <div className="bg-muted p-4 rounded-md flex justify-between items-center">
            <span>{currentContent.amount}:</span>
            <span className="font-bold">{amount} {currentContent.currency}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">{currentContent.cardNumber}</Label>
              <Input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardName">{currentContent.cardName}</Label>
              <Input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">{currentContent.expiryDate}</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cvv">{currentContent.cvv}</Label>
                <Input
                  id="cvv"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? currentContent.processing : currentContent.submit}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              {currentContent.secure}
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoyasserPaymentForm;
