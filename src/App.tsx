import React from "react";
import { Stack } from "./stackflow";
import "./App.css";
import "@stackflow/plugin-basic-ui/index.css";
import { useStore } from "./store";
import {
  mobileFrameContainer,
  stackStateContainer,
  titleH2,
} from "./styles/style.css";

const Controls: React.FC = () => {
  const flow = useStore((state) => state.flow);

  const { push, pop, replace } = flow;

  return (
    <div className="panel">
      <div>
        <button onClick={() => push("PageAScreen", { title: "Page A Screen" })}>
          push A screen
        </button>
        <button onClick={() => push("PageBScreen", { title: "Page B Screen" })}>
          push B screen
        </button>
        <button
          onClick={() => replace("PageAScreen", { title: "Page A Screen" })}
        >
          replace A screen
        </button>
        <button
          onClick={() => replace("PageBScreen", { title: "Page B Screen" })}
        >
          replace B screen
        </button>
        <button onClick={() => pop()}>pop</button>
      </div>
      <div>
        <button
          onClick={() =>
            push("BasicBottomSheetScreen", {
              title: "Basic BottomSheet Screen",
            })
          }
        >
          push Basic BottomSheet Screen
        </button>
        <button
          onClick={() =>
            push("BottomSheetInnerNavigateActivity", {
              title: "Navigate In BottomSheet",
            })
          }
        >
          push BottomSheet Inner Navigate Activity Screen
        </button>
      </div>
      <div>
        <button
          onClick={() =>
            push("TabNavigationActivity", {
              title: "Home with Bottom Tab",
            })
          }
        >
          push Bottom Tab Navigation Screen
        </button>
      </div>
    </div>
  );
};

const StackInspector: React.FC = () => {
  return (
    <div className={stackStateContainer}>
      <h2 className={titleH2}>스택 상태</h2>
      <div className="mono"></div>
      <p style={{ fontSize: 12, color: "#6b7280" }}></p>
    </div>
  );
};

const PhonePreview: React.FC = () => {
  return (
    <div className={mobileFrameContainer}>
      <h2 className={titleH2}>모바일 미리보기</h2>
      <div className="phone">
        <Stack />
      </div>
      <div style={{ height: 200 }}></div>
    </div>
  );
};

export default function App() {
  return (
    <div className="page">
      <Controls />
      <StackInspector />
      <PhonePreview />
    </div>
  );
}
