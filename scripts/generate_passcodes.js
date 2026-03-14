const { createClient } = require('@supabase/supabase-js');

// Connect to your live Supabase
const supabaseUrl = 'https://dhvjmmnzkgpkjllaksmt.supabase.co';
const supabaseKey = 'sb_publishable_uMRziFq8WoqpjhZC7rJkhQ_vxvANLW9';
const supabase = createClient(supabaseUrl, supabaseKey);

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'silver', 'gold', 'crimson', 'emerald'];
const animals = ['tiger', 'eagle', 'bear', 'wolf', 'dragon', 'hawk', 'lion', 'panther', 'falcon', 'shark'];

async function generateClassroom(studentCount) {
  const passcodes = new Set();
  
  while(passcodes.size < studentCount) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const number = Math.floor(Math.random() * 90) + 10;
    passcodes.add(`${color}-${animal}-${number}`);
  }

  const newNations = Array.from(passcodes).map(code => ({
    passcode: code,
    nation_name: 'Pending Naming...',
    level: 1,
    era: 'Stone Age'
  }));

  console.log(`Injecting ${studentCount} new secure passcodes into the database...`);

  const { data: nationsData, error: nationsError } = await supabase
    .from('nations')
    .insert(newNations)
    .select();

  if (nationsError) {
    console.error('Error creating nations:', nationsError);
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

  const { error: resourcesError } = await supabase
    .from('resources')
    .insert(newResources);

  if (resourcesError) {
    console.error('Error initializing resources:', resourcesError);
    return;
  }

  console.log('\n✅ SUCCESS: Classroom Generated!');
  console.log('\n--- PRINTABLE MASTER LIST ---');
  nationsData.forEach((n, index) => {
    console.log(`${index + 1}. [ _______________ ] -> ${n.passcode}`);
  });
}

generateClassroom(30);
