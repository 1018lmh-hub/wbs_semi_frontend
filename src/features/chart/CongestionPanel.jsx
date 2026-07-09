// src/features/chart/CongestionPanel.jsx
import React from "react";
import CurrentCongestionRate from "./CurrentCongestionRate";
import SerialCongestionRate from "./SerialCongestionRate";
import { PanelWrapper, Divider } from "./CongestionPanel.style";

const CongestionPanel = () => {
  return (
    <PanelWrapper>
      <CurrentCongestionRate />
      <Divider />
      <SerialCongestionRate />
    </PanelWrapper>
  );
};

export default CongestionPanel;
