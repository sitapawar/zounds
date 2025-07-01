import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmqhqzgpjmydhhaaetzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcWhxemdwam15ZGhoYWFldHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODUxMjksImV4cCI6MjA2Njk2MTEyOX0.OOsM4jo16QqR08qtt6W0yhNRLMsTJ-1ngscY2ju--mU';
export const supabase = createClient(supabaseUrl, supabaseKey);

