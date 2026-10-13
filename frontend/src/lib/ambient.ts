/**
 * The site's background music: Pranav's own piano piece, /music/piano.mp3,
 * looped with a short breath between plays.
 *
 * It is decoded into Web Audio rather than played from an <audio> element
 * so the fades work everywhere; iOS ignores an element's volume.
 *
 * Off until the visitor turns it on with the sound button, and off again on
 * every new visit. The file is only fetched on that first press.
 */

const SRC = "/music/piano.mp3";
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
  /** The sound button. */
  toggle() {
    if (playing) stop();
    else void start();
  },
};

let armed = false;

/** Keeps the music quiet while the tab is in the background. */
export const armAmbient = () => {
  if (armed || typeof window === "undefined") return;
  armed = true;
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
