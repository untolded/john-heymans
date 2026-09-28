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
        { n: "01", title: "You are the average of the 5 people you spend the most time with", line: "People grow fastest in teams that hold a higher standard than they do." },
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
      title: "About me",
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
      description: "Two-year journey. One AI algorithm. The Olympic final. I built the algorithm that chose my races. A keynote on strategy, risk and finding the edge.",
      person: "Belgian Olympic 5000m finalist and keynote speaker.",
      imageAlt: "John Heymans with his arms up in the Olympic stadium in Paris, with the line: Two-year journey. One AI algorithm. The Olympic final.",
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

    /** Headings for the static story only (screen readers, reduced motion). The film shows no chapter names. */
    chapters: {
      prologue: "",
      opener: "",
      iten: "Iten",
      edge: "The edge",
      algorithm: "The algorithm",
      doubt: "The doubters",
      final: "The final",
      handover: "",
    },

    credit: "Photo: {name}",
    footageCredit: "Footage: {name}",

    hero: {
      line: "Two-year journey. One AI algorithm. The Olympic final.",
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

    /** John opens the story himself, one line at a time, over the red road in Iten. */
    prologue: {
      lines: [
        "My story is about taking|a different road.",
        "Two years before the Olympics in Paris,| I wasn't even in the world's top 200.",
        "So I used AI to find a road|nobody else was taking.",
      ],
    },

    opener: {
      title: "They all said|it couldn't|be|done.",
    },

    iten: {
      origin: "Brussels, Belgium",
      destination: "Iten, Kenya",
      title: "The day after my graduation,|I booked a plane|ticket to Kenya.",
      line: "To train with the best|runners in the world.",
      mapSummary: "A flight from Brussels, Belgium, to Iten, Kenya.",
      packAlt: "A large group of Kenyan runners training on a red dirt road in Iten",
    },

    edge: {
      a: "However,|training hard alone|wouldn't be enough.",
      b: "I needed an *edge*.",
    },

    /**
     * The ChatGPT conversation. A reconstruction of the method in
     * docs/john_heymans_olympic_journey_ai_strategy.md, not a transcript.
     * The code is shown as written; only its comments are translatable.
     */
    algorithm: {
      app: "ChatGPT",
      composer: "Ask anything",
      send: "Send",
      prompt: "Help me build an AI-algorithm to get me to the Olympics",
      you: "I asked",
      assistant: "ChatGPT answered",
      thinking: "Thinking",
      thought: "Finished thinking",
      steps: [
        "Olympic places in the 5000m go by world ranking. The quota is {quota} runners.",
        "Ranking points are result points plus placing points.",
        "Placing points aren't linear. A top three at a Gold or Silver indoor meet beats a fast time in tenth.",
      ],
      agentsHead: "Running {n} agents",
      agentsDone: "{n} agents finished",
      agents: [
        { name: "Ranking agent", task: "Projecting the cut for the top {quota}", done: "{points} points" },
        { name: "Calendar agent", task: "Scoring every meet in the window", done: "Top-three odds per meet" },
        { name: "Load agent", task: "Weighing races, travel and injury risk", done: "Three or four races" },
      ],
      codeLang: "python",
      copy: "Copy",
      code: [
        "# Olympic 5000m: {quota} places, decided by world ranking",
        "TARGET = {points}  # projected cut for the top {quota}",
        "",
        "def meet_score(meet, me):",
        "    podium = top3_odds(meet.field_depth, me.form)",
        "    return result_points(me.target_time) + podium * placing_points(meet.category)",
        "",
        "season = optimise(",
        "    meets=world_calendar(\"2023-07\", \"2024-06\"),",
        "    score=meet_score,",
        "    reach=TARGET,",
        "    minimise=[\"races\", \"fatigue\", \"travel\", \"injury_risk\"],",
        ")",
      ],
      recommendationLead: "Recommendation:",
      recommendation: "a competition calendar that's different from everyone else.",
      calendar: {
        rows: [
          { id: "usual", label: "Everyone else", note: "12 to 15 races, outdoors" },
          { id: "chosen", label: "You", note: "3 or 4 races, indoors" },
        ],
        summary: "Everyone else races twelve to fifteen times a season, outdoors, from May to September. The recommended season is three or four indoor races between January and March.",
      },
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
      title: "My team and my peers|called me crazy.",
      fallback: "That will never work.",
      now: "now",
      answer: "I ran it anyway.",
      record: "The fastest rise|up the world rankings|in the history of athletics.",
      chartSummary: "My world ranking climbed from {a} in {from} to {b} in {to}, inside the Olympic quota of {quota}. That ranking was my Olympic qualification.",
    },

    final: {
      a: "Nobody believed|I'd make the final.",
      b: "I was the underdog.",
      arms: "Hey mom, made it.",
      close: "Dare to|dream big.",
    },

    handover: {
      /* Bars are line breaks. Written in, so the card never leaves "it." alone on a line. */
      line: "That's my story.|Here's what your team takes from it.",
    },

    /**
     * The five lessons of the keynote, in keynote order. The story shows 1, 2
     * and 5 at the end of their chapters; the practical part lists all five.
     * A bar is a line break on the story's lesson card only.
     */
    lessons: [
      { title: "You are the average of the 5 people you spend the most time with." },
      { title: "Don't be afraid|to challenge|the status quo." },
      { title: "Focus on what|you can control." },
      { title: "Embrace|the pressure." },
      { title: "Dare to|dream big." },
    ],

    ranking: {
      quotaLine: "The Olympic quota: {n} runners",
      /** The two ends of the climb, as big as the chart allows. */
      startValue: "200+",
      endNote: "Olympic qualification",
    },

    photoAlt: {
      "track-lying": "Me lying on a red track after a session, seen from above",
      "lavender-race": "Me racing an Olympic 5000m heat in Paris",
      "heats-pack": "Me with my fist in the air as I finish my Olympic 5000m heat in Paris",
      "final-pan": "The field of an Olympic 5000m heat in Paris, in motion",
      "final-arms": "Me after the Olympic 5000m final, hands on my head, with Hey mom written on one arm and Made it on the other",
      "outdoor-portrait": "Me on a track, tense, catching my breath",
      iten: "Me on a red dirt road in Iten, Kenya, smiling",
      "kit-portrait": "Me in the Belgian kit on an indoor track, checking my watch",
      shoes: "Me tying my racing spikes on a bench before a race",
      "track-laugh": "Me sitting on a track, laughing",
      "stage-wide": "Me on stage at Supernova, Antwerp",
    },

    practical: {
      title: "The keynote",
      facts: [
        { figure: "30", line: "minutes, plus optional Q&A" },
        { figure: "3", line: "languages: English, Dutch or French" },
        { figure: "5", line: "lessons with clear parallels in business" },
      ],
      lessonsTitle: "More than an AI story: the five lessons I share with anyone chasing a meaningful goal",
      lessonBack: "Back to lesson {n} in the story",
      scaleTitle: "Small room or full house, expect to feel high energy",
      scale: [
        { title: "Leadership dinners", size: "8 to 20", at: 12 },
        { title: "Executive offsites", size: "20 to 50", at: 32 },
        { title: "Company events", size: "100+", at: 100 },
        { title: "Conferences and business fairs", size: "1,000+", at: 1000 },
      ],
      proofTitle: "I've been booked by",
      /**
       * The marquee, in order. Each file is prepared to read as one colour
       * (scripts in the round 10 notes); heights in rem are set by eye so every
       * logo carries the same visual weight. A caption sits under a symbol
       * that does not say its own name.
       */
      logos: [
        { file: "ypo.svg", name: "YPO", w: 433, h: 163, rem: 3.1 },
        { file: "proximus.png", name: "Proximus", w: 756, h: 160, rem: 2.2 },
        { file: "kbc.svg", name: "KBC", w: 320, h: 320, rem: 3.4 },
        { file: "white-case.svg", name: "White & Case", w: 162, h: 12, rem: 1.3 },
        { file: "dell.svg", name: "Dell", w: 58, h: 33, rem: 3.1 },
        { file: "sport-vlaanderen.png", name: "Sport Vlaanderen", w: 468, h: 160, rem: 2.7 },
        { file: "engie.svg", name: "Engie", w: 78, h: 28, rem: 2.3 },
        { file: "cobepa.png", name: "Cobepa", w: 267, h: 200, rem: 3.6 },
        { file: "sd-worx.svg", name: "SD Worx", w: 128, h: 41, rem: 2.2 },
        { file: "duvel.svg", name: "Duvel", w: 676, h: 312, rem: 3.2 },
        { file: "hr-tech.svg", name: "HR Tech", w: 954, h: 1080, rem: 3.6 },
        { file: "unizo.svg", name: "Unizo", w: 200, h: 92, rem: 2.9 },
        { file: "warande.svg", name: "De Warande", w: 46, h: 38, rem: 2.5, caption: "De Warande" },
        { file: "sigma.png", name: "Sigma", w: 282, h: 200, rem: 3.4 },
        { file: "garrincha.svg", name: "Garrincha", w: 751, h: 100, rem: 1.35 },
        { file: "supernova.svg", name: "Supernova", w: 163, h: 25, rem: 1.45 },
      ],
      logosPause: "Pause the logos",
      logosPlay: "Play the logos",
      quotesTitle: "What organisers wrote",
      /** Translated from Dutch where the original was Dutch. Name and link only where the writer gave them. */
      quotes: [
        {
          text: "I've attended plenty of keynotes lately, and take it from me, John: you stand head and shoulders above them. And I'm comparing you with the so-called top names from the business world.",
          name: "Andrés Jorge Buysse",
          who: "Private Banker",
          org: "Deutsche Bank",
          href: "https://www.linkedin.com/in/andr%C3%A9s-jorge-b-83897a83/",
          portrait: null,
          logo: { src: "/testimonials/deutsche-bank-logo.png", w: 120, h: 120 },
        },
        {
          text: "His story of rising from amateur to Olympic finalist in just two years wasn't about self-promotion but about sharing life lessons directly applicable to business. His high energy further enhanced the experience.",
          name: null,
          who: "Partner, Co-Head of Global M&A",
          org: "White & Case",
          href: null,
          portrait: "/testimonials/white-case-portrait.png",
          logo: { src: "/testimonials/white-case-logo.png", w: 120, h: 40 },
        },
        {
          text: "Your keynote at De Warande was a unique experience for everyone there. With your enthusiasm, your youth and your positivity, you win over your whole audience. That philosophy applies directly to the attitude a business leader needs to grow.",
          name: "Marina De Groof",
          who: "Founder and CEO",
          org: "DGI Immo",
          href: "https://www.linkedin.com/in/marinadegroof/",
          portrait: "/testimonials/dgi-portrait.jpg",
          logo: { src: "/testimonials/dgi-logo.png", w: 105, h: 120 },
        },
        {
          text: "Sharing not only the highs of elite competition but also the hurdles and setbacks that shaped his path to success. His authenticity and openness made his message even more impactful.",
          name: null,
          who: "Programme Manager",
          org: "The Merode",
          href: null,
          portrait: "/testimonials/merode-portrait.png",
          logo: { src: "/testimonials/merode-logo.png", w: 120, h: 40 },
        },
      ],
      quoteProfile: "{name} on LinkedIn",
      roomTitle: "What the room said",
      roomNote: "Filmed straight after the keynote at Supernova, Antwerp.",
      roomPause: "Pause the clips",
      roomPlay: "Play the clips",
      roomOpen: "Watch with sound, {s} seconds",
      roomSound: "Play with sound",
      roomDialog: "Straight after the keynote at Supernova",
    },

    enquiry: {
      title: "Bring this to your team.",
      modalTitle: "Check my availability",
      intro: "Five short questions. You get availability and a fee within two working days.",
      /** The enquiry is styled as a ChatGPT conversation, a nod to how the season was planned. */
      chat: {
        app: "ChatGPT",
        hello: "Let's see if I'm free for your event. Five quick questions, then I'll reply with availability and a fee within two working days.",
        pick: "Choose an answer above",
        details: "Add your details above, then send",
        disclaimer: "Not actually ChatGPT. Your answers come straight to me.",
        edit: "Change this answer",
        sent: "Sent. I'll reply within two working days, usually sooner.",
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
        language: { q: "Which language should I speak?", options: ["English", "Dutch", "French"] },
        contact: {
          q: "Who should I reply to?",
          name: "Your name",
          org: "Organisation",
          email: "Work email",
          message: "Anything else I should know",
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
      error: "That didn't go through. Write to me directly at {email}.",
      required: "I need this one to reply.",
      invalidEmail: "That email address doesn't look complete.",
      direct: "Or write directly to {email}",
      email: "hello@johnheymans.com",
    },

    bio: {
      title: "About me",
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
        label: "My road to the Olympics, in my own words",
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
      /** Scrolling the page counts as a 1 km run; the clock pauses while you read, like a running watch. */
      pace: {
        title: "Your run down this page",
        waiting: "You're on the last lap.",
        lead: "Scrolling down this page counts as a 1 km run. Here's how fast you went.",
        pace: "Your time for 1 km",
        five: "Your 5 km at that speed",
        mine: "My fastest 5 km, {city} {year}",
        mineShort: "My fastest 5 km",
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
