-- 1. Create a table to track when students buy real-world classroom perks
CREATE TABLE public.perk_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nation_id UUID REFERENCES public.nations(id) ON DELETE CASCADE,
    perk_name TEXT NOT NULL, 
    cost_amount INTEGER NOT NULL,
    cost_currency TEXT NOT NULL, -- 'gold', 'culture', 'tech_points'
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' -- 'pending' means they bought it, 'redeemed' means the teacher approved it
);

-- 2. Secure function for a student to buy a real-world perk
CREATE OR REPLACE FUNCTION buy_classroom_perk(
    p_nation_id UUID, 
    p_perk_name TEXT, 
    p_cost_amount INTEGER, 
    p_cost_currency TEXT
)
RETURNS boolean AS $$
DECLARE
    v_current_funds INTEGER;
BEGIN
    -- Lock the row to prevent double-clicking the buy button
    IF p_cost_currency = 'gold' THEN
        SELECT gold INTO v_current_funds FROM public.resources WHERE nation_id = p_nation_id FOR UPDATE;
    ELSIF p_cost_currency = 'culture' THEN
        SELECT culture INTO v_current_funds FROM public.resources WHERE nation_id = p_nation_id FOR UPDATE;
    ELSIF p_cost_currency = 'tech_points' THEN
        SELECT tech_points INTO v_current_funds FROM public.resources WHERE nation_id = p_nation_id FOR UPDATE;
    ELSE
        RAISE EXCEPTION 'Invalid currency type';
    END IF;

    -- Check if they have enough funds
    IF v_current_funds >= p_cost_amount THEN
        -- Deduct the funds dynamically based on currency
        IF p_cost_currency = 'gold' THEN
            UPDATE public.resources SET gold = gold - p_cost_amount WHERE nation_id = p_nation_id;
        ELSIF p_cost_currency = 'culture' THEN
            UPDATE public.resources SET culture = culture - p_cost_amount WHERE nation_id = p_nation_id;
        ELSIF p_cost_currency = 'tech_points' THEN
            UPDATE public.resources SET tech_points = tech_points - p_cost_amount WHERE nation_id = p_nation_id;
        END IF;

        -- Insert the pending redemption request
        INSERT INTO public.perk_purchases (nation_id, perk_name, cost_amount, cost_currency)
        VALUES (p_nation_id, p_perk_name, p_cost_amount, p_cost_currency);

        RETURN true;
    ELSE
        RAISE EXCEPTION 'Insufficient % for this perk', p_cost_currency;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Secure function for a teacher to mark a perk as redeemed
CREATE OR REPLACE FUNCTION redeem_perk(p_purchase_id UUID)
RETURNS boolean AS $$
BEGIN
    UPDATE public.perk_purchases 
    SET status = 'redeemed' 
    WHERE id = p_purchase_id;
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
