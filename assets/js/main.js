// إرسال التقييم إلى Supabase
async function sendRating(messageId, rating) {
    const { error } = await supabase
        .from('vivo_ai_feedback')
        .insert([{
            message_id: messageId,
            rating: rating,
            created_at: new Date()
        }]);
    
    if (!error) {
        showToast('شكرًا لتقييمك!', 'success');
    }
}