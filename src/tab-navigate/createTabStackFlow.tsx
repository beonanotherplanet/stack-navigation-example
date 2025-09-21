// src/stackflow/common.ts
import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import React from "react";
import { tabScreen } from "../styles/style.css";

export const Pad: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className={tabScreen}>{children}</div>
);

export const commonPlugins = [
  basicRendererPlugin(),
  basicUIPlugin({
    theme: "cupertino",
    backgroundColor: "#ffffff",
  }),
];

export function createTabStackflow<
  A extends Record<string, React.ComponentType<any>>,
  K extends Extract<keyof A, string>
>(args: { activities: A; initial: K; transitionDuration?: number }) {
  const { activities, initial, transitionDuration = 350 } = args;
  return stackflow({
    transitionDuration,
    activities,
    initialActivity: () => initial,
    plugins: commonPlugins,
  });
}
