import EntityForm from '@/components/EntityForm';

export default function RendezVousPage() {
  return (
    <EntityForm
      entityKey="rendez_vous"
      title="📅 Nouveau Rendez-vous"
      description="Création d'un rendez-vous client"
      successRedirect="/dashboard/list"
      nextActionHref="/dashboard/intervention"
      nextActionLabel="Créer une Intervention"
    />
  );
}