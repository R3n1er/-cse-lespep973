-- Migration : Table demande_acces pour gestion des demandes d’accès utilisateurs non injectés
CREATE TABLE IF NOT EXISTS demande_acces (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    etablissement text NOT NULL,
    statut text NOT NULL DEFAULT 'en_attente',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_demande_acces_email ON demande_acces(email); 