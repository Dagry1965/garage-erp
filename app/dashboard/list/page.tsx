// app/dashboard/list/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ListPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadRecords() {
      const { data, error } = await supabase
        .from('entity_records')
        .select(`
          id,
          data,
          created_at,
          entity_types!inner(key, label)
        `)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setRecords(data || []);
      setLoading(false);
    }
    loadRecords();
  }, []);

  // Statuts par type
  const statusOptionsByType: Record<string, { value: string; label: string }[]> = {
    rendez_vous: [
      { value: 'brouillon', label: 'Brouillon' },
      { value: 'planifie', label: 'Planifié' },
      { value: 'honore', label: 'Honoré' },
      { value: 'annule', label: 'Annulé' },
      { value: 'no_show', label: 'Client non venu' },
    ],
    intervention: [
      { value: 'brouillon', label: 'Brouillon' },
      { value: 'diagnostic_en_cours', label: 'Diagnostic en cours' },
      { value: 'en_attente_validation_client', label: 'En attente validation' },
      { value: 'valide_client', label: 'Validé client' },
      { value: 'travaux_en_cours', label: 'Travaux en cours' },
      { value: 'travaux_termine', label: 'Travaux terminés' },
      { value: 'transmis_compta', label: 'Transmis compta' },
    ],
    facture: [
      { value: 'brouillon', label: 'Brouillon' },
      { value: 'emise', label: 'Émise' },
      { value: 'partiellement_payee', label: 'Partiellement payée' },
      { value: 'payee', label: 'Payée' },
      { value: 'relancee', label: 'Relancée' },
      { value: 'annulee', label: 'Annulée' },
    ],
  };

  // Statuts à afficher dans le select (dédoublonnés quand aucun type sélectionné)
  const currentStatusOptions = typeFilter
    ? statusOptionsByType[typeFilter] || []
    : Array.from(
        new Map(
          [
            ...statusOptionsByType.rendez_vous,
            ...statusOptionsByType.intervention,
            ...statusOptionsByType.facture,
          ].map(item => [item.value, item])
        ).values()
      );

  const getStatusBadge = (status: string = 'brouillon') => {
    const config: Record<string, { color: string; icon: string; label: string }> = {
      brouillon: { color: 'bg-gray-100 text-gray-700', icon: '📝', label: 'Brouillon' },
      diagnostic_en_cours: { color: 'bg-blue-100 text-blue-700', icon: '🔍', label: 'Diagnostic en cours' },
      en_attente_validation_client: { color: 'bg-amber-100 text-amber-700', icon: '⏳', label: 'En attente client' },
      valide_client: { color: 'bg-emerald-100 text-emerald-700', icon: '✅', label: 'Validé client' },
      travaux_en_cours: { color: 'bg-orange-100 text-orange-700', icon: '🔧', label: 'Travaux en cours' },
      travaux_termine: { color: 'bg-purple-100 text-purple-700', icon: '🏁', label: 'Travaux terminés' },
      transmis_compta: { color: 'bg-indigo-100 text-indigo-700', icon: '📤', label: 'Transmis compta' },
      emise: { color: 'bg-cyan-100 text-cyan-700', icon: '📄', label: 'Émise' },
      partiellement_payee: { color: 'bg-yellow-100 text-yellow-700', icon: '💰', label: 'Partiellement payée' },
      payee: { color: 'bg-green-100 text-green-700', icon: '💵', label: 'Payée' },
    };
    const st = config[status] || { color: 'bg-gray-100 text-gray-700', icon: '📌', label: status };
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-3xl text-sm font-medium ${st.color}`}>
        <span>{st.icon}</span>
        <span>{st.label}</span>
      </span>
    );
  };

  const filteredRecords = records.filter(record => {
    const d = record.data || {};
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      (d.nom || '').toLowerCase().includes(searchTerm) ||
      (d.matricule || '').toLowerCase().includes(searchTerm) ||
      (d.description || '').toLowerCase().includes(searchTerm);

    const matchesType = !typeFilter || record.entity_types?.key === typeFilter;
    const matchesStatus = !statusFilter || (d.status || 'brouillon') === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) return <div className="p-8">Chargement de la liste...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Liste des enregistrements</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher (client, véhicule, description...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
        />

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setStatusFilter('');
          }}
          className="border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none"
        >
          <option value="">Tous les types</option>
          <option value="client">Client</option>
          <option value="vehicule">Véhicule</option>
          <option value="rendez_vous">Rendez-vous</option>
          <option value="intervention">Intervention</option>
          <option value="facture">Facture</option>
        </select>

        {/* Filtre Statut à la fin */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none"
        >
          <option value="">Tous les statuts</option>
          {currentStatusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">Informations principales</th>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-6 py-5 text-left text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRecords.map((record) => {
              const d = record.data || {};
              const status = d.status || 'brouillon';

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium">
                    {record.entity_types?.label || 'Inconnu'}
                  </td>
                  <td className="px-6 py-5">
                    {d.nom && <div><strong>Client :</strong> {d.nom} {d.prenom}</div>}
                    {d.matricule && <div><strong>Véhicule :</strong> {d.matricule}</div>}
                    {d.description && <div className="text-sm text-gray-500 mt-1">{d.description.substring(0, 70)}...</div>}
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(status)}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}