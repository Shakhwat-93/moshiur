-- BD Courier Integration Database Migration
-- Implements permanent phone-based caching, atomic reservation, encrypted settings & orders relationship

-- 1. Create table public.bdcourier_checks
CREATE TABLE IF NOT EXISTS public.bdcourier_checks (
    id BIGSERIAL PRIMARY KEY,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'unknown')),
    data JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    attempt_count INTEGER DEFAULT 1,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT bdcourier_checks_phone_key UNIQUE (phone)
);

CREATE INDEX IF NOT EXISTS idx_bdcourier_checks_phone ON public.bdcourier_checks(phone);
CREATE INDEX IF NOT EXISTS idx_bdcourier_checks_status ON public.bdcourier_checks(status);

-- 2. Alter orders table to link courier_check_id
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_check_id BIGINT REFERENCES public.bdcourier_checks(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_courier_check_id ON public.orders(courier_check_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);

-- 3. Create table public.bdcourier_settings (encrypted / private server configuration)
CREATE TABLE IF NOT EXISTS public.bdcourier_settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    is_enabled BOOLEAN DEFAULT FALSE,
    api_key_encrypted TEXT,
    api_key_masked TEXT,
    encryption_iv TEXT,
    encryption_tag TEXT,
    connection_status TEXT DEFAULT 'unconfigured',
    connection_message TEXT,
    last_checked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.bdcourier_settings (id, is_enabled, connection_status)
VALUES ('config', false, 'unconfigured')
ON CONFLICT (id) DO NOTHING;

-- 4. Row Level Security
ALTER TABLE public.bdcourier_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bdcourier_settings ENABLE ROW LEVEL SECURITY;

-- Deny public anon access to bdcourier_settings (Only service_role can access)
DROP POLICY IF EXISTS "Service role only on bdcourier_settings" ON public.bdcourier_settings;
CREATE POLICY "Service role only on bdcourier_settings"
ON public.bdcourier_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- bdcourier_checks RLS
DROP POLICY IF EXISTS "Service role full access on bdcourier_checks" ON public.bdcourier_checks;
CREATE POLICY "Service role full access on bdcourier_checks"
ON public.bdcourier_checks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read on bdcourier_checks" ON public.bdcourier_checks;
CREATE POLICY "Authenticated read on bdcourier_checks"
ON public.bdcourier_checks
FOR SELECT
TO authenticated
USING (true);

-- 5. Atomic Claim Function (claim_courier_check)
CREATE OR REPLACE FUNCTION public.claim_courier_check(p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record public.bdcourier_checks%ROWTYPE;
BEGIN
    -- Check if record exists
    SELECT * INTO v_record FROM public.bdcourier_checks WHERE phone = p_phone;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'claimed', false,
            'status', v_record.status,
            'record', to_jsonb(v_record)
        );
    END IF;

    -- Atomic insert with pending state
    BEGIN
        INSERT INTO public.bdcourier_checks (phone, status, created_at, claimed_at, updated_at)
        VALUES (p_phone, 'pending', NOW(), NOW(), NOW())
        RETURNING * INTO v_record;

        RETURN jsonb_build_object(
            'claimed', true,
            'status', 'pending',
            'record', to_jsonb(v_record)
        );
    EXCEPTION WHEN unique_violation THEN
        SELECT * INTO v_record FROM public.bdcourier_checks WHERE phone = p_phone;
        RETURN jsonb_build_object(
            'claimed', false,
            'status', v_record.status,
            'record', to_jsonb(v_record)
        );
    END;
END;
$$;
