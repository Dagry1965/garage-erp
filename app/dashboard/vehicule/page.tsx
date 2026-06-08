'use client';

import EntityForm from '@/components/EntityForm';

export default function VehiculePage() {
  return (
    <EntityForm
      entityKey="vehicule"
      title="🚗 Nouveau Véhicule"
      description="Fiche véhicule client"
      successRedirect="/dashboard/list"
    />
  );
}