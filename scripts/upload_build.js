const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://dhvjmmnzkgpkjllaksmt.supabase.co',
  'sb_publishable_uMRziFq8WoqpjhZC7rJkhQ_vxvANLW9'
);

async function upload() {
  const file = fs.readFileSync('country_creators_live_site.zip');
  
  const { data, error } = await supabase.storage
    .from('flags')
    .upload('country_creators_live_site.zip', file, {
      contentType: 'application/zip',
      upsert: true
    });
    
  if (error) {
    console.error('Error:', error);
  } else {
    const { data: urlData } = supabase.storage
      .from('flags')
      .getPublicUrl('country_creators_live_site.zip');
    console.log('URL:', urlData.publicUrl);
  }
}
upload();
