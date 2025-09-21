import { createTabStackflow } from "../createTabStackFlow";
import { SettingsScreen, SettingsDetailScreen } from "./activities";

const activities = {
  SettingsScreen,
  SettingsDetailScreen,
};

const SettingsStackApp = createTabStackflow({
  activities,
  initial: "SettingsScreen",
});

export const { Stack: SettingsStack, useFlow: useSettingsFlow } =
  SettingsStackApp;
export type SettingsActivities = typeof activities;
