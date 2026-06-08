'use client';

import EntityForm from '@/components/EntityForm';

export default function ClientPage() {
  return (
    <EntityForm
      entityKey="client"
      title="👤 Nouveau Client"
      description="Fiche client pour le garage"
      successRedirect="/dashboard/list"
    />
  );
}