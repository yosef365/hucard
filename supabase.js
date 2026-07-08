const SUPABASE_URL = "https://oypgqdlypqpvbdhvvgaa.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_NEW_ANON_KEY";

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);