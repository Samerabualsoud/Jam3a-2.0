import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/layout/Header';
import { CreditCard, Banknote, Building } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      creditCard: 'Credit Card',
      creditCardDesc: 'Pay securely with your credit or debit card',
      cashOnDelivery: 'Cash on Delivery',
      cashOnDeliveryDesc: 'Pay when your order is delivered',
      bankTransfer: 'Bank Transfer',
      bankTransferDesc: 'Transfer the amount to our bank account'
    },
    ar: {
      creditCard: 'بطاقة ائتمان',
      creditCardDesc: 'ادفع بأمان باستخدام بطاقة الائتمان أو الخصم',
      cashOnDelivery: 'الدفع عند الاستلام',
      cashOnDeliveryDesc: 'ادفع عند استلام طلبك',
      bankTransfer: 'تحويل بنكي',
      bankTransferDesc: 'قم بتحويل المبلغ إلى حسابنا المصرفي'
    }
  };
  
  const currentContent = content[language];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={onMethodChange}
          className="space-y-4"
        >
          <div className={`flex items-start space-x-3 border rounded-md p-4 ${selectedMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-input'}`}>
            <RadioGroupItem value="credit_card" id="credit_card" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 h-5 w-5" />
                <span className="font-medium">{currentContent.creditCard}</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.creditCardDesc}</p>
            </div>
          </div>
          
          <div className={`flex items-start space-x-3 border rounded-md p-4 ${selectedMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-input'}`}>
            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
                <Banknote className="mr-2 h-5 w-5" />
                <span className="font-medium">{currentContent.cashOnDelivery}</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.cashOnDeliveryDesc}</p>
            </div>
          </div>
          
          <div className={`flex items-start space-x-3 border rounded-md p-4 ${selectedMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-input'}`}>
            <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                <Building className="mr-2 h-5 w-5" />
                <span className="font-medium">{currentContent.bankTransfer}</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{currentContent.bankTransferDesc}</p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
