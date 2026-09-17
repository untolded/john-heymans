/**
 * All user-facing copy lives here so a Dutch and French dictionary can be
 * added later without touching layout. Keys are stable; values are English.
 * Dutch runs 15 to 20 percent longer, so no layout may depend on string length.
 */

export type Locale = "en";

export const content = {
  brand: {
    name: "John Heymans",
    role: "Olympic 5000m finalist. Keynote speaker.",
    shortRole: "Olympic finalist, keynote speaker",
    pb: "13:03.46",
    pbLabel: "5000m personal best",
  },

  social: [
    { name: "Instagram", handle: "@heymans.john", href: "https://www.instagram.com/heymans.john/" },
    { name: "LinkedIn", handle: "John Heymans", href: "https://www.linkedin.com/in/john-heymans-308aa7154/" },
  ],

  nav: {
    keynote: "Keynote",
    story: "The story",
    proof: "Booked by",
    about: "About",
    enquire: "Check John's availability",
    enquireShort: "Enquire",
    film: "Watch the 60-second film",
    filmShort: "Watch the film",
    skip: "Skip to booking",
  },

  hero: {
    a: {
      headline: "Two years from deciding to try to the Olympic final.",
      sub: "I got there on a race schedule my federation, my coach and my competitors all told me not to run. An algorithm I built picked it. It produced the fastest rise up the world rankings in the history of my sport.",
      kicker: "A 30-minute keynote on strategy, risk and the status quo, for teams that need a different edge.",
    },
    b: {
      lines: ["Two years.", "One algorithm.", "An Olympic final."],
      sub: "Nobody with experience thought the plan would work. I ran it anyway. Now I bring what I learned to teams that are coming off a hard year.",
    },
    c: {
      headline: "Everyone with experience said no.",
      sub: "So I ran the race schedule an algorithm picked instead. Two years later I was on the start line of the Olympic 5000m final. I bring that decision, and what it cost, to teams that need to perform this year.",
    },
  },

  numbers: [
    { value: "2", unit: "years", label: "from deciding to try, to the Olympic final" },
    { value: "5000", unit: "m", label: "Paris 2024, Stade de France" },
    { value: "1", unit: "algorithm", label: "picked the races nobody agreed with" },
    { value: "Fastest", unit: "", label: "rise up the world rankings in the sport's history" },
  ],

  proposition: {
    title: "This is a story about strategy and risk. It happens to take place on a running track.",
    body: [
      "Everyone at the top already trains consistently. That is the entry fee, not the edge. So I built a model that chose which competitions to enter to maximise my world ranking and secure Olympic qualification.",
      "The schedule it produced looked wrong to everyone with experience. It was a real risk, and it was the right call. In the keynote I walk through how that decision was made, what it cost, and what it looks like inside an organisation.",
    ],
  },

  chapters: [
    {
      n: "01",
      place: "Iten, Kenya. 2,400 m",
      title: "Environment",
      tease: "The week after graduating I booked a one-way ticket to a village where the best distance runners in the world train. What I found there was not what I expected to find.",
      hook: "On who you train with, and how often.",
    },
    {
      n: "02",
      place: "A laptop, Belgium",
      title: "The algorithm",
      tease: "Consistency gets you to the front group. It does not get you past it. I needed an edge nobody else was using, so I built one, and then had to decide whether to trust it over everyone who knew better.",
      hook: "On challenging the status quo, and what it costs.",
    },
    {
      n: "03",
      place: "Between seasons",
      title: "Setbacks",
      tease: "Illness, weather, injury. Sleep, nutrition, training. Sorting one list from the other changed how I recovered from a bad result, and how quickly.",
      hook: "On what you control, and what you stop overthinking.",
    },
    {
      n: "04",
      place: "Olympic Village, Paris",
      title: "Pressure",
      tease: "There were two kinds of athlete in the village. Same rooms, same food, same stakes. I watched both for a week and chose which one to be.",
      hook: "On the moments that are rare enough to be worth enjoying.",
    },
    {
      n: "05",
      place: "Stade de France, 10 August 2024",
      title: "The final",
      tease: "Two words on each arm, written that morning. I will tell you the rest in the room.",
      hook: "On the size of the goal setting the height of the ceiling.",
    },
  ],

  keynote: {
    title: "The keynote",
    intro: "Thirty minutes, five parts, one arc: the two years from a decision to an Olympic final, and what each stage means for a team that has to perform this year.",
    facts: [
      { label: "Length", value: "30 minutes, plus optional Q&A" },
      { label: "Languages", value: "English, Dutch or French" },
      { label: "Format", value: "In person, on your stage or at your table" },
      { label: "Built for", value: "Teams coming off a difficult year" },
    ],
    contexts: [
      { title: "Conferences and business fairs", detail: "Main-stage keynote for 1,000 or more delegates." },
      { title: "Company events", detail: "Team days and internal events from 100 people." },
      { title: "Executive offsites", detail: "Strategy sessions for 20 to 50 senior leaders." },
      { title: "Leadership dinners", detail: "Around one table with 8 to 20 leaders, with Q&A." },
    ],
    supernova: {
      title: "Full keynote, Supernova 2026",
      note: "A complete recording of the talk exists. Ask for the private link when you enquire.",
    },
  },

  proof: {
    title: "Booked by",
    logos: [
      { slug: "ypo", name: "YPO" },
      { slug: "kbc", name: "KBC" },
      { slug: "dell", name: "Dell" },
      { slug: "engie", name: "Engie" },
      { slug: "sd-worx", name: "SD Worx" },
      { slug: "duvel", name: "Duvel" },
      { slug: "unizo", name: "Unizo" },
      { slug: "warande", name: "De Warande" },
      { slug: "garrincha", name: "Garrincha" },
      { slug: "supernova", name: "Supernova" },
    ],
    clients: ["White & Case", "Cobepa", "The Merode"],
    footnote: "And White & Case, Cobepa and The Merode.",
    quotes: [
      {
        text: "His story of rising from amateur to Olympic finalist in just two years wasn't about self-promotion but about sharing life lessons directly applicable to business. His high energy further enhanced the experience.",
        who: "Partner, Co-Head of Global M&A",
        org: "White & Case",
        portrait: "/testimonials/white-case-portrait.png",
        logo: "/testimonials/white-case-logo.png",
      },
      {
        text: "Sharing not only the highs of elite competition but also the hurdles and setbacks that shaped his path to success. His authenticity and openness made his message even more impactful.",
        who: "Programme Manager",
        org: "The Merode",
        portrait: "/testimonials/merode-portrait.png",
        logo: "/testimonials/merode-logo.png",
      },
    ],
  },

  about: {
    title: "About",
    body: [
      "I am a Belgian distance runner and a bio-engineer by training. I started running seriously late, graduated during Covid, and decided on the Olympics two years before Paris.",
      "The keynote came out of people asking how the ranking climb happened. The honest answer is a mix of environment, a model most people told me to ignore, and knowing which setbacks to worry about. That answer turned out to be useful to teams as well.",
    ],
    signature: "John",
  },

  enquiry: {
    title: "Check John's availability",
    intro: "Tell me about the event and I will come back to you within two working days with availability and a fee.",
    fields: {
      name: "Your name",
      company: "Company or organisation",
      email: "Work email",
      type: "Type of event",
      date: "Event date, if known",
      message: "Anything else I should know",
      language: "Language",
    },
    types: ["Conference or business fair", "Company event", "Executive offsite", "Leadership dinner", "Something else"],
    languages: ["English", "Dutch", "French"],
    submit: "Send enquiry",
    sending: "Sending",
    success: {
      title: "Received.",
      body: "I will reply within two working days. If it is urgent, write to hello@johnheymans.com.",
      close: "Close",
    },
    email: "hello@johnheymans.com",
  },

  film: {
    title: "The 60-second film",
    pending: "The film is in its final edit. This is the poster frame. The finished version drops into this player.",
    close: "Close",
  },

  footer: {
    contact: "Business enquiries",
    credits: "Photography",
    copyright: "John Heymans",
  },
} as const;

export type Content = typeof content;
