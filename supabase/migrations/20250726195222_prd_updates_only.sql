-- Migration PRD v2.1 - Mise à jour uniquement des nouveaux éléments
-- Date: 26 Janvier 2025

-- 0. Créer la fonction update_updated_at_column si elle n'existe pas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Ajouter les nouveaux champs utilisateur si ils n'existent pas déjà
DO $$ 
BEGIN
  -- Ajouter personal_email si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'personal_email') THEN
    ALTER TABLE users ADD COLUMN personal_email VARCHAR(255);
  END IF;
  
  -- Ajouter children_count si n'existe pas  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'children_count') THEN
    ALTER TABLE users ADD COLUMN children_count INTEGER DEFAULT 0 CHECK (children_count >= 0 AND children_count <= 10);
  END IF;
  
  -- Ajouter children_birth_dates si n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'children_birth_dates') THEN
    ALTER TABLE users ADD COLUMN children_birth_dates JSONB;
  END IF;
END $$;

-- 2. Ajouter les nouveaux types pour les cinémas si ils n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cinema_location') THEN
    CREATE TYPE cinema_location AS ENUM ('agora_cayenne', 'uranus_kourou');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');
  END IF;
END $$;

-- 3. Créer les tables de cinéma si elles n'existent pas
CREATE TABLE IF NOT EXISTS cinema_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cinema cinema_location NOT NULL,
  cinema_name VARCHAR(100) NOT NULL,
  ticket_type VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cse_price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  available_from DATE NOT NULL,
  available_until DATE NOT NULL,
  description TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_price_range CHECK (price > 0 AND cse_price > 0 AND cse_price <= price),
  CONSTRAINT valid_date_range CHECK (available_until >= available_from)
);

CREATE TABLE IF NOT EXISTS cinema_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  delivery_method VARCHAR(50) NOT NULL DEFAULT 'pickup',
  delivery_address TEXT,
  notes TEXT,
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cinema_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES cinema_orders(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES cinema_tickets(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Index si ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_users_personal_email ON users(personal_email) WHERE personal_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cinema_tickets_cinema ON cinema_tickets(cinema);
CREATE INDEX IF NOT EXISTS idx_cinema_tickets_status ON cinema_tickets(stock_quantity) WHERE stock_quantity > 0;
CREATE INDEX IF NOT EXISTS idx_cinema_orders_user_id ON cinema_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cinema_order_items_order_id ON cinema_order_items(order_id);

-- 5. Triggers si ils n'existent pas
DO $$
BEGIN
  -- Trigger pour children validation
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validate_children_data') THEN
    CREATE OR REPLACE FUNCTION validate_children_birth_dates()
    RETURNS TRIGGER AS $trigger$
    BEGIN
      IF NEW.children_birth_dates IS NOT NULL THEN
        IF NOT (NEW.children_birth_dates ? '0' OR NEW.children_birth_dates = '[]'::jsonb) THEN
          RAISE EXCEPTION 'children_birth_dates doit être un tableau JSON';
        END IF;
        
        IF jsonb_array_length(NEW.children_birth_dates) != COALESCE(NEW.children_count, 0) THEN
          RAISE EXCEPTION 'Le nombre d''enfants ne correspond pas aux informations fournies';
        END IF;
      END IF;
      
      IF NEW.children_count < 0 OR NEW.children_count > 10 THEN
        RAISE EXCEPTION 'children_count doit être entre 0 et 10';
      END IF;
      
      RETURN NEW;
    END;
    $trigger$ LANGUAGE plpgsql;

    CREATE TRIGGER validate_children_data
      BEFORE INSERT OR UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION validate_children_birth_dates();
  END IF;
  
  -- Triggers pour updated_at sur les nouvelles tables
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cinema_tickets_updated_at') THEN
    CREATE TRIGGER update_cinema_tickets_updated_at 
      BEFORE UPDATE ON cinema_tickets 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cinema_orders_updated_at') THEN
    CREATE TRIGGER update_cinema_orders_updated_at 
      BEFORE UPDATE ON cinema_orders 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 6. RLS pour les nouvelles tables
ALTER TABLE cinema_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cinema_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cinema_order_items ENABLE ROW LEVEL SECURITY;

-- 7. Politiques RLS (seulement si elles n'existent pas)
DO $$
BEGIN
  -- Politiques cinema_tickets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cinema tickets are viewable by everyone' AND tablename = 'cinema_tickets') THEN
    CREATE POLICY "Cinema tickets are viewable by everyone" 
      ON cinema_tickets FOR SELECT 
      TO authenticated
      USING (stock_quantity > 0 AND available_until >= CURRENT_DATE);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Managers can manage cinema tickets' AND tablename = 'cinema_tickets') THEN
    CREATE POLICY "Managers can manage cinema tickets" 
      ON cinema_tickets FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text 
          AND role IN ('admin', 'gestionnaire')
        )
      );
  END IF;
  
  -- Politiques cinema_orders
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own orders' AND tablename = 'cinema_orders') THEN
    CREATE POLICY "Users can view their own orders" 
      ON cinema_orders FOR SELECT 
      USING (user_id::text = auth.uid()::text);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own orders' AND tablename = 'cinema_orders') THEN
    CREATE POLICY "Users can create their own orders" 
      ON cinema_orders FOR INSERT 
      WITH CHECK (user_id::text = auth.uid()::text);
  END IF;
END $$;

-- 8. Données initiales pour les cinémas (seulement si la table est vide)
INSERT INTO cinema_tickets (cinema, cinema_name, ticket_type, price, cse_price, stock_quantity, available_from, available_until, description)
SELECT 'agora_cayenne', 'Cinéma AGORA', 'Adulte', 9.50, 7.50, 100, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 'Ticket cinéma adulte au Cinéma AGORA à Cayenne'
WHERE NOT EXISTS (SELECT 1 FROM cinema_tickets WHERE cinema = 'agora_cayenne' AND ticket_type = 'Adulte');

INSERT INTO cinema_tickets (cinema, cinema_name, ticket_type, price, cse_price, stock_quantity, available_from, available_until, description)
SELECT 'agora_cayenne', 'Cinéma AGORA', 'Enfant (-12 ans)', 7.50, 6.00, 50, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 'Ticket cinéma enfant (moins de 12 ans) au Cinéma AGORA à Cayenne'
WHERE NOT EXISTS (SELECT 1 FROM cinema_tickets WHERE cinema = 'agora_cayenne' AND ticket_type = 'Enfant (-12 ans)');

INSERT INTO cinema_tickets (cinema, cinema_name, ticket_type, price, cse_price, stock_quantity, available_from, available_until, description)
SELECT 'uranus_kourou', 'Cinéma Uranus', 'Adulte', 8.50, 6.50, 80, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 'Ticket cinéma adulte au Cinéma Uranus à Kourou'
WHERE NOT EXISTS (SELECT 1 FROM cinema_tickets WHERE cinema = 'uranus_kourou' AND ticket_type = 'Adulte');

INSERT INTO cinema_tickets (cinema, cinema_name, ticket_type, price, cse_price, stock_quantity, available_from, available_until, description)
SELECT 'uranus_kourou', 'Cinéma Uranus', 'Enfant (-12 ans)', 7.00, 5.50, 40, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months', 'Ticket cinéma enfant (moins de 12 ans) au Cinéma Uranus à Kourou'
WHERE NOT EXISTS (SELECT 1 FROM cinema_tickets WHERE cinema = 'uranus_kourou' AND ticket_type = 'Enfant (-12 ans)');

-- 9. Commentaires pour documentation
COMMENT ON COLUMN users.personal_email IS 'Email personnel du salarié (modifiable selon PRD)';
COMMENT ON COLUMN users.children_count IS 'Nombre d''enfants pour avantages CSE (0-10, modifiable selon PRD)';
COMMENT ON COLUMN users.children_birth_dates IS 'Informations enfants: [{name: string, birthDate: date}] (modifiable selon PRD)';
COMMENT ON TABLE cinema_tickets IS 'Catalogue des tickets de cinéma disponibles (AGORA Cayenne et Uranus Kourou)';
COMMENT ON TABLE cinema_orders IS 'Commandes de tickets de cinéma des utilisateurs';
COMMENT ON TABLE cinema_order_items IS 'Détails des articles dans chaque commande';
