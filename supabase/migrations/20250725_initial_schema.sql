-- Création de l'extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de l'enum pour les rôles utilisateurs
CREATE TYPE user_role AS ENUM ('salarie', 'gestionnaire', 'admin', 'tresorerie');

-- Création de l'enum pour les statuts de commande
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');

-- Création de l'enum pour les statuts de remboursement
CREATE TYPE reimbursement_status AS ENUM ('pending', 'approved', 'rejected');

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  matricule TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role user_role NOT NULL DEFAULT 'salarie',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des remboursements
CREATE TABLE IF NOT EXISTS reimbursements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  proof_url TEXT NOT NULL,
  status reimbursement_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_exception BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des questionnaires
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des questions
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT NOT NULL, -- 'text', 'multiple_choice', 'single_choice'
  options JSONB, -- Pour les questions à choix multiples
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réponses aux questionnaires
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL si anonyme
  responses JSONB NOT NULL, -- Stocke toutes les réponses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paramètres du CSE
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des paramètres par défaut
INSERT INTO settings (key, value, description) VALUES
  ('reimbursement_rate', '{"rate": 0.5, "max_amount": 200}', 'Taux de remboursement et montant maximum annuel'),
  ('ticket_order_limit', '{"limit": 5}', 'Limite de tickets par commande'),
  ('ticket_cancellation_period', '{"days": 30}', 'Période d''annulation des tickets en jours');

-- Création des politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les administrateurs et gestionnaires peuvent voir tous les utilisateurs" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire')
    )
  );

CREATE POLICY "Les administrateurs peuvent modifier tous les utilisateurs" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour la table tickets
CREATE POLICY "Tous les utilisateurs peuvent voir les tickets actifs" ON tickets
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Les administrateurs et gestionnaires peuvent voir tous les tickets" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire')
    )
  );

CREATE POLICY "Les administrateurs et gestionnaires peuvent modifier les tickets" ON tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire')
    )
  );

-- Politiques pour la table orders
CREATE POLICY "Les utilisateurs peuvent voir leurs propres commandes" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Les administrateurs et gestionnaires peuvent voir toutes les commandes" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire')
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des commandes" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Les administrateurs et gestionnaires peuvent modifier les commandes" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire')
    )
  );

-- Politiques pour la table reimbursements
CREATE POLICY "Les utilisateurs peuvent voir leurs propres remboursements" ON reimbursements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Les administrateurs, gestionnaires et trésoriers peuvent voir tous les remboursements" ON reimbursements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire' OR role = 'tresorerie')
    )
  );

CREATE POLICY "Les utilisateurs peuvent créer des demandes de remboursement" ON reimbursements
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Les administrateurs, gestionnaires et trésoriers peuvent modifier les remboursements" ON reimbursements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'gestionnaire' OR role = 'tresorerie')
    )
  );

-- Politiques pour la table blog_posts
CREATE POLICY "Tous les utilisateurs peuvent voir les articles publiés" ON blog_posts
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Les administrateurs peuvent voir tous les articles" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les administrateurs peuvent créer et modifier des articles" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la table settings
CREATE POLICY "Les administrateurs peuvent voir et modifier les paramètres" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Création des fonctions et triggers

-- Fonction pour mettre à jour le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour le champ updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reimbursements_updated_at
  BEFORE UPDATE ON reimbursements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_survey_questions_updated_at
  BEFORE UPDATE ON survey_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Fonction pour mettre à jour le stock de tickets lors d'une commande
CREATE OR REPLACE FUNCTION update_ticket_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Réduire le stock lors de la création d'une commande
  IF TG_OP = 'INSERT' THEN
    UPDATE tickets
    SET stock = stock - NEW.quantity
    WHERE id = NEW.ticket_id;
  -- Ajuster le stock lors de la modification d'une commande
  ELSIF TG_OP = 'UPDATE' THEN
    -- Si la commande est annulée, remettre les tickets en stock
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      UPDATE tickets
      SET stock = stock + NEW.quantity
      WHERE id = NEW.ticket_id;
    -- Si la quantité est modifiée
    ELSIF NEW.quantity != OLD.quantity THEN
      UPDATE tickets
      SET stock = stock + OLD.quantity - NEW.quantity
      WHERE id = NEW.ticket_id;
    END IF;
  -- Remettre les tickets en stock lors de la suppression d'une commande
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tickets
    SET stock = stock + OLD.quantity
    WHERE id = OLD.ticket_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le stock de tickets
CREATE TRIGGER update_ticket_stock
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_stock();