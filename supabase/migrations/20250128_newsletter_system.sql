-- Migration pour le système de newsletter automatique
-- Créé le: 28 janvier 2025

-- 1. Ajouter le champ is_active à la table users si elle n'existe pas déjà
-- (Note: Adapter selon votre structure existante)

-- Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter le champ is_active s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Ajouter le champ role s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
    END IF;
END $$;

-- 2. Créer la table pour les logs de newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    recipients_count INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table pour tracker les emails envoyés (optionnel, pour audit détaillé)
CREATE TABLE IF NOT EXISTS public.newsletter_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    newsletter_log_id UUID REFERENCES newsletter_logs(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'failed', 'bounced', 'opened', 'clicked'
    mailgun_id VARCHAR(255), -- ID de Mailgun pour tracking
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_sent_at ON public.newsletter_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_recipients_email ON public.newsletter_recipients(user_email);
CREATE INDEX IF NOT EXISTS idx_newsletter_recipients_status ON public.newsletter_recipients(status);

-- 5. Activer RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_recipients ENABLE ROW LEVEL SECURITY;

-- 6. Politiques RLS pour users
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Les utilisateurs peuvent mettre à jour leur propre profil (sauf is_active et role)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Les admins peuvent tout voir et modifier
CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- 7. Politiques RLS pour newsletter_logs
-- Seuls les admins peuvent accéder aux logs
CREATE POLICY "Only admins can access newsletter logs" ON public.newsletter_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- 8. Politiques RLS pour newsletter_recipients
-- Seuls les admins peuvent accéder aux détails des destinataires
CREATE POLICY "Only admins can access newsletter recipients" ON public.newsletter_recipients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- 9. Fonction pour obtenir les utilisateurs actifs (pour l'API)
CREATE OR REPLACE FUNCTION get_active_users()
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT u.id, u.email, u.first_name, u.last_name
    FROM public.users u
    WHERE u.is_active = true 
    AND u.email IS NOT NULL 
    AND u.email != '';
$$;

-- 10. Fonction pour obtenir les statistiques newsletter
CREATE OR REPLACE FUNCTION get_newsletter_stats()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.users),
        'active_users', (SELECT COUNT(*) FROM public.users WHERE is_active = true),
        'total_newsletters_sent', (SELECT COUNT(*) FROM public.newsletter_logs),
        'last_newsletter_date', (SELECT MAX(sent_at) FROM public.newsletter_logs),
        'average_recipients', (SELECT ROUND(AVG(recipients_count)) FROM public.newsletter_logs)
    );
$$;

-- 11. Insérer des données de test si nécessaire
-- Créer un utilisateur admin test (à adapter selon vos besoins)
INSERT INTO public.users (email, first_name, last_name, is_active, role)
VALUES ('user@toto.com', 'Admin', 'CSE', true, 'admin')
ON CONFLICT (email) DO UPDATE SET 
    role = 'admin',
    is_active = true;

-- Insérer quelques utilisateurs test
INSERT INTO public.users (email, first_name, last_name, is_active, role) VALUES
    ('alice.martin@pep973.fr', 'Alice', 'Martin', true, 'user'),
    ('bob.dupont@pep973.fr', 'Bob', 'Dupont', true, 'user'),
    ('claire.bernard@pep973.fr', 'Claire', 'Bernard', true, 'user'),
    ('david.moreau@pep973.fr', 'David', 'Moreau', false, 'user'), -- Utilisateur inactif
    ('emma.petit@pep973.fr', 'Emma', 'Petit', true, 'user')
ON CONFLICT (email) DO NOTHING;

-- 12. Commentaires pour documentation
COMMENT ON TABLE public.users IS 'Table des utilisateurs du CSE avec statut actif/inactif';
COMMENT ON TABLE public.newsletter_logs IS 'Historique des newsletters envoyées';
COMMENT ON TABLE public.newsletter_recipients IS 'Détail des destinataires par newsletter pour tracking';
COMMENT ON COLUMN public.users.is_active IS 'Indique si l''utilisateur est actif et doit recevoir les newsletters';
COMMENT ON COLUMN public.users.role IS 'Rôle de l''utilisateur: user, admin';
COMMENT ON FUNCTION get_active_users() IS 'Retourne la liste des utilisateurs actifs pour l''envoi de newsletter';
COMMENT ON FUNCTION get_newsletter_stats() IS 'Retourne les statistiques globales du système de newsletter'; 