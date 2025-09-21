import { stackflow } from "@stackflow/react";
import {
  HomeScreen,
  PageAScreen,
  PageBScreen,
} from "./basic-navigate/RootActivities";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { devtoolsPlugin } from "@stackflow/plugin-devtools";
import { BasicBottomSheetScreen } from "./basic-navigate/BottomSheetBasicActivity";
import { BottomSheetInnerNavigateActivity } from "./basic-navigate/BottomSheetInnerNavigateActivity";
import HomeTabScreen from "./tab-navigate/TabNavigateActivity";
import TabNavigationActivity from "./tab-navigate/TabNavigateActivity";

export const stack = stackflow({
  transitionDuration: 350,
  activities: {
    HomeScreen,
    PageAScreen,
    PageBScreen,
    BasicBottomSheetScreen,
    BottomSheetInnerNavigateActivity,
    TabNavigationActivity,
  },
  initialActivity: () => "HomeScreen",
  plugins: [
    devtoolsPlugin(),
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino", // or "android"
      backgroundColor: "#ffffff",
    }),
  ],
});

export const { Stack, useFlow, useStepFlow, activities } = stack;
