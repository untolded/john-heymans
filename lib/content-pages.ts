/**
 * The copy for the pages around the story: the 404 and the three legal pages.
 * Kept apart from lib/content.ts because that file ships to the browser with
 * the story, and the legal text has no business in its JavaScript. Only server
 * components import this. Same rules: keys stable, values English, no layout
 * depending on string length.
 */
export const pages = {
  notFound: {
    meta: "Page not found",
    big: "404",
    title: "This page didn't qualify.",
    body: "It isn't ranked anywhere. Maybe the link is old, maybe the page never existed. I've been outside the rankings before, and the way up starts on the home page.",
    home: "Back to the start",
    enquire: "Check my availability",
  },

  /**
   * The legal pages. A draft for John to check before launch: the facts in
   * braces come from lib/story/data/legal.json and show as "To confirm"
   * until he supplies them (npm run build:launch fails until then).
   * {email} is the booking address, {photographers} the footer's list.
   * A block is a paragraph, a list, or a table.
   */
  legal: {
    updated: "Last updated {date}",
    date: "29 September 2026",
    tbc: "To confirm: {what}",
    fields: {
      owner: "the business name and legal form",
      address: "the registered address",
      enterpriseNumber: "the enterprise number",
      vat: "the VAT number",
      host: "the hosting provider",
      mailbox: "the email provider",
      courts: "the judicial district",
    },
    skip: "Skip to the text",
    back: "Back to the story",
    home: "John Heymans, home",
    other: "Also:",
    otherLabel: "The other legal pages",

    privacy: {
      title: "Privacy",
      description: "What happens to the details you share through johnheymans.com, who else sees them, how long I keep them, and your rights.",
      lead: "What happens to the details you share with me through this site. The short version: I use them to answer your enquiry, I never sell them, and you can ask me to delete them at any time.",
      sections: [
        {
          heading: "Who is responsible",
          blocks: [
            "This site is run by {owner}, {address}, enterprise number {enterpriseNumber}, the business through which I, John Heymans, work as a speaker. In this policy, “I” and “me” mean that business and me. I decide what happens to your personal data here.",
            "For anything about your data, write to {email}.",
          ],
        },
        {
          heading: "What I collect and why",
          blocks: [
            "When you send a booking enquiry, I receive the answers you give: your name, your organisation, your work email, the type of event, its date and size, the language you'd like, and anything you add in the message. I use them to reply with my availability and a fee, and to prepare the booking if you go ahead. The legal basis is taking steps at your request before a contract (Article 6(1)(b) of the GDPR).",
            "If we work together, I keep what I need to deliver the keynote and to invoice it. The legal basis is our contract and, for invoices, my obligations under Belgian accounting and tax law. If you email me directly, the same applies to what you send.",
            "When you visit, {host} processes your IP address and technical details of your browser to deliver the pages and keep the site secure. That is my legitimate interest in running a safe website (Article 6(1)(f)).",
            "To stop abuse of the enquiry form, the site keeps a scrambled (hashed) version of your IP address in memory for one hour and accepts five enquiries per hour from the same address. It is not written anywhere and is forgotten after the hour.",
            "I don't measure visits at the moment. If I start, it will only happen after you agree in the cookie banner, and the cookie policy will name the tool first.",
          ],
        },
        {
          heading: "Who else sees it",
          blocks: [
            {
              list: [
                "Resend, Inc., which delivers the enquiry form to my inbox as an email.",
                "{mailbox}, where my email is kept.",
                "{host}, which hosts the site.",
                "My accountant, if a booking leads to an invoice.",
              ],
            },
            "Nobody else. I never sell or rent your details, and I don't use them for advertising.",
          ],
        },
        {
          heading: "Outside the European Union",
          blocks: [
            "Some of these providers are based in the United States. When your data leaves the European Economic Area, the transfer is covered by an adequacy decision of the European Commission, such as the EU-US Data Privacy Framework, or by the Commission's standard contractual clauses.",
          ],
        },
        {
          heading: "How long I keep it",
          blocks: [
            {
              list: [
                "Enquiries that don't lead to a booking: up to two years after our last contact, in case you come back to me.",
                "Bookings: as long as Belgian accounting and tax law requires me to keep the records.",
                "Security logs: only for the short period {host} keeps them.",
                "Your cookie choice: six months, then the site asks again.",
              ],
            },
          ],
        },
        {
          heading: "Your rights",
          blocks: [
            "You can ask to see the personal data I hold about you, to correct it, to delete it, to limit how I use it, to object to it, or to receive it in a format you can take elsewhere. Where you gave consent, you can withdraw it at any time. Write to {email} and I'll reply within one month.",
            "If you think I've handled your data wrongly, you can complain to the Belgian Data Protection Authority, Drukpersstraat 35, 1000 Brussels, www.dataprotectionauthority.be. I'd appreciate the chance to put it right first.",
          ],
        },
        {
          heading: "Links, photos and video",
          blocks: [
            "Instagram and LinkedIn are plain links, not embedded widgets, so nothing from them loads until you click. Once you're there, their own privacy policies apply.",
            "The videos, photos and fonts on this site are served from the site itself, not by other companies.",
            "If you appear in a photo or video here and would rather not, write to me and I'll take it down.",
          ],
        },
        {
          heading: "Changes",
          blocks: ["If I change this policy, the new version appears here with a new date."],
        },
      ],
    },

    cookies: {
      title: "Cookies",
      description: "Which cookies and browser storage johnheymans.com uses, why, for how long, and how to change your choice.",
      lead: "This site doesn't use advertising or tracking cookies. It stores two small things it needs to work, and it asks before it would ever count visits.",
      sections: [
        {
          heading: "What the site stores",
          blocks: [
            {
              table: {
                head: ["Name", "What it does", "Kind", "How long"],
                rows: [
                  ["jh_consent", "Remembers your choice in the cookie banner, so it doesn't ask on every page.", "Necessary cookie, set by this site", "Six months"],
                  ["scroll:[page]", "Returns you to where you were on a page when you go back.", "Necessary, session storage in your browser", "Until you close the tab"],
                ],
              },
            },
          ],
        },
        {
          heading: "Statistics",
          blocks: [
            "At the moment the site measures nothing. If I add visit statistics, they will count visits anonymously to show which parts of the story people read. They will only run if you choose “Allow statistics” in the banner, and this page will name the tool before it goes live.",
          ],
        },
        {
          heading: "Nothing from other companies",
          blocks: ["The videos, photos and fonts are served from this site. The Instagram and LinkedIn icons are plain links. No other company sets cookies here."],
        },
        {
          heading: "Changing your choice",
          blocks: [
            "Use “Cookie settings” at the bottom of any page to see the banner again. You can also delete cookies in your browser's settings; the site will simply ask again.",
            "Questions go to {email}. What happens to the details you send me is in the privacy policy.",
          ],
        },
      ],
    },

    notice: {
      title: "Legal notice",
      description: "Who runs johnheymans.com, the details Belgian law requires on a business website, and the terms for using its content.",
      lead: "The details Belgian law requires on a business website, and the terms for using what's on it.",
      sections: [
        {
          heading: "Who runs this site",
          blocks: [{ list: ["{owner}", "{address}", "Enterprise number: {enterpriseNumber}", "VAT: {vat}", "Email: {email}"] }],
        },
        {
          heading: "Hosting",
          blocks: ["This site is hosted by {host}."],
        },
        {
          heading: "Photos, video and text",
          blocks: [
            "The photographs remain the work of the photographers credited with them: {photographers}. Nothing on this site may be copied, reused or changed without written permission. For press or event material, write to {email}.",
          ],
        },
        {
          heading: "Accuracy and links",
          blocks: [
            "I keep this site accurate, but facts and availability change, and nothing here is a binding offer until we've agreed a booking in writing. I'm not responsible for the content of the sites this one links to.",
          ],
        },
        {
          heading: "Applicable law",
          blocks: ["Belgian law applies to this site. Disputes go to the courts of {courts}."],
        },
      ],
    },
  },
} as const;
