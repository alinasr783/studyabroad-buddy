export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          password: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          password: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          password?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          created_at: string | null
          education_level: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          nationality: string | null
          phone: string
          program_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          education_level?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          nationality?: string | null
          phone: string
          program_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          education_level?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          nationality?: string | null
          phone?: string
          program_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_name: string | null
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          excerpt_ar: string | null
          excerpt_en: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          title_ar: string
          title_en: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title_ar: string
          title_en: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title_ar?: string
          title_en?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          acceptance_rate: number | null
          capital: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          featured: boolean | null
          flag_emoji: string | null
          id: string
          image_url: string | null
          living_cost: number | null
          name_ar: string
          name_en: string
          population: number | null
          students_count: string | null
          universities_count: number | null
          updated_at: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          capital?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean | null
          flag_emoji?: string | null
          id?: string
          image_url?: string | null
          living_cost?: number | null
          name_ar: string
          name_en: string
          population?: number | null
          students_count?: string | null
          universities_count?: number | null
          updated_at?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          capital?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean | null
          flag_emoji?: string | null
          id?: string
          image_url?: string | null
          living_cost?: number | null
          name_ar?: string
          name_en?: string
          population?: number | null
          students_count?: string | null
          universities_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string | null
          degree_level: string | null
          description_ar: string | null
          description_en: string | null
          duration: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          language: string | null
          name_ar: string
          name_en: string
          requirements_ar: string | null
          requirements_en: string | null
          tuition_fee: string | null
          university_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          degree_level?: string | null
          description_ar?: string | null
          description_en?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          name_ar: string
          name_en: string
          requirements_ar?: string | null
          requirements_en?: string | null
          tuition_fee?: string | null
          university_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          degree_level?: string | null
          description_ar?: string | null
          description_en?: string | null
          duration?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          language?: string | null
          name_ar?: string
          name_en?: string
          requirements_ar?: string | null
          requirements_en?: string | null
          tuition_fee?: string | null
          university_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          about_description: string | null
          accent_color: string | null
          address: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          site_logo: string | null
          site_name: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          about_description?: string | null
          accent_color?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_logo?: string | null
          site_name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          about_description?: string | null
          accent_color?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_logo?: string | null
          site_name?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      universities: {
        Row: {
          country_id: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          name_ar: string
          name_en: string
          ranking: number | null
          students_count: string | null
          updated_at: string | null
          website: string | null
          website_url: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name_ar: string
          name_en: string
          ranking?: number | null
          students_count?: string | null
          updated_at?: string | null
          website?: string | null
          website_url?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          name_ar?: string
          name_en?: string
          ranking?: number | null
          students_count?: string | null
          updated_at?: string | null
          website?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "universities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
