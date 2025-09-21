import { createTabStackflow } from "../createTabStackFlow";
import { ArticlesScreen, ArticlesDetailScreen } from "./activities";

const activities = {
  ArticlesScreen,
  ArticlesDetailScreen,
};

const ArticlesStackApp = createTabStackflow({
  activities,
  initial: "ArticlesScreen",
});

export const { Stack: ArticlesStack, useFlow: useArticlesFlow } =
  ArticlesStackApp;
export type ArticlesActivities = typeof activities;
