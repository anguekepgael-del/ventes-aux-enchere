import type { CSSProperties } from "react";

export type VisualStyle = CSSProperties & {
  "--visual-bg": string;
  "--visual-image"?: string;
};

export type MediaStyle = CSSProperties & {
  "--media-image": string;
};

export function visualStyle(background: string, imageUrl?: string): VisualStyle {
  return {
    "--visual-bg": background,
    ...(imageUrl ? { "--visual-image": `url("${imageUrl}")` } : {}),
  };
}

export function mediaStyle(imageUrl: string): MediaStyle {
  return { "--media-image": `url("${imageUrl}")` };
}
