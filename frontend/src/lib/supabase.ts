import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          role: 'boyfriend' | 'girlfriend';
          display_name: string;
          partner_id: string | null;
          anniversary_date: string | null;
          relationship_start: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      moods: {
        Row: {
          id: string;
          user_id: string;
          mood_emoji: string;
          mood_label: string;
          mood_color: string;
          note: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['moods']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['moods']['Insert']>;
      };
      mood_reactions: {
        Row: {
          id: string;
          mood_id: string;
          user_id: string;
          reaction_emoji: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mood_reactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['mood_reactions']['Insert']>;
      };
      letters: {
        Row: {
          id: string;
          title: string;
          content: string;
          from_user_id: string;
          to_user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['letters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['letters']['Insert']>;
      };
      photos: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          uploaded_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
      };
      questions: {
        Row: {
          id: string;
          question_text: string;
          category: string;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          user_id: string;
          answer_text: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['answers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['answers']['Insert']>;
      };
    };
  };
}
