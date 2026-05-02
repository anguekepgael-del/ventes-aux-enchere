import type { CSSProperties } from "react";

export type VisualStyle = CSSProperties & { "--visual-bg": string };

export function visualStyle(background: string): VisualStyle {
  return { "--visual-bg": background };
}
