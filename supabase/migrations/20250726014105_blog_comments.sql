-- Migration : Table blog_comments pour gestion des commentaires d'articles
CREATE TABLE IF NOT EXISTS blog_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content text NOT NULL,
    parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE, -- Pour les réponses aux commentaires
    is_approved boolean NOT NULL DEFAULT false, -- Modération des commentaires
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide par article
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(is_approved);

-- RLS (Row Level Security) pour les commentaires
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir les commentaires approuvés
CREATE POLICY "Les utilisateurs peuvent voir les commentaires approuvés" ON blog_comments
    FOR SELECT USING (is_approved = true);

-- Politique : Les utilisateurs connectés peuvent créer des commentaires
CREATE POLICY "Les utilisateurs connectés peuvent créer des commentaires" ON blog_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent modifier leurs propres commentaires
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres commentaires" ON blog_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres commentaires
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres commentaires" ON blog_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Politique : Les administrateurs et gestionnaires peuvent voir tous les commentaires
CREATE POLICY "Les administrateurs et gestionnaires peuvent voir tous les commentaires" ON blog_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'gestionnaire')
        )
    );

-- Politique : Les administrateurs et gestionnaires peuvent approuver/modérer les commentaires
CREATE POLICY "Les administrateurs et gestionnaires peuvent modérer les commentaires" ON blog_comments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'gestionnaire')
        )
    );

-- Trigger pour mettre à jour le champ updated_at
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
