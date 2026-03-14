import { createClient } from '@supabase/supabase-js';

// These environment variables will be set securely in Vercel.
// For now, they will pull from a local .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Ensure your .env.local is configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * --- CORE DATABASE OPERATIONS FOR COUNTRY CREATORS ---
 */

// 1. Authenticate a student via their secure Passcode (Zero PII)
export async function loginWithPasscode(passcode: string) {
  const { data, error } = await supabase
    .from('nations')
    .select('*, resources(*)')
    .eq('passcode', passcode)
    .single();
    
  if (error) throw error;
  return data; // Returns the nation data and joined resource data
}

// 2. Roll the Daily Expedition (RNG Engine Database Write)
export async function claimDailyExpedition(nationId: string, rewardPayload: any) {
  // Check if they already rolled today to prevent cheating
  // If clear, execute the reward payload (e.g., +50 Gold)
  
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

// 3. Teacher Command: Award Points to a Student
export async function teacherAwardPoints(passcode: string, resource: string, amount: number, reason: string) {
  // Using a secure Postgres Function (RPC) to handle the transaction safely
  const { data, error } = await supabase.rpc('award_student_resource', {
    p_passcode: passcode,
    p_resource_type: resource,
    p_amount: amount,
    p_reason: reason
  });

  if (error) throw error;
  return data;
}

// 4. Teacher Command: Trigger Global Crisis/Event
export async function triggerGlobalEvent(eventName: string, effectPayload: any) {
  const { data, error } = await supabase
    .from('global_events')
    .insert([{ name: eventName, effect: effectPayload, is_active: true }]);

  if (error) throw error;
  return data;
}
