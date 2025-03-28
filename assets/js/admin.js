// تحليل مشاعر الرسائل
function analyzeSentiment(text) {
    const positiveWords = ['رائع', 'شكرا', 'ممتاز', 'حلو', 'جميل'];
    const negativeWords = ['سيء', 'غبي', 'لا يعمل', 'كراهية'];
    
    let score = 0;
    const words = text.split(' ');
    
    words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
    });
    
    return {
        score: score,
        mood: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
    };
}
// في admin.js
async function updateStats() {
    // إحصائيات اليوم
    const { count: todayCount } = await supabase
        .from('vivo_ai_chats')
        .select('*', { count: 'exact' })
        .gte('created_at', new Date().toISOString().split('T')[0]);
    
    // معدل الرضا
    const { data: feedback } = await supabase
        .from('vivo_ai_feedback')
        .select('rating');
    
    const positiveRatings = feedback.filter(f => f.rating === 'good').length;
    const satisfactionRate = (positiveRatings / feedback.length) * 100;
    
    // تحديث الواجهة
    document.getElementById('todayChats').textContent = todayCount;
    document.getElementById('satisfactionRate').textContent = 
        `${satisfactionRate.toFixed(1)}%`;
}

// تحديث كل 30 ثانية
setInterval(updateStats, 30000);