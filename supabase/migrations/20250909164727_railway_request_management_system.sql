-- Location: supabase/migrations/20250909164727_railway_request_management_system.sql
-- Schema Analysis: Only "Emp" table exists (unrelated to request management)
-- Integration Type: NEW_MODULE - Complete request management system
-- Dependencies: Fresh project with complete schema creation

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'supervisor', 'technician', 'user');
CREATE TYPE public.request_type AS ENUM ('preventive_maintenance', 'corrective_maintenance', 'routine_inspection', 'emergency_repair', 'part_replacement', 'system_upgrade');
CREATE TYPE public.request_status AS ENUM ('draft', 'pending', 'approved', 'in_progress', 'on_hold', 'completed', 'rejected', 'cancelled');
CREATE TYPE public.priority_level AS ENUM ('low', 'normal', 'high', 'critical', 'emergency');
CREATE TYPE public.locomotive_type AS ENUM ('electric', 'diesel', 'steam', 'hybrid');
CREATE TYPE public.activity_type AS ENUM ('request_created', 'status_updated', 'assigned', 'comment_added', 'attachment_added', 'completed', 'approved', 'rejected');

-- 2. Core Tables

-- User profiles table (CRITICAL: intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    role public.user_role DEFAULT 'user'::public.user_role,
    department TEXT,
    location TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Locomotives table
CREATE TABLE public.locomotives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loco_number TEXT NOT NULL UNIQUE,
    loco_type public.locomotive_type NOT NULL,
    model TEXT NOT NULL,
    manufacturer TEXT,
    year_manufactured INTEGER,
    current_location TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance requests table
CREATE TABLE public.maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL UNIQUE, -- Format: REQ-YYYY-NNNNNN
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    loco_id UUID REFERENCES public.locomotives(id) ON DELETE SET NULL,
    request_type public.request_type NOT NULL,
    priority public.priority_level DEFAULT 'normal'::public.priority_level,
    request_status public.request_status DEFAULT 'draft'::public.request_status,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    requested_completion_date DATE,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    cost_estimate DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    supervisor_notes TEXT,
    completion_notes TEXT,
    is_draft BOOLEAN DEFAULT true,
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Request attachments table
CREATE TABLE public.request_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Request activity log table
CREATE TABLE public.request_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    activity_type public.activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Request comments table
CREATE TABLE public.request_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_employee_id ON public.user_profiles(employee_id);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location);
CREATE INDEX idx_locomotives_loco_number ON public.locomotives(loco_number);
CREATE INDEX idx_locomotives_location ON public.locomotives(current_location);
CREATE INDEX idx_maintenance_requests_user_id ON public.maintenance_requests(user_id);
CREATE INDEX idx_maintenance_requests_assigned_to ON public.maintenance_requests(assigned_to);
CREATE INDEX idx_maintenance_requests_status ON public.maintenance_requests(request_status);
CREATE INDEX idx_maintenance_requests_type ON public.maintenance_requests(request_type);
CREATE INDEX idx_maintenance_requests_priority ON public.maintenance_requests(priority);
CREATE INDEX idx_maintenance_requests_location ON public.maintenance_requests(location);
CREATE INDEX idx_maintenance_requests_created_at ON public.maintenance_requests(created_at);
CREATE INDEX idx_request_attachments_request_id ON public.request_attachments(request_id);
CREATE INDEX idx_request_activities_request_id ON public.request_activities(request_id);
CREATE INDEX idx_request_comments_request_id ON public.request_comments(request_id);

-- 4. Functions for automation
CREATE OR REPLACE FUNCTION public.generate_request_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $func$
DECLARE
    current_year TEXT;
    next_number INTEGER;
    new_request_id TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get next sequential number for current year
    SELECT COALESCE(MAX(CAST(SPLIT_PART(request_id, '-', 3) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.maintenance_requests
    WHERE request_id LIKE 'REQ-' || current_year || '-%';
    
    new_request_id := 'REQ-' || current_year || '-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN new_request_id;
END;
$func$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, location)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role,
        COALESCE(NEW.raw_user_meta_data->>'location', 'Mumbai Central')
    );
    RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION public.log_request_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
DECLARE
    activity_title TEXT;
    activity_desc TEXT;
    activity_type_val public.activity_type;
BEGIN
    IF TG_OP = 'INSERT' THEN
        activity_type_val := 'request_created';
        activity_title := 'Request Created';
        activity_desc := 'New maintenance request submitted: ' || NEW.title;
        
        INSERT INTO public.request_activities (request_id, user_id, activity_type, title, description)
        VALUES (NEW.id, NEW.user_id, activity_type_val, activity_title, activity_desc);
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Status change
        IF OLD.request_status != NEW.request_status THEN
            activity_type_val := 'status_updated';
            activity_title := 'Status Updated';
            activity_desc := 'Request status changed from ' || OLD.request_status || ' to ' || NEW.request_status;
            
            INSERT INTO public.request_activities (request_id, user_id, activity_type, title, description, old_value, new_value)
            VALUES (NEW.id, auth.uid(), activity_type_val, activity_title, activity_desc, OLD.request_status::TEXT, NEW.request_status::TEXT);
        END IF;
        
        -- Assignment change
        IF COALESCE(OLD.assigned_to::TEXT, '') != COALESCE(NEW.assigned_to::TEXT, '') THEN
            activity_type_val := 'assigned';
            activity_title := 'Assignment Updated';
            activity_desc := 'Request assignment changed';
            
            INSERT INTO public.request_activities (request_id, user_id, activity_type, title, description)
            VALUES (NEW.id, auth.uid(), activity_type_val, activity_title, activity_desc);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$func$;

-- 5. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locomotives_updated_at
    BEFORE UPDATE ON public.locomotives
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
    BEFORE UPDATE ON public.maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_request_comments_updated_at
    BEFORE UPDATE ON public.request_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER log_maintenance_request_activity
    AFTER INSERT OR UPDATE ON public.maintenance_requests
    FOR EACH ROW EXECUTE FUNCTION public.log_request_activity();

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locomotives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6A: Role-based access using auth metadata for locomotives (admin/supervisor access)
CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'supervisor')
    AND up.is_active = true
)
$$;

CREATE POLICY "authenticated_users_view_locomotives"
ON public.locomotives
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_supervisor_manage_locomotives"
ON public.locomotives
FOR ALL
TO authenticated
USING (public.is_admin_or_supervisor())
WITH CHECK (public.is_admin_or_supervisor());

-- Pattern 2: Simple user ownership for maintenance requests
CREATE POLICY "users_view_own_requests"
ON public.maintenance_requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR assigned_to = auth.uid() OR public.is_admin_or_supervisor());

CREATE POLICY "users_create_own_requests"
ON public.maintenance_requests
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_requests"
ON public.maintenance_requests
FOR UPDATE
TO authenticated
USING (
    (user_id = auth.uid() AND request_status IN ('draft', 'pending')) OR
    (assigned_to = auth.uid() AND request_status IN ('approved', 'in_progress')) OR
    public.is_admin_or_supervisor()
)
WITH CHECK (
    (user_id = auth.uid() AND request_status IN ('draft', 'pending')) OR
    (assigned_to = auth.uid() AND request_status IN ('approved', 'in_progress')) OR
    public.is_admin_or_supervisor()
);

CREATE POLICY "admin_supervisor_delete_requests"
ON public.maintenance_requests
FOR DELETE
TO authenticated
USING (public.is_admin_or_supervisor());

-- Pattern 2: Simple user ownership for attachments
CREATE POLICY "users_manage_request_attachments"
ON public.request_attachments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE mr.id = request_attachments.request_id
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    ) OR public.is_admin_or_supervisor()
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE mr.id = request_attachments.request_id
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    ) OR public.is_admin_or_supervisor()
);

-- Pattern 4: Public read, private write for activities
CREATE POLICY "users_view_request_activities"
ON public.request_activities
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE mr.id = request_activities.request_id
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    ) OR public.is_admin_or_supervisor()
);

CREATE POLICY "system_create_activities"
ON public.request_activities
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Pattern 2: Simple user ownership for comments
CREATE POLICY "users_manage_own_comments"
ON public.request_comments
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_supervisor())
WITH CHECK (user_id = auth.uid() OR public.is_admin_or_supervisor());

CREATE POLICY "users_view_request_comments"
ON public.request_comments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE mr.id = request_comments.request_id
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    ) OR public.is_admin_or_supervisor()
);

-- 8. Storage bucket for request attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'request-attachments',
    'request-attachments',
    false,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage RLS policies
CREATE POLICY "users_view_request_attachment_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'request-attachments'
    AND EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE (storage.foldername(name))[1] = mr.id::text
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    )
);

CREATE POLICY "users_upload_request_attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'request-attachments'
    AND EXISTS (
        SELECT 1 FROM public.maintenance_requests mr
        WHERE (storage.foldername(name))[1] = mr.id::text
        AND (mr.user_id = auth.uid() OR mr.assigned_to = auth.uid())
    )
);

CREATE POLICY "users_delete_request_attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'request-attachments'
    AND (
        owner = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role IN ('admin', 'supervisor')
        )
    )
);

-- 9. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    supervisor_uuid UUID := gen_random_uuid();
    technician_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    loco1_uuid UUID := gen_random_uuid();
    loco2_uuid UUID := gen_random_uuid();
    loco3_uuid UUID := gen_random_uuid();
    request1_uuid UUID := gen_random_uuid();
    request2_uuid UUID := gen_random_uuid();
    request3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@railway.gov.in', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin", "location": "Mumbai Central"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (supervisor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'supervisor@railway.gov.in', crypt('supervisor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Rajesh Kumar", "role": "supervisor", "location": "Mumbai Central"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (technician_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'technician@railway.gov.in', crypt('technician123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Amit Singh", "role": "technician", "location": "Pune Junction"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@railway.gov.in', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Priya Sharma", "role": "user", "location": "Nagpur Junction"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert locomotives
    INSERT INTO public.locomotives (id, loco_number, loco_type, model, manufacturer, year_manufactured, current_location) VALUES
        (loco1_uuid, 'WAP-7-30256', 'electric', 'WAP-7', 'Chittaranjan Locomotive Works', 2018, 'Mumbai Central'),
        (loco2_uuid, 'WAG-9-31045', 'electric', 'WAG-9', 'Chittaranjan Locomotive Works', 2020, 'Pune Junction'),
        (loco3_uuid, 'WDM-3A-16789', 'diesel', 'WDM-3A', 'Diesel Locomotive Works', 2019, 'Nagpur Junction');

    -- Insert maintenance requests
    INSERT INTO public.maintenance_requests (
        id, request_id, user_id, loco_id, request_type, priority, request_status,
        title, description, location, requested_completion_date, assigned_to,
        estimated_hours, is_draft, submitted_at, approved_at, started_at
    ) VALUES
        (request1_uuid, 'REQ-2025-000001', supervisor_uuid, loco1_uuid, 'preventive_maintenance', 'high', 'in_progress',
         'Quarterly Brake System Inspection', 'Comprehensive brake system inspection and maintenance for WAP-7 locomotive including brake pad replacement and system calibration.',
         'Mumbai Central', '2025-01-15', technician_uuid, 8, false, now() - interval '2 days', now() - interval '1 day', now() - interval '6 hours'),
        
        (request2_uuid, 'REQ-2025-000002', user_uuid, loco2_uuid, 'corrective_maintenance', 'critical', 'approved',
         'Electrical System Fault Repair', 'Electrical system showing irregular voltage readings. Requires immediate inspection and repair of traction motor connections.',
         'Pune Junction', '2025-01-12', technician_uuid, 12, false, now() - interval '1 day', now() - interval '4 hours', null),
        
        (request3_uuid, 'REQ-2025-000003', user_uuid, loco3_uuid, 'routine_inspection', 'normal', 'pending',
         'Monthly Safety Inspection', 'Regular monthly safety inspection as per maintenance schedule. Check all safety systems and document any issues.',
         'Nagpur Junction', '2025-01-20', null, 4, false, now() - interval '3 hours', null, null);

    -- Insert request activities
    INSERT INTO public.request_activities (request_id, user_id, activity_type, title, description) VALUES
        (request1_uuid, supervisor_uuid, 'request_created', 'Request Created', 'New maintenance request submitted: Quarterly Brake System Inspection'),
        (request1_uuid, admin_uuid, 'approved', 'Request Approved', 'Request approved for immediate action'),
        (request1_uuid, admin_uuid, 'assigned', 'Technician Assigned', 'Request assigned to Amit Singh'),
        (request1_uuid, technician_uuid, 'status_updated', 'Work Started', 'Maintenance work has begun'),
        (request2_uuid, user_uuid, 'request_created', 'Request Created', 'New maintenance request submitted: Electrical System Fault Repair'),
        (request2_uuid, supervisor_uuid, 'approved', 'Request Approved', 'Critical priority request approved'),
        (request3_uuid, user_uuid, 'request_created', 'Request Created', 'New maintenance request submitted: Monthly Safety Inspection');

    -- Insert request comments
    INSERT INTO public.request_comments (request_id, user_id, content) VALUES
        (request1_uuid, technician_uuid, 'Started brake system inspection. Found worn brake pads on bogies 1 and 3. Replacement parts ordered.'),
        (request1_uuid, supervisor_uuid, 'Please prioritize completion by end of week due to scheduled service.'),
        (request2_uuid, user_uuid, 'Voltage readings dropped to 15kV during morning run. System automatically switched to backup.');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data insertion: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data insertion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data insertion: %', SQLERRM;
END $$;