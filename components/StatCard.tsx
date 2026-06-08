// components/StatCard.tsx
'use client';

import Link from 'next/link';

type StatCardProps = {
  href: string;
  icon: string;
  label: string;
  count: number;
  color?: string; // pour les couleurs spéciales (orange, green...)
};

export default function StatCard({ href, icon, label, count, color = 'text-gray-900' }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-6xl font-bold mt-3 ${color}`}>{count}</p>
          </div>
          <span className="text-6xl">{icon}</span>
        </div>
      </div>
    </Link>
  );
}