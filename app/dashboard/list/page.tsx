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

  const deleteRecord = async () => {
    if (!selectedRecord) return;
    if (!confirm("Supprimer cet enregistrement ?")) return;

    const { error } = await supabase
      .from('entity_records')
      .delete()
      .eq('id', selectedRecord.id);

    if (error) {
      alert("Erreur lors de la suppression");
    } else {
      alert("✅ Enregistrement supprimé");
      closeDetails();
      // Rafraîchir la liste
      window.location.reload();
    }
  };

  if (loading) return <div className="p-12 text-center">Chargement...</div>;

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
            <option value="rendez_vous">Rendez-vous</option>
            <option value="intervention">Intervention</option>
            <option value="facture">Facture</option>
            <option value="client">Client</option>
            <option value="vehicule">Véhicule</option>
          </select>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-5 font-medium">Type</th>
                <th className="text-left p-5 font-medium">Contenu</th>
                <th className="text-right p-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr 
                  key={record.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetails(record)}
                >
                  <td className="p-5 font-medium">
                    {record.entity_types?.label || record.entity_types?.key}
                  </td>
                  <td className="p-5 text-sm text-gray-600">
                    {Object.entries(record.data || {})
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <strong>{key}:</strong> {String(value).slice(0, 35)}
                        </div>
                      ))}
                  </td>
                  <td className="p-5 text-right text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" 
          onClick={closeDetails}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">
                Détails — {selectedRecord.entity_types?.label}
              </h2>
              <pre className="bg-gray-100 p-6 rounded-2xl text-sm overflow-auto">
                {JSON.stringify(selectedRecord.data, null, 2)}
              </pre>
            </div>
            <div className="border-t p-6 flex justify-between">
              <button 
                onClick={deleteRecord}
                className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-2xl font-medium"
              >
                🗑️ Supprimer
              </button>
              <button 
                onClick={closeDetails}
                className="px-8 py-4 bg-gray-200 rounded-2xl font-medium"
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