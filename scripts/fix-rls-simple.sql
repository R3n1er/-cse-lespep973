-- Script simplifié pour corriger la récursion infinie RLS
-- Problème principal : Politiques RLS sur la table users qui causent une récursion

-- 1. Désactiver temporairement RLS sur users pour éviter la récursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer les politiques problématiques
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Créer une politique simple et sécurisée
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 4. Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Vérification
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname; 