import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🔍 Logs de debug (à supprimer après)
console.log("🔍 Debug Supabase Config:");
console.log("URL:", supabaseUrl);
console.log("Key (premiers chars):", supabaseAnonKey?.substring(0, 20) + "...");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variables Supabase manquantes. Vérifie ton .env.local");
} else {
  console.log("✅ Variables Supabase chargées");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
});

// 🔍 Test de connexion au démarrage (optionnel)
supabase.from('entity_types').select('count').then(({ data, error }) => {
  if (error) {
    console.error("❌ Test connexion échoué:", error);
  } else {
    console.log("✅ Connexion Supabase OK");
  }
});
