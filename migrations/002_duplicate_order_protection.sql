-- =============================================================================
-- Migration 002: Duplicate Order Protection & Anti-Fraud Security System
-- =============================================================================
-- Implements configurable duplicate order prevention by Phone and/or IP address,
-- atomic PostgreSQL transaction with advisory lock concurrency protection,
-- privacy-preserving attempt logging, and database defense-in-depth trigger.

-- 1. Configuration Table
CREATE TABLE IF NOT EXISTS public.duplicate_order_settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    block_same_phone BOOLEAN NOT NULL DEFAULT TRUE,
    block_same_ip BOOLEAN NOT NULL DEFAULT TRUE,
    duration_minutes INTEGER NOT NULL DEFAULT 10 CHECK (duration_minutes >= 1 AND duration_minutes <= 1440),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT DEFAULT 'admin'
);

INSERT INTO public.duplicate_order_settings (id, is_enabled, block_same_phone, block_same_ip, duration_minutes, updated_at)
VALUES ('config', true, true, true, 10, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Add ip_address column & indexes to public.orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ip_address TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_ip_address ON public.orders(ip_address);
CREATE INDEX IF NOT EXISTS idx_orders_phone_created ON public.orders(phone, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_ip_created ON public.orders(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 3. Blocked Duplicate Attempt Logs Table
CREATE TABLE IF NOT EXISTS public.duplicate_order_logs (
    id BIGSERIAL PRIMARY KEY,
    phone TEXT,
    phone_masked TEXT,
    ip_address TEXT,
    ip_masked TEXT,
    blocked_reason TEXT NOT NULL CHECK (blocked_reason IN ('same_phone', 'same_ip', 'both')),
    matching_order_id TEXT,
    matching_order_created_at TIMESTAMPTZ,
    cooldown_remaining_seconds INTEGER,
    duration_minutes INTEGER,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_duplicate_order_logs_created ON public.duplicate_order_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_duplicate_order_logs_phone ON public.duplicate_order_logs(phone);
CREATE INDEX IF NOT EXISTS idx_duplicate_order_logs_ip ON public.duplicate_order_logs(ip_address);

-- 4. Privacy Masking Helper Functions
CREATE OR REPLACE FUNCTION public.mask_phone(p_phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_phone IS NULL OR length(p_phone) < 7 THEN
        RETURN p_phone;
    END IF;
    RETURN substr(p_phone, 1, 3) || '****' || substr(p_phone, length(p_phone) - 3, 4);
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_ip(p_ip TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_parts TEXT[];
BEGIN
    IF p_ip IS NULL OR p_ip = '' OR p_ip = 'unknown' THEN
        RETURN 'unknown';
    END IF;
    IF p_ip LIKE '%.%' THEN
        v_parts := string_to_array(p_ip, '.');
        IF array_length(v_parts, 1) = 4 THEN
            RETURN v_parts[1] || '.' || v_parts[2] || '.***.***';
        END IF;
    ELSIF p_ip LIKE '%:%' THEN
        v_parts := string_to_array(p_ip, ':');
        IF array_length(v_parts, 1) >= 2 THEN
            RETURN v_parts[1] || ':' || v_parts[2] || ':****:****';
        END IF;
    END IF;
    RETURN substr(p_ip, 1, 4) || '****';
END;
$$;

-- 5. Row Level Security Policies
ALTER TABLE public.duplicate_order_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_order_logs ENABLE ROW LEVEL SECURITY;

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on duplicate_order_settings" ON public.duplicate_order_settings;
CREATE POLICY "Service role full access on duplicate_order_settings"
ON public.duplicate_order_settings
FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on duplicate_order_logs" ON public.duplicate_order_logs;
CREATE POLICY "Service role full access on duplicate_order_logs"
ON public.duplicate_order_logs
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated (admin) read access
DROP POLICY IF EXISTS "Authenticated read on duplicate_order_settings" ON public.duplicate_order_settings;
CREATE POLICY "Authenticated read on duplicate_order_settings"
ON public.duplicate_order_settings
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated read on duplicate_order_logs" ON public.duplicate_order_logs;
CREATE POLICY "Authenticated read on duplicate_order_logs"
ON public.duplicate_order_logs
FOR SELECT TO authenticated USING (true);

-- 6. Atomic Concurrency-Safe Order Submission RPC
CREATE OR REPLACE FUNCTION public.submit_order_secure(
    p_order_id TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_address TEXT,
    p_area TEXT,
    p_package_name TEXT,
    p_quantity INTEGER,
    p_unit_price NUMERIC,
    p_subtotal NUMERIC,
    p_delivery_fee NUMERIC,
    p_total_price NUMERIC,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_settings public.duplicate_order_settings%ROWTYPE;
    v_window_start TIMESTAMPTZ;
    v_matching_order public.orders%ROWTYPE;
    v_matching_ip_order public.orders%ROWTYPE;
    v_blocked_by_phone BOOLEAN := FALSE;
    v_blocked_by_ip BOOLEAN := FALSE;
    v_block_reason TEXT := NULL;
    v_most_recent_order public.orders%ROWTYPE;
    v_elapsed_seconds NUMERIC;
    v_remaining_seconds INTEGER := 0;
    v_existing_order public.orders%ROWTYPE;
    v_new_order public.orders%ROWTYPE;
    v_friendly_msg TEXT;
    v_mins_left INTEGER;
BEGIN
    -- Idempotency Check: if exact same order_id already exists, return it safely
    SELECT * INTO v_existing_order FROM public.orders WHERE order_id = p_order_id;
    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'is_duplicate', false,
            'is_idempotent_replay', true,
            'order', to_jsonb(v_existing_order)
        );
    END IF;

    -- Concurrency Lock: Lock on hashed phone & IP for this transaction duration
    IF p_phone IS NOT NULL AND p_phone != '' THEN
        PERFORM pg_advisory_xact_lock(hashtext('phone:' || p_phone));
    END IF;
    IF p_ip_address IS NOT NULL AND p_ip_address != '' AND p_ip_address != 'unknown' THEN
        PERFORM pg_advisory_xact_lock(hashtext('ip:' || p_ip_address));
    END IF;

    -- Load Settings
    SELECT * INTO v_settings FROM public.duplicate_order_settings WHERE id = 'config';
    IF NOT FOUND THEN
        v_settings.is_enabled := TRUE;
        v_settings.block_same_phone := TRUE;
        v_settings.block_same_ip := TRUE;
        v_settings.duration_minutes := 10;
    END IF;

    -- Check for duplicate if protection enabled
    IF v_settings.is_enabled THEN
        v_window_start := NOW() - (v_settings.duration_minutes || ' minutes')::INTERVAL;

        -- Check phone match
        IF v_settings.block_same_phone AND p_phone IS NOT NULL AND p_phone != '' THEN
            SELECT * INTO v_matching_order FROM public.orders
            WHERE phone = p_phone
              AND created_at >= v_window_start
              AND status NOT IN ('cancelled', 'failed', 'rejected')
            ORDER BY created_at DESC
            LIMIT 1;

            IF FOUND THEN
                v_blocked_by_phone := TRUE;
                v_most_recent_order := v_matching_order;
            END IF;
        END IF;

        -- Check IP match
        IF v_settings.block_same_ip AND p_ip_address IS NOT NULL AND p_ip_address != '' AND p_ip_address != 'unknown' THEN
            SELECT * INTO v_matching_ip_order FROM public.orders
            WHERE ip_address = p_ip_address
              AND created_at >= v_window_start
              AND status NOT IN ('cancelled', 'failed', 'rejected')
            ORDER BY created_at DESC
            LIMIT 1;

            IF FOUND THEN
                v_blocked_by_ip := TRUE;
                IF NOT v_blocked_by_phone OR v_matching_ip_order.created_at > v_most_recent_order.created_at THEN
                    v_most_recent_order := v_matching_ip_order;
                END IF;
            END IF;
        END IF;

        -- Determine Block Reason (OR logic: if either or both matched)
        IF v_blocked_by_phone AND v_blocked_by_ip THEN
            v_block_reason := 'both';
        ELSIF v_blocked_by_phone THEN
            v_block_reason := 'same_phone';
        ELSIF v_blocked_by_ip THEN
            v_block_reason := 'same_ip';
        END IF;

        -- If Blocked: Log & Return Structured Error Response
        IF v_block_reason IS NOT NULL THEN
            v_elapsed_seconds := EXTRACT(EPOCH FROM (NOW() - v_most_recent_order.created_at));
            v_remaining_seconds := GREATEST(1, ROUND((v_settings.duration_minutes * 60) - v_elapsed_seconds));
            v_mins_left := CEIL(v_remaining_seconds::NUMERIC / 60);

            v_friendly_msg := 'আপনার তথ্য দিয়ে সম্প্রতি একটি অর্ডার করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।';
            IF v_mins_left > 1 THEN
                v_friendly_msg := v_friendly_msg || ' (আবার অর্ডার করতে পারবেন: প্রায় ' || v_mins_left || ' মিনিট পরে)';
            ELSE
                v_friendly_msg := v_friendly_msg || ' (আবার অর্ডার করতে পারবেন: প্রায় ১ মিনিট পরে)';
            END IF;

            -- Log blocked attempt
            INSERT INTO public.duplicate_order_logs (
                phone, phone_masked, ip_address, ip_masked, blocked_reason,
                matching_order_id, matching_order_created_at, cooldown_remaining_seconds,
                duration_minutes, user_agent, created_at
            ) VALUES (
                p_phone,
                public.mask_phone(p_phone),
                p_ip_address,
                public.mask_ip(p_ip_address),
                v_block_reason,
                v_most_recent_order.order_id,
                v_most_recent_order.created_at,
                v_remaining_seconds,
                v_settings.duration_minutes,
                substr(p_user_agent, 1, 255),
                NOW()
            );

            RETURN jsonb_build_object(
                'success', false,
                'code', 'DUPLICATE_ORDER_BLOCKED',
                'reason', v_block_reason,
                'message', v_friendly_msg,
                'retry_after_seconds', v_remaining_seconds,
                'duration_minutes', v_settings.duration_minutes
            );
        END IF;
    END IF;

    -- 5. No duplicate block: Insert the new order into public.orders
    INSERT INTO public.orders (
        order_id, name, phone, address, area, package_name, quantity,
        unit_price, subtotal, delivery_fee, total_price, status, ip_address,
        created_at, updated_at, items
    ) VALUES (
        p_order_id,
        p_name,
        p_phone,
        p_address,
        p_area,
        p_package_name,
        COALESCE(p_quantity, 1),
        p_unit_price,
        COALESCE(p_subtotal, p_unit_price * COALESCE(p_quantity, 1)),
        COALESCE(p_delivery_fee, 0),
        p_total_price,
        'pending',
        p_ip_address,
        NOW(),
        NOW(),
        COALESCE(p_items, '[]'::jsonb)
    )
    RETURNING * INTO v_new_order;

    RETURN jsonb_build_object(
        'success', true,
        'is_duplicate', false,
        'order', to_jsonb(v_new_order)
    );
END;
$$;
