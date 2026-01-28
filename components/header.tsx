import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-darker border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Medical Imaging System
        </h2>
      </div>

      <div className="flex items-center gap-4">
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
