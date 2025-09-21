// src/components/BottomTabBar.tsx
import React from "react";
import { bottomTab } from "../styles/style.css";

export type TabKey = "home" | "articles" | "others" | "settings";

export const BottomTabBar: React.FC<{
  active: TabKey;
  onChange: (t: TabKey) => void;
}> = ({ active, onChange }) => {
  const items: { key: TabKey; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "articles", label: "Articles" },
    { key: "others", label: "Others" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className={bottomTab}>
      {items.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  );
};
