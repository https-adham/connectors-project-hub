-- ==============================================================================
-- CONNECTORS PROJECT HUB - DATABASE SCHEMA & MIGRATION
-- Team: Connectors Team - Artificial Intelligence Engineering Program
-- Faculty of Engineering, Mansoura University, Egypt
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ADMIN PROFILES & ROLES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'reviewer', 'leader')) DEFAULT 'reviewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by email and role
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

-- ==============================================================================
-- 2. PROJECT IDEAS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Step 1: Submitter Info
    submission_type TEXT NOT NULL CHECK (submission_type IN ('named', 'anonymous')),
    submitter_name TEXT,
    contact_method TEXT,
    
    -- Step 2: Idea Details
    project_title TEXT NOT NULL,
    project_description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    
    -- Step 3: Implementation Details
    project_type TEXT NOT NULL,
    custom_project_type TEXT,
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    custom_skills JSONB DEFAULT '[]'::jsonb,
    estimated_duration TEXT NOT NULL,
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    
    -- Step 4: Team Participation
    willing_to_lead TEXT NOT NULL CHECK (willing_to_lead IN ('yes', 'no', 'unsure')),
    preferred_collaborators TEXT,
    estimated_team_size TEXT NOT NULL,
    
    -- Step 5: Additional Info
    inspiration_url TEXT,
    additional_notes TEXT,
    
    -- Administrative Review Fields
    review_status TEXT NOT NULL DEFAULT 'new' CHECK (
        review_status IN (
            'new',
            'under_review',
            'needs_more_info',
            'accepted_provisionally',
            'deferred',
            'not_suitable'
        )
    ),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Validation Constraints
    CONSTRAINT check_named_has_name CHECK (
        (submission_type = 'named' AND submitter_name IS NOT NULL AND length(trim(submitter_name)) > 0)
        OR (submission_type = 'anonymous')
    )
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_project_ideas_created_at ON public.project_ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_ideas_review_status ON public.project_ideas(review_status);
CREATE INDEX IF NOT EXISTS idx_project_ideas_project_type ON public.project_ideas(project_type);
CREATE INDEX IF NOT EXISTS idx_project_ideas_willing_to_lead ON public.project_ideas(willing_to_lead);
CREATE INDEX IF NOT EXISTS idx_project_ideas_difficulty ON public.project_ideas(difficulty_level);

-- ==============================================================================
-- 4. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Security helper: check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_profiles 
        WHERE id = auth.uid()
    );
$$;

-- Trigger to update updated_at on admin_profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER set_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ideas ENABLE ROW LEVEL SECURITY;

-- ADMIN_PROFILES POLICIES
-- Allow authenticated admins to view the admin roster
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles
    FOR SELECT
    TO authenticated
    USING (public.is_admin() OR auth.uid() = id);

-- Only super_admins can insert or update admin profiles
CREATE POLICY "Super admins can manage admin profiles"
    ON public.admin_profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- PROJECT_IDEAS POLICIES
-- 1. Public Insertion: anyone (including anonymous) can submit an idea
-- With strict CHECK to ensure no user can elevate review status or inject reviewer notes
CREATE POLICY "Public can submit project ideas"
    ON public.project_ideas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        review_status = 'new'
        AND reviewer_notes IS NULL
        AND reviewed_at IS NULL
        AND reviewed_by IS NULL
    );

-- 2. Admin Selection: only verified administrators can view submitted ideas
CREATE POLICY "Only admins can view project ideas"
    ON public.project_ideas
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 3. Admin Update: only verified administrators can update ideas (e.g. status, reviewer notes)
CREATE POLICY "Only admins can update project ideas"
    ON public.project_ideas
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Admin Deletion: only verified administrators can delete ideas if needed
CREATE POLICY "Only admins can delete project ideas"
    ON public.project_ideas
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- 6. FIRST ADMINISTRATOR SETUP FUNCTION (Safe Bootstrap)
-- ==============================================================================
-- This function allows the very first administrator to claim super_admin status
-- ONLY IF the admin_profiles table is currently empty!
-- Once 1 admin exists, this function safely refuses to promote anyone else.
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(admin_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    current_email TEXT;
    admin_count INT;
BEGIN
    IF current_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You must be authenticated to run bootstrap.');
    END IF;

    SELECT email INTO current_email FROM auth.users WHERE id = current_user_id;

    SELECT count(*) INTO admin_count FROM public.admin_profiles;
    IF admin_count > 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Bootstrap closed: Administrators already exist in the system.');
    END IF;

    INSERT INTO public.admin_profiles (id, email, full_name, role)
    VALUES (current_user_id, current_email, COALESCE(admin_name, 'Team Leader'), 'super_admin');

    RETURN jsonb_build_object('success', true, 'message', 'First administrator successfully established as super_admin.');
END;
$$;
