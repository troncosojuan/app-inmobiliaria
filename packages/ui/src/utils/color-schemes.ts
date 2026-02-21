export type ColorKey = "blue" | "emerald" | "violet" | "amber" | "pink" | "red" | "slate" | "cyan";

export interface ColorScheme {
  bg: string;
  text: string;
}

/**
 * Icon container color schemes: use for icon wrappers in cards, section headers, etc.
 * Pattern: saturated color at 15% opacity bg + full color text.
 */
export const ICON_COLORS: Record<ColorKey, ColorScheme> = {
  blue:    { bg: "bg-blue-600/15 dark:bg-blue-400/15",       text: "text-blue-600 dark:text-blue-400" },
  emerald: { bg: "bg-emerald-600/15 dark:bg-emerald-400/15", text: "text-emerald-600 dark:text-emerald-400" },
  violet:  { bg: "bg-violet-600/15 dark:bg-violet-400/15",   text: "text-violet-600 dark:text-violet-400" },
  amber:   { bg: "bg-amber-500/15 dark:bg-amber-400/15",     text: "text-amber-600 dark:text-amber-400" },
  pink:    { bg: "bg-pink-600/15 dark:bg-pink-400/15",       text: "text-pink-600 dark:text-pink-400" },
  red:     { bg: "bg-red-600/15 dark:bg-red-400/15",         text: "text-red-600 dark:text-red-400" },
  slate:   { bg: "bg-muted",                                  text: "text-muted-foreground" },
  cyan:    { bg: "bg-cyan-600/15 dark:bg-cyan-400/15",       text: "text-cyan-600 dark:text-cyan-400" },
};

/**
 * Badge/pill color schemes: for status badges, plan badges, tags, etc.
 * Same opacity pattern as icon colors, applied to inline pill elements.
 */
export const BADGE_COLORS: Record<ColorKey, string> = {
  blue:    "bg-blue-600/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
  emerald: "bg-emerald-600/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
  violet:  "bg-violet-600/15 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400",
  amber:   "bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  pink:    "bg-pink-600/15 text-pink-600 dark:bg-pink-400/15 dark:text-pink-400",
  red:     "bg-red-600/15 text-red-600 dark:bg-red-400/15 dark:text-red-400",
  slate:   "bg-gray-500/15 text-gray-600 dark:bg-gray-400/15 dark:text-gray-400",
  cyan:    "bg-cyan-600/15 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-400",
};
