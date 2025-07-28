# 📋 Instructions de Migration Newsletter - Application Manuelle

## 🎯 Objectif

Créer les tables et fonctions nécessaires pour le système de newsletter automatique du CSE.

## 🚀 Étapes à suivre

### 1. Accéder au Dashboard Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Se connecter à votre projet
3. Naviguer vers **SQL Editor** dans le menu de gauche

### 2. Exécuter le Script SQL Principal

Copiez-collez le script suivant dans l'éditeur SQL et exécutez-le :

```sql
-- =====================================================
-- MIGRATION NEWSLETTER CSE LES PEP 973
-- À exécuter dans le SQL Editor de Supabase
-- =====================================================

-- 1. Ajouter les champs manquants à la table users existante
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- 2. Créer la table pour les logs de newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    recipients_count INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table pour tracker les emails envoyés
CREATE TABLE IF NOT EXISTS public.newsletter_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    newsletter_log_id UUID REFERENCES newsletter_logs(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent',
    mailgun_id VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_sent_at ON public.newsletter_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_recipients_email ON public.newsletter_recipients(user_email);
CREATE INDEX IF NOT EXISTS idx_newsletter_recipients_status ON public.newsletter_recipients(status);

-- 5. Activer RLS sur les nouvelles tables
ALTER TABLE public.newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_recipients ENABLE ROW LEVEL SECURITY;

-- 6. Créer les politiques RLS pour newsletter_logs
CREATE POLICY "Only authenticated users can view newsletter logs" ON public.newsletter_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert newsletter logs" ON public.newsletter_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 7. Créer les politiques RLS pour newsletter_recipients
CREATE POLICY "Only authenticated users can view newsletter recipients" ON public.newsletter_recipients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert newsletter recipients" ON public.newsletter_recipients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 8. Fonction pour obtenir les utilisateurs actifs
CREATE OR REPLACE FUNCTION get_active_users()
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT u.id, u.email, u.first_name, u.last_name
    FROM public.users u
    WHERE u.is_active = true
    AND u.email IS NOT NULL
    AND u.email != '';
$$;

-- 9. Fonction pour obtenir les statistiques newsletter
CREATE OR REPLACE FUNCTION get_newsletter_stats()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.users),
        'active_users', (SELECT COUNT(*) FROM public.users WHERE is_active = true),
        'total_newsletters_sent', (SELECT COUNT(*) FROM public.newsletter_logs),
        'last_newsletter_date', (SELECT MAX(sent_at) FROM public.newsletter_logs),
        'average_recipients', (SELECT ROUND(AVG(recipients_count)) FROM public.newsletter_logs)
    );
$$;

-- 10. Insérer des données de test
-- Mettre à jour l'utilisateur admin existant
UPDATE public.users
SET
    is_active = true,
    first_name = 'Admin',
    last_name = 'CSE'
WHERE email = 'user@toto.com';

-- 11. Commentaires pour documentation
COMMENT ON TABLE public.newsletter_logs IS 'Historique des newsletters envoyées';
COMMENT ON TABLE public.newsletter_recipients IS 'Détail des destinataires par newsletter pour tracking';
COMMENT ON COLUMN public.users.is_active IS 'Indique si l''utilisateur est actif et doit recevoir les newsletters';
COMMENT ON FUNCTION get_active_users() IS 'Retourne la liste des utilisateurs actifs pour l''envoi de newsletter';
COMMENT ON FUNCTION get_newsletter_stats() IS 'Retourne les statistiques globales du système de newsletter';
```

### 3. Vérifier la Migration

Après l'exécution, vérifiez que tout fonctionne en exécutant ces requêtes de test :

```sql
-- Test 1: Vérifier les tables créées
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('newsletter_logs', 'newsletter_recipients');

-- Test 2: Vérifier les fonctions
SELECT get_active_users();

-- Test 3: Vérifier les statistiques
SELECT get_newsletter_stats();

-- Test 4: Insérer un log de test
INSERT INTO newsletter_logs (subject, content, recipients_count, sent_count, failed_count, sent_by)
VALUES ('Test Newsletter', '<h1>Test</h1>', 0, 0, 0, 'manual_setup');
```

### 4. Configuration des Variables d'Environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon

# Mailgun (pour l'envoi de newsletters)
MAILGUN_API_KEY=votre_clé_mailgun
MAILGUN_DOMAIN=votre_domaine_mailgun
```

### 5. Test du Système

Après la migration, testez le système avec :

```bash
npx tsx scripts/setup-newsletter-tables.ts
```

## ✅ Vérification du Succès

La migration est réussie si :

- ✅ Les tables `newsletter_logs` et `newsletter_recipients` existent
- ✅ Les fonctions `get_active_users()` et `get_newsletter_stats()` fonctionnent
- ✅ L'utilisateur `user@toto.com` a les champs `is_active`, `first_name`, `last_name`
- ✅ Les politiques RLS sont actives et fonctionnelles

## 🚨 Problèmes Courants

### Erreur: "relation already exists"

**Solution:** Ignorez l'erreur, la table existe déjà.

### Erreur: "permission denied"

**Solution:** Assurez-vous d'être connecté avec un compte admin sur Supabase.

### Erreur: "function already exists"

**Solution:** Utilisez `CREATE OR REPLACE FUNCTION` au lieu de `CREATE FUNCTION`.

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs d'erreur dans le SQL Editor
2. Assurez-vous que tous les `CREATE IF NOT EXISTS` sont utilisés
3. Exécutez les requêtes une par une en cas de problème

---

**🎉 Une fois la migration terminée, votre système de newsletter automatique sera opérationnel !**
