-- Fix recursive RLS between public.projects and public.project_matches
-- Idempotent migration to remove policies that caused infinite recursion
-- and replace project ownership checks with a SECURITY DEFINER helper.
-- Why recursion happened:
--   A projects policy (projects_matched_manufacturer_read) used a
--   subquery that selected from public.project_matches. The project_matches
--   policy in turn used a subquery that selected from public.projects to
--   verify project ownership. When Postgres attempted to evaluate these
--   policy expressions the subqueries cross-referenced each other and
--   re-entered policy evaluation for the same table, producing
--   "infinite recursion detected in policy for relation \"projects\"".
-- How this fix avoids recursion:
--   We create a SECURITY DEFINER helper function that performs the
--   ownership lookup as the function owner (bypassing RLS) and grant
--   explicit EXECUTE permission to the authenticated role. Policies then
--   call this function instead of selecting from public.projects directly.

BEGIN;

-- Use an increasing-safe search_path inside the function; explicitly
-- reference public.* tables to avoid ambiguous resolution.

-- Create or replace helper function (idempotent)
CREATE OR REPLACE FUNCTION public.is_project_owned_by(
  p_project_id uuid,
  p_user_id uuid
) RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.projects WHERE id = p_project_id AND customer_id = p_user_id
  );
$$;

-- Ensure the function cannot be executed by anonymous/public role, but
-- authenticated users (the app role) may execute it for policy checks.
REVOKE ALL ON FUNCTION public.is_project_owned_by(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_project_owned_by(uuid, uuid) TO authenticated;

-- Replace project_matches policy that checked projects directly.
DROP POLICY IF EXISTS matches_customer_read ON public.project_matches;
CREATE POLICY matches_customer_read ON public.project_matches
  FOR SELECT
  TO authenticated
  USING (
    public.is_project_owned_by(project_id, (SELECT auth.uid()))
  );

-- Replace project_files owner insert check to use helper (avoids direct projects read)
DROP POLICY IF EXISTS project_files_owner_insert ON public.project_files;
CREATE POLICY project_files_owner_insert ON public.project_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND public.is_project_owned_by(project_id, (SELECT auth.uid()))
  );

-- Replace quotes policy that checked projects directly
DROP POLICY IF EXISTS quotes_project_customer_read ON public.quotes;
CREATE POLICY quotes_project_customer_read ON public.quotes
  FOR SELECT
  TO authenticated
  USING (
    public.is_project_owned_by(project_id, (SELECT auth.uid()))
  );

-- Ensure old/duplicate policies that might conflict are removed.
DROP POLICY IF EXISTS projects_matched_manufacturer_read ON public.projects;
-- Recreate the projects matched-manufacturer read policy in a way that
-- does not select from public.projects (it may still reference project_matches
-- and manufacturer_profiles; those policies no longer query projects directly
-- so this is safe and non-recursive).
CREATE POLICY projects_matched_manufacturer_read ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS(
      SELECT 1 FROM public.project_matches pm
      JOIN public.manufacturer_profiles mp ON mp.id = pm.manufacturer_profile_id
      WHERE pm.project_id = projects.id
        AND mp.owner_id = (SELECT auth.uid())
        AND pm.status IN ('invited','viewed','quoted','accepted')
    )
  );

-- Add comments explaining the change for future maintainers.
COMMENT ON FUNCTION public.is_project_owned_by(uuid, uuid)
  IS 'Helper used by RLS policies to atomically check project ownership without re-entering projects RLS. SECURITY DEFINER; safe for policy use.';

-- Keep migration idempotent
COMMIT;
