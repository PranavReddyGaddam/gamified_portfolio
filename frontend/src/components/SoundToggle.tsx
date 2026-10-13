import { useEffect, useState } from "react";
import { PiSpeakerHigh, PiSpeakerSlash } from "react-icons/pi";
import { ambient, armAmbient } from "../lib/ambient";

type Props = {
  /** dock: a round button in the desktop dock. bar: beside the phone burger. */
  variant: "dock" | "bar";
};

/** Turns the background music on and off. */
const SoundToggle = ({ variant }: Props) => {
  const [on, setOn] = useState(ambient.isPlaying);

  useEffect(() => {
    armAmbient();
    return ambient.subscribe(setOn);
  }, []);

  const label = on ? "Mute music" : "Play music";
  const Icon = on ? PiSpeakerHigh : PiSpeakerSlash;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      className={variant === "dock" ? `hero-dock-link hero-sound${on ? " is-on" : ""}` : "hero-sound-bar"}
      onClick={() => ambient.toggle()}
    >
      <Icon aria-hidden="true" />
      {variant === "dock" ? <span className="hero-dock-tip">{label}</span> : null}
    </button>
  );
};

export default SoundToggle;
