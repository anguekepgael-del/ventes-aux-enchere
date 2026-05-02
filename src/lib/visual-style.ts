import type { CSSProperties } from "react";

export type VisualStyle = CSSProperties & {
  "--visual-bg": string;
  "--visual-image"?: string;
};

export type MediaStyle = CSSProperties & {
  "--media-image": string;
};

export function visualStyle(background: string, imageUrl?: string): VisualStyle {
  const visualBackground = imageUrl
    ? `linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.78)), linear-gradient(120deg, rgba(0, 0, 0, 0.34), rgba(217, 143, 34, 0.16)), url("${imageUrl}"), ${background}`
    : background;

  return {
    "--visual-bg": visualBackground,
    ...(imageUrl ? { "--visual-image": `url("${imageUrl}")` } : {}),
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

export function mediaStyle(imageUrl: string): MediaStyle {
  return {
    "--media-image": `url("${imageUrl}")`,
    minHeight: 190,
    borderRadius: 10,
    background:
      `linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.46)), url("${imageUrl}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    border: "1px solid rgba(255, 255, 255, 0.14)",
  };
}
