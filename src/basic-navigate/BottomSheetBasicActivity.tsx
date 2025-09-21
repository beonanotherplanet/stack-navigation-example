import React, { useState } from "react";
import AppScreenLayout from "../AppScreenLayout";
import { useStepFlow } from "../stackflow";
import { useSheetEnter, makeDimmedCloser } from "../interactions/slideUpDown";
import { basicBottomSheet, dimmed, screenTitle } from "../styles/style.css";
import { flexColumn } from "../styles/flex.css";

export const BasicBottomSheetScreen = ({ params }: { params: any }) => {
  const { stepPush, stepPop } = useStepFlow("BasicBottomSheetScreen");

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleBottomSheetClose = () => {
    stepPop();
  };

  const handleBottomSheetOpen = async () => {
    setIsBottomSheetOpen(true);
    stepPush({
      component: (
        <BottomSheet
          id="basic-bottom-sheet"
          isOpen={isBottomSheetOpen}
          onClose={handleBottomSheetClose}
        />
      ),
    });
  };

  return (
    <AppScreenLayout appBar={{ title: "Basic BottomSheet Screen" }}>
      <div className="screen page-basic-bottomsheet">
        <p className={screenTitle}>{params.title}</p>
        <div className={flexColumn}>
          <button onClick={handleBottomSheetOpen}>바텀시트 열기</button>
        </div>
      </div>
      {params.component}
    </AppScreenLayout>
  );
};

const BottomSheet = ({
  id,
  onClose,
}: {
  id: string;
  isOpen?: boolean;
  onClose: () => void;
}) => {
  useSheetEnter(id, 350);
  const handleDimmedClick = makeDimmedCloser(id, onClose, 350);

  return (
    <div className={dimmed} onClick={handleDimmedClick}>
      <div
        id={id}
        className={basicBottomSheet}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={screenTitle}>BottomSheet</p>
      </div>
    </div>
  );
};
