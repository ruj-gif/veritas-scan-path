import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { profile, signOut } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-primary';
      case 'distributor': return 'bg-blue-500';
      case 'consumer': return 'bg-accent';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-primary">Ayur-Veritas</h1>
          {profile && (
            <Badge className={`${getRoleColor(profile.role)} text-white text-xs`}>
              {profile.role.toUpperCase()}
            </Badge>
          )}
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {profile?.full_name}
          </span>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}