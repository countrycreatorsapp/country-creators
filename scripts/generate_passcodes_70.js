const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dhvjmmnzkgpkjllaksmt.supabase.co';
const supabaseKey = 'sb_publishable_uMRziFq8WoqpjhZC7rJkhQ_vxvANLW9';
const supabase = createClient(supabaseUrl, supabaseKey);

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'silver', 'gold', 'crimson', 'emerald'];
const animals = ['tiger', 'eagle', 'bear', 'wolf', 'dragon', 'hawk', 'lion', 'panther', 'falcon', 'shark'];

async function generateMore(studentCount) {
  // Fetch existing to prevent duplicates
  const { data: existingNations } = await supabase.from('nations').select('passcode');
  const existingSet = new Set(existingNations?.map(n => n.passcode) || []);
  
  const passcodes = new Set();
  
  while(passcodes.size < studentCount) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const number = Math.floor(Math.random() * 90) + 10;
    const code = `${color}-${animal}-${number}`;
    
    if (!existingSet.has(code)) {
      passcodes.add(code);
    }
  }

  const newNations = Array.from(passcodes).map(code => ({
    passcode: code,
    nation_name: 'Pending Naming...',
    level: 1,
    era: 'Stone Age'
  }));

  const { data: nationsData, error: nationsError } = await supabase
    .from('nations')
    .insert(newNations)
    .select();

  if (nationsError) {
    console.error('Error:', nationsError);
    return;
  }

  const newResources = nationsData.map(nation => ({
    nation_id: nation.id,
    population: 100,
    gold: 50,
    materials: 50,
    tech_points: 0,
    culture: 0
  }));

  await supabase.from('resources').insert(newResources);

  console.log('\n--- EXTENDED MASTER LIST (31 - 100) ---');
  nationsData.forEach((n, index) => {
    console.log(`${index + 31}. [ _______________ ] -> ${n.passcode}`);
  });
}

generateMore(70);
