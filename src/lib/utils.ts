import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Layout container ──────────────────────────────────────────────────────
// Page-wide gutter ramp. Targets 160px left/right on desktop; scales down on
// smaller viewports so content doesn't get crushed.
//   < 768px  : 24px  (mobile)
//   ≥ 768px  : 40px  (md — small tablet)
//   ≥ 1024px : 80px  (lg — laptop)
//   ≥ 1280px : 160px (xl — desktop)
// Outer max-width caps the *padding-box* at 2240px so on viewports up to
// 2240 the gutters land exactly on 160px and content fills the available
// inner space (1920px max). Beyond 2240 viewport, the box centers and the
// effective gutters grow naturally.
export const container =
  "mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px]";
