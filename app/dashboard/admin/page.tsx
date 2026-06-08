// app/dashboard/admin/form/[key]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DynamicForm from '@/components/DynamicForm';

export default function EntityFormPage() {
  const params = useParams<{ key: string }>();
  const entityKey = params.key;

  const [entity, setEntity] = useState<any | null>(null);
  const [formSchema, setFormSchema] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // 1) Récupérer l’entity_type par key
      const { data: entityData, error: entityError } = await supabase
        .from('entity_types')
        .select('*')
        .eq('key', entityKey)
        .maybeSingle();

      if (entityError || !entityData) {
        setError('Entité introuvable');
        setLoading(false);
        return;
      }

      setEntity(entityData);

      // 2) Récupérer le form_schema lié
      const { data: formConfig, error: formError } = await supabase
        .from('form_configs')
        .select('form_schema')
        .eq('entity_type_id', entityData.id)
        .maybeSingle();

      if (formError || !formConfig) {
        setError('Aucun formulaire configuré pour cette entité');
        setLoading(false);
        return;
      }

      setFormSchema(formConfig.form_schema);
      setLoading(false);
    };

    loadData();
  }, [entityKey]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!entity || !formSchema) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {formSchema.title || `Formulaire ${entity.label}`}
      </h1>

      <DynamicForm
        config={formSchema}          // <-- utilise ton form_schema dynamique
        entityLabel={entity.label}
      />
    </div>
  );
}
