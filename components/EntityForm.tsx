// components/EntityForm.tsx
'use client';

import { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { getFormConfig } from '@/lib/form-service';
import { useRouter } from 'next/navigation';

type EntityFormProps = {
  entityKey: string;         // ex: "client", "vehicule", ...
  title: string;
  description?: string;
  successRedirect?: string;
};

export default function EntityForm({
  entityKey,
  title,
  description,
  successRedirect,
}: EntityFormProps) {
  const router = useRouter();

  const [schema, setSchema] = useState<any | null>(null);
  const [entityLabel, setEntityLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // va chercher form_schema dans form_configs
        const { entity, schema } = await getFormConfig(entityKey);
        setSchema(schema);
        setEntityLabel(entity.label);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erreur chargement formulaire');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [entityKey]);

  const handleSuccess = (data?: any) => {
    console.log(`Enregistrement ${entityKey} :`, data);
    if (successRedirect) {
      router.push(successRedirect);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement du formulaire...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="p-8 text-center">
        Aucun schéma de formulaire configuré pour cette entité.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      <p className="text-gray-400 mb-8">
        Entité : <strong className="uppercase">{entityLabel || entityKey}</strong>
      </p>

      <DynamicForm
        entityKey={entityKey}
        config={schema}          // 👈 IMPORTANT : on passe le form_schema
        onSuccess={handleSuccess}
      />
    </div>
  );
}
