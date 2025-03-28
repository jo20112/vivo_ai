import supabase from '../utils/supabase.js';
import { checkAdmin } from '../utils/helpers.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loadingBtn = document.getElementById('loginBtn');
  
  loadingBtn.disabled = true;
  loadingBtn.textContent = 'جاري تسجيل الدخول...';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const isAdmin = await checkAdmin(data.user.id);
    
    if (isAdmin) {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/user/chat.html';
    }
  } catch (error) {
    alert('حدث خطأ: ' + error.message);
  } finally {
    loadingBtn.disabled = false;
    loadingBtn.textContent = 'تسجيل الدخول';
  }
});