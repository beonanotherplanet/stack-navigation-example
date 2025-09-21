// src/tabs/Settings/screens.tsx
import React from "react";
import { Pad } from "../createTabStackFlow";
import { useSettingsFlow } from "./stack";
import { titleTabRoot } from "../../styles/style.css";

export const SettingsScreen: React.FC = () => {
  const { push } = useSettingsFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Settings</h1>
      <p>Settings 탭의 루트 스크린입니다.</p>
      <button onClick={() => push("SettingsDetailScreen", { id: Date.now() })}>
        Go to Settings Detail
      </button>
    </Pad>
  );
};

export const SettingsDetailScreen: React.FC<{ params: { id: number } }> = ({
  params,
}) => {
  const { pop, push } = useSettingsFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Settings Detail</h1>
      <p>id: {params.id}</p>
      <div>
        <button onClick={() => pop()}>Pop</button>
        <button
          onClick={() => push("SettingsDetailScreen", { id: Date.now() })}
        >
          Push Another
        </button>
      </div>
    </Pad>
  );
};
