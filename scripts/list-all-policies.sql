-- Script pour lister toutes les politiques RLS
-- CSE Les PEP 973 - 27 Janvier 2025

-- Lister toutes les politiques sur la table users
SELECT 
    policyname,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Compter le nombre total de politiques
SELECT COUNT(*) as total_policies 
FROM pg_policies 
WHERE tablename = 'users';

-- Identifier les politiques qui référencent la table users (cause de récursion)
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users' 
AND qual LIKE '%users%'
ORDER BY policyname; 