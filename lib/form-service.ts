// lib/form-service.ts
import { supabase } from './supabase';

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'datetime-local';
  required?: boolean;
  options?: string[];
};

export type FormSchema = {
  title?: string;
  fields: FormField[];
};

export async function getFormConfig(entityKey: string) {
  // 1) Récupérer l'entity_type
  const { data: entity, error: entityError } = await supabase
    .from('entity_types')
    .select('*')
    .eq('key', entityKey)
    .maybeSingle();

  if (entityError || !entity) {
    throw new Error(`Entité introuvable pour key="${entityKey}"`);
  }

  // 2) Récupérer le form_schema lié
  const { data: configData, error: configError } = await supabase
    .from('form_configs')
    .select('form_schema')
    .eq('entity_type_id', entity.id)
    .maybeSingle();

  if (configError || !configData?.form_schema) {
    throw new Error(`Aucune configuration trouvée pour "${entityKey}"`);
  }

  return {
    entity,
    schema: configData.form_schema as FormSchema,
  };
}
