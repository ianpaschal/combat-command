export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      friendships: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_0_id: string | null
          user_1_id: string | null
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_0_id?: string | null
          user_1_id?: string | null
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_0_id?: string | null
          user_1_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_user_0_id_fkey1"
            columns: ["user_0_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_0_id_fkey1"
            columns: ["user_0_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_1_id_fkey1"
            columns: ["user_1_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_1_id_fkey1"
            columns: ["user_1_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      game_system_configs: {
        Row: {
          created_at: string | null
          data: Json
          game_system_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          game_system_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          game_system_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_system_configs_game_system_id_fkey"
            columns: ["game_system_id"]
            isOneToOne: false
            referencedRelation: "game_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      game_systems: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      match_results: {
        Row: {
          created_at: string | null
          details: Json | null
          game_system_config_id: string
          id: string
          player_0_id: string | null
          player_1_id: string | null
          tournament_pairing_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          game_system_config_id: string
          id?: string
          player_0_id?: string | null
          player_1_id?: string | null
          tournament_pairing_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          game_system_config_id?: string
          id?: string
          player_0_id?: string | null
          player_1_id?: string | null
          tournament_pairing_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_results_game_system_config_fkey"
            columns: ["game_system_config_id"]
            isOneToOne: false
            referencedRelation: "game_system_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_player_0_id_fkey"
            columns: ["player_0_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_player_0_id_fkey"
            columns: ["player_0_id"]
            isOneToOne: false
            referencedRelation: "players_filterable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_player_1_id_fkey"
            columns: ["player_1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_player_1_id_fkey"
            columns: ["player_1_id"]
            isOneToOne: false
            referencedRelation: "players_filterable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_tournament_pairing_id_fkey"
            columns: ["tournament_pairing_id"]
            isOneToOne: false
            referencedRelation: "tournament_pairings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_tournament_pairing_id_fkey"
            columns: ["tournament_pairing_id"]
            isOneToOne: false
            referencedRelation: "tournament_pairings_filterable"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string | null
          id: string
          placeholder_name: string | null
          tournament_competitor_id: string | null
          updated_at: string | null
          user_profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          placeholder_name?: string | null
          tournament_competitor_id?: string | null
          updated_at?: string | null
          user_profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          placeholder_name?: string | null
          tournament_competitor_id?: string | null
          updated_at?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_tournament_competitor_id_fkey"
            columns: ["tournament_competitor_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_tournament_competitor_id_fkey"
            columns: ["tournament_competitor_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors_filterable"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_competitors: {
        Row: {
          country_code: string | null
          created_at: string | null
          id: string
          team_name: string | null
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          team_name?: string | null
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          team_name?: string | null
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_competitors_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_pairings: {
        Row: {
          created_at: string | null
          id: string
          round_index: number
          table_index: number
          tournament_competitor_0_id: string
          tournament_competitor_1_id: string
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          round_index?: number
          table_index?: number
          tournament_competitor_0_id: string
          tournament_competitor_1_id: string
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          round_index?: number
          table_index?: number
          tournament_competitor_0_id?: string
          tournament_competitor_1_id?: string
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_pairings_tournament_competitor_0_id_fkey"
            columns: ["tournament_competitor_0_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_pairings_tournament_competitor_0_id_fkey"
            columns: ["tournament_competitor_0_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors_filterable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_pairings_tournament_competitor_1_id_fkey"
            columns: ["tournament_competitor_1_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_pairings_tournament_competitor_1_id_fkey"
            columns: ["tournament_competitor_1_id"]
            isOneToOne: false
            referencedRelation: "tournament_competitors_filterable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_pairings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_timers: {
        Row: {
          duration: number
          id: string
          paused_at: string | null
          round_index: number
          started_at: string
          stoppage_time: number
          tournament_id: string
        }
        Insert: {
          duration: number
          id?: string
          paused_at?: string | null
          round_index: number
          started_at: string
          stoppage_time?: number
          tournament_id: string
        }
        Update: {
          duration?: number
          id?: string
          paused_at?: string | null
          round_index?: number
          started_at?: string
          stoppage_time?: number
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_timers_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          competitor_count: number
          competitor_groups: Json
          competitor_size: number
          created_at: string | null
          creator_id: string
          current_round: number | null
          description: string | null
          ends_at: string
          game_system_config_id: string
          game_system_id: string
          id: string
          mapbox_place_id: string | null
          pairing_method: Database["public"]["Enums"]["pairing_method"]
          ranking_factors: string[]
          registrations_close_at: string
          registrations_open: boolean
          require_real_names: boolean
          round_count: number
          rules_pack_url: string | null
          starts_at: string
          status: Database["public"]["Enums"]["tournament_status"]
          title: string
          updated_at: string | null
          use_national_teams: boolean
        }
        Insert: {
          banner_url?: string | null
          competitor_count: number
          competitor_groups: Json
          competitor_size: number
          created_at?: string | null
          creator_id: string
          current_round?: number | null
          description?: string | null
          ends_at: string
          game_system_config_id: string
          game_system_id: string
          id?: string
          mapbox_place_id?: string | null
          pairing_method: Database["public"]["Enums"]["pairing_method"]
          ranking_factors: string[]
          registrations_close_at: string
          registrations_open: boolean
          require_real_names: boolean
          round_count: number
          rules_pack_url?: string | null
          starts_at: string
          status: Database["public"]["Enums"]["tournament_status"]
          title: string
          updated_at?: string | null
          use_national_teams: boolean
        }
        Update: {
          banner_url?: string | null
          competitor_count?: number
          competitor_groups?: Json
          competitor_size?: number
          created_at?: string | null
          creator_id?: string
          current_round?: number | null
          description?: string | null
          ends_at?: string
          game_system_config_id?: string
          game_system_id?: string
          id?: string
          mapbox_place_id?: string | null
          pairing_method?: Database["public"]["Enums"]["pairing_method"]
          ranking_factors?: string[]
          registrations_close_at?: string
          registrations_open?: boolean
          require_real_names?: boolean
          round_count?: number
          rules_pack_url?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          title?: string
          updated_at?: string | null
          use_national_teams?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_creator_id_fkey1"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_creator_id_fkey1"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_game_system_config_id_fkey"
            columns: ["game_system_config_id"]
            isOneToOne: false
            referencedRelation: "game_system_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_game_system_id_fkey"
            columns: ["game_system_id"]
            isOneToOne: false
            referencedRelation: "game_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string | null
          family_name: string
          given_name: string
          id: string
          name_visibility: Database["public"]["Enums"]["user_data_visibility"]
          test_user: boolean
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string | null
          family_name: string
          given_name: string
          id?: string
          name_visibility?: Database["public"]["Enums"]["user_data_visibility"]
          test_user?: boolean
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string | null
          family_name?: string
          given_name?: string
          id?: string
          name_visibility?: Database["public"]["Enums"]["user_data_visibility"]
          test_user?: boolean
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      match_results_filterable: {
        Row: {
          created_at: string | null
          details: Json | null
          game_system_config: Json | null
          game_system_id: string | null
          id: string | null
          player_0: Json | null
          player_1: Json | null
          tournament_competitor_ids: string[] | null
          tournament_id: string | null
          tournament_pairing: Json | null
          updated_at: string | null
          user_profile_ids: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "game_system_configs_game_system_id_fkey"
            columns: ["game_system_id"]
            isOneToOne: false
            referencedRelation: "game_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_pairings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players_filterable: {
        Row: {
          created_at: string | null
          id: string | null
          tournament_competitor: Json | null
          updated_at: string | null
          user_profile: Json | null
        }
        Relationships: []
      }
      tournament_competitors_filterable: {
        Row: {
          country_code: string | null
          created_at: string | null
          id: string | null
          players: Json | null
          team_name: string | null
          tournament_id: string | null
          updated_at: string | null
          user_profile_ids: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_competitors_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_pairings_filterable: {
        Row: {
          created_at: string | null
          id: string | null
          round_index: number | null
          table_index: number | null
          tournament_competitor_0: Json | null
          tournament_competitor_1: Json | null
          updated_at: string | null
          user_profile_ids: string[] | null
        }
        Relationships: []
      }
      user_profiles_secure: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string | null
          family_name: string | null
          given_name: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string | null
          family_name?: never
          given_name?: never
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string | null
          family_name?: never
          given_name?: never
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_basic_table_setup: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      get_tournaments_by_user_profile_id: {
        Args: {
          id: string
        }
        Returns: {
          banner_url: string | null
          competitor_count: number
          competitor_groups: Json
          competitor_size: number
          created_at: string | null
          creator_id: string
          current_round: number | null
          description: string | null
          ends_at: string
          game_system_config_id: string
          game_system_id: string
          id: string
          mapbox_place_id: string | null
          pairing_method: Database["public"]["Enums"]["pairing_method"]
          ranking_factors: string[]
          registrations_close_at: string
          registrations_open: boolean
          require_real_names: boolean
          round_count: number
          rules_pack_url: string | null
          starts_at: string
          status: Database["public"]["Enums"]["tournament_status"]
          title: string
          updated_at: string | null
          use_national_teams: boolean
        }[]
      }
    }
    Enums: {
      fow_v4_match_outcome_type:
        | "objective_captured"
        | "attack_repelled"
        | "time_out"
        | "force_broken"
      fow_v4_player_stance: "attack" | "maneuver" | "defend"
      pairing_method: "random" | "round_robin" | "elimination" | "swiss"
      tournament_status: "draft" | "published" | "active" | "archived"
      user_data_visibility:
        | "hidden"
        | "friends"
        | "clubs"
        | "tournaments"
        | "public"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
