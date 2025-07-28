# Tests End-to-End (E2E) avec Playwright

Ce dossier contient les **tests E2E Playwright** pour l’application CSE Les PEP 973.

## 📋 Objectif

- Vérifier l’intégration complète de l’application dans un navigateur réel (UI, navigation, interactions, états de chargement/erreur).
- Simuler le parcours utilisateur de bout en bout (login, blog, recherche, navigation, etc.).

## 🧪 Exécution

- Les tests E2E sont écrits avec [Playwright](https://playwright.dev/).
- Pour lancer les tests :
  ```bash
  npx playwright test
  ```
- Les tests E2E ne remplacent pas les tests unitaires/intégration (Vitest), ils les complètent.

## 🗂️ Organisation

- Les tests E2E restent dans ce dossier (`scripts/tests/`) ou peuvent être déplacés dans un dossier `e2e/` dédié si besoin.
- Les tests unitaires/intégration sont dans `src/__tests__/` ou à côté des composants (`__tests__`).

## 🚦 Bonnes pratiques

- Utiliser Playwright pour tester les parcours utilisateurs, la navigation, les interactions complexes, et la robustesse de l’UI.
- Utiliser Vitest pour tester la logique métier, les hooks, les composants isolés, et les intégrations API.

## 🔗 Références

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

**Résumé : Les tests E2E Playwright valident l’application dans son ensemble, tandis que Vitest garantit la robustesse du code et des modules.**
