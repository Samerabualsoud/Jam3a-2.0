import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Landmark, Truck } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false
}) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      className="space-y-4"
      disabled={disabled}
    >
      <div className={`flex items-center space-x-2 border p-4 rounded-md ${disabled ? 'opacity-70' : 'hover:bg-slate-50'}`}>
        <RadioGroupItem value="moyasser" id="moyasser" />
        <Label htmlFor="moyasser" className="flex items-center cursor-pointer w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Credit/Debit Card (Moyasser)</span>
            <span className="text-xs text-muted-foreground">Secure payment via Moyasser payment gateway</span>
          </div>
        </Label>
      </div>
      
      <div className={`flex items-center space-x-2 border p-4 rounded-md ${disabled ? 'opacity-70' : 'hover:bg-slate-50'}`}>
        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
        <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer w-full">
          <Landmark className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Bank Transfer</span>
            <span className="text-xs text-muted-foreground">Manual bank transfer to our account</span>
          </div>
        </Label>
      </div>
      
      <div className={`flex items-center space-x-2 border p-4 rounded-md ${disabled ? 'opacity-70' : 'hover:bg-slate-50'}`}>
        <RadioGroupItem value="cod" id="cod" />
        <Label htmlFor="cod" className="flex items-center cursor-pointer w-full">
          <Truck className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Cash on Delivery</span>
            <span className="text-xs text-muted-foreground">Pay when you receive your order</span>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
