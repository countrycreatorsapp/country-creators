const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const supabase = createClient('https://dhvjmmnzkgpkjllaksmt.supabase.co', 'sb_publishable_uMRziFq8WoqpjhZC7rJkhQ_vxvANLW9');
async function upload() {
  const file = fs.readFileSync('country_creators_v2.zip');
  await supabase.storage.from('flags').upload('country_creators_v2.zip', file, { contentType: 'application/zip', upsert: true });
  const { data } = supabase.storage.from('flags').getPublicUrl('country_creators_v2.zip');
  console.log('NEW URL:', data.publicUrl);
}
upload();
