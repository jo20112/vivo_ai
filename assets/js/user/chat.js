import supabase from '../../utils/supabase.js';
import { showAlert } from '../../utils/helpers.js';

// متغيرات عامة
let currentChatId = null;

// تهيئة المحادثة
async function initChat() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // عرض رسائل المحادثة الحالية
  if (currentChatId) {
    await loadMessages(currentChatId);
    return;
  }

  // أو إنشاء محادثة جديدة
  const { data, error } = await supabase
    .from('vivo_chats')
    .insert([{ user_id: user.id }])
    .select()
    .single();

  if (error) {
    showAlert('حدث خطأ في بدء المحادثة: ' + error.message, 'error');
    return;
  }

  currentChatId = data.id;
}

// إرسال رسالة
async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  
  if (!message || !currentChatId) return;

  const { data: { user } } = await supabase.auth.getUser();

  try {
    // إرسال الرسالة
    const { data, error } = await supabase
      .from('vivo_messages')
      .insert([{
        chat_id: currentChatId,
        user_id: user.id,
        content: message,
        is_from_ai: false
      }])
      .select();

    if (error) throw error;

    // عرض الرسالة فوراً
    displayMessage(data[0]);
    messageInput.value = '';

    // محاكاة رد الذكاء الاصطناعي
    simulateAIResponse();

  } catch (error) {
    showAlert('حدث خطأ في إرسال الرسالة: ' + error.message, 'error');
  }
}

// محاكاة رد الذكاء الاصطناعي (ستقوم أنت بالرد يدوياً من لوحة التحكم)
function simulateAIResponse() {
  const chatContainer = document.getElementById('chatContainer');
  
  // عرض مؤشر "جاري الكتابة"
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message typing';
  typingIndicator.textContent = 'جاري الكتابة...';
  chatContainer.appendChild(typingIndicator);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // الاستماع للردود الجديدة في الوقت الحقيقي
  const channel = supabase
    .channel('ai-responses')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'vivo_messages',
      filter: `chat_id=eq.${currentChatId}`
    }, payload => {
      if (payload.new.is_from_ai) {
        // إزالة مؤشر الكتابة
        document.querySelector('.typing')?.remove();
        // عرض رد الذكاء الاصطناعي
        displayMessage(payload.new);
      }
    })
    .subscribe();
}

// عرض الرسالة في الشات
function displayMessage(message) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  
  messageDiv.className = `message ${message.is_from_ai ? 'ai-message' : 'user-message'}`;
  messageDiv.textContent = message.content;
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// تحميل الرسائل السابقة
async function loadMessages(chatId) {
  try {
    const { data, error } = await supabase
      .from('vivo_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';

    data.forEach(message => {
      displayMessage(message);
    });

  } catch (error) {
    showAlert('حدث خطأ في تحميل المحادثة: ' + error.message, 'error');
  }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', async () => {
  await initChat();
  
  // إرسال الرسالة عند الضغط على زر الإرسال
  document.getElementById('sendBtn').addEventListener('click', sendMessage);
  
  // أو عند الضغط على إنتر
  document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});