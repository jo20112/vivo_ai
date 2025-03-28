import supabase from '../../utils/supabase.js';
import { formatDate } from '../../utils/helpers.js';

async function loadActivityLog() {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select(`
        id,
        activity_type,
        created_at,
        profiles:user_id(username)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const logTable = document.getElementById('activityTable');
    logTable.innerHTML = data.map(activity => `
      <tr>
        <td>${activity.profiles?.username || 'ضيف'}</td>
        <td>${activity.activity_type}</td>
        <td>${formatDate(activity.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-info view-details" data-id="${activity.id}">
            التفاصيل
          </button>
        </td>
      </tr>
    `).join('');

    // إضافة مستمعات الأحداث لأزرار التفاصيل
    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', async () => {
        await showActivityDetails(btn.dataset.id);
      });
    });

  } catch (error) {
    console.error('Error loading activity log:', error);
  }
}

async function showActivityDetails(activityId) {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('id', activityId)
      .single();

    if (error) throw error;

    // عرض التفاصيل في مودال
    const detailsModal = document.getElementById('detailsModal');
    document.getElementById('modalActivityType').textContent = data.activity_type;
    document.getElementById('modalUser').textContent = data.user_id || 'غير معروف';
    document.getElementById('modalDate').textContent = formatDate(data.created_at);
    document.getElementById('modalIp').textContent = data.ip_address || 'غير معروف';
    document.getElementById('modalDetails').textContent = JSON.stringify(data.details, null, 2);
    
    detailsModal.style.display = 'block';

  } catch (error) {
    console.error('Error fetching activity details:', error);
  }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  loadActivityLog();
  
  // إغلاق المودال عند النقر على X
  document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('detailsModal').style.display = 'none';
  });
});