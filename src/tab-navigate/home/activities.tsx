// src/tabs/home/screens.tsx
import React from "react";
import { Pad } from "../createTabStackFlow";
import { useHomeFlow } from "./stack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { tabScreen, titleTabRoot } from "../../styles/style.css";
import AppScreenLayout from "../../AppScreenLayout";

export const HomeScreen: React.FC = () => {
  const { push } = useHomeFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Home</h1>
      <p>Home 탭의 루트 스크린입니다.</p>
      <button onClick={() => push("HomeDetailScreen", { id: Date.now() })}>
        Go to Home Detail
      </button>
    </Pad>
  );
};

export const HomeDetailScreen: React.FC<{ params: { id: number } }> = ({
  params,
}) => {
  const { pop, push } = useHomeFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Home Detail</h1>
      <p>id: {params.id}</p>
      <div>
        <button onClick={() => pop()}>Pop</button>
        <button onClick={() => push("HomeDetailScreen", { id: Date.now() })}>
          Push Another
        </button>
      </div>
    </Pad>
  );
};
