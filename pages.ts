import { Page, Locator, expect } from '@playwright/test';

export interface Contact {
  firstName: string;
  lastName: string;
  birthdate: string; // yyyy-MM-dd
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function newUser(): User {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'Test',
    lastName: 'User',
    email: `qa.${id}@example.com`,
    password: 'Passw0rd!123',
  };
}

export function newContact(overrides: Partial<Contact> = {}): Contact {
  return {
    firstName: 'John',
    lastName: `Doe${Date.now()}`,
    birthdate: '1990-05-17',
    email: 'john.doe@example.com',
    phone: '6945123456',
    street1: '1 Main Street',
    street2: 'Apt 4',
    city: 'Athens',
    stateProvince: 'Attica',
    postalCode: '10431',
    country: 'Greece',
    ...overrides,
  };
}

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
    await this.page.locator('#signup').click();
  }

  async signUp(user: User) {
    await this.open();
    await this.page.locator('#firstName').fill(user.firstName);
    await this.page.locator('#lastName').fill(user.lastName);
    await this.page.locator('#email').fill(user.email);
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#submit').click();
    await expect(this.page).toHaveURL(/contactList/);
  }
}

export class ContactListPage {
  constructor(private readonly page: Page) {}

  rowFor(contact: Contact): Locator {
    return this.page
      .locator('.contactTableBodyRow')
      .filter({ hasText: `${contact.firstName} ${contact.lastName}` });
  }

  async clickAddContact() {
    await this.page.locator('#add-contact').click();
  }

  async openContact(contact: Contact) {
    await this.rowFor(contact).click();
    await expect(this.page).toHaveURL(/contactDetails/);
  }
}

export class AddContactPage {
  constructor(private readonly page: Page) {}

  async fillForm(contact: Contact) {
    await this.page.locator('#firstName').fill(contact.firstName);
    await this.page.locator('#lastName').fill(contact.lastName);
    await this.page.locator('#birthdate').fill(contact.birthdate);
    await this.page.locator('#email').fill(contact.email);
    await this.page.locator('#phone').fill(contact.phone);
    await this.page.locator('#street1').fill(contact.street1);
    await this.page.locator('#street2').fill(contact.street2);
    await this.page.locator('#city').fill(contact.city);
    await this.page.locator('#stateProvince').fill(contact.stateProvince);
    await this.page.locator('#postalCode').fill(contact.postalCode);
    await this.page.locator('#country').fill(contact.country);
  }

  async submit() {
    await this.page.locator('#submit').click();
  }

  get error(): Locator {
    return this.page.locator('#error');
  }
}

export class ContactDetailsPage {
  constructor(private readonly page: Page) {}

  async expectContact(contact: Contact) {
    const p = this.page;
    await expect(p.locator('#firstName')).toHaveText(contact.firstName);
    await expect(p.locator('#lastName')).toHaveText(contact.lastName);
    await expect(p.locator('#birthdate')).toHaveText(contact.birthdate);
    await expect(p.locator('#email')).toHaveText(contact.email);
    await expect(p.locator('#phone')).toHaveText(contact.phone);
    await expect(p.locator('#street1')).toHaveText(contact.street1);
    await expect(p.locator('#street2')).toHaveText(contact.street2);
    await expect(p.locator('#city')).toHaveText(contact.city);
    await expect(p.locator('#stateProvince')).toHaveText(contact.stateProvince);
    await expect(p.locator('#postalCode')).toHaveText(contact.postalCode);
    await expect(p.locator('#country')).toHaveText(contact.country);
  }

  async delete() {
    // The app asks for confirmation through a native browser dialog
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.page.locator('#delete').click();
    await expect(this.page).toHaveURL(/contactList/);
  }
}
