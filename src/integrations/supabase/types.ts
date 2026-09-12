export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cars: {
        Row: {
          accident_history: string | null
          acquisition_date: string | null
          acquisition_price_inr: number | null
          condition_notes: string | null
          created_at: string
          description: string | null
          features: string[]
          fuel: string
          id: string
          image_url: string
          images: string[]
          insurance_status: string | null
          inventory_status: string
          is_active: boolean
          km: number
          listed_at: string | null
          location: string
          make: string | null
          manufacturing_year: number | null
          model: string | null
          name: string
          owner_count: number | null
          price_inr: number
          registration_state: string | null
          registration_year: number | null
          rto: string
          seller_type: string | null
          service_history: string | null
          slug: string
          sold_at: string | null
          sold_price_inr: number | null
          transmission: string
          updated_at: string
          variant: string | null
          year: number
        }
        Insert: {
          accident_history?: string | null
          acquisition_date?: string | null
          acquisition_price_inr?: number | null
          condition_notes?: string | null
          created_at?: string
          description?: string | null
          features?: string[]
          fuel: string
          id?: string
          image_url: string
          images?: string[]
          insurance_status?: string | null
          inventory_status?: string
          is_active?: boolean
          km: number
          listed_at?: string | null
          location?: string
          make?: string | null
          manufacturing_year?: number | null
          model?: string | null
          name: string
          owner_count?: number | null
          price_inr: number
          registration_state?: string | null
          registration_year?: number | null
          rto?: string
          seller_type?: string | null
          service_history?: string | null
          slug: string
          sold_at?: string | null
          sold_price_inr?: number | null
          transmission: string
          updated_at?: string
          variant?: string | null
          year: number
        }
        Update: {
          accident_history?: string | null
          acquisition_date?: string | null
          acquisition_price_inr?: number | null
          condition_notes?: string | null
          created_at?: string
          description?: string | null
          features?: string[]
          fuel?: string
          id?: string
          image_url?: string
          images?: string[]
          insurance_status?: string | null
          inventory_status?: string
          is_active?: boolean
          km?: number
          listed_at?: string | null
          location?: string
          make?: string | null
          manufacturing_year?: number | null
          model?: string | null
          name?: string
          owner_count?: number | null
          price_inr?: number
          registration_state?: string | null
          registration_year?: number | null
          rto?: string
          seller_type?: string | null
          service_history?: string | null
          slug?: string
          sold_at?: string | null
          sold_price_inr?: number | null
          transmission?: string
          updated_at?: string
          variant?: string | null
          year?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      external_market_listings: {
        Row: {
          accident_history: string | null
          asking_price_inr: number
          condition_notes: string | null
          created_at: string
          fuel: string
          id: string
          insurance_status: string | null
          km: number
          listed_at: string | null
          listing_url: string | null
          location: string
          make: string
          manufacturing_year: number | null
          model: string
          observed_at: string
          owner_count: number | null
          raw_data: Json | null
          registration_state: string | null
          registration_year: number | null
          seller_type: string | null
          service_history: string | null
          source: string
          source_listing_id: string | null
          transmission: string | null
          updated_at: string
          variant: string | null
        }
        Insert: {
          accident_history?: string | null
          asking_price_inr: number
          condition_notes?: string | null
          created_at?: string
          fuel: string
          id?: string
          insurance_status?: string | null
          km: number
          listed_at?: string | null
          listing_url?: string | null
          location: string
          make: string
          manufacturing_year?: number | null
          model: string
          observed_at?: string
          owner_count?: number | null
          raw_data?: Json | null
          registration_state?: string | null
          registration_year?: number | null
          seller_type?: string | null
          service_history?: string | null
          source: string
          source_listing_id?: string | null
          transmission?: string | null
          updated_at?: string
          variant?: string | null
        }
        Update: {
          accident_history?: string | null
          asking_price_inr?: number
          condition_notes?: string | null
          created_at?: string
          fuel?: string
          id?: string
          insurance_status?: string | null
          km?: number
          listed_at?: string | null
          listing_url?: string | null
          location?: string
          make?: string
          manufacturing_year?: number | null
          model?: string
          observed_at?: string
          owner_count?: number | null
          raw_data?: Json | null
          registration_state?: string | null
          registration_year?: number | null
          seller_type?: string | null
          service_history?: string | null
          source?: string
          source_listing_id?: string | null
          transmission?: string | null
          updated_at?: string
          variant?: string | null
        }
        Relationships: []
      }
      garage_queries: {
        Row: {
          created_at: string
          error_code: string | null
          external_match_count: number
          id: string
          internal_match_count: number
          latency_ms: number | null
          parsed_vehicle: Json | null
          question: string
          session_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          external_match_count?: number
          id?: string
          internal_match_count?: number
          latency_ms?: number | null
          parsed_vehicle?: Json | null
          question: string
          session_id?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string | null
          external_match_count?: number
          id?: string
          internal_match_count?: number
          latency_ms?: number | null
          parsed_vehicle?: Json | null
          question?: string
          session_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sell_leads: {
        Row: {
          car_model: string
          city: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          km: number | null
          phone: string
          year: number | null
        }
        Insert: {
          car_model: string
          city: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          km?: number | null
          phone: string
          year?: number | null
        }
        Update: {
          car_model?: string
          city?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          km?: number | null
          phone?: string
          year?: number | null
        }
        Relationships: []
      }
      test_drive_bookings: {
        Row: {
          car_id: string | null
          car_name: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          message: string | null
          phone: string
          preferred_date: string | null
        }
        Insert: {
          car_id?: string | null
          car_name?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          message?: string | null
          phone: string
          preferred_date?: string | null
        }
        Update: {
          car_id?: string | null
          car_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_drive_bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
