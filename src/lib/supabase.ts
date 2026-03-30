import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function loginWithPasscode(passcode: string) {
  const { data, error } = await supabase
    .from('nations')
    .select('*, resources(*), nation_buildings(*)')
    .eq('passcode', passcode)
    .single();
    
  if (error) throw error;
  return data;
}

export async function getClassroomLeaderboard() {
  const { data, error } = await supabase
    .from('nations')
    .select('*, resources(*)');
  if (error) throw error;
  return data;
}

export async function recoverPasscode(nationName: string) {
  const { data, error } = await supabase
    .from('nations')
    .select('passcode, nation_name')
    .ilike('nation_name', `%${nationName}%`);
  if (error) throw error;
  return data;
}

export async function buyBuilding(nationId: string, buildingId: string, goldCost: number, materialsCost: number) {
  const { data, error } = await supabase.rpc('buy_building', {
    p_nation_id: nationId,
    p_building_id: buildingId,
    p_gold_cost: goldCost,
    p_materials_cost: materialsCost
  });

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

export async function uploadNationFlag(passcode: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${passcode}-${Math.random()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('flags')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from('flags')
    .getPublicUrl(fileName);

  const { data, error: updateError } = await supabase
    .from('nations')
    .update({ flag_url: publicUrlData.publicUrl })
    .eq('passcode', passcode)
    .select()
    .single();

  if (updateError) throw updateError;
  return data;
}

export async function claimDailyExpedition(nationId: string, rewardPayload: any) {
  // Try fetching current resources first since RPC might not exist
  const { data: resData, error: fetchErr } = await supabase
    .from('resources')
    .select('*')
    .eq('nation_id', nationId)
    .single();

  if (fetchErr && fetchErr.code !== 'PGRST116') { // PGRST116 is no rows
    throw fetchErr;
  }

  const current = resData || { gold: 0, materials: 0, tech_points: 0, culture: 0, food: 0, population: 100 };
  
  const updates = {
    gold: (current.gold || 0) + (rewardPayload.gold || 0),
    materials: (current.materials || 0) + (rewardPayload.materials || 0),
    tech_points: (current.tech_points || 0) + (rewardPayload.tech || 0),
    culture: (current.culture || 0) + (rewardPayload.culture || 0),
    food: (current.food || 0) + (rewardPayload.food || 0)
  };

  if (resData) {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('nation_id', nationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('resources')
      .insert({ nation_id: nationId, ...updates, population: 100 })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
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

export async function buyClassroomPerk(nationId: string, perkName: string, costAmount: number, costCurrency: string) {
  const { data, error } = await supabase.rpc('buy_classroom_perk', {
    p_nation_id: nationId,
    p_perk_name: perkName,
    p_cost_amount: costAmount,
    p_cost_currency: costCurrency
  });

  if (error) throw error;
  return data;
}

export async function getPendingPerks() {
  const { data, error } = await supabase
    .from('perk_purchases')
    .select('id, perk_name, status, purchased_at, nations(passcode, nation_name)')
    .eq('status', 'pending')
    .order('purchased_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markPerkRedeemed(purchaseId: string) {
  const { data, error } = await supabase.rpc('redeem_perk', {
    p_purchase_id: purchaseId
  });

  if (error) throw error;
  return data;
}
