import supabase from '../../utils/supabase.js';
import { formatDate, showAlert } from '../../utils/helpers.js';

async function loadUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = data.map(user => `
      <tr>
        <td>${user.username}</td>
        <td>${user.email || 'غير متاح'}</td>
        <td>
          <select class="role-select" data-user-id="${user.user_id}">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>مستخدم</option>
            <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>مشرف</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>مسؤول</option>
          </select>
        </td>
        <td>${formatDate(user.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-user" data-user-id="${user.user_id}">
            حذف
          </button>
        </td>
      </tr>
    `).join('');

    // إضافة مستمعات الأحداث
    document.querySelectorAll('.role-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        await updateUserRole(e.target.dataset.userId, e.target.value);
      });
    });

    document.querySelectorAll('.delete-user').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
          await deleteUser(e.target.dataset.userId);
        }
      });
    });

  } catch (error) {
    showAlert('حدث خطأ في تحميل المستخدمين: ' + error.message, 'error');
  }
}

async function updateUserRole(userId, newRole) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) throw error;

    showAlert('تم تحديث صلاحيات المستخدم بنجاح', 'success');
  } catch (error) {
    showAlert('حدث خطأ في تحديث الصلاحيات: ' + error.message, 'error');
  }
}

async function deleteUser(userId) {
  try {
    // حذف المستخدم من المصادقة أولاً
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // ثم حذف بياناته من البروفايل
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileError) throw profileError;

    showAlert('تم حذف المستخدم بنجاح', 'success');
    loadUsers(); // إعادة تحميل القائمة
  } catch (error) {
    showAlert('حدث خطأ في حذف المستخدم: ' + error.message, 'error');
  }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});