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


  /** The one-page story. Round 5: one continuous film, then the practical part. */
  signal: {
    nav: { cta: "Check availability", wordmark: "John Heymans" },

    hero: {
      line: "Olympic 5000m finalist. A 30-minute keynote on strategy, risk and the edge nobody else is looking for.",
      soundOn: "Sound on",
      soundOff: "Sound off",
      scroll: "Scroll to begin",
    },

    story: {
      opener: {
        title: "They all said it couldn't be done.",
        sub: "Two years before Paris I had no ranking, no standard and no plan. I had a decision.",
      },
      kenya: {
        title: "So I went where the best already were.",
        line: "Iten, Kenya. Two thousand four hundred metres above sea level, where the best distance runners in the world do their work.",
        note: "I trained with them for weeks and learned how they do it. Not harder than everyone else. Better, every single day.",
        from: { place: "Brussels", alt: "76 m" },
        to: { place: "Iten", alt: "2,400 m" },
      },
      edge: {
        title: "It still wasn't enough.",
        line: "Everyone up there trains like that. Consistency got me into the group. It was never going to get me past it. I needed an edge nobody else was using.",
      },
      chat: {
        title: "So I asked for one.",
        app: "ChatGPT",
        prompt: "Build an algorithm that gets me to the Olympics.",
        reply: [
          "Olympic qualification runs on world ranking points, not on your personal best.",
          "Points come from your result and your position, weighted by the category of the meet.",
          "So the question is not where you run fastest. It is where the points are.",
        ],
        compute: ["Reading the international calendar", "212 meets scored", "Projecting the ranking after every combination", "Optimising for points per race"],
        outputTitle: "The schedule it produced",
        output: [
          "Skip the fast meets where I finish twelfth.",
          "Enter the category meets where I can place.",
          "Two continental meets, four weeks apart.",
          "One national title, for the points nobody counts.",
        ],
        caption: "Not one of those was the race anyone would have chosen for me.",
      },
      doubt: {
        messages: [
          { who: "My federation", text: "That is not how qualification works." },
          { who: "My coach", text: "You will race yourself into the ground." },
          { who: "My rivals", text: "Nobody qualifies like that." },
        ],
        answer: "I ran it anyway.",
        flashes: ["Fastest rise up the world rankings in the history of my event", "Olympic quota secured"],
      },
      setback: {
        title: "Then it stopped going to plan.",
        line: "Illness. A lost block of training. Results that made no sense on paper.",
        note: "So I cut the list in two. Everything I could not control went out. What stayed was the part I could.",
        controllables: ["Sleep", "Nutrition", "Training"],
        outcome: "The schedule held. I qualified.",
      },
      village: {
        title: "In the Olympic village I made one last decision.",
        line: "Half the athletes there were being eaten alive by the pressure. I decided to enjoy every hour of it instead.",
      },
      final: {
        title: "Nobody had me in that final.",
        line: "I ran it anyway, in front of a full Stade de France, and finished eleventh in the world.",
        marker: ["Hey mom", "Made it"],
        close: "Dare to dream big.",
        closeNote: "That is the story. Here is what your team takes from it.",
      },
    },

    practical: {
      title: "The keynote",
      lead: "Thirty minutes, five decisions, one story your team can use on Monday morning.",
      facts: [
        { label: "Length", value: "30 minutes, plus optional Q&A" },
        { label: "Languages", value: "English, Dutch or French" },
        { label: "Format", value: "In person, on your stage or at your table" },
        { label: "Built for", value: "Teams coming off a hard year, and teams about to take a risk" },
      ],
      audienceTitle: "Where it works",
      audience: [
        { title: "Conferences and business fairs", detail: "Main-stage keynote for 1,000 delegates or more.", size: "1,000+" },
        { title: "Company events", detail: "Team days and internal events, from 100 people.", size: "100+" },
        { title: "Executive offsites", detail: "Strategy sessions for senior leadership teams.", size: "20 to 50" },
        { title: "Leadership dinners", detail: "Around one table, with Q&A over dinner.", size: "8 to 20" },
      ],
      takeawayTitle: "What your audience takes home",
      takeaways: [
        { n: "01", title: "Your environment sets your ceiling", line: "People grow fastest in teams that hold a higher standard than they do." },
        { n: "02", title: "Consistency beats intensity", line: "The best are not working harder on their best day. They are working every day." },
        { n: "03", title: "The edge is where the consensus isn't", line: "The advantage is in the process everyone has stopped questioning." },
        { n: "04", title: "Control what you can control", line: "Separate the two lists, then spend everything on the shorter one." },
        { n: "05", title: "Big goals set the height of the ceiling", line: "Small ambitions are met exactly. Large ones change what a team attempts." },
      ],
      recording: "A full recording of the keynote at Supernova exists. Ask for the private link when you enquire.",
    },

    room: {
      title: "What the room says",
      note: "Filmed straight after the keynote at Supernova, Antwerp.",
      hint: "Click for sound",
    },

    bio: {
      title: "About John",
      role: "Olympic 5000m finalist. Keynote speaker.",
      body: [
        "I am a Belgian distance runner and a bio-engineer by training. I started running seriously late, graduated during Covid, and decided on the Olympics two years before Paris.",
        "The keynote came out of people asking how the ranking climb actually happened. The honest answer is a mix of environment, a model most people told me to ignore, and knowing which setbacks were worth my attention. That answer turned out to be useful to teams as well.",
      ],
      stats: [
        { value: "11th", label: "Olympic 5000m final, Paris 2024" },
        { value: "13:03.46", label: "5000m personal best" },
        { value: "2 years", label: "From the decision to the final" },
        { value: "15+", label: "Keynotes delivered, all by word of mouth" },
      ],
    },

    enquire: {
      title: "Bring this to your team",
      sub: "Tell me about the event. You get availability and a fee within two working days.",
    },
  },

  /**
   * The story page (round 6, /story). One film-like story, then the practical
   * part. Placeholders in braces are filled by lib/story/format.ts. A word in
   * asterisks is the word the amber line underlines. A vertical bar is a
   * line break in a title card; translators move it with the words.
   */
  story: {
    meta: {
      title: "John Heymans, Olympic 5000m finalist and keynote speaker",
      description: "Two years. One algorithm. The Olympic final. I built the algorithm that chose my races. A 30-minute keynote on strategy, risk and finding the edge.",
      person: "Belgian Olympic 5000m finalist and keynote speaker.",
      imageAlt: "John Heymans on stage, with the line: Two years. One algorithm. The Olympic final.",
    },

    a11y: {
      skip: "Skip to the keynote details",
      storyTitle: "The story",
      heroRegion: "Keynote film",
    },

    frame: {
      wordmark: "John Heymans",
      home: "John Heymans, back to the top",
      cta: "Check availability",
      ctaShort: "Availability",
      skip: "Skip the story",
      progress: "Story progress",
      soundOn: "Turn story sound on",
      soundOff: "Turn story sound off",
    },

    chapters: {
      opener: "",
      iten: "Iten",
      edge: "The edge",
      algorithm: "The algorithm",
      doubt: "The doubters",
      setback: "Setbacks",
      village: "The village",
      final: "The final",
      handover: "",
    },

    credit: "Photo: {name}",

    hero: {
      line: "Two years. One algorithm. The Olympic final.",
      sub: "A 30-minute keynote on strategy, risk and finding the edge.",
      film: "Watch the film with sound",
      scroll: "Scroll to begin",
      pause: "Pause the film",
      play: "Play the film",
      standInCredit: "Stand-in film cut from photos by {names}",
      /** Seconds in the hero film where it shows its own text. Our line steps aside. */
      quietCues: [] as { start: number; end: number }[],
    },

    film: {
      title: "The film",
      close: "Close",
      standIn: "The 60-second film is in its final edit. Until it arrives, this is the stand-in cut, without sound.",
      captions: "English",
    },

    opener: {
      title: "They all said|it couldn't|be|done.",
    },

    iten: {
      destination: "Iten, Kenya",
      altitude: "{n} m",
      line: "So I trained with the best, and learned their ways.",
      mapSummary: "A flight to Iten, Kenya, and a climb to 2,400 m.",
    },

    edge: {
      a: "However, this wouldn't be enough.",
      b: "I needed an *edge*.",
    },

    algorithm: {
      app: "ChatGPT",
      composer: "Ask anything",
      send: "Send",
      prompt: "Identify the combination of world meetings that maximises ranking points while minimising total race count, physical fatigue, travel load and injury risk.",
      reply: [
        "Target: 1,215 ranking points. That is where the top 42 is projected to close.",
        "Placing points are not linear. Top three at a Gold or Silver indoor meet outscores a fast time in tenth at a Diamond League.",
        "Plan: indoors, Gold and Silver meets, three or four races instead of twelve.",
      ],
      you: "I asked",
      assistant: "ChatGPT replied",
      caption: "Three or four races instead of twelve. Indoors, where a top-three place is worth more than a fast time.",
      gridSummary: "Every candidate meet in the qualifying window, and the season the algorithm chose, connected in date order.",
    },

    telemetry: {
      objective: "Target: {points} points, the projected cut for the top {quota}",
      calendar: "Reading the international calendar",
      scored: "Scoring each meet: odds of a top-three place",
      projecting: "Weighing place against time, by meet category",
      optimising: "Minimising races, travel and injury risk",
      selected: "Season selected: indoors, Gold and Silver",
      objections: "Objections: federation, coach, competitors",
      unchanged: "Schedule unchanged",
      tracking: "Tracking world ranking",
      record: "Fastest rise in the history of the event",
      holding: "Inside the top {quota}, by a few places",
      sorting: "Separating what I control",
      controllables: "Sleep. Nutrition. Training.",
      standard: "Olympic standard: {standard}",
      qualified: "{city}, {date}: {time}",
    },

    doubt: {
      roles: {
        federation: "My federation",
        coach: "My coach",
        competitors: "My competitors",
      },
      initials: {
        federation: "F",
        coach: "C",
        competitors: "C",
      },
      fallback: "That will never work.",
      now: "now",
      answer: "I ran it anyway.",
      record: "The fastest rise up the world rankings in the history of my event.",
      chartSummary: "My world ranking climbed from {a} in {from} to {b} in {to}, inside the Olympic quota of {quota}.",
    },

    setback: {
      line: "It didn't always go to plan. Setbacks came, one after another.",
      uncontrollable: ["Illness", "Weather", "Injury"],
      controllable: ["Sleep", "Nutrition", "Training"],
      cannot: "Out of my control",
      can: "In my control",
      focus: "So I focused on what I could control.",
      qualified: "In the end, I qualified.",
    },

    qualifiedNote: "{date}: {how}.",

    village: {
      a: "The day I arrived in the Olympic village, I had a choice.",
      b: "Let the pressure get to me, or enjoy every minute of it.",
      c: "I chose to enjoy it.",
    },

    final: {
      a: "Nobody believed I'd make that final.",
      b: "I was the underdog.",
      arms: "Hey mom, made it.",
      close: "Dare to|dream big.",
    },

    handover: {
      /* Bars are line breaks. Written in, so the card never leaves "it." alone on a line. */
      line: "That's the story.|Here's what your team takes from it.",
    },

    /** One lesson per chapter, in keynote order. The practical part uses the same five. */
    lessons: [
      { title: "Your environment sets your ceiling.", line: "And consistency beats hard work." },
      { title: "The edge is where the consensus isn't.", line: "Don't be afraid to challenge the status quo." },
      { title: "Focus on what you can control.", line: "And stop overthinking what you can't." },
      { title: "Embrace the pressure.", line: "It comes with the moments that matter." },
      { title: "Dare to dream big.", line: "Your dreams set your ceiling." },
    ],
    lessonOf: "{n} of {total}",

    ranking: {
      label: "World ranking",
      outside: "Outside the quota",
      climbing: "Climbing",
      inside: "Inside the quota",
      finalLabel: "Olympic 5000m",
      finalValue: "Final",
      placing: "{ordinal} in the final",
      quotaLine: "The Olympic quota: {n} runners",
      qualifiedTitle: "{time} in {city}",
      qualifiedLine: "Under the {standard} Olympic standard",
    },

    photoAlt: {
      "track-lying": "John lying on a red track after a session, seen from above",
      "lavender-race": "John racing an Olympic 5000m heat in Paris",
      "heats-pack": "John with his fist in the air as he finishes his Olympic 5000m heat in Paris",
      "final-pan": "The field of an Olympic 5000m heat in Paris, in motion",
      "final-arms": "John after the Olympic 5000m final, hands on his head, with Hey mom written on one arm and Made it on the other",
      "outdoor-portrait": "John on a track, tense, catching his breath",
      iten: "John on a red dirt road in Iten, Kenya, smiling",
      "kit-portrait": "John in the Belgian kit on an indoor track, checking his watch",
      shoes: "John tying his racing spikes on a bench before a race",
      "track-laugh": "John sitting on a track, laughing",
      "stage-wide": "John on stage at Supernova, Antwerp",
    },

    practical: {
      title: "The keynote",
      lead: "Thirty minutes, five lessons, one story your team can use on Monday morning.",
      facts: [
        { figure: "30", line: "minutes, plus optional Q&A" },
        { figure: "3", line: "languages: English, Dutch or French" },
        { figure: "5", line: "lessons, one per chapter of the story" },
      ],
      format: "In person, on your stage or at your table.",
      lessonsTitle: "The five lessons",
      lessonBack: "Back to lesson {n} in the story",
      scaleTitle: "Where it works",
      scaleLead: "As comfortable at a boardroom table as on a main stage.",
      scaleAxis: "People in the room",
      scale: [
        { title: "Leadership dinners", size: "8 to 20", at: 12, detail: "Around one table, with Q&A over dinner." },
        { title: "Executive offsites", size: "20 to 50", at: 32, detail: "Strategy sessions for senior leadership teams." },
        { title: "Company events", size: "100+", at: 100, detail: "Team days and internal events, from 100 people." },
        { title: "Conferences and business fairs", size: "1,000+", at: 1000, detail: "Main-stage keynote for 1,000 delegates or more." },
      ],
      proofTitle: "Booked by",
      proofNote: "And White & Case, Cobepa and The Merode.",
      /** Logo heights in rem, set by eye so each carries the same visual weight. */
      logoHeights: { ypo: 3.1, kbc: 3.4, dell: 3.1, engie: 2.3, "sd-worx": 2.2, duvel: 3.2, unizo: 2.9, warande: 3.2, garrincha: 1.35, supernova: 1.45 },
      quotesTitle: "What organisers wrote",
      roomTitle: "What the room said",
      roomNote: "Filmed straight after the keynote at Supernova, Antwerp.",
      roomPause: "Pause the clips",
      roomPlay: "Play the clips",
      roomOpen: "Watch with sound, {s} seconds",
      roomDialog: "Straight after the keynote at Supernova",
      recording: "A full recording of the keynote exists. Ask for the private link when you enquire.",
    },

    enquiry: {
      title: "Bring this to your team.",
      modalTitle: "Check John's availability",
      intro: "Five short questions. You get availability and a fee within two working days.",
      /** The enquiry is styled as a ChatGPT conversation, a nod to how the season was planned. */
      chat: {
        app: "ChatGPT",
        hello: "Let's see if John is free for your event. Five quick questions, then he replies with availability and a fee within two working days.",
        pick: "Choose an answer above",
        details: "Add your details above, then send",
        disclaimer: "Not actually ChatGPT. Your answers go straight to John.",
        edit: "Change this answer",
        sent: "Sent. John replies within two working days, usually sooner.",
      },
      steps: {
        type: {
          q: "What kind of event is it?",
          options: ["Conference or business fair", "Company event", "Executive offsite", "Leadership dinner", "Something else"],
        },
        date: { q: "When is it?", label: "Event date", notFixed: "Not fixed yet" },
        size: {
          q: "Roughly how many people will be in the room?",
          options: ["8 to 20", "20 to 50", "100 or more", "1,000 or more"],
        },
        language: { q: "Which language should John speak?", options: ["English", "Dutch", "French"] },
        contact: {
          q: "Who should John reply to?",
          name: "Your name",
          org: "Organisation",
          email: "Work email",
          message: "Anything else John should know",
          optional: "optional",
        },
      },
      next: "Next question",
      back: "Previous question",
      send: "Send enquiry",
      sending: "Sending",
      plain: "Prefer one form?",
      conversational: "Back to the questions",
      stepOf: "Question {n} of {total}",
      revisit: "Change this answer",
      success: "Thanks. You'll hear from me within two working days.",
      urgent: "Anything urgent: {email}",
      error: "That didn't go through. Write to John directly at {email}.",
      required: "John needs this one to reply.",
      invalidEmail: "That email address doesn't look complete.",
      direct: "Or write directly to {email}",
      email: "hello@johnheymans.com",
    },

    bio: {
      title: "About John",
      body: [
        "I am a Belgian distance runner and a bio-engineer by training. I started running seriously late, graduated during Covid, and decided on the Olympics two years before the Games.",
        "The keynote came out of people asking how the ranking climb actually happened. The honest answer is a mix of environment, a model most people told me to ignore, and knowing which setbacks were worth my attention. That answer turned out to be useful to teams as well.",
      ],
      figures: {
        placing: "in the Olympic 5000m final",
        pb: "5000m personal best",
        years: "from deciding to try to the Olympic final",
        keynotes: "keynotes so far, all booked by word of mouth",
      },
      years: "{n} years",
      follow: "Follow the training",
      reel: {
        label: "John on his road to the Olympics, in his own words",
        soundOn: "Play with sound",
        soundOff: "Sound on",
        play: "Play the video",
        pause: "Pause the video",
      },
    },

    footer: {
      wordmark: "John Heymans",
      contact: "Business enquiries",
      credits: "Photography: {names}",
      copyright: "© John Heymans {year}",
      /** The easter egg: your scroll, timed like a race. */
      pace: {
        title: "Your run down this page",
        waiting: "You're on the last lap.",
        lead: "You just scrolled {d} m. Here's your split.",
        pace: "Your pace",
        perKm: "{p} /km",
        five: "Your 5,000 m at that pace",
        mine: "Mine, {city} {year}",
        mineShort: "Mine",
        blank: "--:--",
        days: "{d} d {h} h",
      },
      top: "Back to the top",
    },

    format: {
      ordinal: { one: "{n}st", two: "{n}nd", few: "{n}rd", other: "{n}th" },
      seconds: "{s} s",
      minutes: "{m} min {s} s",
      hours: "{h} h {m} min",
      days: "{d} days {h} h",
      metres: "{n}",
    },

    dev: {
      pending: "Pending",
      placeholder: "Placeholder",
      creditPending: "photographer to confirm",
    },
  },

  footer: {
    contact: "Business enquiries",
    credits: "Photography",
    copyright: "John Heymans",
  },
} as const;

export type Content = typeof content;
