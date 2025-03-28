import { supabase } from '../config.js';

class AdminDashboard {
    constructor() {
        this.init();
    }

    async init() {
        // التحقق من الصلاحيات
        const user = supabase.auth.user();
        if (!(await isAdmin(user.id))) {
            window.location.href = '/403.html';
            return;
        }

        this.loadStats();
        this.loadRecentActivity();
    }

    async loadStats() {
        // إحصائيات المستخدمين
        const { count: totalUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' });

        // إحصائيات المحادثات
        const { count: totalChats } = await supabase
            .from('vivo_chats')
            .select('*', { count: 'exact' });

        // تحديث الواجهة
        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalChats').textContent = totalChats;
    }

    async loadRecentActivity() {
        const { data: activities, error } = await supabase
            .from('activity_log')
            .select(`
                id,
                activity_type,
                created_at,
                profiles:user_id(username)
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error loading activity:', error);
            return;
        }

        const tbody = document.getElementById('activityTableBody');
        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.profiles.username}</td>
                <td>${activity.activity_type}</td>
                <td>${new Date(activity.created_at).toLocaleString()}</td>
            </tr>
        `).join('');
    }
}

new AdminDashboard();