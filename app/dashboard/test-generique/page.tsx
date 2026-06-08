// app/dashboard/test-generique/page.tsx
'use client';

import DynamicForm from '@/components/DynamicForm';
import { getFormConfig } from '@/lib/form-service';
import { useEffect, useState } from 'react';

export default function TestGeneriquePage() {
  const [formConfig, setFormConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const config = await getFormConfig('intervention');
        setFormConfig(config);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-12 text-center">Chargement de la configuration depuis Supabase...</div>;
  if (error) return <div className="p-12 text-red-500">Erreur : {error}</div>;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🔧 Test ERP Générique</h1>
        <p className="text-green-600 mb-8">Configuration chargée depuis la base de données</p>
        
        <DynamicForm 
          entityKey="intervention"
          fields={formConfig.fields || []}
          onSubmit={(data) => alert("✅ Formulaire générique soumis :\n" + JSON.stringify(data, null, 2))}
        />
      </div>
    </div>
  );
}