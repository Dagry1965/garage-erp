// app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { Home, Calendar, Wrench, FileText, Users, Settings, List } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            <div>
              <span className="font-bold text-3xl">Amarkhys</span>
              <p className="text-xs text-gray-500">ERP Garage</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <Home size={22} />
            Tableau de bord
          </Link>
          <Link href="/dashboard/rendez-vous" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <Calendar size={22} />
            Nouveau Rendez-vous
          </Link>

          {/* Liens Client et Véhicule */}
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <Users size={22} />
            Nouveau Client
          </Link>
          <Link href="/dashboard/vehicule" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <span className="text-2xl">🚗</span>
            Nouveau Véhicule
          </Link>

          <Link href="/dashboard/intervention" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <Wrench size={22} />
            Nouvelle Intervention
          </Link>
          <Link href="/dashboard/facture" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <FileText size={22} />
            Nouvelle Facture
          </Link>
          <Link href="/dashboard/list" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <List size={22} />
            Liste des enregistrements
          </Link>
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 font-medium">
            <Settings size={22} />
            Administration
          </Link>
        </nav>

        <div className="p-4 border-t mt-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl font-medium">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}