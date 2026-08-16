import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://prhlxpngdbsgqoudaquc.supabase.co";
const SUPABASE_KEY = "sb_publishable_01bXThSRug86YH7RhJitJg_rQ0ja-JA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
