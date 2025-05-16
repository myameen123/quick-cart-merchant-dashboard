import ThresholdDisplay from "./ThresholdDisplay";

function Aggressive() {
  // Aggressive settings have a higher tolerance for risk
  const thresholds = [0.5, 0.8];
  
  return (
    <ThresholdDisplay
      title="Aggressive" 
      thresholds={thresholds}
      color="destructive"
    />
  );
}

export default Aggressive