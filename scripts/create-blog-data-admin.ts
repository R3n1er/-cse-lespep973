#!/usr/bin/env tsx

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createBlogDataAdmin() {
  console.log("📝 CRÉATION DES DONNÉES DE TEST POUR LE BLOG (ADMIN)");
  console.log("====================================================\n");

  try {
    // 1. Récupérer l'utilisateur de test
    console.log("1️⃣ Récupération de l'utilisateur de test...");
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", "user@toto.com")
      .single();

    if (userError) {
      console.error(
        "❌ Erreur lors de la récupération de l'utilisateur:",
        userError.message
      );
      return;
    }

    console.log("✅ Utilisateur trouvé:", user.id);

    // 2. Créer des articles de test
    console.log("\n2️⃣ Création des articles de test...");

    const articles = [
      {
        title: "Bienvenue sur le Blog CSE Les PEP 973",
        content: `Nous sommes ravis de vous accueillir sur notre nouveau blog ! Ici, vous trouverez toutes les actualités, événements et informations importantes concernant le CSE Les PEP 973.

## Nos missions

Le CSE (Comité Social et Économique) a pour mission d'améliorer les conditions de travail et la qualité de vie au travail de tous les salariés. Nous organisons régulièrement des événements culturels, sportifs et sociaux pour favoriser la cohésion d'équipe.

## Prochaines activités

- **Cinéma** : Séances de cinéma à prix réduits
- **Culture** : Remboursements pour les activités culturelles
- **Événements** : Sorties et activités de groupe
- **Newsletter** : Restez informés de nos actualités

Restez connectés pour ne manquer aucune de nos actualités !`,
        category: "actualites",
        excerpt:
          "Découvrez les missions et activités du CSE Les PEP 973 à travers notre nouveau blog.",
      },
      {
        title: "Guide des Remboursements Culturels 2025",
        content: `Le CSE Les PEP 973 vous accompagne dans vos activités culturelles avec un budget annuel de 200€ par salarié.

## Activités éligibles

### Cinéma et Théâtre
- Places de cinéma (limite : 2 par mois)
- Spectacles de théâtre
- Concerts et opéras

### Musées et Expositions
- Entrées de musées
- Expositions temporaires
- Visites guidées

### Livres et Médias
- Achat de livres
- Abonnements culturels
- Cours et ateliers

## Comment procéder

1. **Participer à l'activité**
2. **Conserver les justificatifs** (factures, tickets)
3. **Remplir le formulaire** dans votre espace personnel
4. **Uploader les justificatifs**
5. **Attendre la validation** (délai : 5 jours ouvrés)

## Montants de remboursement

- **Cinéma** : 50% du prix (max 10€)
- **Théâtre/Concert** : 50% du prix (max 30€)
- **Musée/Exposition** : 100% du prix (max 15€)
- **Livres** : 50% du prix (max 20€)

Pour toute question, n'hésitez pas à nous contacter !`,
        category: "guides",
        excerpt:
          "Tout savoir sur les remboursements culturels proposés par le CSE en 2025.",
      },
      {
        title: "Prochain Événement : Sortie Cinéma",
        content: `Nous organisons une sortie cinéma le samedi 15 février 2025 !

## Détails de l'événement

**Film** : À déterminer (vote en cours)
**Date** : Samedi 15 février 2025
**Heure** : 20h00
**Lieu** : Cinéma Pathé de votre ville
**Prix** : 5€ par personne (au lieu de 12€)

## Comment participer

1. **Inscrivez-vous** via le formulaire en ligne
2. **Payez votre place** (5€)
3. **Recevez votre ticket** par email
4. **Profitez du film** en bonne compagnie !

## Vote pour le film

Nous avons sélectionné 3 films pour cette soirée :
- **Option A** : Film d'action/aventure
- **Option B** : Comédie française
- **Option C** : Film d'animation

Votez pour votre préféré dans l'espace commentaires !

## Inscriptions

Les inscriptions sont ouvertes jusqu'au 10 février 2025.
Places limitées à 50 personnes.

À bientôt !`,
        category: "evenements",
        excerpt:
          "Sortie cinéma organisée par le CSE le 15 février 2025. Inscriptions ouvertes !",
      },
      {
        title: "Nouveautés : Espace de Discussion",
        content: `Nous avons ajouté un espace de discussion à notre blog !

## Fonctionnalités disponibles

### Commentaires
- Commentez les articles
- Répondez aux autres commentaires
- Partagez vos expériences

### Réactions
- Likez les articles que vous aimez
- Marquez les articles comme utiles
- Exprimez vos émotions

### Modération
- Tous les commentaires sont modérés
- Respectez les règles de bonne conduite
- Restez bienveillants et constructifs

## Comment utiliser

1. **Lisez un article** qui vous intéresse
2. **Laissez un commentaire** en bas de page
3. **Réagissez** aux articles avec les boutons
4. **Partagez** avec vos collègues

## Règles de modération

- Respectez les autres utilisateurs
- Pas de spam ou de publicité
- Restez dans le sujet de l'article
- Utilisez un langage approprié

Ensemble, créons une communauté active et bienveillante !`,
        category: "actualites",
        excerpt:
          "Nouvel espace de discussion avec commentaires et réactions sur le blog du CSE.",
      },
    ];

    for (const article of articles) {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .insert({
          ...article,
          author_id: user.id,
          status: "published",
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error(
          `❌ Erreur lors de la création de l'article "${article.title}":`,
          error.message
        );
      } else {
        console.log(`✅ Article créé: "${article.title}"`);

        // Créer un commentaire pour cet article
        const { error: commentError } = await supabase
          .from("blog_comments")
          .insert({
            post_id: post.id,
            author_id: user.id,
            content: "Super article ! Merci pour ces informations.",
            is_approved: true,
          });

        if (commentError) {
          console.error(
            "❌ Erreur lors de la création du commentaire:",
            commentError.message
          );
        } else {
          console.log("   ✅ Commentaire ajouté");
        }

        // Créer une réaction pour cet article
        const { error: reactionError } = await supabase
          .from("blog_reactions")
          .insert({
            post_id: post.id,
            user_id: user.id,
            reaction_type: "like",
          });

        if (reactionError) {
          console.error(
            "❌ Erreur lors de la création de la réaction:",
            reactionError.message
          );
        } else {
          console.log("   ✅ Réaction ajoutée");
        }
      }
    }

    // 3. Vérifier les données créées
    console.log("\n3️⃣ Vérification des données créées...");

    const [
      { count: totalPosts },
      { count: totalComments },
      { count: totalReactions },
    ] = await Promise.all([
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("blog_reactions")
        .select("*", { count: "exact", head: true }),
    ]);

    console.log("📊 Données créées:");
    console.log(`   Articles: ${totalPosts || 0}`);
    console.log(`   Commentaires: ${totalComments || 0}`);
    console.log(`   Réactions: ${totalReactions || 0}`);

    console.log("\n🎉 Données de test créées avec succès !");
    console.log(
      "🌐 Testez maintenant l'interface sur: http://localhost:3000/dashboard/blog"
    );
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

createBlogDataAdmin();
