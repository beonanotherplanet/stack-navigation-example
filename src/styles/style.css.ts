import { style } from "@vanilla-extract/css";
import { flexCenter, flexJustifyBetween } from "./flex.css";

const DIMMED_LAYER_Z_INDEX = 100;

// const DIALOG_LAYER_Z_INDEX = 10000;

export const titleH2 = style({
  margin: "0 0 8px",
  fontSize: 16,
  color: "#374151",
  textAlign: "left",
  width: "100%",
});

export const screenTitle = style({
  margin: "20px 0 40px",
  fontWeight: 600,
  color: "#111317ff",
});

export const stackStateContainer = style({
  background: "#f6faffff",
  width: "100%",
  height: "100%",
  padding: 40,
  boxSizing: "border-box",
});

export const mobileFrameContainer = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: "100%",
  padding: 40,
  boxSizing: "border-box",
});

export const phone = style({
  width: 360,
  height: 640,
  border: "2px solid #dbeafe",
  borderRadius: 24,
  background: "#fff",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
  overflow: "hidden",
  position: "relative",
});

export const dimmed = style({
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  zIndex: DIMMED_LAYER_Z_INDEX,
  background: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(4px)",
});

export const basicBottomSheet = style({
  background: "#fff",
  width: "100%",
  position: "absolute",
  bottom: 0,
  borderRadius: "20px 20px 0 0",
  height: "70%",
  color: "#fff",
  padding: "0 24px 24px",
  boxSizing: "border-box",
});

export const bottomSheetTitle = style([
  screenTitle,
  {
    margin: "24px 0 0",
  },
]);
export const tabInBottomSheet = style({
  width: "100%",
  marginTop: 24,
  height: 42,
  display: "flex",
});

export const tabItemInBottomSheet = style([
  flexCenter,
  {
    width: "100%",
    height: "100%",
    color: "#111317",
    fontSize: 14,
  },
]);

export const bottomTab = style([
  flexJustifyBetween,
  {
    position: "fixed",
    bottom: 0,
    zIndex: 50,
    height: 72,
    width: 360,
    padding: "0 24px",
    boxSizing: "border-box",
    background: "#f8f8f8",
  },
]);

export const tabScreen = style({
  width: "100%",
  padding: "24px 24px 120px",
  boxSizing: "border-box",
});

export const titleTabRoot = style([
  screenTitle,
  {
    fontSize: 16,
  },
]);
