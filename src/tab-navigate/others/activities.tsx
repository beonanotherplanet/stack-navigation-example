import React from "react";
import { Pad } from "../createTabStackFlow";
import { useOthersFlow } from "./stack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import AppScreenLayout from "../../AppScreenLayout";
import { titleTabRoot } from "../../styles/style.css";

export const OthersScreen: React.FC = () => {
  const { push } = useOthersFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Others</h1>
      <p>Others 탭의 루트 스크린입니다.</p>
      <button onClick={() => push("OthersDetailScreen", { id: Date.now() })}>
        Go to Others Detail
      </button>
    </Pad>
  );
};

export const OthersDetailScreen: React.FC<{ params: { id: number } }> = ({
  params,
}) => {
  const { pop, push } = useOthersFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Others Detail</h1>
      <p>id: {params.id}</p>
      <div>
        <button onClick={() => pop()}>Pop</button>
        <button onClick={() => push("OthersDetailScreen", { id: Date.now() })}>
          Push Another
        </button>
      </div>
    </Pad>
  );
};
