/**
 * The site's background music: Pranav's own piano piece, /music/piano.mp3,
 * looped with a short breath between plays.
 *
 * It is decoded into Web Audio rather than played from an <audio> element
 * so the fades work everywhere; iOS ignores an element's volume.
 *
 * Browsers will not play sound until the visitor clicks, taps or presses a
 * key, so it starts on the first one anywhere on the page, fading in. The
 * file is fetched once the page has loaded, so it is usually ready by then.
 * A visitor who turns it off stays off on later visits.
 */

const SRC = "/music/piano.mp3";
const PREF = "ambient-off";
/** Volume under the page; the file itself is mastered to about -19 LUFS. */
const LEVEL = 0.55;
/** Seconds of quiet between one play and the next. */
const GAP = 2.5;

type Listener = (playing: boolean) => void;
const listeners = new Set<Listener>();

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let track: AudioBuffer | null = null;
let bytes: Promise<ArrayBuffer> | null = null;
let source: AudioBufferSourceNode | null = null;
let loopTimer = 0;
/** When, on the context's clock, the next play is due. */
let nextAt = 0;
let playing = false;

const readOff = () => {
  try {
    return localStorage.getItem(PREF) === "1";
  } catch {
    return false;
  }
};

const writeOff = (off: boolean) => {
  try {
    if (off) localStorage.setItem(PREF, "1");
    else localStorage.removeItem(PREF);
  } catch {
    /* private mode: the choice lasts this visit only */
  }
};

const emit = () => listeners.forEach((fn) => fn(playing));

const fetchTrack = () => {
  bytes ??= fetch(SRC).then((r) => {
    if (!r.ok) throw new Error(`${SRC}: ${r.status}`);
    return r.arrayBuffer();
  });
  return bytes;
};

/** Plays the track from the top at `at`, and books the next play after it. */
const playFrom = (at: number) => {
  if (!ctx || !master || !track || !playing) return;
  const node = ctx.createBufferSource();
  node.buffer = track;
  node.connect(master);
  node.start(at);
  source = node;
  nextAt = at + track.duration + GAP;
  book();
};

/** Wakes a second before the next play is due to queue it. */
const book = () => {
  if (!ctx) return;
  window.clearTimeout(loopTimer);
  loopTimer = window.setTimeout(
    () => playFrom(nextAt),
    Math.max(0, (nextAt - ctx.currentTime - 1) * 1000)
  );
};

const start = async () => {
  if (playing) return;
  playing = true;
  emit();
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  // Resume inside the click that started it, before any await.
  void ctx.resume();
  try {
    track ??= await ctx.decodeAudioData((await fetchTrack()).slice(0));
  } catch {
    playing = false;
    bytes = null;
    emit();
    return;
  }
  // Turned off again while the file was still loading.
  if (!playing || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(LEVEL, now + 3);
  if (!source) playFrom(now + 0.05);
  else book();
};

const stop = () => {
  if (!playing) return;
  playing = false;
  emit();
  window.clearTimeout(loopTimer);
  if (!ctx || !master) return;
  const c = ctx;
  const now = c.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.2);
  // Suspending holds the track where it is, so turning the music back on
  // carries on from the same bar instead of starting over.
  window.setTimeout(() => {
    if (!playing) void c.suspend();
  }, 1300);
};

export const ambient = {
  isPlaying: () => playing,
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** The sound button: on and off, remembered for the next visit. */
  toggle() {
    if (playing) {
      writeOff(true);
      stop();
    } else {
      writeOff(false);
      void start();
    }
  },
};

let armed = false;

/**
 * Starts the music on the visitor's first click, tap or key press, unless
 * they turned it off before. A press on the sound button itself is left to
 * the button, so that first press does not start the music and then
 * immediately stop it again.
 */
export const armAmbient = () => {
  if (armed || typeof window === "undefined") return;
  armed = true;

  if (!readOff()) {
    const prefetch = () => void fetchTrack().catch(() => (bytes = null));
    if (document.readyState === "complete") prefetch();
    else window.addEventListener("load", prefetch, { once: true });
  }

  const events = ["pointerdown", "keydown", "touchend"] as const;
  const first = (e: Event) => {
    if (e.target instanceof Element && e.target.closest("[data-sound-toggle]")) return;
    events.forEach((t) => window.removeEventListener(t, first, true));
    if (!readOff()) void start();
  };
  events.forEach((t) => window.addEventListener(t, first, { capture: true, passive: true }));

  // Quiet while the tab is in the background, back when it returns.
  let paused = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) {
      paused = true;
      stop();
    } else if (!document.hidden && paused) {
      paused = false;
      void start();
    }
  });
};
