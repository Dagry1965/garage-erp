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
  config?: FormConfig;   // pour les formulaires dynamiques (form_schema)
  fields?: Field[];      // pour compat avec les anciens appels
  onSuccess?: (data?: any) => void;
};

export default function DynamicForm({
  entityKey,
  config,
  fields: fieldsProp,
  onSuccess,
}: DynamicFormProps) {
  const fields: Field[] = config?.fields || fieldsProp || [];

  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function loadOptions() {
      const optionsMap: Record<string, any[]> = {};

      for (const field of fields) {
        if (
          field.type === 'select' &&
          (field.name.includes('client') || field.name.includes('vehicule'))
        ) {
          const relatedKey = field.name.includes('client') ? 'client' : 'vehicule';

          const { data: entityType, error: etError } = await supabase
            .from('entity_types')
            .select('id')
            .eq('key', relatedKey)
            .maybeSingle();

          if (etError || !entityType) continue;

          const { data } = await supabase
            .from('entity_records')
            .select('id, data')
            .eq('entity_type_id', entityType.id)
            .limit(100);

          optionsMap[field.name] = data || [];
        }
      }

      setDynamicOptions(optionsMap);
    }

    if (fields.length) {
      loadOptions();
    }
  }, [fields]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: entity } = await supabase
        .from('entity_types')
        .select('id')
        .eq('key', entityKey)
        .maybeSingle();

      let entityId = entity?.id;

      if (!entityId) {
        const { data: fallback } = await supabase
          .from('entity_types')
          .select('id')
          .limit(1)
          .maybeSingle();
        entityId = fallback?.id;
      }

      if (!entityId) throw new Error("Aucun type d'entité disponible");

      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .limit(1)
        .maybeSingle();

      const { error } = await supabase
        .from('entity_records')
        .insert({
          entity_type_id: entityId,
          tenant_id: tenant?.id,
          data: formData,
        });

      if (error) throw error;

      alert('✅ Enregistrement réussi !');
      onSuccess?.(formData);
      setFormData({});
    } catch (err: any) {
      alert('Erreur : ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!fields.length) {
    return <div>Pas de champs de formulaire configurés.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
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

                if (field.name.includes('client')) {
                  displayName =
                    data.nom ||
                    data.nom_client ||
                    data.name ||
                    'Client sans nom';
                } else if (field.name.includes('vehicule')) {
                  displayName =
                    data.matricule ||
                    data.immatriculation ||
                    data.plaque ||
                    data.modele ||
                    'Véhicule sans nom';
                }

                return (
                  <option key={option.id} value={option.id}>
                    {displayName}
                  </option>
                );
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
