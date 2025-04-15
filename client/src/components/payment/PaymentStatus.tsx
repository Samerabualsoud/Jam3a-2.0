import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/components/layout/Header';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'pending';
  orderId?: string;
  message?: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  orderId,
  message
}) => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      success: {
        title: 'Payment Successful',
        message: 'Your payment has been processed successfully.',
        orderPrefix: 'Order ID: '
      },
      failed: {
        title: 'Payment Failed',
        message: 'We couldn\'t process your payment. Please try again.',
        orderPrefix: 'Order ID: '
      },
      pending: {
        title: 'Payment Pending',
        message: 'Your payment is being processed. Please wait.',
        orderPrefix: 'Order ID: '
      }
    },
    ar: {
      success: {
        title: 'تم الدفع بنجاح',
        message: 'تمت معالجة الدفع الخاص بك بنجاح.',
        orderPrefix: 'رقم الطلب: '
      },
      failed: {
        title: 'فشل الدفع',
        message: 'لم نتمكن من معالجة الدفع الخاص بك. يرجى المحاولة مرة أخرى.',
        orderPrefix: 'رقم الطلب: '
      },
      pending: {
        title: 'الدفع قيد الانتظار',
        message: 'جاري معالجة الدفع الخاص بك. يرجى الانتظار.',
        orderPrefix: 'رقم الطلب: '
      }
    }
  };
  
  const currentContent = content[language][status];
  
  const statusIcons = {
    success: <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />,
    failed: <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />,
    pending: <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4 animate-pulse" />
  };
  
  const statusColors = {
    success: 'border-green-200 bg-green-50',
    failed: 'border-red-200 bg-red-50',
    pending: 'border-amber-200 bg-amber-50'
  };
  
  return (
    <Card className={statusColors[status]}>
      <CardHeader className="text-center pb-2">
        {statusIcons[status]}
        <CardTitle>{currentContent.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p>{message || currentContent.message}</p>
        {orderId && (
          <p className="mt-2 text-sm font-medium">
            {currentContent.orderPrefix}{orderId}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
