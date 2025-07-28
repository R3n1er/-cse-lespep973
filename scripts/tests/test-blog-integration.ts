import { test, expect } from "@playwright/test";

test.describe("Blog Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page du blog
    await page.goto("http://localhost:3000/blog");
  });

  test("should display blog page with all components", async ({ page }) => {
    // Vérifier que la page se charge correctement
    await expect(page.locator("h1")).toContainText("Blog & Actualités");

    // Vérifier que les statistiques sont présentes
    await expect(page.locator('[data-testid="blog-stats"]')).toBeVisible();

    // Vérifier que les filtres de catégorie sont présents
    await expect(page.locator('[data-testid="category-filter"]')).toBeVisible();

    // Vérifier que la barre de recherche est présente
    await expect(
      page.locator('input[placeholder*="Rechercher"]')
    ).toBeVisible();
  });

  test("should filter articles by category", async ({ page }) => {
    // Cliquer sur le filtre "Actualités"
    await page.click('button:has-text("Actualités")');

    // Vérifier que seuls les articles de cette catégorie sont affichés
    const articles = page.locator('[data-testid="blog-card"]');
    await expect(articles).toHaveCount(2); // 2 articles "Actualités" dans les données mockées

    // Vérifier que tous les articles affichés ont la bonne catégorie
    for (const article of await articles.all()) {
      await expect(article.locator(".badge")).toContainText("Actualités");
    }
  });

  test("should search articles by title and content", async ({ page }) => {
    // Rechercher "tickets"
    await page.fill('input[placeholder*="Rechercher"]', "tickets");

    // Vérifier que l'article sur les tickets est affiché
    await expect(
      page.locator("text=Nouveaux tickets disponibles")
    ).toBeVisible();

    // Rechercher "remboursements"
    await page.fill('input[placeholder*="Rechercher"]', "remboursements");

    // Vérifier que l'article sur les remboursements est affiché
    await expect(page.locator("text=Remboursements simplifiés")).toBeVisible();
  });

  test("should navigate to article detail page", async ({ page }) => {
    // Cliquer sur le premier article
    await page.click('[data-testid="blog-card"]:first-child');

    // Vérifier que nous sommes sur la page de détail
    await expect(page).toHaveURL(/\/blog\/\d+/);

    // Vérifier que le contenu de l'article est affiché
    await expect(page.locator("h1")).toContainText("Blog & Actualités");
    await expect(
      page.locator('button:has-text("Retour au blog")')
    ).toBeVisible();
  });

  test("should display article with all components", async ({ page }) => {
    // Aller directement à un article spécifique
    await page.goto("http://localhost:3000/blog/1");

    // Vérifier que l'article se charge
    await expect(page.locator("h1")).toContainText(
      "Bienvenue sur le blog du CSE"
    );

    // Vérifier que les composants sont présents
    await expect(page.locator('[data-testid="reaction-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="comment-list"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="similar-articles"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="newsletter-signup"]')
    ).toBeVisible();
  });

  test("should handle empty search results", async ({ page }) => {
    // Rechercher quelque chose qui n'existe pas
    await page.fill('input[placeholder*="Rechercher"]', "article inexistant");

    // Vérifier que le message "Aucun article trouvé" est affiché
    await expect(page.locator("text=Aucun article trouvé")).toBeVisible();
  });

  test("should display loading states", async ({ page }) => {
    // Recharger la page pour voir les états de chargement
    await page.reload();

    // Vérifier que les skeletons de chargement sont présents
    await expect(page.locator(".animate-pulse")).toBeVisible();
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Simuler une erreur en modifiant l'URL
    await page.goto("http://localhost:3000/blog?error=true");

    // Vérifier que le message d'erreur est affiché
    await expect(
      page.locator("text=Impossible de charger les articles")
    ).toBeVisible();
    await expect(page.locator('button:has-text("Réessayer")')).toBeVisible();
  });
});
