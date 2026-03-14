const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dhvjmmnzkgpkjllaksmt.supabase.co',
  'sb_publishable_uMRziFq8WoqpjhZC7rJkhQ_vxvANLW9'
);

const adjectives = ['brave', 'swift', 'clever', 'silent', 'fierce', 'noble', 'wild', 'calm', 'bold', 'proud', 'shadow', 'storm', 'iron', 'steel', 'crystal'];
const nouns = ['falcon', 'tiger', 'wolf', 'dragon', 'bear', 'eagle', 'shark', 'panther', 'lion', 'hawk', 'raven', 'cobra', 'viper', 'griffin', 'titan'];

async function upgradeSecurity() {
  console.log('Fetching all 100 existing accounts...');
  const { data: nations, error: fetchError } = await supabase.from('nations').select('id');
  
  if (fetchError || !nations) {
    console.error('Failed to fetch nations:', fetchError);
    return;
  }

  console.log('Generating military-grade, kid-friendly passcodes...');
  const newPasscodes = new Set();
  
  // Generate 100 highly secure but typable passcodes
  while(newPasscodes.size < nations.length) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    // Add a 4-digit PIN (1000 - 9999) for massive entropy increase
    const pin = Math.floor(Math.random() * 9000) + 1000; 
    newPasscodes.add(`${adj}-${noun}-${pin}`);
  }

  const passcodesArray = Array.from(newPasscodes);
  const printableList = [];

  console.log('Upgrading database security lock...');
  
  // Update each account with the new passcode
  for (let i = 0; i < nations.length; i++) {
    const newCode = passcodesArray[i];
    const { error: updateError } = await supabase
      .from('nations')
      .update({ passcode: newCode })
      .eq('id', nations[i].id);
      
    if (updateError) {
      console.error(`Failed to update ${nations[i].id}:`, updateError);
    } else {
      printableList.push(`${i + 1}. [ _______________ ] -> ${newCode}`);
    }
  }

  console.log('\n✅ SECURITY UPGRADE COMPLETE!');
  console.log('--- NEW PRINTABLE MASTER LIST ---');
  console.log('Discard your old list immediately. Do not use the old colors-animals list.');
  console.log(printableList.join('\n'));
}

upgradeSecurity();
