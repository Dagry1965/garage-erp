// components/EntityForm.tsx
'use client';

import { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { getFormConfig } from '@/lib/form-service';
import { useRouter } from 'next/navigation';

type EntityFormProps = {
  entityKey: string;         // ex: "client", "vehicule", "intervention"
  title: string;
  description?: string;
  successRedirect?: string;
  nextActionHref?: string;   // 👈 nouveau
  nextActionLabel?: string;  // 👈 nouveau
};

export default function EntityForm({
  entityKey,
  title,
  description,
  successRedirect,
  nextActionHref,
  nextActionLabel,
}: EntityFormProps) {
  const router = useRouter();

  const [schema, setSchema] = useState<any | null>(null);
  const [entityLabel, setEntityLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastData, setLastData] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
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
    setLastData(data || null);

    if (successRedirect) {
      router.push(successRedirect);
      return;
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
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-gray-500 mb-2">{description}</p>
        )}
        <p className="text-gray-400">
          Entité : <strong className="uppercase">{entityLabel || entityKey}</strong>
        </p>
      </div>

      <DynamicForm
        entityKey={entityKey}
        config={schema}
        onSuccess={handleSuccess}
      />

      {/* Bouton d'action suivante si fourni */}
      {nextActionHref && nextActionLabel && lastData && (
        <button
          type="button"
          onClick={() => router.push(nextActionHref)}
          className="mt-4 w-full border border-gray-300 rounded-2xl px-4 py-3 text-center hover:bg-gray-50"
        >
          {nextActionLabel}
        </button>
      )}
    </div>
  );
}
