import React from "react";
import { Stack, useFlow } from "./stackflow";
import "./App.css";

const Controls: React.FC = () => {
  const flow = useFlow();
  const [activity, setActivity] = React.useState<"Home" | "PageA" | "PageB">(
    "PageA"
  );
  const [paramKey, setParamKey] = React.useState("id");
  const [paramVal, setParamVal] = React.useState("1");

  const params = React.useMemo(
    () => (paramKey.trim() ? { [paramKey.trim()]: paramVal } : {}),
    [paramKey, paramVal]
  );

  return (
    <div className="panel">
      <h2>조작(Left)</h2>

      <div className="kv" style={{ marginBottom: 8 }}>
        <label>Activity</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as any)}
        >
          <option value="Home">Home</option>
          <option value="PageA">PageA</option>
          <option value="PageB">PageB</option>
        </select>
      </div>

      <div className="kv" style={{ marginBottom: 8 }}>
        <label>Param Key</label>
        <input
          className="input"
          value={paramKey}
          onChange={(e) => setParamKey(e.target.value)}
        />
      </div>
      <div className="kv" style={{ marginBottom: 12 }}>
        <label>Param Val</label>
        <input
          className="input"
          value={paramVal}
          onChange={(e) => setParamVal(e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button onClick={() => flow.push(activity, params)}>push</button>
        <button onClick={() => flow.replace(activity, params)}>replace</button>
        <button onClick={() => flow.pop()}>pop</button>
        <button
          onClick={() =>
            flow.reset({
              activity: ["Home", { resetAt: Date.now() }],
            })
          }
        >
          reset(Home)
        </button>
      </div>

      <div className="btn-row">
        <button onClick={() => flow.stepPush(activity, params)}>
          stepPush
        </button>
        <button onClick={() => flow.stepPop()}>stepPop</button>
      </div>

      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
        * 전환 애니메이션은 <code>@stackflow/plugin-renderer-basic</code> +{" "}
        <code>@stackflow/plugin-basic-ui</code> 조합으로 동작.
      </p>
    </div>
  );
};

const StackInspector: React.FC = () => {
  return (
    <div className="panel">
      <h2>스택 상태(Middle)</h2>
      <div className="mono"></div>
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        ↑ 가운데는 최신 API의 스택 스냅샷.
      </p>
    </div>
  );
};

const PhonePreview: React.FC = () => {
  return (
    <div className="panel phone-wrap">
      <div>
        <h2>모바일 미리보기(Right)</h2>
        <div className="phone">
          <Stack />
        </div>
      </div>
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
