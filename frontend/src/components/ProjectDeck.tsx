import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";

/*
  Horizontal accordion of project panels: every panel sits collapsed in its
  natural left-to-right order at all times. Clicking one expands it in place
  and collapses whichever was open — nothing moves to a "slot" or cycles to
  the back, panels just grow/shrink and their neighbors reflow around them,
  animated with GSAP.

  flexGrow/flexBasis/opacity are NOT set via React's style prop after the
  first paint — GSAP owns them exclusively, since React re-asserting the
  final value via inline style on every render would stomp GSAP's in-flight
  tween and make the animation look like an instant pop.
*/

export type DeckProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  previewImages?: string[];
  githubUrl?: string;
  liveUrl?: string;
  placeholder?: boolean;
};

type Theme = "red" | "black" | "crimson" | "charcoal";

const THEMES: Theme[] = ["red", "black", "crimson", "charcoal"];

const THEME_STYLES: Record<
  Theme,
  { bg: string; text: string; buttonBg: string }
> = {
  red: { bg: "#7f1d1d", text: "#fff", buttonBg: "rgba(0,0,0,0.35)" },
  black: { bg: "#0a0a0a", text: "#fff", buttonBg: "rgba(255,255,255,0.1)" },
  crimson: { bg: "#450a0a", text: "#fff", buttonBg: "rgba(255,255,255,0.08)" },
  charcoal: { bg: "#27272a", text: "#fff", buttonBg: "rgba(255,255,255,0.1)" },
};

const PLACEHOLDER_PREVIEW = "/v1/projects/Pranav.jpeg";
const COLLAPSED_PX = 64;
const ANIM_DURATION = 0.5;
const ANIM_EASE = "power3.inOut";

const ProjectDeck: React.FC<{
  label: string;
  projects: DeckProject[];
  onProjectOpen: (id: string) => void;
  /* when the deck is collapsed out of view its videos should not keep playing */
  paused?: boolean;
}> = ({ label, projects, onProjectOpen, paused = false }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    projects.forEach((_, i) => {
      const panel = panelRefs.current[i];
      const contentEl = contentRefs.current[i];
      if (!panel) return;

      const isActive = i === activeIndex;

      if (isFirstRender.current) {
        gsap.set(panel, {
          flexGrow: isActive ? 1 : 0,
          flexBasis: isActive ? "0%" : `${COLLAPSED_PX}px`,
        });
        if (contentEl) gsap.set(contentEl, { opacity: isActive ? 1 : 0 });
      } else {
        gsap.to(panel, {
          flexGrow: isActive ? 1 : 0,
          flexBasis: isActive ? "0%" : `${COLLAPSED_PX}px`,
          duration: ANIM_DURATION,
          ease: ANIM_EASE,
        });

        if (contentEl) {
          gsap.to(contentEl, {
            opacity: isActive ? 1 : 0,
            duration: isActive ? ANIM_DURATION * 0.6 : ANIM_DURATION * 0.3,
            delay: isActive ? ANIM_DURATION * 0.4 : 0,
            ease: "power2.out",
          });
        }
      }

      const video = videoRefs.current[i];
      if (video) {
        if (isActive && !paused) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
    isFirstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, paused]);

  const openPanel = (i: number) => {
    setActiveIndex((current) => (current === i ? current : i));
  };

  return (
    <div className="mb-14">
      <h2 className="font-pressstart2p text-sm md:text-base mb-4 text-white">
        {label}
      </h2>

      <div className="flex h-[55vh] min-h-[380px] rounded-2xl overflow-hidden gap-1">
        {projects.map((project, i) => {
          const theme = THEME_STYLES[THEMES[i % THEMES.length]];
          const isActive = i === activeIndex;
          const video = project.previewImages?.find((src) =>
            src.endsWith(".mp4")
          );

          return (
            <div
              key={project.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              onClick={() => !isActive && openPanel(i)}
              className={`relative h-full overflow-hidden ${
                isActive ? "" : "cursor-pointer"
              }`}
              style={{
                flexShrink: 0,
                background: theme.bg,
                color: theme.text,
              }}
            >
              {/* collapsed label — always mounted, hidden via opacity when active */}
              <div
                className="absolute inset-0 flex items-start justify-center pt-4 pointer-events-none"
                style={{ opacity: isActive ? 0 : 1, transition: "opacity 0.2s" }}
              >
                <span
                  className="font-pressstart2p text-[9px] whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {project.title}
                </span>
              </div>

              {/* active content */}
              <div
                ref={(el) => {
                  contentRefs.current[i] = el;
                }}
                className="absolute inset-0 grid grid-cols-1 md:grid-cols-[3fr_1fr]"
              >
                <div className="relative bg-black">
                  {video ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={video}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={project.placeholder ? project.image : PLACEHOLDER_PREVIEW}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5 md:p-7 flex flex-col overflow-y-auto font-pixellari">
                  <p className="font-pressstart2p text-[10px] uppercase tracking-wider mb-3">
                    {project.title}
                  </p>
                  <p className="text-sm md:text-base leading-[1.7]">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-1 rounded"
                        style={{ background: theme.buttonBg }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs font-pressstart2p px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ background: theme.buttonBg }}
                      >
                        <FaGithub size={14} />
                        CODE
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs font-pressstart2p px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ background: theme.buttonBg }}
                      >
                        <FaArrowUpRightFromSquare size={12} />
                        LIVE
                      </a>
                    )}
                    {!project.githubUrl && !project.liveUrl && !project.placeholder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectOpen(project.id);
                        }}
                        className="flex items-center gap-2 text-xs font-pressstart2p px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ background: theme.buttonBg }}
                      >
                        REQUEST CODE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectDeck;
