import EntityForm from '@/components/EntityForm';

export default function InterventionPage() {
  return (
    <EntityForm
      entityKey="intervention"
      title="🔧 Nouvelle Intervention"
      description="Diagnostic et opérations sur véhicule"
      successRedirect="/dashboard/list"
      nextActionHref="/dashboard/facture"
      nextActionLabel="Créer la Facture"
    />
  );
}