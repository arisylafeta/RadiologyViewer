'use client';

import { Bell, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Brain,
  Bone,
  Scan,
  Settings,
  LogOut
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'MRI Scans',
    href: '/mri',
    icon: Brain,
  },
  {
    title: 'X-Ray Scans',
    href: '/xray',
    icon: Bone,
  },
  {
    title: 'CT Scans',
    href: '/ct',
    icon: Scan,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 h-16 bg-darker border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Activity className="h-5 w-5" />
          <span>Radiology</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-dark hover:text-text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-text-secondary" />
          <span className="text-sm text-text-secondary hidden sm:inline">Settings</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-text-secondary" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full" />
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 text-text-secondary" />
        </Button>
      </div>
    </header>
  );
}
