import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://project-manager-kwlodarczyk.netlify.app/supabase-api";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "project_manager",
  },
});
