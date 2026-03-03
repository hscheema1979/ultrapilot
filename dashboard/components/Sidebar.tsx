/**
 * Mission Control - Shadcn Admin Kit Pattern
 * Sidebar navigation and layout
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Tasks', href: '/tasks', icon: '📋' },
  { name: 'Agents', href: '/agents', icon: '🤖' },
  { name: 'Queues', href: '/queues', icon: '📬' },
  { name: 'System Health', href: '/health', icon: '💚' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🚀</span>
          <span>Mission Control</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">UltraPilot Operations</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-slate-700">
        <ConnectionStatus />
      </div>
    </aside>
  );
}

function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useState(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  });

  return (
    <div className="px-4">
      <p className="text-xs text-slate-400 mb-2">Backend Connection</p>
      <Badge variant={connected ? 'default' : 'destructive'} className="w-full justify-center">
        {connected ? '● Connected' : '○ Disconnected'}
      </Badge>
    </div>
  );
}
