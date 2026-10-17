/**
 * Photos for the San Jose State preview in the About paragraph.
 *
 * Drop the files in public/about/sjsu/ named in the order they were taken
 * (01.jpg, 02.jpg, ...) and list them here. The preview plays them back in
 * this order, one at a time, so oldest first reads as a timelapse of the
 * two years. The frame is 16:10, so landscape shots around 1200px wide fit
 * best.
 *
 *   { src: "/about/sjsu/01.jpg", caption: "First week on campus", date: "Aug 2024" },
 *
 * Hovering (or pressing and holding on a phone) pauses playback and raises
 * a caption bar with `caption` and `date`. A photo with neither just pauses.
 */
export type SjsuPhoto = {
  src: string;
  /** One line describing the photo. Also its alt text. */
  caption?: string;
  /** Month and year, shown lighter beside the caption. */
  date?: string;
  /**
   * The point the frame keeps in view when it crops the photo, as a CSS
   * object-position. Centre when left out.
   */
  focus?: string;
};

// Dates are from each photo's capture time. Compressed with ffmpeg to 800px
// on the short side, cropped no tighter than the frame ever shows and centred
// on the faces Apple's Vision found (by eye where it found none), with the
// location and camera metadata stripped. focus is that same point.
export const sjsuPhotos: SjsuPhoto[] = [
  { src: "/about/sjsu/01.jpg", caption: "GTA in San Jose", date: "Aug 2024", focus: "45% 52%" },
  { src: "/about/sjsu/02.jpg", caption: "First Football Game", date: "Aug 2024", focus: "50% 52%" },
  { src: "/about/sjsu/03.jpg", caption: "Mandatory Golden Gate Bridge Picture", date: "Aug 2024", focus: "67% 48%" },
  { src: "/about/sjsu/04.jpg", caption: "First Fire on the fountain", date: "Oct 2024", focus: "76% 50%" },
  { src: "/about/sjsu/05.jpg", caption: "First Hackathon", date: "Oct 2024" },
  { src: "/about/sjsu/06.jpg", caption: "First visit to Santana Row", date: "Nov 2024", focus: "50% 55%" },
  { src: "/about/sjsu/07.jpg", caption: "It's been a blessing living here for 2 years", date: "Nov 2024" },
  { src: "/about/sjsu/08.jpg", caption: "Prolly my first Dosa in 3 months", date: "Nov 2024" },
  { src: "/about/sjsu/09.jpg", caption: "Christmas Eve on campus", date: "Dec 2024" },
  { src: "/about/sjsu/10.jpg", caption: "Warriors vs Lakers at Chase Center", date: "Jan 2025", focus: "38% 49%" },
  { src: "/about/sjsu/11.jpg", caption: "Holi at Tower Lawn", date: "Mar 2025", focus: "49% 50%" },
  { src: "/about/sjsu/12.jpg", caption: "Whatever the F**k this is", date: "Mar 2025", focus: "45% 50%" },
  { src: "/about/sjsu/13.jpg", caption: "Good Hair day", date: "Mar 2025", focus: "48% 50%" },
  { src: "/about/sjsu/14.jpg", caption: "New Kicks Flex", date: "Mar 2025", focus: "49% 38%" },
  { src: "/about/sjsu/15.jpg", caption: "First Hackathon Win", date: "Apr 2025", focus: "47% 50%" },
  { src: "/about/sjsu/16.jpg", caption: "Moment you realize you got a Job", date: "Apr 2025", focus: "74% 48%" },
  { src: "/about/sjsu/17.jpg", caption: "IDEK!", date: "May 2025", focus: "50% 47%" },
  { src: "/about/sjsu/18.jpg", caption: "First close-up sighting of this edifice", date: "May 2025" },
  { src: "/about/sjsu/19.jpg", caption: "I guess I like to take Solos at Hacks", date: "May 2025" },
  { src: "/about/sjsu/20.jpg", caption: "Snowflake Summit, Moscone", date: "Jun 2025", focus: "58% 50%" },
  { src: "/about/sjsu/21.jpg", caption: "Overnight at Berkeley", date: "Jun 2025" },
  { src: "/about/sjsu/22.jpg", caption: "Unreal glow after being awake for 48 hours", date: "Jun 2025", focus: "45% 52%" },
  { src: "/about/sjsu/23.jpg", caption: "First Meteor Shower (Perseids)", date: "Aug 2025", focus: "44% 44%" },
  { src: "/about/sjsu/24.jpg", caption: "4 A.M activities", date: "Aug 2025", focus: "33% 68%" },
  { src: "/about/sjsu/25.jpg", caption: "My last in-person Hack (or atleast I thought)", date: "Oct 2025", focus: "56% 50%" },
  { src: "/about/sjsu/26.jpg", caption: "Smores in the stupid cold (Yosemite)", date: "Nov 2025" },
  { src: "/about/sjsu/27.jpg", caption: "The hack which got me my job (my actual last)", date: "Apr 2026", focus: "49% 48%" },
  { src: "/about/sjsu/28.jpg", caption: "Drove 2000 miles in the last 5 days", date: "May 2026", focus: "52% 50%" },
];
