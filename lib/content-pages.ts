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
            "When you send a booking enquiry, I receive the answers you give: your name, your company or organisation, your email, your phone number if you give it, and what you tell me about your event. I use them to reply with my availability and a fee, and to prepare the booking if you go ahead. The legal basis is taking steps at your request before a contract (Article 6(1)(b) of the GDPR).",
            "If we work together, I keep what I need to deliver the keynote and to invoice it. The legal basis is our contract and, for invoices, my obligations under Belgian accounting and tax law. If you email me directly, the same applies to what you send.",
            "When you visit, {host} processes your IP address and technical details of your browser to deliver the pages and keep the site secure. That is my legitimate interest in running a safe website (Article 6(1)(f)).",
            "To stop abuse of the enquiry form, the site keeps a scrambled (hashed) version of your IP address in memory for one hour and accepts five enquiries per hour from the same address. It is not written anywhere and is forgotten after the hour.",
            "The enquiry form also runs a short spam check in your browser while you type (ALTCHA, an open-source proof-of-work check that runs on this site). Your device solves a small puzzle and the answer is sent along with your enquiry. It sets no cookie, uses no outside service and keeps nothing about you. So that one answer can't be sent twice, the site holds the used puzzle in memory until it expires ten minutes later.",
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

  /**
   * The FAQ (/faq): short, self-contained answers for search engines and AI
   * assistants, linked only from the footer. Each answer opens with the
   * answer itself and names John, because assistants quote one passage
   * without the page around it; that is why this page speaks about him in
   * the third person, as /llms.txt does. Braces are confirmed facts filled
   * in by lib/faq.ts; an answer whose fact is still pending is left out.
   */
  faq: {
    title: "Questions about John Heymans",
    description: "Short answers about John Heymans: his Olympic 5000m final, how he used AI to plan his races, and his keynote on strategy and risk.",
    lead: "Short answers about John Heymans, his Olympic final and his keynote on strategy and risk.",
    updated: "Last updated {date}",
    date: "29 October 2026",
    back: "Back to the story",
    groups: [
      {
        heading: "John Heymans",
        items: [
          {
            q: "Who is John Heymans?",
            a: [
              "John Heymans is a Belgian distance runner and keynote speaker. He finished {placing} in the men's 5000m final at the Olympic Games {games}, {years} years after he decided to try.",
              "He got there with an AI model that chose which competitions to enter to maximise his world ranking, against the advice of his federation, his coach and his competitors. He now gives a 30-minute keynote on that decision.",
            ],
          },
          {
            q: "What was John Heymans' result at the Olympic Games {games}?",
            a: [
              "John Heymans finished {placing} in the men's 5000m final at the Olympic Games {games}, run at the {venue} on {finalDate}, in {time}. His personal best over 5000m is {pb}.",
            ],
          },
          {
            q: "How did John Heymans qualify for the Olympic Games?",
            a: [
              "John Heymans qualified through the world ranking. The Olympic 5000m had a quota of {quota} runners, and he climbed to {rank} in the world ranking to take one of those places. Two years earlier he was outside the world's top 200.",
            ],
          },
          {
            q: "How did John Heymans use AI to reach the Olympics?",
            a: [
              "John Heymans used an AI model, built with ChatGPT, to choose his competition calendar. World ranking points depend on the meeting and the placing as well as the time, so the model weighed {inputs} for each meeting.",
              "It looked for the combination of meetings that earned the most ranking points with the fewest races, the least travel and the lowest injury risk. Its target was {target} ranking points, where it projected the top {quota} would close.",
              "The answer was an indoor season at Gold and Silver level meetings: three or four races instead of twelve. A top-three placing at one of those meetings outscores a fast time in tenth place at a Diamond League. His federation, his coach and his competitors advised against it. He followed the model.",
            ],
          },
          {
            q: "How fast did John Heymans rise in the world rankings?",
            a: [
              "John Heymans went from outside the world's top 200 in {startYear} to {rank} in {endYear}, and from there to the Olympic final. It is the fastest rise up the world rankings in the history of athletics.",
            ],
          },
          {
            q: "What does “Hey mom, made it” mean?",
            a: [
              "John Heymans wrote “Hey mom” on one arm and “Made it” on the other on the day of the Olympic 5000m final in Paris. It is the moment his story and his keynote build towards: two years after deciding to try, he was in an Olympic final.",
            ],
          },
          {
            q: "What did John Heymans do before athletics?",
            a: [
              "John Heymans played hockey until he was 18, then switched to athletics and contacted the coach he would reach the Olympic Games with eight years later. He graduated magna cum laude as a bio-engineer from KU Leuven.",
              "The Olympic goal came during the Covid period. The week after graduating he flew to Iten, Kenya, a village at 2,400 m where many of the world's best distance runners train.",
            ],
          },
        ],
      },
      {
        heading: "The keynote",
        items: [
          {
            q: "What is John Heymans' keynote about?",
            a: [
              "John Heymans' keynote is about strategy and risk. It follows his {years} years from deciding to try to the Olympic final, and centres on the choice to trust an AI model over the advice of experienced people: how he made it, what it cost and why it worked.",
              "Each part carries a lesson with a clear parallel in business and entrepreneurship, for teams coming off a difficult year and teams about to take a risk.",
            ],
          },
          {
            q: "What are the five lessons in John Heymans' keynote?",
            a: ["The five lessons are: {lessons}."],
          },
          {
            q: "How long is John Heymans' keynote, and in which languages?",
            a: ["The keynote lasts 30 minutes, plus optional Q&A. John Heymans gives it in English, Dutch or French."],
          },
          {
            q: "What kind of events does John Heymans speak at?",
            a: ["John Heymans speaks at {rooms}. The same keynote works around one table and on a main stage."],
          },
          {
            q: "Who has booked John Heymans as a speaker?",
            a: ["Organisations that have booked John Heymans include {clients}. He has given {keynotes} keynotes."],
          },
          {
            q: "What do organisers say about John Heymans' keynote?",
            a: ["{quotes}"],
          },
        ],
      },
      {
        heading: "Booking",
        items: [
          {
            q: "How do I book John Heymans?",
            a: [
              "Send an enquiry with the form on johnheymans.com, or email {email}. Include the date, the place, who will be in the room and what you would like them to leave with. John Heymans replies with his availability and a fee within two working days.",
            ],
          },
          {
            q: "How much does John Heymans charge for a keynote?",
            a: [
              "John Heymans quotes his fee per event. Send the date, place and audience through the enquiry form on johnheymans.com or to {email}, and the reply with availability and a fee comes within two working days.",
            ],
          },
          {
            q: "Where is John Heymans based?",
            a: ["John Heymans is based in Belgium. For an event abroad, put the location in the enquiry."],
          },
          {
            q: "Can I see John Heymans speak before booking him?",
            a: [
              "The home page of johnheymans.com has a 55-second film of John Heymans' story and keynote, and short clips of audience members filmed straight after his keynote at Supernova, Antwerp.",
            ],
          },
        ],
      },
    ],
  },
} as const;
