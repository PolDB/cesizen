import { test, expect } from '@playwright/test';

// Helper : connecter l'utilisateur
async function login(page: any) {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('lucas@gmail.com');
  await page.getByPlaceholder('Mot de passe').fill('123');
  await page.getByText('Se connecter').last().click();
  await expect(page).toHaveURL(/home/);
}

// ─── Navigation Home → Respiration ──────────────────────────────────────────

test.describe('Navigation Home - Respiration', () => {

  test('accès à la respiration sans connexion', async ({ page }) => {
    await page.goto('/respiration');
    await expect(page.getByText('Exercice de respiration')).toBeVisible();
    await expect(page.getByText('Choisis ton cycle')).toBeVisible();
  });

  test('sélection d\'un cycle et navigation vers sécurité', async ({ page }) => {
    await page.goto('/respiration');
    await page.getByText('7 — 4 — 8').click();
    await page.getByText('Suivant →').click();
    await expect(page.getByText('Avant de commencer')).toBeVisible();
    await expect(page.getByText('compris')).toBeVisible();
  });

  test('démarrage de l\'exercice après message sécurité', async ({ page }) => {
    await page.goto('/respiration');
    await page.getByText('Suivant →').click();
    await page.getByText('compris').click();
    await expect(page.getByText('INSPIRATION').first()).toBeVisible();
  });

  test('Home affiche la carte activité respiration', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByText('Respiration').first()).toBeVisible();
    await page.getByText('Respiration').first().click();
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
    await expect(page.getByText('Mes activites')).toBeVisible();
  });

  test('accès /respiration sans connexion → accessible', async ({ page }) => {
    await page.goto('/respiration');
    await expect(page).toHaveURL(/respiration/);
  });

  test('accès /profil connecté → accessible', async ({ page }) => {
    await login(page);
    await page.goto('/profil');
    await expect(page).toHaveURL(/profil/);
    await expect(page.getByText('lucas@gmail.com')).toBeVisible();
  });

});