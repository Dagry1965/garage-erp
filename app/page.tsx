'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <span className="text-8xl block mb-8">🚀</span>
        <h1 className="text-6xl font-bold mb-4">Amarkhys ERP</h1>
        <p className="text-3xl font-semibold text-green-600 mb-8">
          Application démarrée avec succès !
        </p>
        <p className="text-gray-600">
          La base technique Next.js + Tailwind est prête.<br />
          On va maintenant construire l’ERP générique (multi-tenant, formulaires dynamiques, etc.)
        </p>
        <p className="text-sm text-gray-400 mt-12">
          (Connexion Supabase temporairement désactivée pour débloquer)
        </p>
      </div>
    </div>
  );
}