import supabase from '../utils/supabase.js';
import { showAlert } from '../utils/helpers.js';

document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const loadingBtn = document.getElementById('resetBtn');
  
  loadingBtn.disabled = true;
  loadingBtn.textContent = 'جاري الإرسال...';

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://yourdomain.com/auth/update-password.html'
    });

    if (error) throw error;

    showAlert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
  } catch (error) {
    showAlert('حدث خطأ: ' + error.message, 'error');
  } finally {
    loadingBtn.disabled = false;
    loadingBtn.textContent = 'إرسال الرابط';
  }
});