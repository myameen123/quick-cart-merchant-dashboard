import { Button } from '@/components/ui/button';

// Common ThresholdDisplay component for all preset profiles
function ThresholdDisplay({ title, thresholds, color }) {
  // Define background colors for the risk sections
  const lowColor = 'bg-green-400';
  const mediumColor = 'bg-yellow-400';
  const highColor = 'bg-red-400';

  // Calculate percentage widths for visual representation
  const lowWidth = thresholds[0] * 100;
  const mediumWidth = (thresholds[1] - thresholds[0]) * 100;
  const highWidth = (1 - thresholds[1]) * 100;

  return (
    <div className="w-full mx-auto px-6 py-4 bg-slate-100 mt-8 rounded-md">
      <h2 className="text-lg font-bold mb-4 text-center">{title} Risk Profile</h2>
      
      {/* Static slider visualization */}
      <div className="h-4 bg-gray-300 rounded-full relative flex overflow-hidden">
        <div 
          className={`${lowColor} h-full`} 
          style={{ width: `${lowWidth}%` }}
        />
        <div 
          className={`${mediumColor} h-full`} 
          style={{ width: `${mediumWidth}%` }}
        />
        <div 
          className={`${highColor} h-full`} 
          style={{ width: `${highWidth}%` }}
        />
      </div>

      {/* Thumb indicators */}
      <div className="relative h-0">
        <div 
          className="absolute h-5 w-5 bg-blue-600 rounded-full border-2 border-white shadow"
          style={{ 
            left: `calc(${lowWidth}% - 10px)`, 
            top: "-14px"
          }}
        />
        <div 
          className="absolute h-5 w-5 bg-blue-600 rounded-full border-2 border-white shadow"
          style={{ 
            left: `calc(${lowWidth + mediumWidth}% - 10px)`, 
            top: "-14px"
          }}
        />
      </div>

      {/* Labels */}
      <div className="mt-8 flex justify-between text-sm font-medium">
        <div>Low: 0 - {thresholds[0].toFixed(2)}</div>
        <div>Medium: {thresholds[0].toFixed(2)} - {thresholds[1].toFixed(2)}</div>
        <div>High: {thresholds[1].toFixed(2)} - 1</div>
      </div>

      <div className="w-full flex justify-center mt-6">
        <Button 
          className="text-right" 
          size="lg" 
          variant={color}
          onClick={() => {}}
          disabled
        >
          {title} Profile Applied
        </Button>
      </div>
    </div>
  );
}

export default ThresholdDisplay;