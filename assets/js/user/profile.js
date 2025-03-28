import supabase from '../../utils/supabase.js';
import { showAlert } from '../../utils/helpers.js';

async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    window.location.href = '/auth/login.html';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    document.getElementById('username').textContent = data.username || 'غير محدد';
    document.getElementById('email').textContent = user.email;
    document.getElementById('joinDate').textContent = new Date(user.created_at).toLocaleDateString('ar-EG');
    
    if (data.avatar_url) {
      document.getElementById('avatar').src = data.avatar_url;
    }

  } catch (error) {
    showAlert('حدث خطأ في تحميل الملف الشخصي: ' + error.message, 'error');
  }
}

async function updateProfile() {
  const username = document.getElementById('editUsername').value;
  const avatarFile = document.getElementById('editAvatar').files[0];
  
  try {
    let updates = { username };
    
    // إذا تم رفع صورة جديدة
    if (avatarFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`user_${user.id}/${avatarFile.name}`, avatarFile);
      
      if (uploadError) throw uploadError;
      
      updates.avatar_url = uploadData.path;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) throw error;

    showAlert('تم تحديث الملف الشخصي بنجاح', 'success');
    loadProfile(); // إعادة تحميل البيانات
    
  } catch (error) {
    showAlert('حدث خطأ في التحديث: ' + error.message, 'error');
  }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  
  // إضافة مستمع للأحداث
  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateProfile();
  });
});