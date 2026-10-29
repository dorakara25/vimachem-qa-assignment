# Vimachem QA Assignment

## Part 1 - Vending machine test cases
See [vending-machine-test-cases.md](vending-machine-test-cases.md).

## Part 2 - Test automation (Playwright + TypeScript)
Target: https://thinking-tester-contact-list.herokuapp.com

Scenarios:
1. Sign up with a new user, add a contact, validate it on the contact details page
2. Add a contact with an invalid date of birth and validate the error message
3. Delete an existing contact

### Run locally
```bash
npm install
npx playwright install chromium
npm test
npm run report   # open the HTML report
```

### Run in CI
GitHub Actions runs on every push (`.github/workflows/playwright.yml`).
Open the **Actions** tab, pick a run, and download the `playwright-report` artifact.

### Design notes
- Page Object Model in `pages.ts`
- Each test signs up a fresh user with a unique email, so tests are independent and repeatable
- Test data is generated per run to avoid collisions
