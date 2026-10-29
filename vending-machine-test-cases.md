# Vending Machine - Test Cases

## 1. Scope and assumptions

User stories under test:
- Pay with cash (euro coins, €5, €10, €20 notes) or contactless card
- Change is returned in the tray at the bottom
- A receipt is issued for every transaction
- One item at a time
- Product selected by code on the keypad (digits 0-9, Enter, Cancel)
- Product code first then money, or money first then product code

Assumptions (to confirm with the product owner):
- A1: Accepted coins are 1c, 2c, 5c, 10c, 20c, 50c, €1, €2. Notes: €5, €10, €20 (€50+ and others are rejected)
- A2: Product codes are 2 digits (e.g. 11-46) and Enter confirms the code
- A3: The machine gives change in coins and can run out of coins
- A4: Credit shown on the display is kept until the purchase or Cancel
- A5: Cancel before a purchase refunds all inserted cash; cancelling a card payment charges nothing
- A6: A timeout (e.g. 60 s) returns the user to idle and refunds inserted money
- A7: Receipt contains date/time, item, price, amount paid, change, payment method, machine ID

Open questions for the spec:
1. Maximum credit the machine accepts? 2. Is the receipt printed automatically or on request? 3. Is there a card pre-authorisation amount or limit? 4. What happens to a purchase when power is lost mid-transaction? 5. Are product codes 1 or 2 digits, and is Enter required?

Legend: Priority H/M/L. Type: F = functional, N = negative, E = edge case, U = usability, NFR = non-functional.

---

## 2. Cash payment

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| CP-01 | Exact payment with coins | Enter code of €1.50 item, Enter. Insert €1 and 50c | Item dispensed, no change, receipt printed | H | F |
| CP-02 | Exact payment with a note | Select €5 item. Insert €5 note | Item dispensed, no change | H | F |
| CP-03 | Each coin value accepted | Insert 1c, 2c, 5c, 10c, 20c, 50c, €1, €2 one at a time | Display credit increases by exactly the coin value each time | H | F |
| CP-04 | Each note value accepted | Insert €5, €10, €20 one at a time | Credit increases by the note value | H | F |
| CP-05 | Multiple coins add up | Insert several mixed coins reaching the price | Item dispensed when credit >= price | H | F |
| CP-06 | Overpay with a note | Select €1.50 item. Insert €5 | Item dispensed, €3.50 change returned, receipt shows paid €5.00 and change €3.50 | H | F |
| CP-07 | Overpay with coins | Select €1.20 item. Insert €2 | Item dispensed, 80c change | H | F |
| CP-08 | Insufficient credit | Select €2 item. Insert €1 | Item not dispensed, display shows remaining €1.00 | H | F |
| CP-09 | Pay in several steps | Select €2.50 item, insert €1, then €1, then 50c | Dispensed only after the last coin | M | F |
| CP-10 | Rejected foreign coin | Insert a non-euro coin | Coin returned, credit unchanged | H | N |
| CP-11 | Rejected counterfeit/damaged note | Insert a fake, torn or wrongly oriented note | Note returned, credit unchanged | H | N |
| CP-12 | Unsupported note (€50, €100, €200, €500) | Insert €50 note | Note returned, message displayed | H | N |
| CP-13 | Coin jam / stuck coin | Insert deformed coin | Coin returned or error shown, machine recovers | M | N |
| CP-14 | Exact change only | Machine low on coins, pay overpaying amount | "Exact change only" message or sale blocked before payment | H | E |
| CP-15 | Not enough coins to return change | Empty change tray stock, overpay | Transaction refused and all money returned, or as defined by spec. Customer is never short-changed silently | H | E |
| CP-16 | Maximum credit | Keep inserting money past the max credit | Further money rejected, credit not exceeded | M | E |
| CP-17 | Smallest coin purchase | Item costing 0.10, pay 10c | Dispensed, no change | L | E |
| CP-18 | Change composition | Overpay by 3.80 | Change is correct total, uses valid coin combination | M | F |
| CP-19 | Coin inserted after item dispensed | Complete a sale, insert another coin | Coin treated as new credit (or rejected), not lost | M | E |
| CP-20 | Rapid coin insertion | Insert coins quickly in sequence | All counted, none lost or double counted | M | E |

## 3. Contactless card payment

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| CC-01 | Successful card purchase | Select item, tap valid card | Exact price charged once, item dispensed, receipt printed | H | F |
| CC-02 | Tap before selecting an item | Tap card, then enter product code | Item selected and sale completes, or amount charged only when item is chosen (per spec) | H | F |
| CC-03 | Card declined (insufficient funds) | Tap card with no funds | Decline message, item not dispensed, no charge | H | N |
| CC-04 | Blocked/expired card | Tap expired card | Rejected with message, no dispense | H | N |
| CC-05 | Card tapped twice | Tap same card twice quickly | Charged only once | H | N |
| CC-06 | Mobile wallet payment | Pay with Apple/Google Pay | Succeeds like a physical card | M | F |
| CC-07 | Cancel before tapping | Select item, press Cancel | Selection cleared, no charge | H | F |
| CC-08 | Card read failure | Tap card poorly or remove too early | Error message, no charge, can retry | M | N |
| CC-09 | Communication failure with the bank | Simulate network loss during payment | No dispense without confirmed payment, no double charge, clear message | H | N |
| CC-10 | Payment confirmed but dispense fails | Simulate motor jam | Automatic refund / reversal and error message | H | E |
| CC-11 | Over-limit contactless amount | Item above contactless limit (if applicable) | Handled per spec (PIN request or decline) | M | E |
| CC-12 | No change given for card | Pay by card | Charged exactly the price, no change returned | M | F |
| CC-13 | Card and cash mixed | Insert €1 then tap card for €2 item | Defined behaviour: either rejected or partial pay supported. Never charged twice | M | E |
| CC-14 | Card data security | Inspect receipt and display | Only masked card number (last 4 digits) shown | H | NFR |

## 4. Change and dispensing

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| CH-01 | Change falls in the bottom tray | Overpay | Change coins are released into the bottom tray, reachable and not lost | H | F |
| CH-02 | Item falls in the dispensing area | Complete purchase | Item delivered to the bottom pickup area undamaged | H | F |
| CH-03 | Item stuck in spiral | Product does not drop | Error shown, refund given, item flagged as faulty | H | N |
| CH-04 | Change amount accuracy | Repeat with several prices and payments | Change always equals paid minus price | H | F |
| CH-05 | Change after Cancel | Insert €2, press Cancel | Full €2 returned to the tray | H | F |
| CH-06 | Uncollected change | Leave change in tray, start new purchase | New transaction is unaffected, previous change not mixed into credit | L | E |

## 5. Receipt

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| RC-01 | Receipt for cash sale | Buy with cash | Receipt has date/time, item, price, paid, change | H | F |
| RC-02 | Receipt for card sale | Buy with card | Receipt shows card payment, masked card number, amount | H | F |
| RC-03 | Receipt for every transaction | Do 5 sales in a row | 5 receipts, each with unique transaction ID | H | F |
| RC-04 | Receipt amounts consistent | Compare receipt with display and money | All values match | H | F |
| RC-05 | Out of paper | Empty receipt roll | Sale policy as per spec (warn user or block), no silent failure | M | N |
| RC-06 | Receipt for cancelled/refunded transaction | Cancel after inserting money | Per spec: refund receipt or no receipt, consistent | L | E |
| RC-07 | Receipt readability | Print receipt | Text is legible, correct currency symbol and VAT info if required | L | U |

## 6. Product selection and keypad

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| KP-01 | Select valid product | Type valid code, Enter | Product name and price displayed | H | F |
| KP-02 | Every digit 0-9 works | Press each digit | Digit appears on display | H | F |
| KP-03 | Invalid code | Type non-existent code, Enter | "Invalid selection" message, nothing charged | H | N |
| KP-04 | Incomplete code | Type one digit, Enter | Error or ignored (per spec), no dispense | M | N |
| KP-05 | Too many digits | Type more digits than the code length | Extra digits ignored or error, no wrong product selected | M | E |
| KP-06 | Out-of-stock product | Select sold-out item | "Sold out" message, money not taken, can choose another | H | N |
| KP-07 | Cancel clears selection | Type code, Cancel | Selection cleared, display idle | H | F |
| KP-08 | Cancel after inserting money | Insert money, Cancel | Money returned | H | F |
| KP-09 | Enter with no code | Press Enter only | No action, no error state | L | N |
| KP-10 | Change selection before paying | Type code A, Cancel, type code B | Only B is sold | M | F |
| KP-11 | Select a second item during a sale | Pay for item A, then type another code before it drops | Only one item per transaction, second input ignored | H | N |
| KP-12 | Buy two items with credit left | Insert €5, buy €1 item | Machine returns change after one item, or keeps credit only if the spec allows. Never dispenses two items in one transaction | H | E |
| KP-13 | Fast key presses / key held | Press keys very quickly or hold one | No duplicate digits or stuck keys | L | E |
| KP-14 | Keypad wear / unresponsive key | Press unresponsive key | Display shows nothing wrong, no phantom input | L | N |

## 7. Order of actions (code first / money first)

| ID | Title | Steps | Expected result | Pri | Type |
|---|---|---|---|---|---|
| OR-01 | Code then money | Enter code, then insert exact money | Dispensed | H | F |
| OR-02 | Money then code | Insert money, then enter code | Dispensed | H | F |
| OR-03 | Money then code with overpay | Insert €5, enter code of €2 item | Dispensed, €3 change | H | F |
| OR-04 | Code, partial money, rest later | Enter code, insert part, wait, insert rest | Dispensed after enough credit | M | F |
| OR-05 | Money inserted, wrong code, then correct code | Insert money, enter invalid code, then valid code | Credit kept, item dispensed | M | E |
| OR-06 | Change selected item while credit present | Insert €3, select €2 item, Cancel, select €1 item | Correct item/price used | M | E |
| OR-07 | Timeout with credit | Insert money, wait past timeout | Money returned automatically, machine back to idle | M | E |
| OR-08 | Timeout with selection only | Enter code, wait | Selection cleared | L | E |

## 8. Non-functional and system tests

| ID | Title | Expected result | Pri | Type |
|---|---|---|---|---|
| NF-01 | Power loss during a cash sale | Inserted money is refunded or credit restored after restart; no free item | H | NFR |
| NF-02 | Power loss during a card sale | No charge without dispense, or automatic reversal | H | NFR |
| NF-03 | Display messages are clear and in the right language | Messages are understandable | M | U |
| NF-04 | Accessibility: keypad height, braille/tactile keys, audio | Usable by wheelchair users and the visually impaired | M | U |
| NF-05 | Operating temperature range | Machine works at expected ambient temperature | L | NFR |
| NF-06 | Vandalism/tamper: shake machine or force the door | Alarm or lock holds, no free products | M | NFR |
| NF-07 | Stock and sales logging | Each sale updates inventory and cash totals correctly | M | F |
| NF-08 | Concurrency of inputs: coin + key + card at the same time | No race condition or double sale | M | E |
| NF-09 | Performance: dispense in under X seconds | Dispense after payment completes within spec | L | NFR |
| NF-10 | Service mode: refill and cash collection | Totals reconcile with sales records | M | F |

---

## 9. Suggested test approach
- Run H priority cases first (smoke / regression pack)
- Use boundary values for money: price-1c, exact price, price+1c
- Use equivalence classes for coins, notes and cards: valid, invalid, damaged, foreign
- Cases CP-06, CP-14/15, CC-05, CC-09/10, KP-11 and NF-01/02 are the highest risk: they involve money loss or double charge
- Good candidates for automation in a simulator or HIL setup: CP-01 to CP-08, CP-18, KP-01 to KP-12, OR-01 to OR-03
