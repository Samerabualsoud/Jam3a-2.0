import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/layout/Header';

interface CashOnDeliveryFormProps {
  onComplete: (data: any) => void;
  isProcessing?: boolean;
}

const CashOnDeliveryForm: React.FC<CashOnDeliveryFormProps> = ({ 
  onComplete,
  isProcessing = false
}) => {
  const { language } = useLanguage();
  const [deliveryNotes, setDeliveryNotes] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      deliveryNotes,
      method: 'cash_on_delivery'
    });
  };
  
  const content = {
    en: {
      title: 'Cash on Delivery',
      instructions: 'You will pay when your order is delivered to your address.',
      deliveryNotes: 'Delivery Notes (Optional)',
      deliveryNotesPlaceholder: 'Any special instructions for delivery...',
      submit: 'Confirm Order',
      processing: 'Processing...',
      note: 'Note: Please have the exact amount ready at the time of delivery.'
    },
    ar: {
      title: 'الدفع عند الاستلام',
      instructions: 'ستدفع عندما يتم تسليم طلبك إلى عنوانك.',
      deliveryNotes: 'ملاحظات التوصيل (اختياري)',
      deliveryNotesPlaceholder: 'أي تعليمات خاصة للتسليم...',
      submit: 'تأكيد الطلب',
      processing: 'جاري المعالجة...',
      note: 'ملاحظة: يرجى تجهيز المبلغ المطلوب بالضبط في وقت التسليم.'
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
          <div className="bg-muted p-4 rounded-md">
            <p>{currentContent.instructions}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="deliveryNotes">{currentContent.deliveryNotes}</Label>
              <Textarea
                id="deliveryNotes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder={currentContent.deliveryNotesPlaceholder}
                rows={3}
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

export default CashOnDeliveryForm;
