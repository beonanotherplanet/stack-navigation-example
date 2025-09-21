// ScreenLayout.tsx
import { AppScreen, type AppScreenProps } from "@stackflow/plugin-basic-ui";
import FlowBridge from "./FlowBridge"; // flow 브리지도 같이 두면 편함

type AppScreenLayoutProps = AppScreenProps;

export default function AppScreenLayout(props: AppScreenLayoutProps) {
  return (
    <AppScreen {...props}>
      <FlowBridge />
      {props.children}
    </AppScreen>
  );
}
