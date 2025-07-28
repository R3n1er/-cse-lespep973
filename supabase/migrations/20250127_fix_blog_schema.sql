-- Migration de correction pour le schéma Blog
-- Date: 27 Janvier 2025
-- Description: Ajout des colonnes manquantes aux tables blog existantes

-- Ajouter les colonnes manquantes à blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ajouter les colonnes manquantes à blog_comments
ALTER TABLE blog_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ajouter les colonnes manquantes à blog_reactions
ALTER TABLE blog_reactions 
ADD COLUMN IF NOT EXISTS reaction_type VARCHAR(20) DEFAULT 'like';

-- Créer les index manquants (seulement ceux qui ne causent pas d'erreur)
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_post_id ON blog_reactions(post_id);

-- Mettre à jour les articles existants pour avoir un statut par défaut
UPDATE blog_posts SET status = 'published' WHERE status IS NULL;

-- Mettre à jour les commentaires existants pour être approuvés par défaut
UPDATE blog_comments SET is_approved = true WHERE is_approved IS NULL;

-- Mettre à jour les réactions existantes pour avoir un type par défaut
UPDATE blog_reactions SET reaction_type = 'like' WHERE reaction_type IS NULL; 