import React from "react";
import { AppScreen } from "@stackflow/plugin-basic-ui";

type P = Record<string, unknown>;

export const HomeScreen: React.FC<{ params?: P }> = ({ params }) => (
  <AppScreen appBar={{ title: "Home" }}>
    <div className="screen">
      <div className="card">
        <div className="title">여기는 홈 화면</div>
      </div>
      <div className="card mono">{JSON.stringify(params ?? {}, null, 2)}</div>
    </div>
  </AppScreen>
);

export const PageAScreen: React.FC<{ params?: P }> = ({ params }) => (
  <AppScreen appBar={{ title: "PageA" }}>
    <div className="screen">
      <span className="tag">detail view</span>
      <div className="card mono">{JSON.stringify(params ?? {}, null, 2)}</div>
    </div>
  </AppScreen>
);

export const PageBScreen: React.FC<{ params?: P }> = ({ params }) => (
  <AppScreen appBar={{ title: "PageB" }}>
    <div className="screen">
      <span className="tag">another view</span>
      <div className="card mono">{JSON.stringify(params ?? {}, null, 2)}</div>
    </div>
  </AppScreen>
);
