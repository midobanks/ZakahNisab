import type { BlogPost } from '@/types/zakah';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-nisab',
    title: 'What is Nisab? A Simple Guide',
    excerpt: 'Learn what Nisab means in Islam, why it matters for Zakah, and how to determine if your wealth has reached the threshold.',
    content: `Nisab is the minimum amount of wealth a Muslim must possess before Zakah becomes obligatory. It is a threshold set by Islamic law based on the value of gold or silver.

The word "Nisab" (نصاب) literally means "basis" or "foundation" in Arabic. In the context of Zakah, it represents the baseline above which Zakah is due.

Two Nisab thresholds are commonly used:

- **Gold Nisab:** 87.48 grams of gold
- **Silver Nisab:** 612.36 grams of silver

The Silver Nisab is the lower threshold. Many scholars recommend using the Silver Nisab as it is more cautious and ensures that Zakah is given sooner. If your net wealth is less than the Nisab, no Zakah is due.

**Why does Nisab matter?** It prevents those with minimal wealth from being burdened and ensures Zakah is only required from those who can genuinely afford it.`,
  },
  {
    slug: 'gold-nisab-vs-silver-nisab',
    title: 'Gold Nisab vs Silver Nisab: Which One Should You Use?',
    excerpt: 'Understand the difference between the two Nisab thresholds and which one may apply to your situation.',
    content: `When calculating Zakah, one of the first decisions is which Nisab threshold to use: Gold or Silver.

**Gold Nisab (87.48g of gold):** This is the higher threshold. In many parts of the world, the Gold Nisab is significantly higher than the Silver Nisab. Some scholars prefer this as it follows the literal mention of gold and silver in the Quran.

**Silver Nisab (612.36g of silver):** This is the lower threshold. The Hanafi school and many contemporary scholars recommend the Silver Nisab because it is closer to the original purpose of Zakah — to help those in need. Using the lower threshold means more people will be obligated to pay Zakah, which benefits the community.

**Our recommendation:** ZakahNisab defaults to the Silver Nisab as it is more cautious and widely accepted. However, we provide both options so you can follow the practice you are most comfortable with. When in doubt, consult a qualified scholar.`,
  },
  {
    slug: 'how-to-calculate-zakah-on-cash-and-savings',
    title: 'How to Calculate Zakah on Cash and Savings',
    excerpt: 'A step-by-step guide to calculating Zakah on your cash at hand, bank accounts, and savings.',
    content: `Cash and savings are among the most common assets subject to Zakah. Here is how to calculate what you owe.

**Step 1: Add up all cash and bank balances**
- Cash in your wallet
- Checking account balances
- Savings account balances
- Fixed deposits and term deposits
- Money in digital wallets and payment apps

**Step 2: Deduct your liabilities**
- Outstanding debts and loans
- Credit card balances
- Bills due within the year

**Step 3: Check the Nisab threshold**
Compare your net cash savings against the current Nisab value (Gold or Silver). Only if your savings exceed the Nisab threshold is Zakah due.

**Step 4: Calculate 2.5%**
If you are above the Nisab and have held this wealth for one lunar year (Hawl), multiply your net savings by 2.5%.

**Example:** If you have ₦1,000,000 in savings and no debts, and the Silver Nisab is ₦500,000, your Zakah would be: ₦1,000,000 × 2.5% = ₦25,000.`,
  },
  {
    slug: 'how-to-calculate-zakah-on-gold-and-silver',
    title: 'How to Calculate Zakah on Gold and Silver',
    excerpt: 'Learn how to properly calculate Zakah on your gold jewelry, bars, coins, and silver assets.',
    content: `Gold and silver have special significance in Zakah because they are specifically mentioned in the Quran and hadith.

**Types of gold and silver subject to Zakah:**
- Gold and silver jewelry (most scholars consider it Zakatable)
- Gold bars and bullion
- Silver coins and bars
- Gold and silver held as investment

**Important note:** Most scholars agree that all gold and silver, including jewelry worn for adornment, is subject to Zakah if it reaches the Nisab threshold.

**Calculation steps:**
1. Weigh your gold in grams
2. Multiply by the current market price per gram
3. Add the value to your total zakatable assets
4. Repeat for silver
5. If your total wealth exceeds the Nisab, Zakah is due at 2.5%

**Example:** If you have 100g of gold and the current price is ₦98,480/g, the gold value is ₦9,848,000. This would be added to your other assets for the Nisab check.`,
  },
  {
    slug: 'what-debts-can-be-deducted-from-zakah',
    title: 'What Debts Can Be Deducted From Zakah?',
    excerpt: 'Understanding which debts reduce your zakatable wealth and how to properly account for them.',
    content: `A key part of Zakah calculation is deducting your debts to arrive at your net zakatable wealth.

**Deductible debts (reduce your zakatable wealth):**
- Personal loans and bank loans
- Credit card balances
- Outstanding bills (utility, rent, etc.)
- Money borrowed from friends or family
- Business debts and payables

**Non-deductible liabilities:**
- Future expenses you have not yet incurred
- Mortgage on your primary residence (scholarly difference)
- Long-term installment payments (some scholars differ)

**General rule:** A debt is deductible if it is due within the current lunar year and you are obligated to pay it back.

**Example:** If you have ₦5,000,000 in assets and ₦2,000,000 in debts, your net zakatable wealth is ₦3,000,000. Zakah is calculated on ₦3,000,000, not ₦5,000,000.

Always consult a scholar for complex debt situations.`,
  },
  {
    slug: 'what-is-hawl',
    title: 'What is Hawl? The Lunar Year Requirement for Zakah',
    excerpt: 'Understand the Hawl (lunar year) condition for Zakah and how to track when your Zakah is due.',
    content: `Hawl (حول) is the Islamic legal term for one full lunar (Hijri) year. It is a key condition for Zakah.

**What does Hawl mean for your Zakah?**
Zakah is not due simply because you have wealth above Nisab. That wealth must have been in your possession for one complete lunar year.

**How to track your Hawl:**
1. Note the Hijri date when your wealth first exceeded the Nisab
2. Check whether your wealth remained above Nisab throughout the year
3. After one lunar year from that date, Zakah becomes due

**What if your wealth dips below Nisab during the year?**
If your wealth falls below the Nisab at any point during the lunar year, the Hawl is reset. You start counting again from the next time your wealth exceeds Nisab.

**Practical tip:** Set a reminder on the Hijri date when you first calculated that you were above Nisab. Many Muslims choose a fixed date (e.g., the first of Ramadan) to calculate and pay all their Zakah at once.

Use ZakahNisab's reminder feature to get notified when it is time to check your Zakah again.`,
  },
  {
    slug: 'difference-between-zakah-and-sadaqah',
    title: 'The Difference Between Zakah and Sadaqah',
    excerpt: 'Learn the key differences between obligatory Zakah and voluntary Sadaqah in Islam.',
    content: `Zakah and Sadaqah are both forms of charity in Islam, but they have important differences.

**Zakah (obligatory charity):**
- One of the Five Pillars of Islam
- Obligatory on every eligible Muslim
- Fixed rate of 2.5% on qualifying wealth
- Specific conditions (Nisab, Hawl)
- Must be given to specific categories of recipients
- Calculated annually

**Sadaqah (voluntary charity):**
- Recommended, not obligatory
- No minimum or maximum amount
- Can be given at any time
- Can be given to anyone in need
- Includes non-financial acts (a smile is Sadaqah)

**Common misunderstanding:** Some people give Sadaqah throughout the year and assume it fulfills their Zakah obligation. This is incorrect. Zakah and Sadaqah are separate. You must fulfill your Zakah obligation in addition to any voluntary Sadaqah you choose to give.

**Our advice:** Calculate your Zakah obligation first, pay it, then give Sadaqah as you are able beyond that.`,
  },
  {
    slug: 'common-zakah-calculation-mistakes',
    title: '5 Common Zakah Calculation Mistakes to Avoid',
    excerpt: 'Avoid these frequent errors when calculating your Zakah to ensure you fulfill your obligation correctly.',
    content: `Here are the most common mistakes people make when calculating Zakah:

**1. Forgetting to include all assets**
Many people remember cash and gold but forget business inventory, receivables, and investments. Make a comprehensive list of all zakatable assets.

**2. Using the wrong Nisab threshold**
The difference between Gold Nisab and Silver Nisab can be significant. Know which one you follow and use the correct value.

**3. Mixing Zakah and Sadaqah**
Remember that voluntary Sadaqah does not replace obligatory Zakah. They are separate acts of worship.

**4. Not accounting for the Hawl**
Even if you are above Nisab today, Zakah is only due after one full lunar year. Do not rush to pay until the Hawl condition is met.

**5. Incorrect debt deductions**
Not all debts are deductible. Make sure the debts you subtract are actually due within the current lunar year and are not long-term obligations like mortgages (on which scholars differ).

**How to avoid these mistakes:** Use a reliable Zakah calculator like ZakahNisab, keep good records of your assets and liabilities, and consult a scholar for complex situations.`,
  },
  {
    slug: 'zakah-for-business-owners',
    title: 'Zakah for Business Owners: A Practical Guide',
    excerpt: 'Business owners have unique Zakah considerations. Learn how to calculate Zakah on your business assets and inventory.',
    content: `If you own a business, your Zakah calculation includes additional asset categories.

**What is Zakatable in your business:**
- Cash in business bank accounts
- Inventory and stock-in-trade
- Accounts receivable (money owed to your business)
- Raw materials and finished goods

**What is NOT Zakatable:**
- Fixed assets (buildings, machinery, vehicles used in the business)
- Personal assets not intended for sale
- Business liabilities (deductible from total assets)

**How to calculate:**
1. Add up all cash, inventory value, and receivables
2. Subtract business debts and payables
3. Add your personal zakatable assets (cash, gold, etc.)
4. Check against Nisab
5. Pay 2.5% on the total

**Important for online sellers:** If you sell on Instagram, WhatsApp, or e-commerce platforms, the value of your current inventory is zakatable. Keep track of your stock levels.

**A note on mixed assets:** If your business has both zakatable and non-zakatable assets, calculate only on the zakatable portion.`,
  },
];
