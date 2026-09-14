export type FunItem = {
  id: string;
  /** Song, film or place name. */
  title: string;
  /** Artist, director or country — the second line on hover. */
  by: string;
  /** Cover art or photo. Apple artwork URLs are already sized. */
  image?: string;
  /**
   * Short badge shown over the cover — "Movie" / "TV" in the screen row,
   * a competition or sport elsewhere. Omit for no badge.
   */
  tag?: string;
  /** Optional link out to the track, film or photo set. */
  href?: string;
  /** True until real content replaces it — renders as a marked placeholder. */
  placeholder?: boolean;
  /**
   * Opens a detail modal on click rather than a link. Any field present is
   * rendered and the rest skipped, so a trip can start with nothing but
   * photos and gain notes later.
   */
  detail?: {
    /** Rows in the modal's meta grid — when, who with, how long. */
    facts?: { label: string; value: string }[];
    /** Paragraphs of the write-up. */
    body?: string[];
    /** Photos, in order. The first doubles as the modal's lead image. */
    photos?: string[];
  };
};

export type FunYear = {
  year: string;
  items: FunItem[];
  /**
   * How many there were in total that year. The row shows the best few, so
   * without this the tabs would all read the same tile count.
   */
  total?: number;
  /** Link to that year's source — the Replay playlist, a list, an album. */
  href?: string;
};

export type FunRow = {
  id: string;
  label: string;
  /** Name and URL of the service this row comes from, shown top-right. */
  source?: { label: string; href: string };
  /**
   * All-time favourites, shown first and selected by default — the starred
   * tab beside the years. These are picked across every year, not within one.
   */
  favourites?: FunItem[];
  years: FunYear[];
};

const ph = (id: string, n: number, title: string, by: string): FunItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${id}-${i}`,
    title: `[${title} ${i + 1}]`,
    by: `[${by}]`,
    placeholder: true,
  }));

/**
 * Things heard, watched and visited, grouped by year.
 *
 * The music rows are real — pulled from the Apple Music Replay playlists,
 * deduplicated by album so a row never repeats the same cover. Films and
 * places are still PLACEHOLDERS: replace title/by/image and drop the
 * `placeholder` flag as real entries arrive.
 */
export const funRows: FunRow[] = [
  {
    id: "music",
    label: "Music",
    source: {
      label: "Apple Music",
      href: "https://music.apple.com/us/playlist/replay-2025/pl.rp-1kGkIEYDb8d8",
    },
    // TODO(pranav): these are stand-ins — the only track appearing in more
    // than one year's Replay, plus the current year's top. Swap them for the
    // five you would actually name.
    favourites: [
      {
        id: "mf-1",
        title: "Vellake (Slowed Version)",
        by: "Naresh Narayan, Goldie Khristi & Anirudh Ravichander",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d4/2e/dc/d42edc26-7373-ca34-1305-5f2d1f649dae/196871508926.jpg/400x400bb.jpg",
      },
      {
        id: "mf-2",
        title: "Manchild",
        by: "Sabrina Carpenter",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cc/bc/ef/ccbcefb5-cf3a-1c55-0173-c37602827c7a/25UMGIM81699.rgb.jpg/400x400bb.jpg",
      },
      {
        id: "mf-3",
        title: "Not Like Us",
        by: "Kendrick Lamar",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/ef/b6/d0efb685-73be-fdee-58c9-be655f4cd4fd/24UMGIM51924.rgb.jpg/400x400bb.jpg",
      },
      {
        id: "mf-4",
        title: "Cornfield Chase",
        by: "Hans Zimmer",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f4/5b/73/f45b735a-8d7a-9713-b217-0f8e1593c28b/794043201943.jpg/400x400bb.jpg",
      },
      {
        id: "mf-5",
        title: "Kesariya (From \"Brahmastra\")",
        by: "Pritam, Arijit Singh & Amitabh Bhattacharya",
        image:
          "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/400x400bb.jpg",
      },
    ],
    years: [
      {
        year: "2026",
        total: 100,
        href:
          "https://music.apple.com/us/playlist/replay-2026/pl.rp-6xDDH6ndv4Q4",
        items: [
          {
            id: "m26-1",
            title: "undressed",
            by: "sombr",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2a/98/7d/2a987dd6-2961-b988-d7f1-e7a59f990dce/054391234278.jpg/400x400bb.jpg",
          },
          {
            id: "m26-2",
            title: "Midnight Sun",
            by: "Zara Larsson",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fb/1d/2d/fb1d2d1c-0f79-53ad-ab9b-ac20918b5856/196873177199.jpg/400x400bb.jpg",
          },
          {
            id: "m26-3",
            title: "DAISIES",
            by: "Justin Bieber",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f9/09/36/f9093663-c05f-7f95-0a60-4e95d52fbb22/25UMGIM93915.rgb.jpg/400x400bb.jpg",
          },
          {
            id: "m26-4",
            title: "Just Keep Watching",
            by: "Tate McRae",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a6/91/da/a691dac7-4cb7-82f5-0eda-e37b96f63f55/075679610720.jpg/400x400bb.jpg",
          },
          {
            id: "m26-5",
            title: "I Just Might",
            by: "Bruno Mars",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ed/46/bf/ed46bf4e-7cb9-965a-54f3-03059977fe6c/075679589293.jpg/400x400bb.jpg",
          },
        ],
      },
      {
        year: "2025",
        total: 100,
        href:
          "https://music.apple.com/us/playlist/replay-2025/pl.rp-1kGkIEYDb8d8",
        items: [
          {
            id: "m25-1",
            title: "Manchild",
            by: "Sabrina Carpenter",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cc/bc/ef/ccbcefb5-cf3a-1c55-0173-c37602827c7a/25UMGIM81699.rgb.jpg/400x400bb.jpg",
          },
          {
            id: "m25-2",
            title: "Juno",
            by: "Sabrina Carpenter",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f6/15/d0/f615d0ab-e0c4-575d-907e-1cc084642357/24UMGIM61704.rgb.jpg/400x400bb.jpg",
          },
          {
            id: "m25-3",
            title: "Tension",
            by: "Diljit Dosanjh",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b4/1c/bf/b41cbf10-9a17-acbf-ce4c-af407825d4f3/199203117209_cover.jpg/400x400bb.jpg",
          },
          {
            id: "m25-4",
            title: "Sirra",
            by: "Guru Randhawa, Kiran Bajwa & Rony Ajnali",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/ac/3b/26ac3b10-0237-e46c-14af-b28abf60f0e1/5021732749444.jpg/400x400bb.jpg",
          },
          {
            id: "m25-5",
            title: "White Brown Black",
            by: "Avvy Sra & Karan Aujla",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/0b/c2/e6/0bc2e611-ef63-b23c-fbad-1d0523463da2/22UM1IM39836.rgb.jpg/400x400bb.jpg",
          },
        ],
      },
      {
        year: "2024",
        total: 98,
        href:
          "https://music.apple.com/us/playlist/replay-2024/pl.rp-gQDLhzQyoG2G",
        items: [
          {
            id: "m24-1",
            title: "Idhe Idhe (From \"Hi Nanna\")",
            by: "Hesham Abdul Wahab & Krishna Kanth",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/aa/ea/07/aaea07e8-f4bb-3428-2e17-f4043da0ee2f/8903431974662_cover.jpg/400x400bb.jpg",
          },
          {
            id: "m24-2",
            title: "Not Like Us",
            by: "Kendrick Lamar",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/ef/b6/d0efb685-73be-fdee-58c9-be655f4cd4fd/24UMGIM51924.rgb.jpg/400x400bb.jpg",
          },
          {
            id: "m24-3",
            title: "Born to Shine",
            by: "Diljit Dosanjh",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/400x400bb.jpg",
          },
          {
            id: "m24-4",
            title: "Vellake (Slowed Version)",
            by: "Naresh Narayan, Goldie Khristi, Bharatt-Saurabh, Yazin Nizar & Anirudh Ravichander",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d4/2e/dc/d42edc26-7373-ca34-1305-5f2d1f649dae/196871508926.jpg/400x400bb.jpg",
          },
          {
            id: "m24-5",
            title: "Sajni",
            by: "Arijit Singh, Ram Sampath & Prashant Pandey",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/48/d8/bf/48d8bf8f-df58-e05f-62e2-bc494d748ea4/8902894362252_cover.jpg/400x400bb.jpg",
          },
        ],
      },
      {
        year: "2023",
        total: 98,
        href:
          "https://music.apple.com/us/playlist/replay-2023/pl.rp-NLLNioDjVY0Y",
        items: [
          {
            id: "m23-1",
            title: "Vellake (Slowed Version)",
            by: "Naresh Narayan, Goldie Khristi, Bharatt-Saurabh, Yazin Nizar & Anirudh Ravichander",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d4/2e/dc/d42edc26-7373-ca34-1305-5f2d1f649dae/196871508926.jpg/400x400bb.jpg",
          },
          {
            id: "m23-2",
            title: "Dandelions (slowed + reverb)",
            by: "Ruth B.",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/86/89/09/8689091f-1b82-5a9a-b0dc-d22d3143eb00/196871853132.jpg/400x400bb.jpg",
          },
          {
            id: "m23-3",
            title: "Na Roja Nuvve (From \"Kushi\")",
            by: "Hesham Abdul Wahab & Shiva Nirvana",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b5/28/a5/b528a58b-5633-d045-5205-894a3c105d1f/197188849610.jpg/400x400bb.jpg",
          },
          {
            id: "m23-4",
            title: "Unnatundi Gundey",
            by: "Karthik, Chinmayi Sripada & Ramajogayya Shastry",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/98/81/43/988143ca-e902-4e8a-977c-3e31eefcfaab/196925399784.jpg/400x400bb.jpg",
          },
          {
            id: "m23-5",
            title: "Paisa Hai Toh",
            by: "Sachin-Jigar, Vishal Dadlani, Mellow D & Jigar Saraiya",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/94/ab/8b/94ab8b7b-2e90-6a27-c2a2-30e111c27e9c/196589837134.jpg/400x400bb.jpg",
          },
        ],
      },
      {
        year: "2022",
        total: 99,
        href:
          "https://music.apple.com/us/playlist/replay-2022/pl.rp-YbbxcAR5YjMj",
        items: [
          {
            id: "m22-1",
            title: "Cornfield Chase",
            by: "Hans Zimmer",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f4/5b/73/f45b735a-8d7a-9713-b217-0f8e1593c28b/794043201943.jpg/400x400bb.jpg",
          },
          {
            id: "m22-2",
            title: "Kesariya (From \"Brahmastra\")",
            by: "Pritam, Arijit Singh & Amitabh Bhattacharya",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/400x400bb.jpg",
          },
          {
            id: "m22-3",
            title: "Once Upon a Time",
            by: "Anirudh Ravichander",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/41/41/01/41410135-baa0-1aab-7417-f6746b0f3c25/196589186973.jpg/400x400bb.jpg",
          },
          {
            id: "m22-4",
            title: "Masakali",
            by: "Mohit Chauhan",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/fe/21/e2fe21b6-50e6-7b4b-285a-d40394baba4e/8902894628990_cover.jpg/400x400bb.jpg",
          },
          {
            id: "m22-5",
            title: "Arabic Kuthu (From \"Beast\")",
            by: "Anirudh Ravichander & Jonita Gandhi",
            image:
              "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e9/19/b9/e919b921-d5a8-9e9a-8508-3551da375aee/196626458629.jpg/400x400bb.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "screen",
    label: "Screen",
    favourites: [
      ...ph("sf-a", 3, "FAVOURITE FILM", "Director").map((i) => ({
        ...i,
        tag: "Movie",
      })),
      ...ph("sf-b", 2, "FAVOURITE SERIES", "Creator").map((i) => ({
        ...i,
        tag: "TV",
      })),
    ],
    years: [
      {
        year: "2025",
        items: [
          ...ph("s25a", 3, "FILM", "Director").map((i) => ({ ...i, tag: "Movie" })),
          ...ph("s25b", 2, "SERIES", "Creator").map((i) => ({ ...i, tag: "TV" })),
        ],
      },
      {
        year: "2024",
        items: [
          ...ph("s24a", 3, "FILM", "Director").map((i) => ({ ...i, tag: "Movie" })),
          ...ph("s24b", 2, "SERIES", "Creator").map((i) => ({ ...i, tag: "TV" })),
        ],
      },
      {
        year: "2023",
        items: [
          ...ph("s23a", 3, "FILM", "Director").map((i) => ({ ...i, tag: "Movie" })),
          ...ph("s23b", 2, "SERIES", "Creator").map((i) => ({ ...i, tag: "TV" })),
        ],
      },
    ],
  },
  {
    id: "place",
    label: "Places",
    favourites: [
      { id: "pf-1", title: "New York", by: "New York", tag: "2026", detail: { photos: [] } },
      { id: "pf-2", title: "San Diego", by: "California", tag: "2026", detail: { photos: [] } },
      { id: "pf-4", title: "Yosemite", by: "California", tag: "2025", detail: { photos: [] } },
      { id: "pf-5", title: "Seattle", by: "Washington", tag: "2025", detail: { photos: [] } },
      { id: "pf-6", title: "San Francisco", by: "California", tag: "2024", detail: { photos: [] } },
    ],
    years: [
      {
        year: "2026",
        total: 10,
        items: [
          { id: "p26-1", title: "Los Angeles", by: "California", tag: "May", detail: { photos: [] } },
          { id: "p26-2", title: "San Diego", by: "California", tag: "May", detail: { photos: [] } },
          { id: "p26-3", title: "New York", by: "New York", tag: "May", detail: { photos: [] } },
          { id: "p26-4", title: "New Jersey", by: "New Jersey", tag: "May", detail: { photos: [] } },
          { id: "p26-5", title: "Washington", by: "District of Columbia", tag: "May", detail: { photos: [] } },
          { id: "p26-6", title: "Philadelphia", by: "Pennsylvania", tag: "May", detail: { photos: [] } },
          { id: "p26-7", title: "Dallas", by: "Texas", tag: "Jun", detail: { photos: [] } },
          { id: "p26-8", title: "Austin", by: "Texas", tag: "Jun", detail: { photos: [] } },
          { id: "p26-9", title: "San Antonio", by: "Texas", tag: "Jun", detail: { photos: [] } },
          { id: "p26-10", title: "Lake Tahoe", by: "California", tag: "May", detail: { photos: [] } },
        ],
      },
      {
        year: "2025",
        total: 3,
        items: [
          { id: "p25-1", title: "Dallas", by: "Texas", tag: "Jan", detail: { photos: [] } },
          { id: "p25-3", title: "Seattle", by: "Washington", tag: "Jul", detail: { photos: [] } },
          { id: "p25-4", title: "Yosemite", by: "California", tag: "Nov", detail: { photos: [] } },
        ],
      },
      {
        year: "2024",
        total: 4,
        items: [
          { id: "p24-1", title: "San Francisco", by: "California", tag: "Arrived", detail: { photos: [] } },
          { id: "p24-2", title: "San Jose", by: "California", tag: "Home", detail: { photos: [] } },
          { id: "p24-3", title: "New York", by: "New York", tag: "Dec", detail: { photos: [] } },
          { id: "p24-4", title: "New Jersey", by: "New Jersey", tag: "Dec", detail: { photos: [] } },
        ],
      },
    ],
  },
];
