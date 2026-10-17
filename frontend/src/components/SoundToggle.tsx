import { useEffect, useState } from "react";
import { PiMusicNotes, PiSpeakerHigh, PiSpeakerSlash } from "react-icons/pi";
import { ambient, armAmbient } from "../lib/ambient";

/** How long a visitor who has not clicked yet waits before the hint shows. */
const HINT_AFTER = 3500;

type Props = {
  /** dock: a round button in the desktop dock. bar: beside the phone burger. */
  variant: "dock" | "bar";
};

/**
 * Turns the background music on and off.
 *
 * Browsers hold the music back until the first click or tap, and scrolling
 * does not count, so a visitor who only scrolls would never hear it. After a
 * few seconds of that, a small pill beside the button invites the click; it
 * goes the moment the music starts.
 */
const SoundToggle = ({ variant }: Props) => {
  const [on, setOn] = useState(ambient.isPlaying);
  const [waiting, setWaiting] = useState(ambient.isWaiting);
  const [due, setDue] = useState(false);

  useEffect(() => {
    armAmbient();
    setOn(ambient.isPlaying());
    setWaiting(ambient.isWaiting());
    const timer = window.setTimeout(() => setDue(true), HINT_AFTER);
    const off = ambient.subscribe(() => {
      setOn(ambient.isPlaying());
      setWaiting(ambient.isWaiting());
    });
    return () => {
      window.clearTimeout(timer);
      off();
    };
  }, []);

  const hint = waiting && due;
  const verb = window.matchMedia("(pointer: coarse)").matches ? "Tap" : "Click";

  const label = on ? "Mute music" : "Play music";
  const Icon = on ? PiSpeakerHigh : PiSpeakerSlash;

  return (
    <button
      type="button"
      data-sound-toggle=""
      aria-label={label}
      aria-pressed={on}
      className={
        variant === "dock"
          ? `hero-dock-link hero-sound${on ? " is-on" : ""}${hint ? " has-hint" : ""}`
          : "hero-sound-bar"
      }
      onClick={() => ambient.toggle()}
    >
      <Icon aria-hidden="true" />
      <span className={`sound-hint sound-hint--${variant}${hint ? " is-shown" : ""}`} aria-hidden="true">
        <PiMusicNotes />
        {verb} anywhere for sound
      </span>
    </button>
  );
};

export default SoundToggle;
