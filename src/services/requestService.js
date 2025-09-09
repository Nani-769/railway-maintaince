import { supabase } from '../lib/supabase';

export const requestService = {
  // Get all requests for current user
  async getUserRequests(userId, filters = {}) {
    try {
      let query = supabase?.from('maintenance_requests')?.select(`
          *,
          loco:locomotives(*),
          assigned_user:user_profiles!maintenance_requests_assigned_to_fkey(*),
          attachments:request_attachments(*)
        `)?.or(`user_id.eq.${userId},assigned_to.eq.${userId}`)?.order('created_at', { ascending: false })

      // Apply filters
      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('request_status', filters?.status)
      }
      if (filters?.type && filters?.type !== 'all') {
        query = query?.eq('request_type', filters?.type)
      }
      if (filters?.fromDate) {
        query = query?.gte('created_at', filters?.fromDate)
      }
      if (filters?.toDate) {
        query = query?.lte('created_at', filters?.toDate)
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

  // Get all requests (admin/supervisor view)
  async getAllRequests(filters = {}) {
    try {
      let query = supabase?.from('maintenance_requests')?.select(`
          *,
          user:user_profiles!maintenance_requests_user_id_fkey(*),
          loco:locomotives(*),
          assigned_user:user_profiles!maintenance_requests_assigned_to_fkey(*),
          attachments:request_attachments(*)
        `)?.order('created_at', { ascending: false })

      // Apply filters
      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('request_status', filters?.status)
      }
      if (filters?.type && filters?.type !== 'all') {
        query = query?.eq('request_type', filters?.type)
      }
      if (filters?.priority && filters?.priority !== 'all') {
        query = query?.eq('priority', filters?.priority)
      }
      if (filters?.location) {
        query = query?.ilike('location', `%${filters?.location}%`)
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

  // Create new request
  async createRequest(requestData, userId) {
    try {
      // Generate request ID
      const { data: requestIdData, error: idError } = await supabase?.rpc('generate_request_id')

      if (idError) {
        throw idError
      }

      const newRequest = {
        ...requestData,
        request_id: requestIdData,
        user_id: userId,
        is_draft: false,
        submitted_at: new Date()?.toISOString()
      }

      const { data, error } = await supabase?.from('maintenance_requests')?.insert([newRequest])?.select(`
          *,
          loco:locomotives(*),
          assigned_user:user_profiles!maintenance_requests_assigned_to_fkey(*)
        `)?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Save draft request
  async saveDraft(requestData, userId) {
    try {
      const draftData = {
        ...requestData,
        user_id: userId,
        is_draft: true,
        request_status: 'draft'
      }

      const { data, error } = await supabase?.from('maintenance_requests')?.insert([draftData])?.select()?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update request
  async updateRequest(requestId, updates) {
    try {
      const { data, error } = await supabase?.from('maintenance_requests')?.update(updates)?.eq('id', requestId)?.select(`
          *,
          user:user_profiles!maintenance_requests_user_id_fkey(*),
          loco:locomotives(*),
          assigned_user:user_profiles!maintenance_requests_assigned_to_fkey(*)
        `)?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete request
  async deleteRequest(requestId) {
    try {
      const { error } = await supabase?.from('maintenance_requests')?.delete()?.eq('id', requestId)

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Get request activities
  async getRequestActivities(requestId) {
    try {
      const { data, error } = await supabase?.from('request_activities')?.select(`
          *,
          user:user_profiles(full_name, email)
        `)?.eq('request_id', requestId)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get request comments
  async getRequestComments(requestId) {
    try {
      const { data, error } = await supabase?.from('request_comments')?.select(`
          *,
          user:user_profiles(full_name, email)
        `)?.eq('request_id', requestId)?.order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add comment
  async addComment(requestId, content, userId) {
    try {
      const { data, error } = await supabase?.from('request_comments')?.insert([{
          request_id: requestId,
          user_id: userId,
          content
        }])?.select(`
          *,
          user:user_profiles(full_name, email)
        `)?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Upload attachment
  async uploadAttachment(requestId, file, userId) {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${requestId}/${fileName}`

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('request-attachments')?.upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Save attachment record
      const { data, error } = await supabase?.from('request_attachments')?.insert([{
          request_id: requestId,
          file_name: file?.name,
          file_path: filePath,
          file_size: file?.size,
          file_type: file?.type,
          uploaded_by: userId
        }])?.select()?.single()

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete attachment
  async deleteAttachment(attachmentId) {
    try {
      // Get attachment info first
      const { data: attachment, error: fetchError } = await supabase?.from('request_attachments')?.select('file_path')?.eq('id', attachmentId)?.single()

      if (fetchError) {
        throw fetchError
      }

      // Delete from storage
      const { error: storageError } = await supabase?.storage?.from('request-attachments')?.remove([attachment?.file_path])

      if (storageError) {
        throw storageError
      }

      // Delete record
      const { error } = await supabase?.from('request_attachments')?.delete()?.eq('id', attachmentId)

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Get dashboard metrics
  async getDashboardMetrics(userId, isAdmin = false) {
    try {
      const baseFilter = isAdmin ? {} : { or: `user_id.eq.${userId},assigned_to.eq.${userId}` }
      
      const { data, error } = await supabase?.from('maintenance_requests')?.select('request_status, priority, created_at')?.match(baseFilter)

      if (error) {
        throw error
      }

      // Calculate metrics
      const metrics = {
        total: data?.length || 0,
        pending: data?.filter(r => r?.request_status === 'pending')?.length || 0,
        approved: data?.filter(r => r?.request_status === 'approved')?.length || 0,
        inProgress: data?.filter(r => r?.request_status === 'in_progress')?.length || 0,
        completed: data?.filter(r => r?.request_status === 'completed')?.length || 0,
        rejected: data?.filter(r => r?.request_status === 'rejected')?.length || 0,
        critical: data?.filter(r => r?.priority === 'critical')?.length || 0,
        high: data?.filter(r => r?.priority === 'high')?.length || 0
      }

      return { data: metrics, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}