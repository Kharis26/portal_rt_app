
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xfkdptxmynigsxkkgack.supabase.co';
const SUPABASE_ANON_KEY = 'TEMPELKAN_ANON_KEY_PROYEKMU_DI_SINI';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Membaca pengaturan RT/RW
export async function tesKoneksi() {
    const { data, error } = await supabase
        .from('system_settings')
        .select('*');

    if (error) {
        console.error('Koneksi gagal:', error);
        return null;
    }

    return data?.[0] ?? null;
}

// Login dengan email dan password
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
    });

    if (error) {
        console.error('Login gagal:', error.message);
        return {
            success: false,
            message: error.message
        };
    }

    return {
        success: true,
        user: data.user
    };
}

// Memeriksa sesi login
export async function cekSesi() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Gagal memeriksa sesi:', error.message);
        return null;
    }

    return data.session;
}

// Logout
export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Logout gagal:', error.message);
        return {
            success: false,
            message: error.message
        };
    }

    return { success: true };
}
