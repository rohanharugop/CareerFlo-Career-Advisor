export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          age: number | null
          gender: string | null
          education_status: string | null
          stream: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          age?: number | null
          gender?: string | null
          education_status?: string | null
          stream?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          age?: number | null
          gender?: string | null
          education_status?: string | null
          stream?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      college: {
        Row: {
          id: string
          email: string
          name: string
          course_name: string
          fees: number
          expected_kcet_cutoff: number
          company_names: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          course_name: string
          fees: number
          expected_kcet_cutoff: number
          company_names?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          course_name?: string
          fees?: number
          expected_kcet_cutoff?: number
          company_names?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}