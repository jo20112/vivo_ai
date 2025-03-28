import supabase from '../../utils/supabase.js';
import { formatDate } from '../../utils/helpers.js';

async function loadStats() {
  try {
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
    
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// تحديث سجل النشاط
async function loadRecentActivity() {
  const { data, error } = await supabase
    .from('activity_log')
    .select(`
      id,
      activity_type,
      created_at,
      profiles:user_id(username)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error loading activity:', error);
    return;
  }

  const activityList = document.getElementById('activityList');
  activityList.innerHTML = data.map(item => `
    <div class="activity-item">
      <div class="activity-type">${item.activity_type}</div>
      <div class="activity-user">${item.profiles.username}</div>
      <div class="activity-date">${formatDate(item.created_at)}</div>
    </div>
  `).join('');
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadRecentActivity();
  
  // تحديث البيانات كل 30 ثانية
  setInterval(() => {
    loadStats();
    loadRecentActivity();
  }, 30000);
});