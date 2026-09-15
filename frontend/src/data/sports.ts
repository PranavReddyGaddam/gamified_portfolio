export type Sport = {
  id: string;
  /** Sport name, shown on the card. */
  label: string;
  /** The player this sport means most through. */
  favourite: string;
  /** One line under the sport name. */
  blurb?: string;
  /** Cover image, from /public/fun/. Omit for the drawn crest. */
  image?: string;
  /** Free-form rows shown in the modal: team, competition, ground, whatever. */
  facts?: { label: string; value: string }[];
  /** Longer paragraphs for the modal body. */
  body?: string[];
  /**
   * Photos shown under the write-up. Everything here is Creative Commons
   * from Wikimedia and stored locally, so `credit` and `licence` are
   * required: both licences used oblige attribution.
   */
  photos?: {
    src: string;
    caption: string;
    credit: string;
    licence: string;
    /** Link to the file page, so the attribution can be checked. */
    href: string;
  }[];
};

/**
 * Sports followed, one card each.
 *
 * `favourite` is filled in; everything else is a stub for Pranav to write —
 * the modal renders whatever is present and skips what is not, so adding
 * `facts` or `body` later needs no component change.
 */
export const sports: Sport[] = [
  {
    id: "nba",
    label: "NBA",
    favourite: "LeBron James",
    blurb: "[Add a line about how you got into basketball]",
    facts: [
      { label: "Player", value: "LeBron James" },
      { label: "Team", value: "[Add team]" },
    ],
    body: ["[Write about what you like watching: a season, a run, a game.]"],
  },
  {
    id: "cricket",
    label: "Cricket",
    favourite: "Virat Kohli",
    blurb: "Eighteen years of it, and counting.",
    facts: [
      { label: "Player", value: "Virat Kohli" },
      { label: "Team", value: "India" },
      { label: "IPL", value: "Royal Challengers Bengaluru" },
      { label: "Since", value: "2007" },
    ],
    body: [
      "It starts in 2007. My cousins came over, someone found a bat, and we played right there in the house. I was six years old, and that is the first memory I have of cricket. Then the T20 World Cup happened and India won the inaugural edition, and then the IPL arrived and had all of us glued to the television. I supported the Deccan Chargers back then, and we won the second edition. Virender Sehwag was my favourite player.",
      "The 2011 World Cup was in India, and by then I was a hardcore fan with no stopping me. First match, first ball: Sehwag hits a four against Bangladesh in Dhaka and goes on to make a legendary 175. In the same match, a player in his first World Cup also scored a century and started his World Cup career with a bang. His name is Virat Kohli, and he has been my favourite ever since. Around then I started supporting RCB, because Gayle and Kohli were in the same side.",
      "Then came the long wait. 2016 was Virat's record season, 973 runs in a single IPL, and we still could not lift the cup. I was heartbroken for days. India lost the T20 World Cup that year, the Champions Trophy the year after, and the 2019 World Cup went the same way. 2023 was the cruellest of them all: a record run to the final at home without losing a single match, Virat scoring 765 across the tournament, and then losing the final to Australia.",
      "Through every one of those, my support for India, for RCB and for Virat never diminished. That is the part I think about most. Thirteen years of turning up for the same teams and the same player, knowing exactly how it tended to end, and turning up anyway.",
      "The 2024 T20 World Cup finally broke it open. Success at an international trophy after thirteen years of waiting, and the Champions Trophy followed. Then RCB won two IPL titles back to back, and two more in the WPL. After all that time, everything arrived at once.",
      "I also played properly for a while. I went to cricket coaching in grade 8 and left after a year, but I will happily admit it was the best year of my life. I had so much fun going to those sessions, and I still think about them.",
      "This is the very short version. There is a lot more to it.",
    ],
    photos: [
      {
        src: "/fun/cricket/sehwag.jpg",
        caption:
          "Virender Sehwag, my first favourite. He opened the 2011 World Cup with a four off the very first ball and made 175.",
        credit: "Flying Cloud",
        licence: "CC BY 2.0",
        href: "https://commons.wikimedia.org/wiki/File:Virender_Sehwag_in_2008.jpg",
      },
      {
        src: "/fun/cricket/kohli.jpg",
        caption:
          "Virat Kohli, who scored a century in that same match on his World Cup debut and has been my favourite ever since.",
        credit: "Anand Anil",
        licence: "CC BY-SA 4.0",
        href: "https://commons.wikimedia.org/wiki/File:Virat_Kohli_portrait.jpg",
      },
      {
        src: "/fun/cricket/wankhede.jpg",
        caption:
          "The Wankhede in Mumbai, where the 2011 final was won.",
        credit: "G patkar",
        licence: "CC BY-SA 3.0",
        href: "https://commons.wikimedia.org/wiki/File:Wankhede_ICC_WCF.jpg",
      },
    ],
  },
  {
    id: "tennis",
    label: "Tennis",
    favourite: "Roger Federer",
    blurb: "[Add a line about following tennis]",
    facts: [
      { label: "Player", value: "Roger Federer" },
      { label: "Tournament", value: "[Add a favourite slam]" },
    ],
    body: ["[Write about a match or rivalry you keep going back to.]"],
  },
  {
    id: "football",
    label: "Football",
    favourite: "Lionel Messi",
    blurb: "[Add a line about following football]",
    facts: [
      { label: "Player", value: "Lionel Messi" },
      { label: "Club", value: "[Add club]" },
    ],
    body: ["[Write about a season, a final, or how you started watching.]"],
  },
];
