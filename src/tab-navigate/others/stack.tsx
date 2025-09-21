import { createTabStackflow } from "../createTabStackFlow";
import { OthersScreen, OthersDetailScreen } from "./activities";

const activities = {
  OthersScreen,
  OthersDetailScreen,
};

const OthersStackApp = createTabStackflow({
  activities,
  initial: "OthersScreen",
});

export const { Stack: OthersStack, useFlow: useOthersFlow } = OthersStackApp;
export type OthersActivities = typeof activities;
