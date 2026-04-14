import { test, expect } from '@playwright/test';

// ─── Login ───────────────────────────────────────────────────────────────────

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('affiche le formulaire de connexion', async ({ page }) => {
    await expect(page.getByText('CESIZEN')).toBeVisible();
    await expect(page.getByText('Connexion').first()).toBeVisible();
    await expect(page.getByPlaceholder('exemple@mail.com')).toBeVisible();
  });

  test('connexion avec identifiants valides', async ({ page }) => {
    await page.getByPlaceholder('exemple@mail.com').fill('jean@test.com');
    await page.getByPlaceholder('Votre mot de passe').fill('motdepasse123');
    await page.getByText('Connexion').last().click();
    await expect(page).toHaveURL(/home/);
    await expect(page.getByText('Mes activités')).toBeVisible();
  });

  test('connexion avec mauvais mot de passe', async ({ page }) => {
    await page.getByPlaceholder('exemple@mail.com').fill('jean@test.com');
    await page.getByPlaceholder('Votre mot de passe').fill('mauvaismdp');
    await page.getByText('Connexion').last().click();
    await expect(page).toHaveURL(/login/);
  });

  test('connexion avec champs vides', async ({ page }) => {
    await page.getByText('Connexion').last().click();
    await expect(page).toHaveURL(/login/);
  });

});

// ─── Inscription + consentement ──────────────────────────────────────────────

test.describe('Inscription', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('affiche le formulaire d\'inscription', async ({ page }) => {
    await expect(page.getByText('Inscription').first()).toBeVisible();
    await expect(page.getByPlaceholder('Dupont')).toBeVisible();
    await expect(page.getByPlaceholder('Jean')).toBeVisible();
  });

  test('inscription avec données valides + consentement accepté', async ({ page }) => {
    const timestamp = Date.now();
    await page.getByPlaceholder('Dupont').fill('TestNom');
    await page.getByPlaceholder('Jean').fill('TestPrenom');
    await page.getByPlaceholder('JJ/MM/AAAA').fill('01/01/1990');
    await page.getByPlaceholder('exemple@mail.com').fill(`test${timestamp}@test.com`);
    await page.getByPlaceholder('Votre mot de passe').fill('motdepasse123');
    await page.getByText('Inscription').last().click();

    // Modal consentement
    await expect(page.getByText('Consentement')).toBeVisible();
    await page.getByText('Oui').click();

    await expect(page).toHaveURL(/login/);
  });

  test('inscription avec consentement refusé bloque l\'inscription', async ({ page }) => {
    const timestamp = Date.now();
    await page.getByPlaceholder('Dupont').fill('TestNom');
    await page.getByPlaceholder('Jean').fill('TestPrenom');
    await page.getByPlaceholder('JJ/MM/AAAA').fill('01/01/1990');
    await page.getByPlaceholder('exemple@mail.com').fill(`test${timestamp}@test.com`);
    await page.getByPlaceholder('Votre mot de passe').fill('motdepasse123');
    await page.getByText('Inscription').last().click();

    // Modal consentement → refus
    await expect(page.getByText('Consentement')).toBeVisible();
    await page.getByText('Non').click();

    // Reste sur register
    await expect(page).toHaveURL(/register/);
  });

  test('champs vides bloquent l\'inscription', async ({ page }) => {
    await page.getByText('Inscription').last().click();
    await expect(page).toHaveURL(/register/);
  });

});