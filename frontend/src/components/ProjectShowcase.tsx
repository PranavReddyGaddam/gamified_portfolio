import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaLock, FaUnlock } from "react-icons/fa";
import "./ProjectShowcase.css";

/*
  Adapted from Codrops "Grid to Full Preview" by Gwen Bogaert
  https://github.com/gwen-bo/codrops-grid-to-preview

  4-column grid. Hovering a tile in columns 1-2 expands a preview over a
  2x2 block of columns 3-4 (anchored to the hovered row) with a clip-path
  cross reveal, while the 4 covered tiles fade outward. And vice versa.
*/

export type ShowcaseProject = {
  id: string;
  title: string;
  image: string;
  imageClass?: string;
  description: string;
  tags: string[];
  linkLabel: string;
  placeholder?: boolean;
  previewImages?: string[];
};

type Props = {
  projects: ShowcaseProject[];
  onProjectOpen: (id: string) => void;
};

const COLS = 4;
const PREVIEW_ROWS = 2;
const PLACEHOLDER_PREVIEW = "/Pranav.jpeg";

type PreviewRefs = {
  container: HTMLDivElement;
  masked: HTMLDivElement;
  title: HTMLElement;
  description: HTMLElement;
  tags: HTMLElement;
  images: HTMLElement;
  tiles: HTMLElement[]; // all tiles in the half this preview covers
  totalRows: number;
};

class HalfPreview {
  ui: PreviewRefs & { previewImagesPerID: Record<string, HTMLElement[]> };
  timeline: gsap.core.Timeline | null = null;
  galleryTimeline: gsap.core.Timeline | null = null;

  constructor(refs: PreviewRefs) {
    const previewImagesPerID: Record<string, HTMLElement[]> = {};
    Array.from(refs.images.children).forEach((img) => {
      const id = (img as HTMLElement).dataset.id!;
      (previewImagesPerID[id] ??= []).push(img as HTMLElement);
    });
    this.ui = { ...refs, previewImagesPerID };
  }

  // Pick which 2-row block the preview covers: the hovered row pairs with
  // the row above by default, and only pairs with the row below when that
  // pair is more fully visible in the viewport (e.g. the top row has been
  // scrolled off-screen).
  pickRowStart(tileRow: number): number {
    const upper = tileRow - 1;
    const lower = tileRow;
    const isValid = (start: number) =>
      start >= 0 && start + PREVIEW_ROWS <= this.ui.totalRows;

    if (!isValid(upper)) return isValid(lower) ? lower : Math.max(this.ui.totalRows - PREVIEW_ROWS, 0);
    if (!isValid(lower)) return upper;

    const visibleFraction = (start: number) => {
      const rows = this.ui.tiles.filter((t) => {
        const r = Math.floor(Number(t.dataset.index) / COLS);
        return r >= start && r < start + PREVIEW_ROWS;
      });
      const rects = rows.map((t) => t.getBoundingClientRect());
      const top = Math.min(...rects.map((r) => r.top));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const visible = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
      return Math.max(visible, 0) / Math.max(bottom - top, 1);
    };

    return visibleFraction(upper) >= visibleFraction(lower) ? upper : lower;
  }

  pauseVideos() {
    this.ui.images.querySelectorAll("video").forEach((v) => v.pause());
  }

  setProject(tile: HTMLElement | null) {
    this.galleryTimeline?.kill();
    this.pauseVideos();

    if (tile) {
      const tileRow = Math.floor(Number(tile.dataset.index) / COLS);
      const rowStart = this.pickRowStart(tileRow);

      // anchor the 2-row preview block to the hovered row
      this.ui.container.style.gridRow = `${rowStart + 1} / span ${PREVIEW_ROWS}`;

      const coveredTiles = this.ui.tiles.filter((t) => {
        const row = Math.floor(Number(t.dataset.index) / COLS);
        return row >= rowStart && row < rowStart + PREVIEW_ROWS;
      });

      this.ui.title.innerHTML = tile.dataset.name ?? "";
      this.ui.description.innerHTML = tile.dataset.description ?? "";
      this.ui.tags.innerHTML = (tile.dataset.tags ?? "")
        .split("|")
        .filter(Boolean)
        .map((t) => `<span>${t}</span>`)
        .join("");

      const allImages = Array.from(this.ui.images.children);
      gsap.set(allImages, { opacity: 0 });
      const images = this.ui.previewImagesPerID[tile.dataset.index!];
      if (images) {
        gsap.set(images[0], { opacity: 1 });
        // videos only play while their preview is shown, from the start
        images.forEach((el) => {
          if (el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.play().catch(() => {});
          }
        });
      }

      this.buildTimeline(coveredTiles);
      this.timeline!.play();
      if (images) this.startGallery(images);
    } else {
      this.timeline?.reverse();
    }
  }

  startGallery(images: HTMLElement[]) {
    if (images.length < 2) return;
    const timeline = gsap.timeline({ repeat: -1 });
    images.forEach((image) => {
      timeline
        .set(images, { opacity: 0 })
        .set(image, { opacity: 1 })
        .to(image, { duration: 0, opacity: 1 }, "+=0.8");
    });
    this.galleryTimeline = timeline;
  }

  buildTimeline(coveredTiles: HTMLElement[]) {
    // Revert (not kill) any in-flight timeline: killing mid-animation would
    // freeze tiles half-faded; revert snaps everything back to its original
    // state before the new animation starts.
    this.timeline?.revert();
    this.timeline = null;

    // measure after the grid-row placement above has taken effect
    const { width, height } = this.ui.container.getBoundingClientRect();
    const vw = window.innerWidth / 100;
    const armWidthPx = 5 * vw;
    const arm = {
      x: (armWidthPx / Math.max(width, 1)) * 100,
      y: (armWidthPx / Math.max(height, 1)) * 100,
    };
    const shrinkVw = 5;
    const widthInVw = width / vw;
    const heightInVw = height / vw;
    const scale = {
      x: (widthInVw - shrinkVw) / widthInVw,
      y: (heightInVw - shrinkVw) / heightInVw,
    };
    const { x, y } = arm;

    this.timeline = gsap
      .timeline({ paused: true, defaults: { ease: "power2.inOut" } })
      .addLabel("preview", 0)
      .addLabel("tiles", 0)
      .to(this.ui.container, { opacity: 1 }, "preview")
      .to(
        this.ui.container,
        {
          scaleX: scale.x,
          scaleY: scale.y,
          transformOrigin: "center center",
        },
        "preview"
      )
      .to(
        coveredTiles,
        {
          opacity: 0,
          x: (i: number) => (i % 2 === 0 ? "2.5vw" : "-2.5vw"),
          y: (i: number) => (i < 2 ? "2.5vw" : "-2.5vw"),
        },
        "tiles"
      )
      .fromTo(
        this.ui.masked,
        {
          clipPath: `polygon(
            ${50 - x / 2}% 0%,
            ${50 + x / 2}% 0%,
            ${50 + x / 2}% ${50 - y / 2}%,
            100% ${50 - y / 2}%,
            100% ${50 + y / 2}%,
            ${50 + x / 2}% ${50 + y / 2}%,
            ${50 + x / 2}% 100%,
            ${50 - x / 2}% 100%,
            ${50 - x / 2}% ${50 + y / 2}%,
            0% ${50 + y / 2}%,
            0% ${50 - y / 2}%,
            ${50 - x / 2}% ${50 - y / 2}%
          )`,
        },
        {
          clipPath: `polygon(
            50% 0%,
            50% 0%,
            50% 50%,
            100% 50%,
            100% 50%,
            50% 50%,
            50% 100%,
            50% 100%,
            50% 50%,
            0% 50%,
            0% 50%,
            50% 50%
          )`,
        },
        "preview"
      );
  }

  destroy() {
    this.timeline?.kill();
    this.galleryTimeline?.kill();
  }
}

const ProjectShowcase: React.FC<Props> = ({ projects, onProjectOpen }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const lockApiRef = useRef<{
    lock: (index: number) => void;
    unlock: () => void;
  } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tiles = Array.from(
      root.querySelectorAll<HTMLElement>(".showcase-tile")
    );
    const totalRows = Math.ceil(tiles.length / COLS);
    const isLeft = (tile: HTMLElement) => {
      const i = Number(tile.dataset.index);
      return i % COLS === 0 || i % COLS === 1;
    };

    const buildRefs = (side: "left" | "right"): PreviewRefs => {
      const container = root.querySelector<HTMLDivElement>(
        `.showcase-preview.--${side}`
      )!;
      return {
        container,
        masked: container.querySelector<HTMLDivElement>(".preview-mask")!,
        title: container.querySelector<HTMLElement>(".preview-title")!,
        description: container.querySelector<HTMLElement>(
          ".preview-description"
        )!,
        tags: container.querySelector<HTMLElement>(".preview-tags")!,
        images: container.querySelector<HTMLElement>(".preview-images")!,
        tiles: tiles.filter((t) => (side === "left" ? isLeft(t) : !isLeft(t))),
        totalRows,
      };
    };

    // hovering a left tile expands the preview over the right half
    const previewRight = new HalfPreview(buildRefs("right"));
    const previewLeft = new HalfPreview(buildRefs("left"));
    const previewFor = (tile: HTMLElement) =>
      isLeft(tile) ? previewRight : previewLeft;

    let activeTile: HTMLElement | null = null;
    let lockedTile: HTMLElement | null = null;
    let hoverDelay: ReturnType<typeof setTimeout> | null = null;

    const onEnter = (tile: HTMLElement) => {
      if (lockedTile) return;
      if (hoverDelay) clearTimeout(hoverDelay);
      hoverDelay = setTimeout(() => {
        activeTile = tile;
        previewFor(tile).setProject(tile);
        hoverDelay = null;
      }, 100);
    };

    const onLeave = () => {
      if (lockedTile) return;
      if (hoverDelay) {
        clearTimeout(hoverDelay);
        hoverDelay = null;
      }
      if (activeTile) {
        previewFor(activeTile).setProject(null);
        activeTile = null;
      }
    };

    // pins the preview on a tile: hover enter/leave is ignored while locked
    lockApiRef.current = {
      lock(index: number) {
        const tile = tiles[index];
        if (!tile) return;
        if (hoverDelay) {
          clearTimeout(hoverDelay);
          hoverDelay = null;
        }
        if (activeTile && activeTile !== tile) {
          previewFor(activeTile).setProject(null);
        }
        if (activeTile !== tile) {
          previewFor(tile).setProject(tile);
        }
        activeTile = tile;
        lockedTile = tile;
        setLockedIndex(index);
      },
      unlock() {
        // keep the preview open; normal hover behavior resumes, so it
        // closes on the next mouseleave
        lockedTile = null;
        setLockedIndex(null);
      },
    };

    const enterHandlers = new Map<HTMLElement, () => void>();
    tiles.forEach((tile) => {
      const handler = () => onEnter(tile);
      enterHandlers.set(tile, handler);
      tile.addEventListener("mouseenter", handler);
      tile.addEventListener("mouseleave", onLeave);
    });

    return () => {
      tiles.forEach((tile) => {
        const handler = enterHandlers.get(tile);
        if (handler) tile.removeEventListener("mouseenter", handler);
        tile.removeEventListener("mouseleave", onLeave);
      });
      if (hoverDelay) clearTimeout(hoverDelay);
      lockApiRef.current = null;
      setLockedIndex(null);
      previewLeft.destroy();
      previewRight.destroy();
    };
  }, [projects]);

  const halfProjects = (side: "left" | "right") =>
    projects
      .map((p, i) => ({ project: p, index: i }))
      .filter(({ index }) =>
        side === "left"
          ? index % COLS === 0 || index % COLS === 1
          : index % COLS === 2 || index % COLS === 3
      );

  // a preview panel shows the projects from the OPPOSITE half: hovering a
  // left tile expands the right panel with that left project's images
  const renderPreview = (side: "left" | "right") => (
    <div className={`showcase-preview --${side}`}>
      <div className="preview-images">
        {halfProjects(side === "left" ? "right" : "left").flatMap(
          ({ project, index }) =>
            (project.previewImages ?? [PLACEHOLDER_PREVIEW]).map((src, j) =>
              src.endsWith(".mp4") ? (
                <video
                  key={`${project.id}-${j}`}
                  data-id={index}
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  key={`${project.id}-${j}`}
                  data-id={index}
                  src={src}
                  alt={project.title}
                />
              )
            )
        )}
      </div>
      <p className="preview-title font-pressstart2p"></p>
      <div className="preview-details font-pixellari">
        <p className="preview-description"></p>
        <div className="preview-tags"></div>
      </div>
      <div className="preview-mask"></div>
    </div>
  );

  return (
    <div className="project-showcase" ref={rootRef}>
      <div className="showcase-stage">
      <ul className="showcase-grid">
        {projects.map((project, i) => (
          <li
            key={project.id}
            className={`showcase-tile ${
              project.placeholder ? "--placeholder" : ""
            }`}
            data-index={i}
            data-name={project.title}
            data-description={project.description}
            data-tags={project.tags.join("|")}
            onClick={() => !project.placeholder && onProjectOpen(project.id)}
          >
            <button
              className={`tile-lock ${lockedIndex === i ? "--locked" : ""}`}
              aria-label={
                lockedIndex === i ? "Unlock preview" : "Lock preview"
              }
              onClick={(e) => {
                e.stopPropagation();
                if (lockedIndex === i) lockApiRef.current?.unlock();
                else lockApiRef.current?.lock(i);
              }}
            >
              {lockedIndex === i ? <FaLock /> : <FaUnlock />}
            </button>
            <div className="tile-cta font-pressstart2p">
              <p>{project.placeholder ? "COMING SOON" : project.linkLabel}</p>
            </div>
            <img
              src={project.image}
              alt={project.title}
              className={project.imageClass}
            />
            <p className="tile-title font-pressstart2p">{project.title}</p>
          </li>
        ))}
      </ul>
      <div
        className="showcase-preview-layer"
        style={{
          gridTemplateRows: `repeat(${Math.ceil(projects.length / COLS)}, 1fr)`,
        }}
      >
        {renderPreview("left")}
        {renderPreview("right")}
      </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
