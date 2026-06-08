import EntityForm from '@/components/EntityForm';

export default function FacturePage() {
  return (
    <EntityForm
      entityKey="facture"
      title="📄 Nouvelle Facture"
      description="Facturation d'une intervention ou vente"
      successRedirect="/dashboard/list"
    />
  );
}