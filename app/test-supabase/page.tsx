'use client';

import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export default function TestSupabase() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function check() {
      console.log("🔍 Test de recherche entity_type 'intervention'...");
      
      const { data, error } = await supabase
        .from('entity_types')
        .select('*')
        .eq('key', 'intervention');

      setResult({ data, error });
    }
    check();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Diagnostic Entity Type "intervention"</h1>
      
      <pre className="bg-gray-100 p-6 rounded-2xl text-sm overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}