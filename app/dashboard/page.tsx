// app/dashboard/page.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    client: 0,
    vehicule: 0,
    rendez_vous: 0,
    intervention: 0,
    facture: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data: records } = await supabase
        .from('entity_records')
        .select('entity_types!inner(key)');

      if (records) {
        const counts = records.reduce((acc: any, record: any) => {
          const key = record.entity_types?.key;
          if (key) acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        setStats({
          client: counts.client || 0,
          vehicule: counts.vehicule || 0,
          rendez_vous: counts.rendez_vous || 0,
          intervention: counts.intervention || 0,
          facture: counts.facture || 0,
        });
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { href: '/dashboard/client', icon: '👤', label: 'Clients', count: stats.client },
    { href: '/dashboard/vehicule', icon: '🚗', label: 'Véhicules', count: stats.vehicule },
    { href: '/dashboard/rendez-vous', icon: '📅', label: 'Rendez-vous', count: stats.rendez_vous },
    { href: '/dashboard/intervention', icon: '🔧', label: 'Interventions', count: stats.intervention, color: 'text-orange-600' },
    { href: '/dashboard/facture', icon: '📄', label: 'Factures', count: stats.facture, color: 'text-green-600' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">🏠 Tableau de bord</h1>
        <p className="text-gray-600 mb-10">Bienvenue dans Amarkhys ERP Garage</p>

        {loading ? (
          <p className="text-center py-12">Chargement des statistiques...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <StatCard
                key={index}
                href={card.href}
                icon={card.icon}
                label={card.label}
                count={card.count}
                color={card.color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}