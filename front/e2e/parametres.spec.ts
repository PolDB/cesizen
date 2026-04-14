import { test, expect } from '@playwright/test';

// Helper : connecter l'utilisateur
async function login(page: any) {
  await page.goto('/login');
  await page.getByPlaceholder('exemple@mail.com').fill('jean@test.com');
  await page.getByPlaceholder('Mot de passe').fill('motdepasse123');
  await page.getByText('Connexion').last().click();
  await expect(page).toHaveURL(/home/);
}

// ─── Changement de mot de passe ──────────────────────────────────────────────

test.describe('Changement de mot de passe', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/profil');
    await page.getByText('⚙️').click();
    await expect(page).toHaveURL(/parametres/);
  });

  test('affiche les options des paramètres', async ({ page }) => {
    await expect(page.getByText('Paramètres')).toBeVisible();
    await expect(page.getByText('Réinitialiser les performances')).toBeVisible();
    await expect(page.getByText('Changer son mot de passe')).toBeVisible();
    await expect(page.getByText('Exporter les données personnelles')).toBeVisible();
    await expect(page.getByText('Supprimer son compte')).toBeVisible();
  });

  test('ouvre la modal de changement de mot de passe', async ({ page }) => {
    await page.getByText('Changer son mot de passe').click();
    await expect(page.getByText('Changer le mot de passe')).toBeVisible();
    await expect(page.getByPlaceholder('Ancien mot de passe')).toBeVisible();
    await expect(page.getByPlaceholder('Nouveau mot de passe')).toBeVisible();
  });

  test('changement de mot de passe avec ancien mdp incorrect', async ({ page }) => {
    await page.getByText('Changer son mot de passe').click();
    await page.getByPlaceholder('Ancien mot de passe').fill('mauvaisancienmdp');
    await page.getByPlaceholder('Nouveau mot de passe').fill('nouveaumdp123');
    await page.getByText('Confirmer').click();
    // Reste sur la page paramètres avec erreur
    await expect(page).toHaveURL(/parametres/);
  });

  test('annuler ferme la modal', async ({ page }) => {
    await page.getByText('Changer son mot de passe').click();
    await expect(page.getByText('Changer le mot de passe')).toBeVisible();
    await page.getByText('Annuler').click();
    await expect(page.getByText('Changer le mot de passe')).not.toBeVisible();
  });

  test('champs vides bloquent le changement', async ({ page }) => {
    await page.getByText('Changer son mot de passe').click();
    await page.getByText('Confirmer').click();
    // Modal reste ouverte
    await expect(page.getByText('Changer le mot de passe')).toBeVisible();
  });

});

// ─── Suppression de compte ───────────────────────────────────────────────────

test.describe('Suppression de compte', () => {

  test('modal suppression s\'ouvre et peut être annulée', async ({ page }) => {
    await login(page);
    await page.goto('/parametres');
    await page.getByText('Supprimer son compte').click();
    await expect(page.getByText('Cette action est irréversible')).toBeVisible();
    await page.getByText('Annuler').click();
    await expect(page.getByText('Cette action est irréversible')).not.toBeVisible();
  });

});