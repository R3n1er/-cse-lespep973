-- Script de correction des politiques RLS pour l'application CSE Les PEP 973
-- Résout les problèmes de "infinite recursion detected in policy"

-- 1. Supprimer les politiques RLS problématiques
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON blog_comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON cinema_tickets;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON newsletter_subscriptions;

-- 2. Créer des politiques RLS simplifiées et sécurisées

-- Politique pour la table users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour blog_posts (lecture publique, écriture admin)
CREATE POLICY "Public read access for blog posts" ON blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Admin write access for blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'gestionnaire')
        )
    );

-- Politique pour blog_comments
CREATE POLICY "Public read access for approved comments" ON blog_comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can insert comments" ON blog_comments
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Users can update own comments" ON blog_comments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.id = blog_comments.user_id
        )
    );

-- Politique pour blog_reactions
CREATE POLICY "Public read access for reactions" ON blog_reactions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage reactions" ON blog_reactions
    FOR ALL USING (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Politique pour cinema_tickets (lecture publique)
CREATE POLICY "Public read access for cinema tickets" ON cinema_tickets
    FOR SELECT USING (true);

CREATE POLICY "Admin write access for cinema tickets" ON cinema_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'gestionnaire')
        )
    );

-- Politique pour orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.id = orders.user_id
        )
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Politique pour newsletter_subscriptions
CREATE POLICY "Public read access for newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage own subscription" ON newsletter_subscriptions
    FOR UPDATE USING (
        email = auth.jwt() ->> 'email'
    );

-- 3. Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cinema_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Vérification des politiques
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 