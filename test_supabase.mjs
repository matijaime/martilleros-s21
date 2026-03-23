import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const envs = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    envs[match[1]] = match[2];
  }
});

const supabaseUrl = envs['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = envs['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAlerts() {
  console.log('Testing update into site_alerts...');
  const { data, error } = await supabase
    .from('site_alerts')
    .update({ message: 'hola test', active: true, updated_at: new Date().toISOString() })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Update Success:', data);
  }
}

testAlerts();
