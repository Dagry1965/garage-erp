// app/dashboard/admin/form/[key]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DynamicForm from '@/components/DynamicForm';
import { getFormConfig } from '@/lib/form-service';

export default function FormEditorPage() {
  const { key } = useParams() as { key: string };

  const [schema, setSchema] = useState<any | null>(null);
  const [entityLabel, setEntityLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      setError(null);
      try {
        const { entity, schema } = await getFormConfig(key);
        setSchema(schema);
        setEntityLabel(entity.label);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erreur chargement formulaire');
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [key]);

  const handleSubmit = (data: any) => {
    console.log('Formulaire sauvegardé :', data);
    alert(`Formulaire pour ${key} sauvegardé !`);
  };

  if (loading) return <div className="p-12 text-center">Chargement de l&apos;éditeur de formulaire...</div>;
  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;
  if (!schema) return <div className="p-12 text-center">Aucun schéma trouvé.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        {schema.title || 'Modifier le formulaire'}
      </h1>
      <p className="text-gray-500 mb-8">
        Entité : <strong className="uppercase">{entityLabel || key}</strong>
      </p>

      <DynamicForm
        entityKey={key}
        config={schema}
        onSuccess={handleSubmit}
      />
    </div>
  );
}
