// app/dashboard/list/page.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function ListPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    async function loadRecords() {
      const { data } = await supabase
        .from('entity_records')
        .select(`
          id,
          created_at,
          data,
          entity_types!inner(key, label)
        `)
        .order('created_at', { ascending: false });

      setRecords(data || []);
      setFilteredRecords(data || []);
      setLoading(false);
    }
    loadRecords();
  }, []);

  useEffect(() => {
    let result = records;

    if (filterType !== 'all') {
      result = result.filter(r => r.entity_types?.key === filterType);
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(r => 
        JSON.stringify(r.data).toLowerCase().includes(term)
      );
    }

    setFilteredRecords(result);
  }, [records, search, filterType]);

  const openDetails = (record: any) => setSelectedRecord(record);
  const closeDetails = () => setSelectedRecord(null);

  if (loading) return <div className="p-12 text-center">Chargement de la liste...</div>;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">📋 Liste des enregistrements</h1>
        <p className="text-gray-600 mb-8">Toutes les données de l’ERP</p>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-2xl px-5 py-4"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-2xl px-5 py-4"
          >
            <option value="all">Tous les types</option>
            <option value="client">Client</option>
            <option value="vehicule">Véhicule</option>
            <option value="rendez_vous">Rendez-vous</option>
            <option value="intervention">Intervention</option>
            <option value="facture">Facture</option>
          </select>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-5 font-medium">Type</th>
                <th className="text-left p-5 font-medium">Informations principales</th>
                <th className="text-right p-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const d = record.data || {};
                return (
                  <tr 
                    key={record.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => openDetails(record)}
                  >
                    <td className="p-5 font-medium">
                      {record.entity_types?.label}
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                      {d.nom && <div><strong>Client :</strong> {d.nom} {d.prenom}</div>}
                      {d.matricule && <div><strong>Véhicule :</strong> {d.matricule}</div>}
                      {d.type_intervention && <div><strong>Type :</strong> {d.type_intervention}</div>}
                      {d.description && <div><strong>Description :</strong> {d.description.substring(0, 70)}...</div>}
                      {d.montant && <div><strong>Montant :</strong> {d.montant} FCFA</div>}
                    </td>
                    <td className="p-5 text-right text-sm text-gray-500">
                      {new Date(record.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails amélioré */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeDetails}>
          <div className="bg-white rounded-3xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">
                Détails — {selectedRecord.entity_types?.label}
              </h2>
              
              <div className="space-y-4">
                {Object.entries(selectedRecord.data || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-3">
                    <span className="font-medium text-gray-700 capitalize">{key}</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-6 flex justify-end">
              <button 
                onClick={closeDetails}
                className="px-8 py-4 bg-gray-200 rounded-2xl font-medium hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}