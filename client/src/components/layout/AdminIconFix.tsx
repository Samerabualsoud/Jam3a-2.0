import React from 'react';
import { ShieldCheck } from 'lucide-react';

// This component provides a consistent admin icon with proper styling
const AdminIconFix: React.FC = () => {
  return (
    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
  );
};

export default AdminIconFix;
