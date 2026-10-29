import { test, expect } from '@playwright/test';
import {
  SignUpPage,
  ContactListPage,
  AddContactPage,
  ContactDetailsPage,
  newUser,
  newContact,
} from './pages';

test.describe('Thinking Tester contact list', () => {
  // Every test starts with a brand new user, so tests are independent
  test.beforeEach(async ({ page }) => {
    await new SignUpPage(page).signUp(newUser());
  });

  test('sign up, add a contact and validate it on the details page', async ({ page }) => {
    const contact = newContact();
    const list = new ContactListPage(page);
    const add = new AddContactPage(page);
    const details = new ContactDetailsPage(page);

    await list.clickAddContact();
    await add.fillForm(contact);
    await add.submit();

    await expect(page).toHaveURL(/contactList/);
    await expect(list.rowFor(contact)).toBeVisible();

    await list.openContact(contact);
    await details.expectContact(contact);
  });

  test('adding a contact with an invalid date of birth shows an error', async ({ page }) => {
    const contact = newContact({ birthdate: '31-12-1990' }); // wrong format, expected yyyy-MM-dd
    const list = new ContactListPage(page);
    const add = new AddContactPage(page);

    await list.clickAddContact();
    await add.fillForm(contact);
    await add.submit();

    await expect(add.error).toBeVisible();
    await expect(add.error).toContainText('Birthdate is invalid');
    await expect(page).toHaveURL(/addContact/); // stayed on the form
  });

  test('delete an existing contact', async ({ page }) => {
    const contact = newContact();
    const list = new ContactListPage(page);
    const add = new AddContactPage(page);
    const details = new ContactDetailsPage(page);

    await list.clickAddContact();
    await add.fillForm(contact);
    await add.submit();
    await expect(list.rowFor(contact)).toBeVisible();

    await list.openContact(contact);
    await details.delete();

    await expect(list.rowFor(contact)).toHaveCount(0);
  });
});
