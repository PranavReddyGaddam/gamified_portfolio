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
  /** Free-form rows shown in the modal — team, competition, ground, whatever. */
  facts?: { label: string; value: string }[];
  /** Longer paragraphs for the modal body. */
  body?: string[];
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
    body: ["[Write about what you like watching — a season, a run, a game.]"],
  },
  {
    id: "cricket",
    label: "Cricket",
    favourite: "Virat Kohli",
    blurb: "[Add a line about following cricket]",
    facts: [
      { label: "Player", value: "Virat Kohli" },
      { label: "Format", value: "[Test / ODI / T20]" },
    ],
    body: ["[Write about a series or innings worth remembering.]"],
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
