async function submitFeedback(chatId, rating, comments = null) {
    const { error } = await supabase
        .from('vivo_feedback')
        .insert([{
            chat_id: chatId,
            rating: rating,
            comments: comments
        }]);

    if (error) {
        throw new Error('Failed to submit feedback');
    }

    // تحديث معدل الرضا في المحادثة
    await supabase
        .from('vivo_chats')
        .update({ has_feedback: true })
        .eq('id', chatId);
}