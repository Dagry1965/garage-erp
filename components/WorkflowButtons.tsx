// components/WorkflowButtons.tsx
'use client';

import { supabase } from '@/lib/supabase';

type WorkflowButtonsProps = {
  entityKey: string;
  currentStatus: string;
  recordId: string;
  onStatusChange?: (newStatus: string) => void;
};

export default function WorkflowButtons({
  entityKey,
  currentStatus,
  recordId,
  onStatusChange,
}: WorkflowButtonsProps) {

  // Transitions autorisées selon le statut actuel
  const allowedTransitions: Record<string, Record<string, { label: string; nextStatus: string; color: string }[]>> = {
    intervention: {
      brouillon: [
        { label: 'Commencer le diagnostic', nextStatus: 'diagnostic_en_cours', color: 'bg-blue-600' },
      ],
      diagnostic_en_cours: [
        { label: 'Terminer diagnostic + envoyer devis', nextStatus: 'en_attente_validation_client', color: 'bg-amber-600' },
      ],
      en_attente_validation_client: [
        { label: 'Client a validé', nextStatus: 'valide_client', color: 'bg-emerald-600' },
      ],
      valide_client: [
        { label: 'Démarrer les travaux', nextStatus: 'travaux_en_cours', color: 'bg-orange-600' },
      ],
      travaux_en_cours: [
        { label: 'Travaux terminés', nextStatus: 'travaux_termine', color: 'bg-purple-600' },
      ],
      travaux_termine: [
        { label: 'Transmettre à la compta', nextStatus: 'transmis_compta', color: 'bg-indigo-600' },
      ],
      transmis_compta: [],
    },
    rendez_vous: {
      brouillon: [
        { label: 'Planifier', nextStatus: 'planifie', color: 'bg-blue-600' },
      ],
      planifie: [
        { label: 'Honorer', nextStatus: 'honore', color: 'bg-emerald-600' },
        { label: 'Annuler', nextStatus: 'annule', color: 'bg-red-600' },
      ],
    },
  };

  const transitions = allowedTransitions[entityKey]?.[currentStatus] || [];

  const handleTransition = async (nextStatus: string, label: string) => {
    if (!confirm(`Confirmez-vous le passage au statut : "${label}" ?`)) return;

    try {
      const { data: currentRecord, error: fetchError } = await supabase
        .from('entity_records')
        .select('data')
        .eq('id', recordId)
        .single();

      if (fetchError) throw fetchError;

      const newData = { ...currentRecord?.data, status: nextStatus };

      const { error } = await supabase
        .from('entity_records')
        .update({ data: newData })
        .eq('id', recordId);

      if (error) throw error;

      alert(`✅ Statut mis à jour : ${label}`);
      onStatusChange?.(nextStatus);
    } catch (err: any) {
      alert('Erreur lors du changement de statut : ' + err.message);
    }
  };

  if (transitions.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">
        Aucune action disponible pour ce statut.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {transitions.map((t) => (
        <button
          key={t.nextStatus}
          onClick={() => handleTransition(t.nextStatus, t.label)}
          className={`px-6 py-3 rounded-2xl text-white font-medium hover:scale-105 transition ${t.color}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}