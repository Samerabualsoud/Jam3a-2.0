import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

// This component ensures the admin icon appears when logged in with admin credentials
interface AdminIconProps {
  isAdmin: boolean;
  isActive: (path: string) => boolean;
  language: 'en' | 'ar';
  user: any;
}

const AdminIcon: React.FC<AdminIconProps> = ({ isAdmin, isActive, language, user }) => {
  // Check if user is admin by email or isAdmin property
  const isAdminUser = isAdmin || (user && user.email === 'admin@jam3a.me');
  
  if (!isAdminUser) return null;
  
  return (
    <Link to="/admin">
      <Button 
        variant="ghost" 
        size="icon" 
        className={`text-foreground hover:text-primary transition-colors relative ${isActive('/admin') ? 'text-primary' : ''}`}
        title={language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
        aria-label={language === 'en' ? 'Admin Panel' : 'لوحة الإدارة'}
      >
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" aria-hidden="true"></span>
      </Button>
    </Link>
  );
};

export default AdminIcon;
