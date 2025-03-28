import { supabase } from './config.js';

async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw new Error(error.message);
    }

    // تسجيل نشاط الدخول
    await supabase
        .from('activity_log')
        .insert([{
            user_id: data.user.id,
            activity_type: 'login',
            ip_address: await getClientIP()
        }]);

    return data.user;
}