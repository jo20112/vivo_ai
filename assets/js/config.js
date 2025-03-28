// تكوين Supabase
const supabaseConfig = {
    url: 'https://hbvhkmwfquxbwfmccemb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidmhrbXdmcXV4YndmbWNjZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODI2NTEsImV4cCI6MjA1ODc1ODY1MX0.-yOyr7mQ9Y0S5A1qfDXXPWeZ8ARxqkc6U6UWYeG9uz0
',
    tables: {
        chats: 'vivo_ai_chats',
        feedback: 'vivo_ai_feedback',
        users: 'vivo_ai_users'
    }
};

// تهيئة العميل
const supabase = supabase.createClient(
    supabaseConfig.url, 
    supabaseConfig.key
);

// إعدادات التطبيق
const appConfig = {
    name: 'VIVO AI',
    version: '1.0.0',
    features: {
        voice: true,
        sentimentAnalysis: true,
        darkMode: true
    }
};