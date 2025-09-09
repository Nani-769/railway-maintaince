import { supabase } from '../lib/supabase';

export const locomotiveService = {
  // Get all locomotives
  async getAllLocomotives(filters = {}) {
    try {
      let query = supabase?.from('locomotives')?.select('*')?.eq('is_active', true)?.order('loco_number', { ascending: true })

      // Apply filters
      if (filters?.type && filters?.type !== 'all') {
        query = query?.eq('loco_type', filters?.type)
      }
      if (filters?.location) {
        query = query?.ilike('current_location', `%${filters?.location}%`)
      }
      if (filters?.search) {
        query = query?.or(`loco_number.ilike.%${filters?.search}%,model.ilike.%${filters?.search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get locomotive by ID
  async getLocomotiveById(locomotiveId) {
    try {
      const { data, error } = await supabase?.from('locomotives')?.select('*')?.eq('id', locomotiveId)?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Create new locomotive (admin/supervisor only)
  async createLocomotive(locomotiveData) {
    try {
      const { data, error } = await supabase?.from('locomotives')?.insert([locomotiveData])?.select()?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update locomotive
  async updateLocomotive(locomotiveId, updates) {
    try {
      const { data, error } = await supabase?.from('locomotives')?.update(updates)?.eq('id', locomotiveId)?.select()?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete locomotive (soft delete)
  async deleteLocomotive(locomotiveId) {
    try {
      const { data, error } = await supabase?.from('locomotives')?.update({ is_active: false })?.eq('id', locomotiveId)?.select()?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get locomotive maintenance history
  async getLocomotiveHistory(locomotiveId) {
    try {
      const { data, error } = await supabase?.from('maintenance_requests')?.select(`
          *,
          user:user_profiles!maintenance_requests_user_id_fkey(full_name, email),
          assigned_user:user_profiles!maintenance_requests_assigned_to_fkey(full_name, email)
        `)?.eq('loco_id', locomotiveId)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}