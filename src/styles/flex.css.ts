import { style } from "@vanilla-extract/css";

export const flexCenter = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const flexJustifyBetween = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const flexColumn = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
