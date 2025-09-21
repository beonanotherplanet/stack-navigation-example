// src/App.tsx
import React, { useMemo, useState } from "react";
import { BottomTabBar, type TabKey } from "./BottomTabBar";
import { HomeStack } from "./home/stack";
import { ArticlesStack } from "./articles/stack";
import { SettingsStack } from "./settings/stack";
import AppScreenLayout from "../AppScreenLayout";
import { OthersStack } from "./others/stack";

const TabNavigationActivity: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("home");
  const contentStyle = useMemo(() => ({ height: "calc(100dvh - 56px)" }), []);

  return (
    <AppScreenLayout>
      {tab === "home" && <HomeStack />}
      {tab === "articles" && <ArticlesStack />}
      {tab === "others" && <OthersStack />}
      {tab === "settings" && <SettingsStack />}

      <BottomTabBar active={tab} onChange={setTab} />
    </AppScreenLayout>
  );
};

export default TabNavigationActivity;
