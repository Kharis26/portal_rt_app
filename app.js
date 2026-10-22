import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://xfkdptxmynigsxkkgack.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma2RwdHhteW5pZ3N4a2tnYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1Nzg0MDMsImV4cCI6MjEwODE1NDQwM30.NHTufsV8kHGWUzKQZFcdHSFzuaUamGgM7sdu-5EAJSo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function tesKoneksi() {
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) {
        console.error('Koneksi Gagal:', error);
        return null;
    }
    return data[0];
}