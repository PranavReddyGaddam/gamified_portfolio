import type { IconType } from "react-icons";
import {
  LuAppWindow,
  LuCamera,
  LuCode,
  LuCommand,
  LuGlasses,
  LuHeadphones,
  LuLaptop,
  LuMonitor,
  LuPencilRuler,
  LuSmartphone,
  LuTerminal,
  LuWatch,
} from "react-icons/lu";

export type UseItem = {
  name: string;
  icon: IconType;
};

export type UseGroup = {
  label: string;
  items: UseItem[];
};

/**
 * The kit, in two groups.
 *
 * Deliberately just names and glyphs: the point is what is on the desk, and
 * a paragraph per item would bury that. Icons come from Lucide, which the
 * dock already uses, so the weight matches the rest of the page.
 *
 * TODO(pranav): the shape is right but the specifics are placeholders —
 * replace anything wrong and drop what you do not actually use.
 */
export const useGroups: UseGroup[] = [
  {
    label: "Hardware",
    items: [
      { name: "MacBook Pro", icon: LuLaptop },
      { name: "iPhone", icon: LuSmartphone },
      { name: "Apple Watch", icon: LuWatch },
      { name: "Apple Vision Pro", icon: LuGlasses },
      { name: "AirPods Pro", icon: LuHeadphones },
      { name: "Studio Display", icon: LuMonitor },
      { name: "Nikon D-3200", icon: LuCamera },
    ],
  },
  {
    label: "Software",
    items: [
      { name: "VS Code", icon: LuCode },
      { name: "Claude Code", icon: LuTerminal },
      { name: "Arc Browser", icon: LuAppWindow },
      { name: "Raycast", icon: LuCommand },
      { name: "Figma", icon: LuPencilRuler },
    ],
  },
];
