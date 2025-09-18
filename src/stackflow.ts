import { stackflow } from "@stackflow/react";
import { HomeScreen, PageAScreen, PageBScreen } from "./activities";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";

export const { Stack, useFlow, activities } = stackflow({
  transitionDuration: 350,
  activities: {
    HomeScreen,
    PageAScreen,
    PageBScreen,
  },
  initialActivity: () => "HomeScreen",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino", // or "android"
      backgroundColor: "#ffffff",
    }),
  ],
});
