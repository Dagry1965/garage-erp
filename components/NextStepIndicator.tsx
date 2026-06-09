// components/NextStepIndicator.tsx
'use client';

type NextStepIndicatorProps = {
  currentStatus: string;
  entityKey: string;
};

export default function NextStepIndicator({ currentStatus, entityKey }: NextStepIndicatorProps) {
  const getNextStep = () => {
    if (entityKey === 'intervention') {
      switch (currentStatus) {
        case 'brouillon':
          return { icon: '🔍', text: 'Prochaine étape : Commencer le diagnostic du véhicule' };
        case 'diagnostic_en_cours':
          return { icon: '📧', text: 'Prochaine étape : Terminer le diagnostic et envoyer le devis' };
        case 'en_attente_validation_client':
          return { icon: '⏳', text: 'Prochaine étape : Attendre la validation du client' };
        case 'valide_client':
          return { icon: '🔧', text: 'Prochaine étape : Démarrer les travaux' };
        case 'travaux_en_cours':
          return { icon: '🏁', text: 'Prochaine étape : Terminer les travaux' };
        case 'travaux_termine':
          return { icon: '📤', text: 'Prochaine étape : Transmettre à la compta' };
        case 'transmis_compta':
          return { icon: '📄', text: 'Prochaine étape : Facture en cours de génération' };
        default:
          return { icon: 'ℹ️', text: 'Aucune action suivante définie' };
      }
    }
    if (entityKey === 'rendez_vous') {
      switch (currentStatus) {
        case 'brouillon':
          return { icon: '📅', text: 'Prochaine étape : Planifier le rendez-vous' };
        case 'planifie':
          return { icon: '✅', text: 'Prochaine étape : Honorer le rendez-vous' };
        default:
          return { icon: 'ℹ️', text: 'Aucune action suivante' };
      }
    }
    return { icon: 'ℹ️', text: 'Aucune action suivante définie' };
  };

  const { icon, text } = getNextStep();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-8 flex items-start gap-4">
      <div className="text-4xl flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="uppercase text-blue-600 text-xs font-semibold tracking-widest mb-1">Prochaine étape</p>
        <p className="text-gray-800 text-lg leading-tight">{text}</p>
      </div>
    </div>
  );
}