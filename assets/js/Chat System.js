async function sendMessage(userId, message) {
    // إدراج الرسالة في قاعدة البيانات
    const { data, error } = await supabase
        .from('vivo_chats')
        .insert([{
            user_id: userId,
            message: message,
            sentiment_score: analyzeSentiment(message)
        }])
        .select()
        .single();

    if (error) {
        throw new Error('Failed to send message');
    }

    return data;
}