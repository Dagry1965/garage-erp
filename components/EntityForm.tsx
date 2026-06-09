// components/EntityForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DynamicForm from './DynamicForm';
import NextStepIndicator from './NextStepIndicator';
import WorkflowButtons from './WorkflowButtons';
import { getFormConfig } from '@/lib/form-service';

type EntityFormProps = {
  entityKey: string;
  title: string;
  description?: string;
  successRedirect?: string;
  nextActionHref?: string;
  nextActionLabel?: string;
  showWorkflow?: boolean;
};

export default function EntityForm({
  entityKey,
  title,
  description,
  successRedirect = '/dashboard/list',
  nextActionHref,
  nextActionLabel = 'Voir la liste',
  showWorkflow = false,
}: EntityFormProps) {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);    // contiendra schema
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState('brouillon');

  useEffect(() => {
    async function load() {
      const { schema } = await getFormConfig(entityKey);  // 👈 on récupère schema
      setConfig(schema);                                  // 👈 on stocke schema seulement
      setLoading(false);
    }
    load();
  }, [entityKey]);

  const handleSuccess = (data: any) => {
    const fakeId = 'REC-' + Date.now();
    setRecordId(fakeId);
    setCurrentStatus(data?.status || 'brouillon');
    setSuccess(true);
  };

  if (loading) {
    return <div className="p-12 text-center">Chargement du formulaire...</div>;
  }

  if (success && recordId) {
    return (
      <div className="p-12 max-w-2xl mx-auto text-center">
        <div className="text-8xl mb-6">✅</div>
        <h2 className="text-4xl font-bold text-green-600 mb-4">{title} enregistré !</h2>

        {showWorkflow && (
          <div className="mt-12 border-t pt-8">
            <NextStepIndicator currentStatus={currentStatus} entityKey={entityKey} />
            <h3 className="text-lg font-semibold mt-8 mb-4">Actions possibles</h3>
            <WorkflowButtons
              entityKey={entityKey}
              currentStatus={currentStatus}
              recordId={recordId}
              onStatusChange={setCurrentStatus}
            />
          </div>
        )}

        <button
          onClick={() => router.push(successRedirect)}
          className="mt-10 py-4 px-8 bg-white border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
        >
          📋 {nextActionLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-600 mb-8">{description}</p>}

        {config && (
          <DynamicForm
            entityKey={entityKey}
            config={config}          // maintenant = { title, fields: [...] }
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
