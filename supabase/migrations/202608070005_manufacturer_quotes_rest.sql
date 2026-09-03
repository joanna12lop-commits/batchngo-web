-- idempotent continuation of manufacturer & quotes migration
-- safe to run multiple times; assumes enum value 'interested' is already present

BEGIN;

-- Add columns to project_matches if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='project_matches' AND column_name='decline_reason'
  ) THEN
    ALTER TABLE public.project_matches ADD COLUMN decline_reason text CHECK (decline_reason is null or char_length(decline_reason) <= 2000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='project_matches' AND column_name='responded_at'
  ) THEN
    ALTER TABLE public.project_matches ADD COLUMN responded_at timestamptz;
  END IF;
END$$;

-- Rename column in quotes if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quotes' AND column_name='amount_cents'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quotes' AND column_name='estimated_unit_price_cents'
  ) THEN
    ALTER TABLE public.quotes RENAME COLUMN amount_cents TO estimated_unit_price_cents;
  END IF;
END$$;

-- Ensure estimated_unit_price_cents is nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quotes' AND column_name='estimated_unit_price_cents'
  ) THEN
    EXECUTE 'ALTER TABLE public.quotes ALTER COLUMN estimated_unit_price_cents DROP NOT NULL';
  END IF;
END$$;

-- Add other columns to quotes if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='minimum_unit_price_cents') THEN
    ALTER TABLE public.quotes ADD COLUMN minimum_unit_price_cents bigint CHECK (minimum_unit_price_cents is null or minimum_unit_price_cents >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='maximum_unit_price_cents') THEN
    ALTER TABLE public.quotes ADD COLUMN maximum_unit_price_cents bigint CHECK (maximum_unit_price_cents is null or maximum_unit_price_cents >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='moq') THEN
    ALTER TABLE public.quotes ADD COLUMN moq integer;
    -- add check constraint for moq only if not present
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.quotes'::regclass AND conname='quotes_moq_check') THEN
      ALTER TABLE public.quotes ADD CONSTRAINT quotes_moq_check CHECK (moq > 0);
    END IF;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='tooling_setup_cost_cents') THEN
    ALTER TABLE public.quotes ADD COLUMN tooling_setup_cost_cents bigint CHECK (tooling_setup_cost_cents is null or tooling_setup_cost_cents >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='sample_available') THEN
    ALTER TABLE public.quotes ADD COLUMN sample_available boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='sample_cost_cents') THEN
    ALTER TABLE public.quotes ADD COLUMN sample_cost_cents bigint CHECK (sample_cost_cents is null or sample_cost_cents >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='production_location') THEN
    ALTER TABLE public.quotes ADD COLUMN production_location jsonb NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='expires_at') THEN
    ALTER TABLE public.quotes ADD COLUMN expires_at date;
  END IF;
END$$;

-- Populate moq default where null
UPDATE public.quotes q
SET moq = COALESCE(p.quantity,1)
FROM public.projects p
WHERE p.id = q.project_id AND (q.moq IS NULL);

-- Populate expires_at default where null
UPDATE public.quotes
SET expires_at = COALESCE(submitted_at::date, current_date) + 30
WHERE expires_at IS NULL;

-- Set moq NOT NULL if column exists and contains no nulls
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='moq') THEN
    IF NOT EXISTS (SELECT 1 FROM public.quotes WHERE moq IS NULL) THEN
      EXECUTE 'ALTER TABLE public.quotes ALTER COLUMN moq SET NOT NULL';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quotes' AND column_name='expires_at') THEN
    IF NOT EXISTS (SELECT 1 FROM public.quotes WHERE expires_at IS NULL) THEN
      EXECUTE 'ALTER TABLE public.quotes ALTER COLUMN expires_at SET NOT NULL';
    END IF;
  END IF;
END$$;

-- Add unit or range check constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.conname = 'quotes_unit_or_range_check' AND n.nspname = 'public' AND t.relname = 'quotes'
  ) THEN
    ALTER TABLE public.quotes ADD CONSTRAINT quotes_unit_or_range_check CHECK (
      estimated_unit_price_cents IS NOT NULL OR
      (minimum_unit_price_cents IS NOT NULL AND maximum_unit_price_cents IS NOT NULL AND minimum_unit_price_cents <= maximum_unit_price_cents)
    );
  END IF;
END$$;

-- Unique index if not exists
CREATE UNIQUE INDEX IF NOT EXISTS quotes_project_manufacturer_unique ON public.quotes(project_id, manufacturer_profile_id);

-- Policies: drop and recreate (idempotent)
DROP POLICY IF EXISTS projects_matched_manufacturer_read ON public.projects;
CREATE POLICY projects_matched_manufacturer_read ON public.projects FOR SELECT TO authenticated USING(
  EXISTS(
    SELECT 1 FROM public.project_matches pm JOIN public.manufacturer_profiles mp ON mp.id = pm.manufacturer_profile_id
    WHERE pm.project_id = projects.id
      AND mp.owner_id = (SELECT auth.uid())
      AND pm.status IN ('invited','viewed','interested','quoted')
  )
);

DROP POLICY IF EXISTS project_files_authorized_read ON public.project_files;
CREATE POLICY project_files_authorized_read ON public.project_files FOR SELECT TO authenticated USING(
  owner_id = (SELECT auth.uid()) OR EXISTS(
    SELECT 1 FROM public.project_matches pm JOIN public.manufacturer_profiles mp ON mp.id = pm.manufacturer_profile_id
    WHERE pm.project_id = project_files.project_id
      AND mp.owner_id = (SELECT auth.uid())
      AND pm.status IN ('invited','viewed','interested','quoted')
  )
);

DROP POLICY IF EXISTS quotes_matched_manufacturer_insert ON public.quotes;
CREATE POLICY quotes_matched_manufacturer_insert ON public.quotes FOR INSERT TO authenticated WITH CHECK(
  submitted_by = (SELECT auth.uid()) AND EXISTS(
    SELECT 1 FROM public.project_matches pm JOIN public.manufacturer_profiles mp ON mp.id = pm.manufacturer_profile_id
    WHERE pm.project_id = quotes.project_id
      AND pm.manufacturer_profile_id = quotes.manufacturer_profile_id
      AND mp.owner_id = (SELECT auth.uid())
      AND pm.status IN ('invited','viewed','interested','quoted')
  )
);

DROP POLICY IF EXISTS quotes_manufacturer_update_draft ON public.quotes;
CREATE POLICY quotes_manufacturer_update_own ON public.quotes FOR UPDATE TO authenticated USING(
  submitted_by = (SELECT auth.uid())
) WITH CHECK (
  submitted_by = (SELECT auth.uid()) AND status IN ('draft','submitted','withdrawn')
);

REVOKE UPDATE ON public.project_matches FROM authenticated;
GRANT UPDATE(status,decline_reason,responded_at,updated_at) ON public.project_matches TO authenticated;

COMMIT;
