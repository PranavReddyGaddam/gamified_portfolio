import { useEffect, useState } from "react";

/** Live local time, shown beside the location in the footer. */
const LocalClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  const hour = Number(
    now.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "America/Los_Angeles" })
  );
  const isNight = hour < 7 || hour >= 19;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true">{isNight ? "☾" : "☀"}</span>
      {time}
    </span>
  );
};

export default LocalClock;
