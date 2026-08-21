'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

export default function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Only increment once per session to avoid spamming on every navigation
    const hasVisited = sessionStorage.getItem('hasVisited');

    const trackVisitor = async () => {
      try {
        const method = hasVisited ? 'GET' : 'POST';
        const res = await fetch('/api/visitor', { method });
        const data = await res.json();
        if (data.count !== undefined) {
          setCount(data.count);
          if (!hasVisited) {
            sessionStorage.setItem('hasVisited', 'true');
          }
        }
      } catch (error) {
        console.error('Failed to track visitor', error);
      }
    };

    trackVisitor();
  }, []);

  if (count === null) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Users className="w-5 h-5" />
      <span className="text-sm font-bold">
        {count.toLocaleString('id-ID')} Pengunjung Website
      </span>
    </div>
  );
}

