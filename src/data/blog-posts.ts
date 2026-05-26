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
- **Silver Nisab:** 595 grams of silver

The Silver Nisab is the lower threshold. Many scholars recommend using the Silver Nisab as it is more cautious and ensures that Zakah is given sooner. If your net wealth is less than the Nisab, no Zakah is due.

**Why does Nisab matter?** It prevents those with minimal wealth from being burdened and ensures Zakah is only required from those who can genuinely afford it.`,
  },
  {
    slug: 'gold-nisab-vs-silver-nisab',
    title: 'Gold Nisab vs Silver Nisab: Which One Should You Use?',
    excerpt: 'Understand the difference between the two Nisab thresholds and which one may apply to your situation.',
    content: `When calculating Zakah, one of the first decisions is which Nisab threshold to use: Gold or Silver.

**Gold Nisab (87.48g of gold):** This is the higher threshold. In many parts of the world, the Gold Nisab is significantly higher than the Silver Nisab. Some scholars prefer this as it follows the literal mention of gold and silver in the Quran.

**Silver Nisab (595g of silver):** This is the lower threshold. The Hanafi school and many contemporary scholars recommend the Silver Nisab because it is closer to the original purpose of Zakah — to help those in need. Using the lower threshold means more people will be obligated to pay Zakah, which benefits the community.

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
    slug: 'nisab-for-paper-money',
    title: 'Nisab for Paper Money: Is It Based on Silver or Gold?',
    excerpt: 'Learn whether the minimum threshold (Nisab) for paper money is based on silver or gold, and how to calculate Zakah on your cash.',
    content: `**Summary of answer**

The correct view is that the minimum threshold (Nisab) for paper money is based on silver, not gold, because that is in the best interests of the poor. The minimum threshold for silver is 595 grams. So whoever has cash that is equivalent in value to that must give Zakah on it.

**Full Answer**

Praise be to Allah, and blessings and peace be upon the Messenger of Allah:

The minimum threshold for silver is 595 grams. So whoever has cash that is equivalent in value to that must give Zakah on it.

The earlier jurists decided on that with regard to trade goods, so they paid attention to what is in the best interests of the poor.

It says in Ar-Rawd Al-Murbi\`, p. 211: "Trade goods are to be evaluated at the end of the Hijri year on the basis of what is in the best interests of the poor, to be evaluated against gold or silver. If their value reaches the minimum threshold (Nisab) according to one of the two and not the other, that is what should be regarded as the minimum threshold."

In statements issued by the Fiqh Council of the Muslim World League, and in a statement issued by the Council of Senior Scholars in Saudi — which is also the view favoured by the Permanent Committee, and by Shaykh Ibn Baz (may Allah have mercy on him) and others — it was stated that cash is to be evaluated on the basis of the lower of the minimum thresholds of gold and silver, as that is what is in the best interests of the poor.

It says in a statement issued by the Fiqh Council of the Muslim World League:

"Zakah must be paid on paper money if its value reaches the lower of the minimum thresholds of gold or silver, or if it reaches the minimum threshold when put together with other wealth [gold and silver] and trade goods." (Al-Qarar 6, p.101)

Based on that, you should look at how much 595 grams of silver are worth, then if your cash is equal to that amount, Zakah must be paid on it at a rate of 2.5%.

And Allah knows best.`,
  },
  {
    slug: 'zakah-on-savings',
    title: 'Zakah on Savings: Complete Guide',
    excerpt: 'Understand how to calculate Zakah on your savings, when it becomes due, and how to handle savings accumulated over time.',
    content: `**Summary of answer**

If the amount of money reaches the nisab and one full Hijri year has passed, then zakah must be paid on it, whether it is for savings or otherwise. If the amount of money decreases and drops below the nisab during the year, then no zakah is due.

**Full Answer**

Praise be to Allah, and blessings and peace be upon the Messenger of Allah:

**Zakah on money in bank**

If the amount of saved money reaches the nisab (minimum threshold) and one full Hijri year has passed, then zakah must be paid on it, whether it is for savings or otherwise. The nisab is equivalent to 85 grams of gold or 595 grams of silver. The amount that must be paid is 2.5% of the money.

If the amount of money decreases and drops below the nisab during the year, then no zakah is due, and you start reckoning the year anew when the amount of money reaches the nisab again.

**Do you pay zakat on savings less than a year?**

If the amount of money increases gradually, then the matter is subject to further discussion.

If the new money comes from the first money, such as profits on the saved money in an Islamic bank — then zakah must be paid on the whole amount when one year has passed since the original money was acquired, even if only a few days have passed since the profit was acquired. Hence the jurists said that the year for the profits is the same as the year for the original amount.

If the extra money does not stem from the original and is separate money, such as money that a person saves from his salary, then the basic principle is that a separate year should be calculated for each amount of money. It is not necessary for this new money to reach the nisab, because the nisab has already been reached by the first amount of money.

Based on this, then whatever you save during Ramadan, you should pay zakah on it the following Ramadan, and whatever you save in Shawwal you should pay zakah on it the following Shawwal, and so on.

Undoubtedly it is difficult for a person to make a separate account for his savings each month, and to pay zakah on every amount he saves when one year has passed since acquiring it. Hence it is easier for him to pay zakah on all his savings during the year when one year has passed since his money first reached the nisab.

In that case, you will be paying zakah on money for which one year has not yet passed, but there is nothing wrong with that, because it comes under the heading of paying zakah in advance before one year has passed.

"With regard to a person who owns money that reaches the nisab then acquires other money at different times which does not stem from the first amount of money, and is rather separate from it, such as the salary that is paid monthly to an employee, or an inheritance, gift or rent paid on property, etc., if he insists on having all his rights and on not giving any charity to those who deserve it apart from what he is obliged to give, then he should make a schedule of his earnings and write down every amount and the date on which he took possession of it. Then he should pay zakah for each amount separately when one year has passed from the date on which he took possession of it.

But if he wants an easier method, and wants to be more generous and give precedence to the poor and others who are entitled to zakah over himself, then he can pay zakah on all the money he possesses when one year has passed from the date when his wealth first reached the nisab. This will bring a greater reward and raise him higher in status; it is easier for him and is more generous towards the poor and needy and others who are entitled to zakah. Whatever extra amount he may pay will be regarded as a 'down payment' on the zakah for any wealth for which one year has not yet passed." (Fatawa al-Lajnah al-Daimah, 9/280)

And Allah knows best.`,
  },
  {
    slug: 'categories-of-zakah-recipients',
    title: 'Categories of Zakah Recipients: The 8 Eligible Groups',
    excerpt: 'Learn about the eight categories of people who are eligible to receive Zakah, based on the Quran and Islamic scholarship.',
    content: `**Summary of answer**

There are 8 categories of Zakah recipients:

1. The poor
2. The needy
3. Those employed to collect or administer
4. To attract the hearts of those who have been inclined towards Islam
5. The slaves
6. Those who are in debt
7. For Allah's Cause
8. The wayfarers

**Full Answer**

Praise be to Allah, and blessings and peace be upon the Messenger of Allah:

**Reference to Zakah recipients in the Quran**

There are eight categories on which zakah must be spent, which Allah has explained clearly. He states that this is a duty imposed by Allah and that it is based on knowledge and wisdom. Allah, may He be exalted, says (interpretation of the meaning):

"As-Sadaqat (here it means zakah) are only for the Fuqara (poor), and Al-Masakin (the poor) and those employed to collect (the funds); and to attract the hearts of those who have been inclined (towards Islam); and to free the captives; and for those in debt; and for Allah's Cause (i.e. for Mujahidun — those fighting in a just battle), and for the wayfarer (a traveller who is cut off from everything); a duty imposed by Allah. And Allah is All-Knower, All-Wise." [al-Tawbah 9:60]

**Categories of Zakah recipients**

These eight are the categories who are entitled to zakah and to whom it must be paid.

**The first and second** are the fuqara and masakin (the poor and needy). They should be given zakah to meet their needs. The difference between the fuqara and masakin is that the fuqara are in greater need; one of them cannot find enough to suffice himself and his dependents for half a year. The masakin are better off than the fuqara, because they can find half of what will suffice them or more. These people should be given zakah because of their need.

**How to calculate the need of the poor and the needy**

The scholars said: They should be given what they need to suffice them and their families for one year, because when the year has passed, zakah will become due again. Just as the year is the unit of time by which zakah becomes due, so too the year should be the unit of time by which the poor and needy, who are entitled to zakah, should be given zakah. This is a good view, i.e., we should give the poor and needy person what will suffice him and his family for a full year, whether we give it in the form of food and clothing, or we give him money with which to buy what suits him, or we give him tools with which he can make things, if he is good at that, such as a tailor, carpenter or blacksmith and so on. What matters is that we give him what will suffice him and his family for one year.

**The third** is: those employed to collect or administer (the funds), i.e., those who are appointed by the authorities. This refers to those who are involved in the collection and distribution of zakah. They are the collectors who collect it from those who have to pay it, and the ones who divide it among those who are entitled to it, and those who record it, and so on.

**How much should zakah collectors be given?**

Those who are employed to administer the zakah deserve to be paid from it in return for their work, and they should be given according to their efforts.

Based on this, they should be given zakah commensurate with their work, whether they are rich or poor, because they are receiving zakah for their work, not because of their need.

**The fourth** is: "to attract the hearts of those who have been inclined (towards Islam)". These are people who may be given zakah in order to open their hearts towards Islam, either a kafir who we hope will become Muslim, or a Muslim to whom we give in order to strengthen his faith, or an evil man to whom we give zakah so as to ward off his evil from the Muslims.

**The fifth** category of those who are entitled to zakah is: slaves. The scholars explained this in three ways:
- A mukatib or slave who has entered into a contract of manumission to buy himself from his master
- A slave who may be bought with zakah funds and set free
- A Muslim prisoner who has been captured by the kuffar; the kuffar may be given zakah funds to ransom this prisoner

**The sixth** is: those who are in debt. The scholars divided debt into two categories: debts incurred to bring about reconciliation, and debts incurred because of need.

**The seventh** is: "for Allah's Cause". What is meant here is jihad for the sake of Allah and nothing else.

**The eighth** is: wayfarers, i.e., travellers who are cut off from everything and have no money. Such a traveller may be given enough zakah to enable him to reach his homeland, even if he is rich in his own country, because he is in need.

**Must zakah be given to each of the zakah recipients?**

The answer is that this is not obligatory, because the Prophet (peace and blessings of Allah be upon him) said to Mu'adh ibn Jabal (may Allah be pleased with him), when he sent him to Yemen: "Teach them that Allah has enjoined on them charity (zakah) from their wealth, to be taken from their rich and given to their poor."

**Which of the zakah recipients should be given priority?**

Priority should be given where the need is greatest, because all of them are entitled, so whoever is in greater need should be given priority. Usually the ones who are in greatest need are the poor and needy, hence Allah started with them.

Reference: Majmu' Fatawa Ibn \`Uthaymin (18/331-339).

And Allah knows best.`,
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
