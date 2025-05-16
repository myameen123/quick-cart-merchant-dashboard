import ThresholdDisplay from "./ThresholdDisplay";

function Balanced() {
  // Balanced settings have a moderate tolerance for risk
  const thresholds = [0.3, 0.7];
  
  return (
    <ThresholdDisplay 
      title="Balanced" 
      thresholds={thresholds}
      color="default"
    />
  );
}

export default Balanced