// types/database.ts - Generated Supabase Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string
          user_id: string
          prompt: string
          story_type: 'realistic' | 'fantasy'
          art_style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
          page_count: 8 | 12 | 16
          image_urls: string[]
          text_content: string[]
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          story_type: 'realistic' | 'fantasy'
          art_style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
          page_count: 8 | 12 | 16
          image_urls?: string[]
          text_content?: string[]
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          story_type?: 'realistic' | 'fantasy'
          art_style?: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
          page_count?: 8 | 12 | 16
          image_urls?: string[]
          text_content?: string[]
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: {
          user_uuid: string
        }
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}