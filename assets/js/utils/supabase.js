import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

const supabaseUrl = 'https://hbvhkmwfquxbwfmccemb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidmhrbXdmcXV4YndmbWNjZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODI2NTEsImV4cCI6MjA1ODc1ODY1MX0.-yOyr7mQ9Y0S5A1qfDXXPWeZ8ARxqkc6U6UWYeG9uz0';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;