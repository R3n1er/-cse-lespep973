-- Migration pour ajouter author_id à blog_comments
-- Date: 27 Janvier 2025
-- Description: Ajout de la colonne author_id manquante

-- Ajouter la colonne author_id à blog_comments si elle n'existe pas
ALTER TABLE blog_comments 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Mettre à jour les commentaires existants avec l'utilisateur de test
UPDATE blog_comments 
SET author_id = (SELECT id FROM auth.users WHERE email = 'user@toto.com' LIMIT 1)
WHERE author_id IS NULL;

-- Créer l'index pour author_id
CREATE INDEX IF NOT EXISTS idx_blog_comments_author_id ON blog_comments(author_id); 