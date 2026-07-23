import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { DeckProject } from "./ProjectDeck";

/*
  Mobile counterpart to ProjectDeck: a vertical accordion instead of a
  horizontal one. Same fixed-order, single-open, GSAP flexGrow/flexBasis
  pattern, just stacked top-to-bottom (row height instead of panel width).

  All 12 projects live in one accordion, but only the first 6 rows are
  rendered until "More projects" is clicked, which mounts rows 7-12.
*/

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

const PLACEHOLDER_PREVIEW = "/projects/Pranav.jpeg";
const COLLAPSED_PX = 52;
const ANIM_DURATION = 0.5;
const ANIM_EASE = "power3.inOut";
const INITIAL_COUNT = 6;

const ProjectDeckMobile: React.FC<{
  projects: DeckProject[];
  onProjectOpen: (id: string) => void;
}> = ({ projects, onProjectOpen }) => {
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const extraWrapRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const isFirstExtraRender = useRef(true);

  // all 12 rows always render — "extra" rows (index >= INITIAL_COUNT) are
  // animated open/closed by height instead of being mounted/unmounted, so
  // the reveal can actually be tweened instead of popping in
  const hasExtra = projects.length > INITIAL_COUNT;

  useLayoutEffect(() => {
    projects.forEach((_, i) => {
      const row = rowRefs.current[i];
      const contentEl = contentRefs.current[i];
      if (!row) return;

      const isActive = i === activeIndex;

      if (isFirstRender.current) {
        gsap.set(row, {
          flexGrow: isActive ? 1 : 0,
          flexBasis: isActive ? "0%" : `${COLLAPSED_PX}px`,
        });
        if (contentEl) gsap.set(contentEl, { opacity: isActive ? 1 : 0 });
      } else {
        gsap.to(row, {
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
        if (isActive) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
    isFirstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // animate the extra-rows wrapper open/closed by height
  useLayoutEffect(() => {
    const wrap = extraWrapRef.current;
    if (!wrap || !hasExtra) return;

    if (isFirstExtraRender.current) {
      gsap.set(wrap, {
        height: showAll ? "auto" : 0,
        opacity: showAll ? 1 : 0,
        marginTop: showAll ? "0.25rem" : 0,
      });
      isFirstExtraRender.current = false;
      return;
    }

    if (showAll) {
      const targetHeight = wrap.scrollHeight;
      gsap.fromTo(
        wrap,
        { height: 0, opacity: 0, marginTop: 0 },
        {
          height: targetHeight,
          opacity: 1,
          marginTop: "0.25rem",
          duration: ANIM_DURATION,
          ease: ANIM_EASE,
          onComplete: () => {
            gsap.set(wrap, { height: "auto" });
          },
        }
      );
    } else {
      gsap.to(wrap, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: ANIM_DURATION,
        ease: ANIM_EASE,
      });
    }
  }, [showAll, hasExtra]);

  const openRow = (i: number) => {
    setActiveIndex((current) => (current === i ? current : i));
  };

  const renderRow = (project: DeckProject, i: number) => {
    const theme = THEME_STYLES[THEMES[i % THEMES.length]];
    const isActive = i === activeIndex;
    const video = project.previewImages?.find((src) => src.endsWith(".mp4"));

    return (
            <div
              key={project.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              onClick={() => !isActive && openRow(i)}
              className={`relative w-full overflow-hidden flex flex-col ${
                isActive ? "" : "cursor-pointer"
              }`}
              style={{
                flexShrink: 0,
                background: theme.bg,
                color: theme.text,
              }}
            >
              {/* title bar — stays visible whether the row is open or closed,
                  so the open row never loses its heading as you scroll past
                  the media/content below it */}
              <div
                className="relative z-10 flex items-center px-4"
                style={{ height: `${COLLAPSED_PX}px`, flexShrink: 0 }}
              >
                <span className="font-pressstart2p text-[10px] whitespace-nowrap">
                  {project.title}
                </span>
              </div>

              {/* active content */}
              <div
                ref={(el) => {
                  contentRefs.current[i] = el;
                }}
                className="relative flex flex-col"
              >
                <div className="relative bg-black h-48 sm:h-56">
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
                <div className="p-4 flex flex-col font-pixellari">
                  <p className="text-sm leading-[1.7]">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
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

                  <div className="flex flex-wrap gap-2 mt-5">
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
  };

  const initialProjects = projects.slice(0, INITIAL_COUNT);
  const extraProjects = projects.slice(INITIAL_COUNT);

  return (
    <div className="lg:hidden">
      <div className="flex flex-col rounded-2xl overflow-hidden gap-1">
        {initialProjects.map((project, i) => renderRow(project, i))}
      </div>

      {hasExtra && (
        <div
          ref={extraWrapRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="flex flex-col rounded-2xl overflow-hidden gap-1">
            {extraProjects.map((project, j) =>
              renderRow(project, INITIAL_COUNT + j)
            )}
          </div>
        </div>
      )}

      {hasExtra && (
        <button
          onClick={() => {
            if (showAll && activeIndex !== null && activeIndex >= INITIAL_COUNT) {
              setActiveIndex(0);
            }
            setShowAll((current) => !current);
          }}
          className="w-full mt-4 font-pressstart2p text-xs text-white bg-red-900/40 border border-red-400 rounded-lg py-3 hover:bg-red-900/60 transition-colors"
        >
          {showAll ? "SHOW LESS" : "MORE PROJECTS"}
        </button>
      )}
    </div>
  );
};

export default ProjectDeckMobile;
