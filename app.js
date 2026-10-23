
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://xfkdptxmynigsxkkgack.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_T7IYmnWOSa9g6Nhtg7rHXw_9QbUHuve';

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

function denganBatasWaktuApp(promise, nama, ms = 12000) {
    let timer;

    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(new Error(
                    nama + ' tidak merespons dalam 12 detik.'
                ));
            }, ms);
        })
    ]).finally(() => clearTimeout(timer));
}

export async function muatRingkasanDashboard() {
    const [kk, warga, kas] = await Promise.all([
        denganBatasWaktuApp(
            supabase.from('households')
                .select('id', { count: 'exact', head: true }),
            'Data KK'
        ),
        denganBatasWaktuApp(
            supabase.from('residents')
                .select('id', { count: 'exact', head: true })
                .eq('is_active', true),
            'Data warga'
        ),
        denganBatasWaktuApp(
            supabase.from('view_saldo_kas')
                .select('saldo_saat_ini')
                .maybeSingle(),
            'Saldo kas'
        )
    ]);

    if (kk.error) {
        throw new Error('Data KK: ' + kk.error.message);
    }

    if (warga.error) {
        throw new Error('Data warga: ' + warga.error.message);
    }

    if (kas.error) {
        throw new Error('Saldo kas: ' + kas.error.message);
    }

    if (!kas.data || kas.data.saldo_saat_ini == null) {
        throw new Error('Data saldo kas belum tersedia.');
    }

    return {
        totalKK: kk.count ?? 0,
        totalWarga: warga.count ?? 0,
        saldoKas: kas.data.saldo_saat_ini
    };
}
