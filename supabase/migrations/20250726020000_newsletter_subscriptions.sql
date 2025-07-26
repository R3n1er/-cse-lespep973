-- Migration : Table newsletter_subscriptions pour gestion des abonnements à la newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    first_name text,
    last_name text,
    is_active boolean NOT NULL DEFAULT true,
    subscribed_at timestamptz NOT NULL DEFAULT now(),
    unsubscribed_at timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active ON newsletter_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscribed_at ON newsletter_subscriptions(subscribed_at);

-- RLS (Row Level Security) pour les abonnements
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir leurs propres abonnements
CREATE POLICY "Les utilisateurs peuvent voir leurs propres abonnements" ON newsletter_subscriptions
    FOR SELECT USING (
        email = (
            SELECT email FROM users WHERE id = auth.uid()
        )
    );

-- Politique : Les utilisateurs peuvent créer des abonnements
CREATE POLICY "Les utilisateurs peuvent créer des abonnements" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Politique : Les utilisateurs peuvent modifier leurs propres abonnements
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres abonnements" ON newsletter_subscriptions
    FOR UPDATE USING (
        email = (
            SELECT email FROM users WHERE id = auth.uid()
        )
    );

-- Politique : Les administrateurs et gestionnaires peuvent voir tous les abonnements
CREATE POLICY "Les administrateurs et gestionnaires peuvent voir tous les abonnements" ON newsletter_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'gestionnaire')
        )
    );

-- Trigger pour mettre à jour le champ updated_at
CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 