import supabase from '../utils/supabase.js';
import { showAlert } from '../utils/helpers.js';

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const loadingBtn = document.getElementById('signupBtn');
  
  loadingBtn.disabled = true;
  loadingBtn.textContent = 'جاري إنشاء الحساب...';

  try {
    // تسجيل المستخدم الجديد
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (authError) throw authError;

    // إضافة بيانات المستخدم الإضافية
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authData.user.id,
        username,
        role: 'user'
      }]);

    if (profileError) throw profileError;

    showAlert('تم إنشاء الحساب بنجاح! يرجى تفعيل البريد الإلكتروني', 'success');
    setTimeout(() => {
      window.location.href = '/auth/login.html';
    }, 3000);
  } catch (error) {
    showAlert('حدث خطأ: ' + error.message, 'error');
  } finally {
    loadingBtn.disabled = false;
    loadingBtn.textContent = 'إنشاء حساب';
  }
});