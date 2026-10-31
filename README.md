# Vimachem QA Assignment

## Part 1 - Vending machine test cases
Submitted as a separate document, attached to the email.

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


### Observations

During manual exploration, the Birthdate field accepts values that are well-formed
but not realistic, such as a future date or a date more than 150 years in the past.
Only an invalid format (e.g. `31-12-1990`) is rejected with "Birthdate is invalid".
I did not automate this, since the expected behaviour should be confirmed with the
product owner first. It would be a good candidate for a follow-up test once the rule is defined.
