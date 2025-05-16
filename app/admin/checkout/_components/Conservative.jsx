import ThresholdDisplay from "./ThresholdDisplay";

function Conservative() {
  // Conservative settings have a lower tolerance for risk
  const thresholds = [0.2, 0.5];
  
  return (
    <ThresholdDisplay
      title="Conservative" 
      thresholds={thresholds}
      color="outline"
    />
  );
}

export default Conservative