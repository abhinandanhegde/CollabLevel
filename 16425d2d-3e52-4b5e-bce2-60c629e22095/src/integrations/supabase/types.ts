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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      collaborations: {
        Row: {
          compensation: string | null
          completed_at: string | null
          created_at: string
          deliverables: string[]
          end_date: string | null
          id: string
          partner_confirmed: boolean
          partner_id: string
          proposer_confirmed: boolean
          proposer_id: string
          purpose: string
          start_date: string | null
          status: Database["public"]["Enums"]["collab_status"]
          title: string
          updated_at: string
        }
        Insert: {
          compensation?: string | null
          completed_at?: string | null
          created_at?: string
          deliverables?: string[]
          end_date?: string | null
          id?: string
          partner_confirmed?: boolean
          partner_id: string
          proposer_confirmed?: boolean
          proposer_id: string
          purpose?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["collab_status"]
          title: string
          updated_at?: string
        }
        Update: {
          compensation?: string | null
          completed_at?: string | null
          created_at?: string
          deliverables?: string[]
          end_date?: string | null
          id?: string
          partner_confirmed?: boolean
          partner_id?: string
          proposer_confirmed?: boolean
          proposer_id?: string
          purpose?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["collab_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_proposer_id_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          note: string | null
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          note?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          note?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          collaboration_id: string
          created_at: string
          done: boolean
          due_date: string | null
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          done?: boolean
          due_date?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          bio: string
          created_at: string
          credibility_score: number
          handle: string
          headline: string
          id: string
          industry: string
          interests: string[]
          links: Json
          location: string
          name: string
          portfolio: Json
          skills: string[]
          type_fields: Json
          updated_at: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type"]
          bio?: string
          created_at?: string
          credibility_score?: number
          handle: string
          headline?: string
          id: string
          industry?: string
          interests?: string[]
          links?: Json
          location?: string
          name: string
          portfolio?: Json
          skills?: string[]
          type_fields?: Json
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          bio?: string
          created_at?: string
          credibility_score?: number
          handle?: string
          headline?: string
          id?: string
          industry?: string
          interests?: string[]
          links?: Json
          location?: string
          name?: string
          portfolio?: Json
          skills?: string[]
          type_fields?: Json
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          collaboration_id: string
          created_at: string
          id: string
          rating: number
          subject_id: string
          text: string
        }
        Insert: {
          author_id: string
          collaboration_id: string
          created_at?: string
          id?: string
          rating: number
          subject_id: string
          text?: string
        }
        Update: {
          author_id?: string
          collaboration_id?: string
          created_at?: string
          id?: string
          rating?: number
          subject_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_credibility: {
        Args: { _profile_id: string }
        Returns: undefined
      }
    }
    Enums: {
      account_type:
        | "brand"
        | "startup"
        | "creator"
        | "artist"
        | "agency"
        | "marketer"
        | "independent"
        | "community"
      collab_status:
        | "proposed"
        | "active"
        | "completed"
        | "declined"
        | "cancelled"
      connection_status: "pending" | "accepted" | "declined"
      verification_status: "unverified" | "pending" | "verified"
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
      account_type: [
        "brand",
        "startup",
        "creator",
        "artist",
        "agency",
        "marketer",
        "independent",
        "community",
      ],
      collab_status: [
        "proposed",
        "active",
        "completed",
        "declined",
        "cancelled",
      ],
      connection_status: ["pending", "accepted", "declined"],
      verification_status: ["unverified", "pending", "verified"],
    },
  },
} as const
