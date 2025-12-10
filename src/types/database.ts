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
            profiles: {
                Row: {
                    id: string
                    role: 'company' | 'individual'
                    company_name: string | null
                    carbon_score: number
                    created_at: string
                }
                Insert: {
                    id: string
                    role: 'company' | 'individual'
                    company_name?: string | null
                    carbon_score?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'company' | 'individual'
                    company_name?: string | null
                    carbon_score?: number
                    created_at?: string
                }
            }
            listings: {
                Row: {
                    id: string
                    seller_id: string
                    title: string
                    description: string | null
                    price: number
                    quantity: number
                    dimensions: string | null
                    status: 'active' | 'sold'
                    location_lat: number
                    location_lng: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    seller_id: string
                    title: string
                    description?: string | null
                    price: number
                    quantity: number
                    dimensions?: string | null
                    status?: 'active' | 'sold'
                    location_lat: number
                    location_lng: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    seller_id?: string
                    title?: string
                    description?: string | null
                    price?: number
                    quantity?: number
                    dimensions?: string | null
                    status?: 'active' | 'sold'
                    location_lat?: number
                    location_lng?: number
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    buyer_id: string
                    listing_id: string
                    pickup_code: string
                    status: 'reserved' | 'picked_up'
                    created_at: string
                }
                Insert: {
                    id?: string
                    buyer_id: string
                    listing_id: string
                    pickup_code: string
                    status?: 'reserved' | 'picked_up'
                    created_at?: string
                }
                Update: {
                    id?: string
                    buyer_id?: string
                    listing_id?: string
                    pickup_code?: string
                    status?: 'reserved' | 'picked_up'
                    created_at?: string
                }
            }
        }
    }
}
