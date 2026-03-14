-- 1. Create a table to track which buildings each nation owns
CREATE TABLE public.nation_buildings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nation_id UUID REFERENCES public.nations(id) ON DELETE CASCADE,
    building_id TEXT NOT NULL, -- e.g., 'fishing_fleet'
    built_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(nation_id, building_id) -- A nation can only build a specific unique building once
);

-- 2. Create the secure transaction function (RPC) to buy a building
CREATE OR REPLACE FUNCTION buy_building(
    p_nation_id UUID, 
    p_building_id TEXT, 
    p_gold_cost INTEGER, 
    p_materials_cost INTEGER
)
RETURNS boolean AS $$
DECLARE
    v_current_gold INTEGER;
    v_current_materials INTEGER;
BEGIN
    -- Lock the row for update to prevent double-spending
    SELECT gold, materials INTO v_current_gold, v_current_materials
    FROM public.resources
    WHERE nation_id = p_nation_id
    FOR UPDATE;

    -- Check if they have enough funds
    IF v_current_gold >= p_gold_cost AND v_current_materials >= p_materials_cost THEN
        -- Deduct the funds
        UPDATE public.resources
        SET gold = gold - p_gold_cost,
            materials = materials - p_materials_cost
        WHERE nation_id = p_nation_id;

        -- Insert the new building
        INSERT INTO public.nation_buildings (nation_id, building_id)
        VALUES (p_nation_id, p_building_id);

        RETURN true;
    ELSE
        RAISE EXCEPTION 'Insufficient resources';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
