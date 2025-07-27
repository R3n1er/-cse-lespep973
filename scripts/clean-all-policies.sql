-- Script pour nettoyer TOUTES les politiques RLS sur la table users
-- CSE Les PEP 973 - 27 Janvier 2025

-- ÉTAPE 1: Désactiver RLS temporairement
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 2: Supprimer TOUTES les politiques existantes (même celles avec des noms longs)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Basic user access" ON users;
DROP POLICY IF EXISTS "Secure user access" ON users;
DROP POLICY IF EXISTS "Secure user update" ON users;
DROP POLICY IF EXISTS "Simple user access" ON users;
DROP POLICY IF EXISTS "Simple user update" ON users;

-- Supprimer les politiques avec des noms longs (celles que vous avez vues)
DROP POLICY IF EXISTS "Les administrateurs et gestionnaires peuvent voir tous les util" ON users;
DROP POLICY IF EXISTS "Les administrateurs peuvent modifier tous les utilisateurs" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON users;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON users;

-- ÉTAPE 3: Vérifier qu'il n'y a plus AUCUNE politique
SELECT COUNT(*) as remaining_policies 
FROM pg_policies 
WHERE tablename = 'users';

-- ÉTAPE 4: Créer UNE SEULE politique simple et sécurisée
CREATE POLICY "User self access" ON users
    FOR ALL USING (auth.uid()::text = id::text);

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