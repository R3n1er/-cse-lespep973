-- Migration pour créer les tables tickets et orders
-- Date: 27 Janvier 2025

-- Création de l'enum pour les statuts de commande
CREATE TYPE order_status AS ENUM (
  'pending',      -- En attente de validation
  'confirmed',    -- Confirmée
  'cancelled',    -- Annulée
  'delivered',    -- Livrée
  'refunded'      -- Remboursée
);

-- Table des tickets disponibles
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  max_per_user INTEGER NOT NULL DEFAULT 5 CHECK (max_per_user > 0),
  category VARCHAR(100) NOT NULL DEFAULT 'cinema',
  cinema_location VARCHAR(255), -- Pour les tickets de cinéma (AGORA, Uranus)
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes de tickets
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  status order_status DEFAULT 'pending',
  notes TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte unique pour éviter les doublons
  UNIQUE(user_id, ticket_id, created_at)
);

-- Table des listes d'attente (quand stock épuisé)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un utilisateur ne peut être qu'une fois en liste d'attente pour un ticket
  UNIQUE(user_id, ticket_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_active ON tickets(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_ticket_id ON waitlist(ticket_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON waitlist(notified);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour vérifier le stock avant commande
CREATE OR REPLACE FUNCTION check_stock_before_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier si le stock est suffisant
  IF (SELECT stock FROM tickets WHERE id = NEW.ticket_id) < NEW.quantity THEN
    RAISE EXCEPTION 'Stock insuffisant pour ce ticket';
  END IF;
  
  -- Vérifier la limite par utilisateur
  IF (SELECT COUNT(*) FROM orders 
      WHERE user_id = NEW.user_id 
      AND ticket_id = NEW.ticket_id 
      AND created_at >= DATE_TRUNC('month', NOW())
      AND status != 'cancelled') + NEW.quantity > 
     (SELECT max_per_user FROM tickets WHERE id = NEW.ticket_id) THEN
    RAISE EXCEPTION 'Limite mensuelle dépassée pour ce ticket';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour vérifier le stock
CREATE TRIGGER check_stock_before_order_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION check_stock_before_order();

-- Fonction pour mettre à jour le stock après commande
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le stock quand une commande est confirmée
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE tickets 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW.ticket_id;
  END IF;
  
  -- Restaurer le stock si une commande est annulée
  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE tickets 
    SET stock = stock + NEW.quantity 
    WHERE id = NEW.ticket_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour le stock
CREATE TRIGGER update_stock_after_order_trigger AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();

-- Insertion de données de test pour les tickets
INSERT INTO tickets (name, description, price, stock, max_per_user, category, cinema_location) VALUES
('Ticket Cinéma AGORA - Cayenne', 'Ticket pour le cinéma AGORA à Cayenne. Films en cours et à venir.', 8.00, 50, 4, 'cinema', 'AGORA - Cayenne'),
('Ticket Cinéma Uranus - Kourou', 'Ticket pour le cinéma Uranus à Kourou. Films en cours et à venir.', 8.00, 30, 4, 'cinema', 'Uranus - Kourou'),
('Piscine Municipale - Cayenne', 'Accès à la piscine municipale de Cayenne. Valable 1 mois.', 3.00, 100, 2, 'loisirs', 'Piscine Municipale - Cayenne'),
('Musée Départemental', 'Entrée gratuite au musée départemental. Exposition permanente et temporaire.', 0.00, 200, 2, 'culture', 'Musée Départemental - Cayenne'),
('Parc Zoologique', 'Entrée au parc zoologique de Guyane. Découverte de la faune locale.', 15.00, 25, 2, 'loisirs', 'Parc Zoologique - Cayenne');

-- Politiques RLS pour la sécurité
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Politiques pour tickets (lecture publique, écriture admin)
CREATE POLICY "Tickets are viewable by everyone" ON tickets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Tickets are insertable by admin" ON tickets
  FOR INSERT WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Tickets are updatable by admin" ON tickets
  FOR UPDATE USING (auth.role() = 'admin');

-- Politiques pour orders (utilisateur voit ses commandes, admin voit tout)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (auth.role() = 'admin' OR auth.role() = 'gestionnaire');

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (auth.role() = 'admin' OR auth.role() = 'gestionnaire');

-- Politiques pour waitlist
CREATE POLICY "Users can view their own waitlist entries" ON waitlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own waitlist entries" ON waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all waitlist entries" ON waitlist
  FOR SELECT USING (auth.role() = 'admin' OR auth.role() = 'gestionnaire');

CREATE POLICY "Admins can update all waitlist entries" ON waitlist
  FOR UPDATE USING (auth.role() = 'admin' OR auth.role() = 'gestionnaire'); 