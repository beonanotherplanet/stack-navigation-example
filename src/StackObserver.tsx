// StackObserver.tsx
import { useStack } from "@stackflow/react";
import { useEffect } from "react";

export default function StackObserver() {
  const { activities } = useStack();

  // 즉시 스냅샷
  console.log(
    "[observer] now:",
    "len=",
    activities.length,
    "top=",
    activities[activities.length - 1]?.name
  );

  // 전환 완료 스냅샷(transitionDuration=350ms 기준)
  useEffect(() => {
    const t = setTimeout(() => {
      const top = activities[activities.length - 1]?.name;
      console.log("[observer+350ms] len=", activities.length, "top=", top);
    }, 400);
    return () => clearTimeout(t);
  }, [activities]);

  return null;
}
