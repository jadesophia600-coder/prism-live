import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ayabomkpawjryvbyvqhr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YWJvbWtwYXdqcnl2Ynl2cWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNjc3NDAsImV4cCI6MjEwNTc0Mzc0MH0.eT9xWGqLk9RP2WREFVfiLxD0HQnrtlAZB5qIb9hxaL8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
