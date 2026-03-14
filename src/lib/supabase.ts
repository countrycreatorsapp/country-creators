import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function loginWithPasscode(passcode: string) {
  const { data, error } = await supabase
    .from('nations')
    .select('*, resources(*)')
    .eq('passcode', passcode)
    .single();
    
  if (error) throw error;
  return data;
}

export async function setNationName(passcode: string, newName: string) {
  const { data, error } = await supabase
    .from('nations')
    .update({ nation_name: newName })
    .eq('passcode', passcode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function claimDailyExpedition(nationId: string, rewardPayload: any) {
  const { data, error } = await supabase.rpc('process_expedition', {
    p_nation_id: nationId,
    p_gold_reward: rewardPayload.gold || 0,
    p_materials_reward: rewardPayload.materials || 0,
    p_tech_reward: rewardPayload.tech || 0,
    p_culture_reward: rewardPayload.culture || 0,
    p_food_reward: rewardPayload.food || 0
  });

  if (error) throw error;
  return data;
}

export async function teacherAwardPoints(passcode: string, resource: string, amount: number, reason: string) {
  const { data, error } = await supabase.rpc('award_student_resource', {
    p_passcode: passcode,
    p_resource_type: resource,
    p_amount: amount,
    p_reason: reason
  });

  if (error) throw error;
  return data;
}
