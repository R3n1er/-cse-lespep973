-- Migration : Table blog_reactions pour gestion des réactions (likes) d'articles
CREATE TABLE IF NOT EXISTS blog_reactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type text NOT NULL DEFAULT 'like', -- 'like', 'love', 'wow', etc.
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    -- Contrainte unique pour éviter les doublons
    UNIQUE(post_id, user_id, reaction_type)
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_blog_reactions_post_id ON blog_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_user_id ON blog_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_type ON blog_reactions(reaction_type);

-- RLS (Row Level Security) pour les réactions
ALTER TABLE blog_reactions ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir toutes les réactions
CREATE POLICY "Les utilisateurs peuvent voir toutes les réactions" ON blog_reactions
    FOR SELECT USING (true);

-- Politique : Les utilisateurs connectés peuvent créer des réactions
CREATE POLICY "Les utilisateurs connectés peuvent créer des réactions" ON blog_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent modifier leurs propres réactions
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres réactions" ON blog_reactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres réactions
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres réactions" ON blog_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour mettre à jour le champ updated_at
CREATE TRIGGER update_blog_reactions_updated_at
  BEFORE UPDATE ON blog_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
