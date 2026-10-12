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
};

// TEMPORARY: stand-ins borrowed from the Fun section, with made-up captions,
// to judge the playback.
// Replace with the SJSU photos.
export const sjsuPhotos: SjsuPhoto[] = [
  { src: "/fun/cricket/2007-t20-parade.webp", caption: "First week on campus", date: "Aug 2024" },
  { src: "/fun/cricket/2011-dhaka-partnership.webp", caption: "Late nights in the library", date: "Oct 2024" },
  { src: "/fun/football/messi-argentina-knees.jpg", caption: "Finals week, survived", date: "Dec 2024" },
  { src: "/fun/tennis/federer-wimbledon-smash.jpg", caption: "Spring semester kickoff", date: "Jan 2025" },
  { src: "/fun/basketball/lebron-curry.jpg", caption: "Hackathon weekend", date: "Mar 2025" },
  { src: "/fun/cricket/2024-t20-world-cup.webp", caption: "Summer on campus", date: "Jul 2025" },
  { src: "/fun/cricket/2025-champions-trophy.webp", caption: "Capstone demo day", date: "Apr 2026" },
  { src: "/fun/cricket/2025-rcb-ipl-title.webp", caption: "Graduation", date: "May 2026" },
];
