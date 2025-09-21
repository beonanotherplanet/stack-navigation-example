import { useEffect } from "react";
import { useFlow } from "./stackflow";
import { useStore } from "./store";

const FlowBridge = () => {
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
