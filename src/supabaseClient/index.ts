import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'


const supabase = createClient(process.env.PROJECT_SUPABASE_URL!, process.env.PROJECT_SUPABASE_ANON_KEY!);

export default supabase