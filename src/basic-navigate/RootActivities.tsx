import React from "react";
import AppScreenLayout from "../AppScreenLayout";
import { stack, useFlow } from "../stackflow";
import { screenTitle } from "../styles/style.css";
import { flexColumn } from "../styles/flex.css";
import { useActivity, useStack } from "@stackflow/react";

type P = Record<string, unknown>;

export const HomeScreen: React.FC<{ params?: P }> = ({ params }) => {
  const { push } = useFlow();
  return (
    <AppScreenLayout appBar={{ title: "Home" }}>
      <div className="screen">
        <p className={screenTitle}>Home Screen</p>
        <div className={flexColumn}>
          <button
            onClick={() => push("PageAScreen", { title: "Page A Screen" })}
          >
            push A screen
          </button>
          <button
            onClick={() => push("PageBScreen", { title: "Page B Screen" })}
          >
            push B screen
          </button>
        </div>
      </div>
    </AppScreenLayout>
  );
};

export const PageAScreen: React.FC<{ params?: P }> = ({ params }) => {
  const { push, pop, replace } = useFlow();
  const stack = useStack();
  console.log(stack);
  return (
    <AppScreenLayout appBar={{ title: "PageA" }}>
      <div className="screen page-a">
        <p className={screenTitle}>Page A Screen</p>
        <div className={flexColumn}>
          <button
            onClick={() => push("PageAScreen", { title: "Page A Screen" })}
          >
            push A screen
          </button>
          <button
            onClick={() => push("PageBScreen", { title: "Page B Screen" })}
          >
            push B screen
          </button>
          <button
            onClick={() => replace("PageBScreen", { title: "Page B Screen" })}
          >
            replace to B screen
          </button>
          <button onClick={() => pop()}>pop</button>
        </div>
      </div>
    </AppScreenLayout>
  );
};

export const PageBScreen: React.FC<{ params?: P }> = ({ params }) => {
  const { push, pop, replace } = useFlow();
  return (
    <AppScreenLayout appBar={{ title: "PageB" }}>
      <div className="screen page-b">
        <p className={screenTitle}>Page B Screen</p>
        <div className={flexColumn}>
          <button
            onClick={() => push("PageAScreen", { title: "Page A Screen" })}
          >
            push A screen
          </button>
          <button
            onClick={() => push("PageBScreen", { title: "Page B Screen" })}
          >
            push B screen
          </button>
          <button
            onClick={() => replace("PageAScreen", { title: "Page A Screen" })}
          >
            replace to A screen
          </button>
          <button onClick={() => pop()}>pop</button>
        </div>
      </div>
    </AppScreenLayout>
  );
};
