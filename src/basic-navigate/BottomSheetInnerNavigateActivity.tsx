import React, { useLayoutEffect, useState } from "react";
import AppScreenLayout from "../AppScreenLayout";
import { useStepFlow } from "../stackflow";
import { makeDimmedCloser, useSheetEnter } from "../interactions/slideUpDown";
import {
  basicBottomSheet,
  bottomSheetTitle,
  dimmed,
  screenTitle,
  tabInBottomSheet,
  tabItemInBottomSheet,
} from "../styles/style.css";
import { flexColumn } from "../styles/flex.css";

export const BottomSheetInnerNavigateActivity = ({
  params,
}: {
  params: any;
}) => {
  const { stepPush, stepPop } = useStepFlow("BottomSheetInnerNavigateActivity");

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
    <AppScreenLayout appBar={{ title: "Navigate In BottomSheet" }}>
      <div className="screen page-bottomsheet-inner-activity">
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
        <p className={bottomSheetTitle}>BottomSheet</p>
        <div>
          <div className={tabInBottomSheet}>
            <div className={tabItemInBottomSheet}>Article 0</div>
            <div className={tabItemInBottomSheet}>Article 1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
