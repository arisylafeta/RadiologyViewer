'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  Bone,
  Scan,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
];

const bottomNavItems = [
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-darkest border-r border-border">
      {/* Logo & Ministry Header */}
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-text-primary">
              Radiology Friend
            </h1>
          </div>
          <p className="text-xs text-text-muted">
            Ministria e Shëndetësisë 🇦🇱
          </p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-dark hover:text-text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-2 border-t border-border">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-dark hover:text-text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
