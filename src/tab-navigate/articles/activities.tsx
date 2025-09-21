// src/tabs/Articles/screens.tsx
import React from "react";
import { Pad } from "../createTabStackFlow";
import { useArticlesFlow } from "./stack";
import { titleTabRoot } from "../../styles/style.css";

export const ArticlesScreen: React.FC = () => {
  const { push } = useArticlesFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Articles</h1>
      <p>Articles 탭의 루트 스크린입니다.</p>
      <button onClick={() => push("ArticlesDetailScreen", { id: Date.now() })}>
        Go to Articles Detail
      </button>
    </Pad>
  );
};

export const ArticlesDetailScreen: React.FC<{ params: { id: number } }> = ({
  params,
}) => {
  const { pop, push } = useArticlesFlow();
  return (
    <Pad>
      <h1 className={titleTabRoot}>Articles Detail</h1>
      <p>id: {params.id}</p>
      <div>
        <button onClick={() => pop()}>Pop</button>
        <button
          onClick={() => push("ArticlesDetailScreen", { id: Date.now() })}
        >
          Push Another
        </button>
      </div>
    </Pad>
  );
};
