// app/dashboard/intervention/page.tsx
'use client';

import EntityForm from '@/components/EntityForm';

export default function InterventionPage() {
  return (
    <EntityForm
      entityKey="intervention"
      title="Nouvelle Intervention"
      description="Création d'une intervention atelier"
      showWorkflow={true}
    />
  );
}