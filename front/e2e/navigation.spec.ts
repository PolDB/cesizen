import { test, expect } from '@playwright/test';

// Helper : connecter l'utilisateur
async function login(page: any) {
  await page.goto('/login');
  await page.getByPlaceholder('exemple@mail.com').fill('jean@test.com');
  await page.getByPlaceholder('Mot de passe').fill('motdepasse123');
  await page.getByText('Connexion').last().click();
  await expect(page).toHaveURL(/home/);
}

// ─── Navigation Home → Respiration ──────────────────────────────────────────

test.describe('Navigation Home → Respiration', () => {

  test('accès à la respiration sans connexion', async ({ page }) => {
    await page.goto('/respiration');
    await expect(page.getByText('Activité Respiration')).toBeVisible();
    await expect(page.getByText('Choix du cycle')).toBeVisible();
  });

  test('sélection d\'un cycle et navigation vers sécurité', async ({ page }) => {
    await page.goto('/respiration');
    await page.getByText('7-4-8').click();
    await page.getByText('Suivant →').click();
    await expect(page.getByText('vertiges')).toBeVisible();
    await expect(page.getByText('Compris')).toBeVisible();
  });

  test('démarrage de l\'exercice après message sécurité', async ({ page }) => {
    await page.goto('/respiration');
    await page.getByText('Suivant →').click();
    await page.getByText('Compris').click();
    await expect(page.getByText('Inspiration').first()).toBeVisible();
  });

  test('Home affiche la carte activité respiration', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByText('Activité respiration').first()).toBeVisible();
    await page.getByText('Activité respiration').first().click();
    await expect(page).toHaveURL(/respiration/);
  });

});

// ─── Protection des routes ───────────────────────────────────────────────────

test.describe('Protection des routes', () => {

  test('accès /profil sans connexion → redirige vers login', async ({ page }) => {
    await page.goto('/profil');
    await expect(page).toHaveURL(/login/);
  });

  test('accès /parametres sans connexion → redirige vers login', async ({ page }) => {
    await page.goto('/parametres');
    await expect(page).toHaveURL(/login/);
  });

  test('accès /home sans connexion → accessible', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/home/);
    await expect(page.getByText('Mes activités')).toBeVisible();
  });

  test('accès /respiration sans connexion → accessible', async ({ page }) => {
    await page.goto('/respiration');
    await expect(page).toHaveURL(/respiration/);
  });

  test('accès /profil connecté → accessible', async ({ page }) => {
    await login(page);
    await page.goto('/profil');
    await expect(page).toHaveURL(/profil/);
    await expect(page.getByText('jean@test.com')).toBeVisible();
  });

});