import { createTabStackflow } from "../createTabStackFlow";
import { HomeScreen, HomeDetailScreen } from "./activities";

const activities = {
  HomeScreen,
  HomeDetailScreen,
};

const HomeStackApp = createTabStackflow({
  activities,
  initial: "HomeScreen",
});

export const { Stack: HomeStack, useFlow: useHomeFlow } = HomeStackApp;
export type HomeActivities = typeof activities;
