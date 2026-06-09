// components/DynamicForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Field = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'datetime-local';
  required?: boolean;
  options?: string[];
};

type FormConfig = {
  title?: string;
  fields: Field[];
};

type DynamicFormProps = {
  entityKey: string;
  config?: FormConfig;
  fields?: Field[];
  entityLabel?: string;
  onSuccess?: (data?: any) => void;
  onSubmit?: (data?: any) => void;
};

export default function DynamicForm({
  entityKey,
  config,
  fields: fieldsProp,
  entityLabel,
  onSuccess,
  onSubmit,
}: DynamicFormProps) {
  const fields: Field[] = config?.fields || fieldsProp || [];

  const [formData, setFormData] = useState<any>({ status: 'brouillon' }); // statut par défaut en création
  const [saving, setSaving] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});

  // Chargement options dynamiques
  useEffect(() => {
    async function loadOptions() {
      const optionsMap: Record<string, any[]> = {};
      for (const field of fields) {
        if (field.type !== 'select') continue;
        let relatedKey = '';
        if (field.name.includes('client')) relatedKey = 'client';
        else if (field.name.includes('vehicule')) relatedKey = 'vehicule';
        else if (field.name.includes('intervention')) relatedKey = 'intervention';

        if (relatedKey) {
          const { data: entityType } = await supabase
            .from('entity_types')
            .select('id')
            .eq('key', relatedKey)
            .maybeSingle();

          if (entityType?.id) {
            const { data } = await supabase
              .from('entity_records')
              .select('id, data')
              .eq('entity_type_id', entityType.id)
              .limit(200);
            optionsMap[field.name] = data || [];
          }
        }
      }
      setDynamicOptions(optionsMap);
    }
    if (fields.length) loadOptions();
  }, [fields]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: entity } = await supabase.from('entity_types').select('id').eq('key', entityKey).maybeSingle();
      let entityId = entity?.id;
      if (!entityId) {
        const { data: fallback } = await supabase.from('entity_types').select('id').limit(1).maybeSingle();
        entityId = fallback?.id;
      }
      const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();

      const { error } = await supabase.from('entity_records').insert({
        entity_type_id: entityId,
        tenant_id: tenant?.id,
        data: formData,
      });

      if (error) throw error;

      alert('✅ Enregistrement réussi !');
      onSuccess?.(formData);
      setFormData({ status: 'brouillon' });
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Badge Statut en haut à droite
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
      <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-3xl text-sm font-semibold shadow-sm ${st.color}`}>
        <span className="text-lg">{st.icon}</span>
        <span>{st.label}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* Badge Statut en haut à droite */}
      <div className="absolute top-0 right-0">
        {getStatusBadge(formData.status)}
      </div>

      <div className="pt-14">
        {fields
          .filter(field => field.name !== 'status') // ← MASQUÉ en création
          .map((field) => (
            <div key={field.name} className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                  required={field.required}
                >
                  <option value="">Sélectionnez...</option>
                  {(dynamicOptions[field.name] || []).map((option: any) => {
                    const data = option.data || {};
                    let displayName = 'Sans nom';
                    if (field.name.includes('client')) displayName = `${data.nom || ''} ${data.prenom || ''}`.trim() || 'Client';
                    else if (field.name.includes('vehicule')) displayName = data.matricule || data.modele || 'Véhicule';
                    return <option key={option.id} value={option.id}>{displayName}</option>;
                  })}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 min-h-[100px]"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                  required={field.required}
                />
              )}
            </div>
          ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-green-700 w-full disabled:opacity-50"
      >
        {saving ? 'Enregistrement en cours...' : 'Enregistrer'}
      </button>
    </form>
  );
}