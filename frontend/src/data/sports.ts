export type Sport = {
  id: string;
  /** Sport name, shown on the card. */
  label: string;
  /** The player this sport means most through. */
  favourite: string;
  /** One line under the sport name. */
  blurb?: string;
  /**
   * Thumbnail for the card, from /public/fun/. Omit to fall back to the
   * drawn initial. Not repeated inside the modal, where the body's own
   * figures carry the pictures.
   */
  image?: string;
  /** Free-form rows shown in the modal: team, competition, ground, whatever. */
  facts?: { label: string; value: string }[];
  /**
   * The write-up, as an ordered run of blocks so photographs can sit at the
   * moment they belong to rather than collecting at the end.
   */
  body?: Block[];
};

/** A paragraph. */
export type TextBlock = { kind: "text"; text: string };

/**
 * One or two photographs sharing a caption. A pair is laid out side by side,
 * which suits two frames of the same passage of play.
 */
export type FigureBlock = {
  kind: "figure";
  images: { src: string; alt: string }[];
  caption?: string;
  /**
   * Where the subject sits vertically, for the crop. Defaults to centre;
   * "top" keeps heads in frame on a tall image.
   */
  focus?: "top" | "center";
  /** Required only for material that is not ours, e.g. Creative Commons. */
  credit?: { name: string; licence: string; href: string };
};

export type Block = TextBlock | FigureBlock;

/** Shorthand so the story below reads as prose rather than object literals. */
const t = (text: string): TextBlock => ({ kind: "text", text });

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
    body: [t("[Write about what you like watching: a season, a run, a game.]")],
  },
  {
    id: "cricket",
    label: "Cricket",
    favourite: "Virat Kohli",
    image: "/fun/cricket/kohli-cover-drive.webp",
    blurb: "Eighteen years of it, and counting.",
    facts: [
      { label: "Player", value: "Virat Kohli" },
      { label: "Team", value: "India" },
      { label: "IPL", value: "Royal Challengers Bengaluru" },
      { label: "Since", value: "2007" },
    ],
    body: [
      t(
        "It starts in 2007. My cousins came over, someone found a bat, and we played right there in the house. I was six years old, and that is the first memory I have of cricket. Then the T20 World Cup happened and India won the inaugural edition, and the whole country came out for it."
      ),
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2007-t20-parade.webp",
            alt: "Crowds filling the street around an open-top bus during India's 2007 T20 World Cup victory parade",
          },
        ],
        caption:
          "The 2007 victory parade. India won the first T20 World Cup there was, and this is roughly the moment cricket stopped being something I watched and became something I followed.",
      },
      t(
        "Then the IPL arrived and had all of us glued to the television. I supported the Deccan Chargers back then, and we won the second edition. Virender Sehwag was my favourite player."
      ),
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2009-deccan-chargers-title.webp",
            alt: "Deccan Chargers players lifting the 2009 IPL trophy under confetti",
          },
        ],
        caption: "Deccan Chargers, 2009. My first team, and my first trophy.",
      },
      t(
        "The 2011 World Cup was in India, and by then I was a hardcore fan with no stopping me. First match, first ball: Sehwag hits a four against Bangladesh in Dhaka and goes on to make a legendary 175. In the same match, a player in his first World Cup also scored a century and started his World Cup career with a bang. His name is Virat Kohli, and he has been my favourite ever since."
      ),
      {
        kind: "figure",
        focus: "top",
        images: [
          {
            src: "/fun/cricket/2011-dhaka-partnership.webp",
            alt: "Virat Kohli and Virender Sehwag meeting mid-pitch during their partnership in Dhaka",
          },
          {
            src: "/fun/cricket/2011-dhaka-kohli-century.webp",
            alt: "Virat Kohli raising his bat after reaching his century on World Cup debut",
          },
        ],
        caption:
          "Dhaka, 19 February 2011. The two of them mid-partnership, and Kohli raising his bat for a hundred on his World Cup debut.",
      },
      t(
        "Around then I started supporting RCB, because Gayle and Kohli were in the same side."
      ),
      t(
        "Then came the long wait. 2016 was Virat's record season, 973 runs in a single IPL, and we still could not lift the cup. I was heartbroken for days."
      ),
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2016-kohli-rcb-season.webp",
            alt: "Virat Kohli in the 2016 RCB shirt raising his bat to the crowd",
          },
        ],
        caption:
          "973 runs in one season, a record that still stands, and no trophy at the end of it.",
      },
      t(
        "India lost the T20 World Cup that year, the Champions Trophy the year after, and the 2019 World Cup went the same way. 2023 was the cruellest of them all: a record run to the final at home without losing a single match, Virat scoring 765 across the tournament, and then losing the final to Australia."
      ),
      t(
        "Through every one of those, my support for India, for RCB and for Virat never diminished. That is the part I think about most. Thirteen years of turning up for the same teams and the same player, knowing exactly how it tended to end, and turning up anyway."
      ),
      t(
        "The 2024 T20 World Cup finally broke it open. Success at an international trophy after thirteen years of waiting."
      ),
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2024-t20-world-cup.webp",
            alt: "India celebrating with the 2024 T20 World Cup trophy",
          },
        ],
        caption: "Barbados, 2024. Thirteen years of waiting, finally over.",
      },
      t(
        "Then the Champions Trophy followed, RCB won two IPL titles back to back, and there were two more in the WPL. After all that time, everything arrived at once."
      ),
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2025-champions-trophy.webp",
            alt: "Virat Kohli lifting the 2025 Champions Trophy surrounded by teammates",
          },
          {
            src: "/fun/cricket/2025-rcb-ipl-title.webp",
            alt: "Virat Kohli kissing the IPL trophy in the RCB shirt",
          },
        ],
        caption:
          "The Champions Trophy, and then RCB finally getting there. I had waited most of my life for the second one.",
      },
      {
        kind: "figure",
        images: [
          {
            src: "/fun/cricket/2026-rcb-ipl-title.webp",
            alt: "Virat Kohli and RCB teammates celebrating on the field after winning",
          },
          {
            src: "/fun/cricket/2026-t20-world-cup.webp",
            alt: "India lifting the T20 World Cup trophy amid gold confetti",
          },
        ],
        caption: "And then it kept happening.",
      },
      t(
        "I also played properly for a while. I went to cricket coaching in grade 8 and left after a year, but I will happily admit it was the best year of my life. I had so much fun going to those sessions, and I still think about them."
      ),
      t("This is the very short version. There is a lot more to it."),
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
    body: [t("[Write about a match or rivalry you keep going back to.]")],
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
    body: [t("[Write about a season, a final, or how you started watching.]")],
  },
];
