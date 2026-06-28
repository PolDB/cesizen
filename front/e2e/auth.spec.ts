import { test, expect } from '@playwright/test';

// ─── Login ───────────────────────────────────────────────────────────────────

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('affiche le formulaire de connexion', async ({ page }) => {
    await expect(page.getByText('Connexion').first()).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
  });

  test('connexion avec identifiants valides', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('flo@gmail.com');
    await page.getByPlaceholder('Mot de passe').fill('123');
    await page.getByText('se connecter').last().click();
    await expect(page).toHaveURL(/home/);
    await expect(page.getByText('Mes activites')).toBeVisible();
  });

  test('connexion avec mauvais mot de passe', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('pauldaubrive@gmail.com');
    await page.getByPlaceholder('Mot de passe').fill('mauvaismdp');
    await page.getByText('se connecter').last().click();
    await expect(page).toHaveURL(/login/);
  });

  test('connexion avec champs vides', async ({ page }) => {
    await page.getByText('se connecter').last().click();
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
    await expect(page.getByPlaceholder('Nom de famille')).toBeVisible();
    await expect(page.getByPlaceholder('Prenom')).toBeVisible();
  });

  test('inscription avec données valides + consentement accepté', async ({ page }) => {
    await page.getByPlaceholder('Nom de famille').fill('TestNom');
    await page.getByPlaceholder('Prenom').fill('TestPrenom');
    await page.getByPlaceholder('Email').fill(`test${Date.now()}@test.com`);    
    await page.getByPlaceholder('Mot de passe').fill('123');
    await page.getByRole('button', { name: 'Creer mon compte' }).click();    await page.waitForTimeout(1000);
    // Modal consentement
    await expect(page.getByText('Consentement utilisation des données')).toBeVisible();
    await page.getByText('Accepter').click();

    await expect(page).toHaveURL(/login/);
  });

  test('inscription avec consentement refusé bloque l\'inscription', async ({ page }) => {
    await page.getByPlaceholder('Nom de famille').fill('TestNom');
    await page.getByPlaceholder('Prenom').fill('TestPrenom');
    await page.getByPlaceholder('Email').fill(`test${Date.now()}@test.com`);    
    await page.getByPlaceholder('Mot de passe').fill('123');
    await page.getByText('Creer mon compte').last().click();
    await page.waitForTimeout(1000);
    // Modal consentement → refus
    await expect(page.getByText('Consentement utilisation des données')).toBeVisible();
    await page.getByText('Refuser').click();

    // Reste sur register
    await expect(page).toHaveURL(/register/);
  });

  test('champs vides bloquent l\'inscription', async ({ page }) => {
    await page.getByText('Creer mon compte').last().click();
    await expect(page).toHaveURL(/register/);
  });

});