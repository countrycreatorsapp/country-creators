-- 1. Create a table to track when students leave the classroom
CREATE TABLE public.bathroom_passes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nation_id UUID REFERENCES public.nations(id) ON DELETE CASCADE,
    checked_out_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'out', -- 'out' or 'returned'
    duration_minutes INTEGER
);

-- 2. Secure function for a student to check out (Costs 10 Culture)
CREATE OR REPLACE FUNCTION checkout_bathroom(p_nation_id UUID)
RETURNS boolean AS $$
DECLARE
    v_current_culture INTEGER;
    v_active_pass UUID;
BEGIN
    -- Check if they are already out
    SELECT id INTO v_active_pass FROM public.bathroom_passes 
    WHERE nation_id = p_nation_id AND status = 'out';
    
    IF v_active_pass IS NOT NULL THEN
        RAISE EXCEPTION 'You are already signed out of the classroom.';
    END IF;

    -- Lock and check resources (Cost: 10 Culture to leave the room)
    SELECT culture INTO v_current_culture
    FROM public.resources
    WHERE nation_id = p_nation_id
    FOR UPDATE;

    IF v_current_culture >= 10 THEN
        -- Deduct the cost
        UPDATE public.resources SET culture = culture - 10 WHERE nation_id = p_nation_id;
        
        -- Create the active pass record
        INSERT INTO public.bathroom_passes (nation_id) VALUES (p_nation_id);
        
        RETURN true;
    ELSE
        RAISE EXCEPTION 'Insufficient Culture. You need 10 Culture to use a hall pass.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Secure function for a student to check back in
CREATE OR REPLACE FUNCTION checkin_bathroom(p_nation_id UUID)
RETURNS boolean AS $$
DECLARE
    v_active_pass UUID;
    v_out_time TIMESTAMP WITH TIME ZONE;
    v_duration INTEGER;
BEGIN
    -- Find their active pass
    SELECT id, checked_out_at INTO v_active_pass, v_out_time 
    FROM public.bathroom_passes 
    WHERE nation_id = p_nation_id AND status = 'out';
    
    IF v_active_pass IS NULL THEN
        RAISE EXCEPTION 'You do not have an active hall pass.';
    END IF;

    -- Calculate how many minutes they were gone
    v_duration := EXTRACT(EPOCH FROM (now() - v_out_time)) / 60;

    -- Close the pass
    UPDATE public.bathroom_passes 
    SET checked_in_at = now(), 
        status = 'returned',
        duration_minutes = v_duration
    WHERE id = v_active_pass;

    -- (Optional) If they were gone longer than 5 minutes, penalize their Gold/Production
    IF v_duration > 5 THEN
        UPDATE public.resources SET gold = GREATEST(0, gold - (v_duration * 5)) WHERE nation_id = p_nation_id;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
