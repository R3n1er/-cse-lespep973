-- Script final pour corriger la récursion infinie RLS
-- CSE Les PEP 973 - 27 Janvier 2025

-- ÉTAPE 1: Désactiver complètement RLS sur users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 2: Supprimer TOUTES les politiques existantes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Basic user access" ON users;
DROP POLICY IF EXISTS "Secure user access" ON users;
DROP POLICY IF EXISTS "Secure user update" ON users;

-- ÉTAPE 3: Vérifier qu'il n'y a plus de politiques
-- (Cette requête devrait retourner 0 lignes)
SELECT COUNT(*) as policies_count 
FROM pg_policies 
WHERE tablename = 'users';

-- ÉTAPE 4: Créer une politique simple et sécurisée
CREATE POLICY "Simple user access" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Simple user update" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- ÉTAPE 5: Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 6: Vérification finale
SELECT 
    policyname,
    cmd,
    permissive,
    qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- ÉTAPE 7: Test d'accès (optionnel)
-- Cette requête devrait fonctionner si tout est correct
-- SELECT * FROM users WHERE id = auth.uid() LIMIT 1; 