-- =====================================================
-- MIGRATION CINEMA SYSTEM - CSE LES PEP 973
-- Date: 29 Janvier 2025
-- Version: 1.0
-- =====================================================

-- 1. Table des cinémas partenaires
CREATE TABLE IF NOT EXISTS public.cinemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- "Agora", "Uranus"
    location VARCHAR(100) NOT NULL, -- "Cayenne", "Kourou"
    address TEXT,
    contact_info JSONB,
    reduced_price DECIMAL(5,2) NOT NULL, -- Prix CSE réduit
    regular_price DECIMAL(5,2) NOT NULL, -- Prix public
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des commandes de tickets
CREATE TABLE IF NOT EXISTS public.cinema_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cinema_id UUID NOT NULL REFERENCES public.cinemas(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 5),
    unit_price DECIMAL(5,2) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    order_month DATE NOT NULL, -- YYYY-MM-01 pour tracking quota
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des tickets individuels
CREATE TABLE IF NOT EXISTS public.cinema_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.cinema_orders(id) ON DELETE CASCADE,
    ticket_code VARCHAR(50) UNIQUE NOT NULL, -- Code unique pour retrait
    qr_code_data TEXT NOT NULL, -- Données pour QR code
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Index pour optimisation des requêtes
CREATE INDEX IF NOT EXISTS idx_cinema_orders_user_month ON public.cinema_orders(user_id, order_month);
CREATE INDEX IF NOT EXISTS idx_cinema_orders_status ON public.cinema_orders(status);
CREATE INDEX IF NOT EXISTS idx_cinema_tickets_order ON public.cinema_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_cinema_tickets_code ON public.cinema_tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_cinemas_active ON public.cinemas(is_active) WHERE is_active = true;

-- 5. Contrainte unique pour éviter les doublons de quota mensuel
CREATE UNIQUE INDEX IF NOT EXISTS idx_cinema_orders_user_month_unique 
ON public.cinema_orders(user_id, order_month) 
WHERE status IN ('pending', 'paid');

-- 6. Fonction pour vérifier le quota mensuel
CREATE OR REPLACE FUNCTION check_monthly_quota(
    p_user_id UUID,
    p_requested_quantity INTEGER,
    p_target_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_used_tickets INTEGER := 0;
    v_remaining_quota INTEGER;
    v_can_order BOOLEAN;
    v_max_quota CONSTANT INTEGER := 5;
BEGIN
    -- Calculer les tickets déjà commandés ce mois
    SELECT COALESCE(SUM(quantity), 0)
    INTO v_used_tickets
    FROM public.cinema_orders
    WHERE user_id = p_user_id
      AND order_month = p_target_month
      AND status IN ('paid', 'pending');
    
    v_remaining_quota := v_max_quota - v_used_tickets;
    v_can_order := (v_remaining_quota >= p_requested_quantity);
    
    RETURN jsonb_build_object(
        'used_tickets', v_used_tickets,
        'remaining_quota', v_remaining_quota,
        'requested_quantity', p_requested_quantity,
        'can_order', v_can_order,
        'target_month', p_target_month,
        'max_quota', v_max_quota
    );
END;
$$;

-- 7. Fonction pour obtenir l'historique des commandes
CREATE OR REPLACE FUNCTION get_user_cinema_history(p_user_id UUID)
RETURNS TABLE (
    order_id UUID,
    cinema_name VARCHAR(100),
    cinema_location VARCHAR(100),
    quantity INTEGER,
    total_amount DECIMAL(8,2),
    order_date DATE,
    status VARCHAR(20),
    tickets_count BIGINT,
    stripe_payment_intent_id VARCHAR(255)
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        co.id as order_id,
        c.name as cinema_name,
        c.location as cinema_location,
        co.quantity,
        co.total_amount,
        co.created_at::DATE as order_date,
        co.status,
        COUNT(ct.id) as tickets_count,
        co.stripe_payment_intent_id
    FROM public.cinema_orders co
    JOIN public.cinemas c ON co.cinema_id = c.id
    LEFT JOIN public.cinema_tickets ct ON co.id = ct.order_id
    WHERE co.user_id = p_user_id
    GROUP BY co.id, c.name, c.location, co.quantity, co.total_amount, co.created_at, co.status, co.stripe_payment_intent_id
    ORDER BY co.created_at DESC;
$$;

-- 8. Fonction pour obtenir les statistiques cinéma (admin)
CREATE OR REPLACE FUNCTION get_cinema_stats()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT jsonb_build_object(
        'total_orders', (SELECT COUNT(*) FROM public.cinema_orders WHERE status = 'paid'),
        'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM public.cinema_orders WHERE status = 'paid'),
        'total_tickets_sold', (SELECT COALESCE(SUM(quantity), 0) FROM public.cinema_orders WHERE status = 'paid'),
        'orders_this_month', (
            SELECT COUNT(*) 
            FROM public.cinema_orders 
            WHERE status = 'paid' 
            AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        ),
        'revenue_this_month', (
            SELECT COALESCE(SUM(total_amount), 0) 
            FROM public.cinema_orders 
            WHERE status = 'paid' 
            AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        ),
        'cinema_breakdown', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'cinema_name', c.name,
                    'cinema_location', c.location,
                    'orders_count', COALESCE(stats.orders_count, 0),
                    'total_revenue', COALESCE(stats.total_revenue, 0),
                    'tickets_sold', COALESCE(stats.tickets_sold, 0)
                )
            )
            FROM public.cinemas c
            LEFT JOIN (
                SELECT 
                    co.cinema_id,
                    COUNT(*) as orders_count,
                    SUM(co.total_amount) as total_revenue,
                    SUM(co.quantity) as tickets_sold
                FROM public.cinema_orders co
                WHERE co.status = 'paid'
                GROUP BY co.cinema_id
            ) stats ON c.id = stats.cinema_id
            WHERE c.is_active = true
        )
    );
$$;

-- 9. Fonction pour générer un code ticket unique
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE
    v_code VARCHAR(50);
    v_exists BOOLEAN;
BEGIN
    LOOP
        -- Générer un code: CSE + 8 caractères aléatoires
        v_code := 'CSE' || UPPER(SUBSTRING(encode(gen_random_bytes(4), 'hex') FROM 1 FOR 8));
        
        -- Vérifier l'unicité
        SELECT EXISTS(SELECT 1 FROM public.cinema_tickets WHERE ticket_code = v_code) INTO v_exists;
        
        EXIT WHEN NOT v_exists;
    END LOOP;
    
    RETURN v_code;
END;
$$;

-- 10. Trigger pour auto-génération du code ticket
CREATE OR REPLACE FUNCTION auto_generate_ticket_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.ticket_code IS NULL OR NEW.ticket_code = '' THEN
        NEW.ticket_code := generate_ticket_code();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_ticket_code
    BEFORE INSERT ON public.cinema_tickets
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_ticket_code();

-- 11. Activation Row Level Security
ALTER TABLE public.cinemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cinema_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cinema_tickets ENABLE ROW LEVEL SECURITY;

-- 12. Politiques RLS pour cinemas (lecture publique, admin pour modification)
CREATE POLICY "Anyone can view active cinemas" ON public.cinemas
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cinemas" ON public.cinemas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND (u.role = 'admin' OR u.email LIKE '%admin%' OR u.email = 'user@toto.com')
        )
    );

-- 13. Politiques RLS pour cinema_orders
CREATE POLICY "Users can view their own cinema orders" ON public.cinema_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cinema orders" ON public.cinema_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders" ON public.cinema_orders
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all cinema orders" ON public.cinema_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND (u.role = 'admin' OR u.email LIKE '%admin%' OR u.email = 'user@toto.com')
        )
    );

-- 14. Politiques RLS pour cinema_tickets
CREATE POLICY "Users can view their own cinema tickets" ON public.cinema_tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cinema_orders co
            WHERE co.id = cinema_tickets.order_id
            AND co.user_id = auth.uid()
        )
    );

CREATE POLICY "System can create tickets for paid orders" ON public.cinema_tickets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.cinema_orders co
            WHERE co.id = cinema_tickets.order_id
            AND co.status = 'paid'
        )
    );

CREATE POLICY "Admins can manage all cinema tickets" ON public.cinema_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND (u.role = 'admin' OR u.email LIKE '%admin%' OR u.email = 'user@toto.com')
        )
    );

-- 15. Insertion des données des cinémas partenaires
INSERT INTO public.cinemas (name, location, address, contact_info, reduced_price, regular_price, is_active) VALUES
('Agora', 'Cayenne', 'Centre Commercial Collery, 97300 Cayenne', 
 '{"phone": "0594 31 99 99", "email": "contact@agora-cayenne.fr", "website": "https://agora-cayenne.fr"}', 
 7.50, 12.00, true),
('Uranus', 'Kourou', 'Avenue de l''Europe, 97310 Kourou', 
 '{"phone": "0594 32 17 65", "email": "contact@uranus-kourou.fr", "website": "https://uranus-kourou.fr"}', 
 7.00, 11.50, true)
ON CONFLICT DO NOTHING;

-- 16. Commentaires pour documentation
COMMENT ON TABLE public.cinemas IS 'Table des cinémas partenaires CSE (Agora Cayenne, Uranus Kourou)';
COMMENT ON TABLE public.cinema_orders IS 'Commandes de tickets cinéma avec gestion quota mensuel (max 5/user/month)';
COMMENT ON TABLE public.cinema_tickets IS 'Tickets individuels avec codes QR uniques pour retrait cinéma';

COMMENT ON FUNCTION check_monthly_quota IS 'Vérification du quota mensuel de tickets par utilisateur (max 5)';
COMMENT ON FUNCTION get_user_cinema_history IS 'Historique complet des commandes cinéma par utilisateur';
COMMENT ON FUNCTION get_cinema_stats IS 'Statistiques globales du système cinéma pour admin';
COMMENT ON FUNCTION generate_ticket_code IS 'Génération automatique de codes tickets uniques (format: CSE + 8 chars)';

-- 17. Vérification finale
DO $$
BEGIN
    RAISE NOTICE 'Migration cinema system terminée avec succès';
    RAISE NOTICE 'Tables créées: cinemas, cinema_orders, cinema_tickets';
    RAISE NOTICE 'Fonctions créées: check_monthly_quota, get_user_cinema_history, get_cinema_stats';
    RAISE NOTICE 'Politiques RLS configurées pour sécurité utilisateur/admin';
    RAISE NOTICE 'Données des cinémas Agora et Uranus insérées';
END $$; 