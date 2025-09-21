import { useEffect } from "react";
import { activities, Stack, useFlow, useStepFlow } from "./stackflow";
import { useStore } from "./store";
import { useStack } from "@stackflow/react";

type ActivityNameType = keyof typeof activities;

const FlowBridge = ({
  stepActivityName,
}: {
  stepActivityName?: ActivityNameType;
}) => {
  const useFlowObj = useFlow();
  //   const useStepFlowObj = (activityName: ActivityNameType) => useStepFlow(activityName);

  const setFlow = useStore((state) => state.setFlow);
  //   const setUseStepFlow = useStore(state => state.setUseStepFlow)

  useEffect(() => {
    if (useFlowObj) {
      setFlow(useFlowObj);
    }
  }, [useFlowObj]);

  return null;
};

export default FlowBridge;
