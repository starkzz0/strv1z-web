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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: number | null
          duration_days: number
          id: string
          instructions: Json | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          duration_days: number
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          duration_days?: number
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      crisis_alerts: {
        Row: {
          ai_confidence: number | null
          content_id: string | null
          content_type: string | null
          created_at: string
          detected_keywords: string[] | null
          id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: Database["public"]["Enums"]["crisis_severity"]
          status: Database["public"]["Enums"]["intervention_status"] | null
          user_id: string
        }
        Insert: {
          ai_confidence?: number | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          detected_keywords?: string[] | null
          id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity: Database["public"]["Enums"]["crisis_severity"]
          status?: Database["public"]["Enums"]["intervention_status"] | null
          user_id: string
        }
        Update: {
          ai_confidence?: number | null
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          detected_keywords?: string[] | null
          id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: Database["public"]["Enums"]["crisis_severity"]
          status?: Database["public"]["Enums"]["intervention_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      daily_boosts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          type: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type?: string | null
        }
        Relationships: []
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          is_moderator: boolean | null
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_moderator?: boolean | null
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_moderator?: boolean | null
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          crisis_detected: boolean | null
          group_id: string
          id: string
          is_anonymous: boolean | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          crisis_detected?: boolean | null
          group_id: string
          id?: string
          is_anonymous?: boolean | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          crisis_detected?: boolean | null
          group_id?: string
          id?: string
          is_anonymous?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          ai_analysis: Json | null
          content: string
          created_at: string
          crisis_flags: string[] | null
          id: string
          is_private: boolean | null
          mood_at_time: number | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          content: string
          created_at?: string
          crisis_flags?: string[] | null
          id?: string
          is_private?: boolean | null
          mood_at_time?: number | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          content?: string
          created_at?: string
          crisis_flags?: string[] | null
          id?: string
          is_private?: boolean | null
          mood_at_time?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_relationships: {
        Row: {
          ended_at: string | null
          id: string
          matched_at: string
          mentee_id: string
          mentor_id: string
          notes: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          matched_at?: string
          mentee_id: string
          mentor_id: string
          notes?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          matched_at?: string
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          context: string | null
          coping_strategies: string[] | null
          created_at: string
          id: string
          intensity: Database["public"]["Enums"]["mood_intensity"]
          mood_score: number
          notes: string | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          context?: string | null
          coping_strategies?: string[] | null
          created_at?: string
          id?: string
          intensity: Database["public"]["Enums"]["mood_intensity"]
          mood_score: number
          notes?: string | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          context?: string | null
          coping_strategies?: string[] | null
          created_at?: string
          id?: string
          intensity?: Database["public"]["Enums"]["mood_intensity"]
          mood_score?: number
          notes?: string | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          likes_count: number | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          crisis_detected: boolean | null
          crisis_severity: Database["public"]["Enums"]["crisis_severity"] | null
          id: string
          is_anonymous: boolean | null
          likes_count: number | null
          mood_context: number | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          crisis_detected?: boolean | null
          crisis_severity?:
            | Database["public"]["Enums"]["crisis_severity"]
            | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          mood_context?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          crisis_detected?: boolean | null
          crisis_severity?:
            | Database["public"]["Enums"]["crisis_severity"]
            | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          mood_context?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          institution: string | null
          notification_preferences: Json | null
          privacy_level: string | null
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          institution?: string | null
          notification_preferences?: Json | null
          privacy_level?: string | null
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          institution?: string | null
          notification_preferences?: Json | null
          privacy_level?: string | null
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      support_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          member_count: number | null
          moderator_id: string | null
          name: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          member_count?: number | null
          moderator_id?: string | null
          name: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          member_count?: number | null
          moderator_id?: string | null
          name?: string
          topic?: string | null
        }
        Relationships: []
      }
      trusted_contacts: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_user_id: string | null
          created_at: string
          id: string
          is_emergency_contact: boolean | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_user_id?: string | null
          created_at?: string
          id?: string
          is_emergency_contact?: boolean | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_user_id?: string | null
          created_at?: string
          id?: string
          is_emergency_contact?: boolean | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed: boolean | null
          created_at: string
          earned_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean | null
          created_at?: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean | null
          created_at?: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          completion_data: Json | null
          created_at: string
          current_day: number | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["challenge_status"] | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          completion_data?: Json | null
          created_at?: string
          current_day?: number | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          completion_data?: Json | null
          created_at?: string
          current_day?: number | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["challenge_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      challenge_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "abandoned"
      crisis_severity: "low" | "medium" | "high" | "critical"
      intervention_status: "detected" | "notified" | "escalated" | "resolved"
      mood_intensity: "very_low" | "low" | "moderate" | "high" | "very_high"
      user_role: "student" | "therapist" | "admin" | "institution_admin"
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
    Enums: {
      challenge_status: [
        "not_started",
        "in_progress",
        "completed",
        "abandoned",
      ],
      crisis_severity: ["low", "medium", "high", "critical"],
      intervention_status: ["detected", "notified", "escalated", "resolved"],
      mood_intensity: ["very_low", "low", "moderate", "high", "very_high"],
      user_role: ["student", "therapist", "admin", "institution_admin"],
    },
  },
} as const
